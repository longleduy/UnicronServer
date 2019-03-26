import { gql } from 'apollo-server-express'
//Todo: Controllers
import {getNotification,getMessage} from '../../../controllers/notifications/notification_controller'
//Todo: Utils
import { authorizationMiddleWare } from '../../../middlewares/authorization_middleware'
import {convertPostTime} from '../../../utils/common'
export const typeDefs = gql`
    type Notification{
        fromUser: UserInfo!
        action: String!
        postID: String
        content:String
        actionTime: String!
        isNewNotif: Boolean
        isReadNotif: Boolean
    }
    type UserInfo{
        id: String!
        profileName: String!
        avatar: String
    }
    extend type Query{
        getNotification(limitNumber: Int!,skipNumber: Int!):[Notification]
        getMessage(limitNumber: Int!,skipNumber: Int!):[Notification]
    }
`;
export const resolvers = {
     Query: {
        getNotification: async (obj, args, { req, res }) => {
            const data = await authorizationMiddleWare(req, res, getNotification, args);
            return data;
        },
        getMessage: async (obj, args, { req, res }) => {
            const data = await authorizationMiddleWare(req, res, getMessage, args);
            return data;
        }
     },
     Notification: {
        fromUser: async (obj, args, { req, res }) => {
            return obj.fromUser || {id: "?",
                profileName: "Anonymous",
                avatar: null};
        },
        actionTime: async (obj, args, { req, res })=> {
            return convertPostTime(obj.notifiTime)
        }
    },


}