import { readFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import { ApolloGateway, RemoteGraphQLDataSource } from '@apollo/gateway'
import { ApolloServer } from 'apollo-server-lambda'

const __dirname = dirname(fileURLToPath(import.meta.url))

const schema = await readFile(
  resolve(__dirname, '../schema/supergraph-gateway.graphql'),
  'utf-8',
)

const gateway = new ApolloGateway({
  buildService(definition) {
    // console.log('definition', definition)

    const { name, url } = definition

    // ? join('http://localhost:4001', name)

    // TEMNP HACK
    // we should probably always use env.API_GATEWAY?
    return new RemoteGraphQLDataSource({
      url: join(env.IS_OFFLINE ? url ?? '' : env.APIGATEWAY_URL ?? '', name),
    })
  },

  supergraphSdl: schema,
})

const server = new ApolloServer({
  gateway,
})

export default server.createHandler()
