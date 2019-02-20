import { makeExecutableSchema } from 'graphql-tools'
import { gql } from 'apollo-server-express'
import { typeDefs as userAccountSchema, resolvers as userAccountResolver } from './users/user_schema'
import {typeDefs as postSchema, resolvers as postResolver} from './posts/post_schema'
import { typeDefs as notificationSchema, resolvers as notificationResolver } from './notifications/notification_schema'
import { typeDefs as chatSchema, resolvers as chatResolver } from './chats/chat_schema'
import { typeDefs as searchSchame, resolvers as searchResolver } from './search/search_schema'
const Query = gql`
    type Query {
        _empty: String
    }
`
const Mutation = gql`
    type Mutation {
        _empty: String
    }
`
const Subscription = gql`
    type Subscription{
        _empty: String
    }
    `
export const schema = makeExecutableSchema({
    typeDefs: [Query,Mutation,Subscription,userAccountSchema,postSchema,notificationSchema,chatSchema,searchSchame],
    resolvers: [userAccountResolver,postResolver,notificationResolver,chatResolver,searchResolver]
})