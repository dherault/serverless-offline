import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildSubgraphSchema } from '@apollo/subgraph'
import { ApolloServer } from 'apollo-server-lambda'
import gql from 'graphql-tag'
import resolvers from './resolvers.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const schema = await readFile(
  resolve(__dirname, '../schema/products.graphql'),
  'utf-8',
)

const server = new ApolloServer({
  schema: buildSubgraphSchema({
    resolvers,
    typeDefs: gql(schema),
  }),
})

export default server.createHandler()
