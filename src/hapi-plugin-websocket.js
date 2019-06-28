/* eslint-disable */
/*
**  hapi-plugin-websocket -- HAPI plugin for seamless WebSocket integration
**  Copyright (c) 2016-2018 Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*  external dependencies  */
const URI     = require("urijs")
const hoek    = require("@hapi/hoek")
const Boom    = require("@hapi/boom")
const WS      = require("ws")
const WSF     = require("websocket-framed")

/*  internal dependencies  */
const pkg     = require("./hapi-plugin-websocket.package.json")

/*  the HAPI plugin registration function  */
const register = async (server, pluginOptions) => {
    /*  determine plugin registration options  */
    pluginOptions = hoek.applyToDefaults({
        create: function () {}
    }, pluginOptions, true)

    /*  check whether a HAPI route has WebSocket enabled  */
    const isRouteWebSocketEnabled = (route) => {
        return (
            typeof route === "object"
            && typeof route.settings === "object"
            && typeof route.settings.plugins === "object"
            && typeof route.settings.plugins.websocket !== "undefined"
        )
    }

    /*  check whether a HAPI request is WebSocket driven  */
    const isRequestWebSocketDriven = (request) => {
        return (
            typeof request === "object"
            && typeof request.plugins === "object"
            && typeof request.plugins.websocket === "object"
            && request.plugins.websocket.mode === "websocket"
        )
    }

    /*  determine the route-specific options of WebSocket-enabled route  */
    const fetchRouteOptions = (route) => {
        let routeOptions = route.settings.plugins.websocket
        if (typeof routeOptions !== "object")
            routeOptions = {}
        routeOptions = hoek.applyToDefaults({
            only:          false,
            subprotocol:   null,
            error:         function () {},
            connect:       function () {},
            disconnect:    function () {},
            message:       function () {},
            request:       function (ctx, request, h) { return h.continue },
            response:      function (ctx, request, h) { return h.continue },
            frame:         false,
            frameEncoding: "json",
            frameRequest:  "REQUEST",
            frameResponse: "RESPONSE",
            frameMessage:  function () {},
            autoping:      0,
            initially:     false
        }, routeOptions, true)
        return routeOptions
    }

    /*  find a particular route for an HTTP request  */
    const findRoute = (req) => {
        let route  = null

        /*  determine request parameters  */
        let url    = URI.parse(req.url)
        let host   = typeof req.headers.host === "string" ? req.headers.host : undefined
        let path   = url.path
        let protos = (req.headers["sec-websocket-protocol"] || "").split(/, */)

        /*  find a matching route  */
        let matched = server.match("POST", path, host)
        if (matched) {
            /*  we accept only WebSocket-enabled ones  */
            if (isRouteWebSocketEnabled(matched)) {
                /*  optionally, we accept only the correct WebSocket subprotocol  */
                let routeOptions = fetchRouteOptions(matched)
                if (!(   routeOptions.subprotocol !== null
                      && protos.indexOf(routeOptions.subprotocol) === -1)) {
                    /*  take this route  */
                    route = matched
                }
            }
        }

        return route
    }

    /*  the global WebSocket server instance  */
    let wss = null
    let wsf = null

    /*  provide a local context  */
    let ctx = {}

    /*  perform WebSocket handling on HAPI start  */
    server.ext({ type: "onPostStart", method: (server) => {
        /*  sanity check all HAPI route definitions  */
        server.table().forEach((route) => {
            /*  for all WebSocket-enabled routes...  */
            if (isRouteWebSocketEnabled(route)) {
                /*  make sure it is defined for POST method  */
                if (route.method.toUpperCase() !== "POST")
                    throw new Error("WebSocket protocol can be enabled on POST routes only")
            }
        })

        /*  establish a WebSocket server and attach it to the
            Node HTTP server underlying the HAPI server  */
        wss = new WS.Server({
            /*  the underyling HTTP server  */
            server: server.listener,

            /*  disable per-server client tracking, as we have to perform it per-route  */
            clientTracking: false,

            /*  ensure that incoming WebSocket requests have a corresponding HAPI route  */
            verifyClient: async ({ req }, result) => {
                let route = findRoute(req)
                if (!route) return result(false, 404, "No suitable WebSocket-enabled HAPI route found")
                /*  inject incoming WebSocket message as a simulated HTTP request  */
                const ctx={};
                let response = await server.inject({
                    /*  simulate the hard-coded POST request  */
                    method:        "POST",

                    /*  pass-through initial HTTP request information  */
                    url:           req.url,
                    headers:       req.headers,
                    remoteAddress: req.socket.remoteAddress,

                    /*  provide WebSocket message as HTTP POST payload  */
                    payload:       "",

                    /*  provide WebSocket plugin context information  */
                    plugins: {
                        websocket: { mode: "websocket", ctx,  req }
                    }
                })
         
                
                if (response.statusCode<200||response.statusCode>=300&&response.statusCode<400) result(false, 500, 'Internal Server Error');
                else if (response.statusCode>=400) result(false, response.statusCode);
                else result(true);

                // /*  transform simulated HTTP response into an outgoing WebSocket message  */
                // if (response.statusCode !== 204 && ws.readyState === WS.OPEN) {
                //     /*  decode data from JSON as HAPI has already encoded it  */
                //     let type = routeOptions.frameResponse
                //     let data = JSON.parse(response.payload)

                //     /*  send as framed data  */
                //     wsf.send({ type, data }, ev.frame)
                // }
                
            }
        })
        pluginOptions.create(wss)

        /*  per-route peer (aka client) tracking  */
        let routePeers = {}

        /*  per-route timers  */
        let routeTimers = {}

        /*  on WebSocket connection (actually HTTP upgrade events)...  */
        wss.on("connection", async (ws, req) => {
            /*  find the (previously already successfully matched) HAPI route  */
            let route = findRoute(req)

            /*  fetch the per-route options  */
            let routeOptions = fetchRouteOptions(route)

            /*  determine a route-specific identifier  */
            let routeId = `${route.method}:${route.path}`
            if (route.vhost)
                routeId += `:${route.vhost}`
            if (routeOptions.subprotocol !== null)
                routeId += `:${routeOptions.subprotocol}`

            /*  track the peer per-route  */
            if (routePeers[routeId] === undefined)
                routePeers[routeId] = []
            let peers = routePeers[routeId]
            peers.push(ws)

            /*  optionally enable automatic WebSocket PING messages  */
            if (routeOptions.autoping > 0) {
                /*  lazy setup of route-specific interval timer  */
                if (routeTimers[routeId] === undefined) {
                    routeTimers[routeId] = setInterval(() => {
                        peers.forEach((ws) => {
                            if (ws.isAlive === false)
                                ws.terminate()
                            else {
                                ws.isAlive = false
                                ws.ping("", false)
                            }
                        })
                    }, routeOptions.autoping)
                }

                /*  mark peer alive initially and on WebSocket PONG messages  */
                ws.isAlive = true
                ws.on("pong", () => {
                    ws.isAlive = true
                })
            }

            /*  optionally create WebSocket-Framed context  */
            if (routeOptions.frame === true)
            wsf = new WSF(ws, routeOptions.frameEncoding)


            /*  allow application to hook into WebSocket connection  */
            routeOptions.connect.call(ctx, { ctx, wss, ws, wsf, req, peers })

            /*  determine HTTP headers for simulated HTTP request:
                take headers of initial HTTP upgrade request, but explicitly remove Accept-Encoding,
                because it could lead HAPI to compress the payload (which we cannot post-process)  */
            let headers = Object.assign({}, req.headers)
            delete headers["accept-encoding"]

            /*  optionally inject an empty initial message  */
            // if (routeOptions.initially) {
            //     /*  inject incoming WebSocket message as a simulated HTTP request  */
            //     let response = await server.inject({
            //         /*  simulate the hard-coded POST request  */
            //         method:        "POST",

            //         /*  pass-through initial HTTP request information  */
            //         url:           req.url,
            //         headers:       headers,
            //         remoteAddress: req.socket.remoteAddress,

            //         /*  provide an empty HTTP POST payload  */
            //         payload:       null,

            //         /*  provide WebSocket plugin context information  */
            //         plugins: {
            //             websocket: { mode: "websocket", ctx, wss, ws, wsf, req, peers, initially: true }
            //         }
            //     })

            //     /*  any HTTP redirection, client error or server error response
            //         leads to an immediate WebSocket connection drop  */
            //     if (response.statusCode >= 300) {
            //         let annotation = `(HAPI handler reponded with HTTP status ${response.statusCode})`
            //         if (response.statusCode < 400)
            //             ws.close(1002, `Protocol Error ${annotation}`)
            //         else if (response.statusCode < 500)
            //             ws.close(1008, `Policy Violation ${annotation}`)
            //         else
            //             ws.close(1011, `Server Error ${annotation}`)
            //     }
            // }

            /*  hook into WebSocket message retrieval  */
            if (routeOptions.frame === true) {
                /*  framed WebSocket communication (correlated request/reply)  */
                wsf.on("message", async (ev) => {
                    /*  allow application to hook into raw WebSocket frame processing  */
                    routeOptions.frameMessage.call(ctx, { ctx, wss, ws, wsf, req, peers }, ev.frame)

                    /*  process frame of expected type only  */
                    if (ev.frame.type === routeOptions.frameRequest) {
                        /*  re-encode data as JSON as HAPI want to decode it  */
                        let message = JSON.stringify(ev.frame.data)

                        /*  inject incoming WebSocket message as a simulated HTTP request  */
                        // let response = await server.inject({
                        //     /*  simulate the hard-coded POST request  */
                        //     method:        "POST",

                        //     /*  pass-through initial HTTP request information  */
                        //     url:           req.url,
                        //     headers:       headers,
                        //     remoteAddress: req.socket.remoteAddress,

                        //     /*  provide WebSocket message as HTTP POST payload  */
                        //     payload:       message,

                        //     /*  provide WebSocket plugin context information  */
                        //     plugins: {
                        //         websocket: { mode: "websocket", ctx, wss, ws, wsf, req, peers }
                        //     }
                        // })

                        // /*  transform simulated HTTP response into an outgoing WebSocket message  */
                        // if (response.statusCode !== 204 && ws.readyState === WS.OPEN) {
                        //     /*  decode data from JSON as HAPI has already encoded it  */
                        //     let type = routeOptions.frameResponse
                        //     let data = JSON.parse(response.payload)

                        //     /*  send as framed data  */
                        //     wsf.send({ type, data }, ev.frame)
                        // }
                        routeOptions.message.call(ctx, { ctx, wss, ws, wsf, req, peers, message })
                    }
                })
            }
            else {
                /*  plain WebSocket communication (uncorrelated request/reponse)  */
                ws.on("message", async (message) => {
                    /*  inject incoming WebSocket message as a simulated HTTP request  */
                    // let response = await server.inject({
                    //     /*  simulate the hard-coded POST request  */
                    //     method:        "POST",

                    //     /*  pass-through initial HTTP request information  */
                    //     url:           req.url,
                    //     headers:       headers,
                    //     remoteAddress: req.socket.remoteAddress,

                    //     /*  provide WebSocket message as HTTP POST payload  */
                    //     payload:       message,

                    //     /*  provide WebSocket plugin context information  */
                    //     plugins: {
                    //         websocket: { mode: "websocket", ctx, wss, ws, wsf, req, peers }
                    //     }
                    // })

                    // /*  transform simulated HTTP response into an outgoing WebSocket message  */
                    // if (response.statusCode !== 204 && ws.readyState === WS.OPEN)
                    //     ws.send(response.payload)
                    routeOptions.message.call(ctx, { ctx, wss, ws, wsf, req, peers, message })
                })
            }

            /*  hook into WebSocket disconnection  */
            ws.on("close", () => {
                /*  allow application to hook into WebSocket disconnection  */
                routeOptions.disconnect.call(ctx, { ctx, wss, ws, wsf, req, peers })

                /*  stop tracking the peer  */
                let idx = routePeers[routeId].indexOf(ws)
                routePeers[routeId].splice(idx, 1)
            })

            /*  allow application to hook into WebSocket error processing  */
            ws.on("error", (error) => {
                routeOptions.error.call(ctx, { ctx, wss, ws, wsf, req, peers }, error)
            })
            if (routeOptions.frame === true) {
                wsf.on("error", (error) => {
                    routeOptions.error.call(ctx, { ctx, wss, ws, wsf, req, peers }, error)
                })
            }
        })
    } })

    /*  perform WebSocket handling on HAPI stop  */
    server.ext({ type: "onPreStop", method: (server, h) => {
        /*  close WebSocket server instance  */
        return new Promise((resolve /*, reject */) => {
            if (wss !== null) {
                /*  trigger the WebSocket server to close everything  */
                wss.close(() => {
                    /*  give WebSocket server's callback a chance to execute
                        (this indirectly calls our "close" subscription above)  */
                    setTimeout(() => {
                        /*  continue processing inside HAPI  */
                        wss = null
                        resolve()
                    }, 0)
                })
            }
            else
                resolve()
        })
    } })

    /*  make available to HAPI request the remote WebSocket information  */
    server.ext({ type: "onRequest", method: (request, h) => {
        if (isRequestWebSocketDriven(request)) {
            request.info.remoteAddress = request.plugins.websocket.req.socket.remoteAddress
            request.info.remotePort    = request.plugins.websocket.req.socket.remotePort
        }
        return h.continue
    } })

    /*  allow WebSocket information to be easily retrieved  */
    server.decorate("request", "websocket", (request) => {
        return () => {
            return (isRequestWebSocketDriven(request) ?
                request.plugins.websocket
                : { mode: "http", ctx: null, wss: null, ws: null, wsf: null, req: null, peers: null })
        }
    }, { apply: true })

    /*  handle WebSocket exclusive routes  */
    server.ext({ type: "onPreAuth", method: (request, h) => {
        /*  if WebSocket is enabled with "only" flag on the selected route...  */
        if (   isRouteWebSocketEnabled(request.route)
            && request.route.settings.plugins.websocket.only === true) {
            /*  ...but this is not a WebSocket originated request  */
            if (!isRequestWebSocketDriven(request))
                return Boom.badRequest("Plain HTTP request to a WebSocket-only route not allowed")
        }
        return h.continue
    } })

    /*  handle request/response hooks  */
    server.ext({ type: "onPostAuth", method: (request, h) => {
        if (isRouteWebSocketEnabled(request.route) && isRequestWebSocketDriven(request)) {
            let routeOptions = fetchRouteOptions(request.route)
            return routeOptions.request.call(request.plugins.websocket.ctx,
                request.plugins.websocket, request, h)
        }
        return h.continue
    } })
    server.ext({ type: "onPostHandler", method: (request, h) => {
        if (isRouteWebSocketEnabled(request.route) && isRequestWebSocketDriven(request)) {
            let routeOptions = fetchRouteOptions(request.route)
            return routeOptions.response.call(request.plugins.websocket.ctx,
                request.plugins.websocket, request, h)
        }
        return h.continue
    } })
}

/*  export register function, wrapped in a plugin object  */
module.exports = {
    plugin: {
        register: register,
        pkg:      pkg,
        once:     true
    }
}

