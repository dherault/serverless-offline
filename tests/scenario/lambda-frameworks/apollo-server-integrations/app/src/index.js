import { ApolloServer } from '@apollo/server'
import {
  handlers,
  startServerAndCreateLambdaHandler,
} from '@as-integrations/aws-lambda'
import gql from 'graphql-tag'

const resolvers = {
  Query: {
    hello: () => 'Hello graphql!',
  },
}

const typeDefs = gql`
  type Query {
    hello: String
  }
`

const server = new ApolloServer({
  resolvers,
  typeDefs,
})

export default startServerAndCreateLambdaHandler(
  server,
  handlers.createAPIGatewayProxyEventRequestHandler(),
)
