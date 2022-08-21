'use strict'

const { ApolloServer } = require('apollo-server-lambda')
const gql = require('graphql-tag')

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

exports.graphql = server.createHandler()
