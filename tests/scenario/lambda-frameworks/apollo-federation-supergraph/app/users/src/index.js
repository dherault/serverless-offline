import { readFile } from 'node:fs/promises'
import { join } from 'desm'
import { ApolloServer } from '@apollo/server'
import { buildSubgraphSchema } from '@apollo/subgraph'
import {
  handlers,
  startServerAndCreateLambdaHandler,
} from '@as-integrations/aws-lambda'
import gql from 'graphql-tag'
import resolvers from './resolvers.js'

const schema = await readFile(
  join(import.meta.url, '../schema/users.graphql'),
  'utf8',
)

const server = new ApolloServer({
  schema: buildSubgraphSchema({
    resolvers,
    typeDefs: gql(schema),
  }),
})

export default startServerAndCreateLambdaHandler(
  server,
  handlers.createAPIGatewayProxyEventRequestHandler(),
)
