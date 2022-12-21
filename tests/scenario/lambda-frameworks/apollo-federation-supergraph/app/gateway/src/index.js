import { readFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import { ApolloGateway, RemoteGraphQLDataSource } from '@apollo/gateway'
import { ApolloServer } from '@apollo/server'
import { startServerAndCreateLambdaHandler } from '@as-integrations/aws-lambda'

const __dirname = dirname(fileURLToPath(import.meta.url))

const schema = await readFile(
  resolve(__dirname, '../schema/supergraph-gateway.graphql'),
  'utf-8',
)

const gateway = new ApolloGateway({
  buildService(definition) {
    const { name, url } = definition

    // TEMNP, we should probably always use env.API_GATEWAY?
    const remoteUrl = join(env.IS_OFFLINE ? url : env.APIGATEWAY_URL, name)

    return new RemoteGraphQLDataSource({
      url: remoteUrl,
    })
  },

  supergraphSdl: schema,
})

const server = new ApolloServer({
  gateway,
})

export default startServerAndCreateLambdaHandler(server)
