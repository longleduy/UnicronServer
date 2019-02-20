import { gql } from 'apollo-server-express'
import {PubSub, withFilter} from 'graphql-subscriptions'
const pubsub = new PubSub();
//Todo: Controllers
import {getChatMessageByChanelID,sendMessage} from '../../../controllers/chats/chat_controller'
//Todo: Utils
import { authorizationMiddleWare } from '../../../middlewares/authorization_middleware'
import {convertPostTime,getChatChanelID} from '../../../utils/common'
const NEW_MESSAGE_SUB = 'NEW_MESSAGE_SUB'
export const typeDefs = gql`
    type ChatInfo{
        fromUserId: String!
        content: String!
        chatTime: String!
    }
    extend type Query{
        getChatMessageByChanelId(from: String!,to: String!,limitNumber: Int!,skipNumber: Int!):[ChatInfo]
    }
    extend type Mutation{
        sendMessage(from: String!,to: String!,content:String!):ChatInfo
    }
    # extend type Subscription{
    #     newMessageSub(from: String!,to: String!): ChatInfo
    # }
`;
export const resolvers = {
     Query: {
        getChatMessageByChanelId: async (obj, args, { req, res }) => {
            const data = await authorizationMiddleWare(req, res, getChatMessageByChanelID, args);
            return data;
        }
     },
     Mutation: {
        // sendMessage: async (obj, args, { req, res }) => {
        //     const data = await authorizationMiddleWare(req, res, sendMessage, args);
        //     pubsub.publish(NEW_MESSAGE_SUB,{newMessageSub:data});
        //     pubsub.publish('NOTIFICATION_POST_SUB',getNotiInfor2(data.notificationInfo))
        //     return data;
        // }
     },
    //  Subscription: {
    //     newMessageSub : {
    //         subscribe: withFilter(
    //             () => pubsub.asyncIterator(NEW_MESSAGE_SUB),
    //             (payload,variables) => {
    //                 let {from,to} = variables;
    //                 let chanelID = getChatChanelID(from,to)
    //                 return payload.newMessageSub.chanelID === chanelID;
    //             }
    //         )
    //     }
    // },
     ChatInfo: {
        chatTime: async (obj, args, { req, res })=> {
            return convertPostTime(obj.chatTime)
        }
    },


}
