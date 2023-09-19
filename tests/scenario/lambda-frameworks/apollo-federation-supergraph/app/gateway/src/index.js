import { readFile } from 'node:fs/promises'
import { join as pathJoin } from 'node:path'
import { env } from 'node:process'
import { ApolloGateway, RemoteGraphQLDataSource } from '@apollo/gateway'
import { ApolloServer } from '@apollo/server'
import {
  handlers,
  startServerAndCreateLambdaHandler,
} from '@as-integrations/aws-lambda'
import { join } from 'desm'

const schema = await readFile(
  join(import.meta.url, '../schema/supergraph-gateway.graphql'),
  'utf8',
)

const gateway = new ApolloGateway({
  buildService(definition) {
    const { name, url } = definition

    // TEMNP, we should probably always use env.API_GATEWAY?
    const remoteUrl = pathJoin(env.IS_OFFLINE ? url : env.APIGATEWAY_URL, name)

    return new RemoteGraphQLDataSource({
      url: remoteUrl,
    })
  },

  supergraphSdl: schema,
})

const server = new ApolloServer({
  gateway,
})

export default startServerAndCreateLambdaHandler(
  server,
  handlers.createAPIGatewayProxyEventRequestHandler(),
)
