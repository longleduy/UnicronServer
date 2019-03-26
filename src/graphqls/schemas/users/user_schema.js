import { gql } from 'apollo-server-express'
import {PubSub, withFilter} from 'graphql-subscriptions'
//Todo: Controllers
import * as userAccountController from '../../../controllers/users/user_controller'
import { insertEmailActiveAccBuffer } from '../../../utils/job_utils/email_buffer_util'
import { authorizationMiddleWare } from '../../../middlewares/authorization_middleware'
import { convertPostTime } from '../../../utils/common'
import { getClientIp } from '../../../utils/common'
const pubsub = new PubSub();
const SET_USER_STATUS_SUB = 'SET_USER_STATUS_SUB'
export const typeDefs = gql`
interface  UserAccountInterface{
        firstName: String
        lastName: String
        email: String
        profileName: String
        passWord: String
        gender: String
        level: String
        active: Boolean
        avatar: String
        dateOfBirth:String
        point:Int
        rank:Int
        facebookAdress:String
        instagramAdress:String
        posts:Int
    }
    type UserAccount implements UserAccountInterface{
        firstName: String
        lastName: String
        email: String
        profileName: String
        passWord: String
        gender: String
        level: String
        active: Boolean
        avatar: String
        dateOfBirth:String
        point:Int
        rank:Int
        facebookAdress:String
        instagramAdress:String
        posts:Int
    }
    type NewNotificationInfo{
        newNotifications: NotificationCount!
        newestNotificationInfo: NotificationInfo
    }
    type NotificationCount{
        likeAndComments: Int!
        messages: Int!
    }
    type NotificationInfo{
        formUserName: String!
        formUserAvatar: String
        action: String!
        postID: String
        content:String
        actionTime: String!
    }   
    type SignInInfo {
        jwt:String!
    }
    type ListUser{
        userID: String!
        profileName:String!
        avatar: String
        status: String
        point: Int
    }
    input formData {
        firstName: String
        lastName: String
        email: String
        profileName: String
        passWord: String
        gender: String
        level: String
        active: Boolean
        avatar: String
    }
    input updateUserDataInput{
        gender: String
        dateOfBirth: String
        facebookAdress:String
        instagramAdress:String
        avatar: String
    }
    type updateUserDataType{
        gender: String
        dateOfBirth: String
        facebookAdress:String
        instagramAdress:String
        avatar: String
    }
    type checkEmail {
        status: Boolean
    }
    type verifyEmail {
        status: String
    }
    type boolean{
        isSuccess: Boolean
    }
    type jwtRespone{
        jwt: String!
    }
    type blockTime{
        count: Int
        status: String
    }
    extend type Query{
        checkEmail(email: String!): checkEmail
        verifyEmail(secretKey: String!): verifyEmail
        getNotificationInfo:NewNotificationInfo
        getSignInBlockTime: blockTime
        getListUser(limitNumber: Int!,skipNumber: Int!):[ListUser]
    }
    extend type Mutation {
        addNewUserAccount(formData: formData):UserAccountInterface
        signIn(formData: formData): jwtRespone
        signOut:boolean
        updateUserInfo(updateUserDataInput: updateUserDataInput):updateUserDataType
        setUserStatus(status:String!):ListUser
    }
    extend type Subscription{
        setUserStatusSub: ListUser
    }
`;
export const resolvers = {
    Query: {
        checkEmail: (obj, args, context) => {
            return userAccountController.checkEmail(args.email);
        },
        verifyEmail: (obj, args, context) => {
            return userAccountController.verifyEmail(args.secretKey);
        },
        getNotificationInfo: (obj, args, { req, res }) => {
            return authorizationMiddleWare(req, res, userAccountController.getNewNotification);
        },
        getSignInBlockTime: async (obj, args, { req, res }) => {
            let clientIP = getClientIp(req);
            let data = await userAccountController.getSignInBlockTime(clientIP);
            return data;
        },
        getListUser: async (obj, args, { req, res }) => {
            const data = await authorizationMiddleWare(req, res, userAccountController.getListUser, args);
            return data;
        },
    },
    Mutation: {
        addNewUserAccount: (obj, args, context) => {
            return userAccountController.addNewUserAccount(args.formData);
        },
        signIn: async (obj, args, { req }) => {
            let clientIP = getClientIp(req);
            const user = await userAccountController.signIn(args.formData, clientIP);
            req.session.user = user;
            return { jwt: user.jwt };
        },
        signOut: async (obj, args, { req, res }) => {
          let data =  await userAccountController.setUserStatus({ status: "OFF" }, req, res);
          if(data){
            pubsub.publish('SET_USER_STATUS_SUB',{setUserStatusSub:data})
            }
            await req.session.destroy();
            return {
                isSuccess: true
            };
        },
        updateUserInfo: async (obj, args, { req, res }) => {
            return authorizationMiddleWare(req, res, userAccountController.updateUserInfo, args.updateUserDataInput);
        },
        setUserStatus: async (obj, args, { req, res }) => {
            let data = await userAccountController.setUserStatus({ status: args.status }, req, res);
            if(data){
                pubsub.publish('SET_USER_STATUS_SUB',{setUserStatusSub:data})
            }
            return data;
        }
    },
    Subscription: {
        setUserStatusSub: {
            subscribe: () => pubsub.asyncIterator(SET_USER_STATUS_SUB)
        }
    },
    NewNotificationInfo: {
        newestNotificationInfo: async (obj, args, { req, res }) => {
            const data = obj.newestNotificationInfo;
            if (!data) return null;
            return {
                formUserName: data.fromUser.profileName,
                formUserAvatar: data.fromUser.avatar,
                action: data.action,
                postID: data.postID,
                content: data.content,
                actionTime: convertPostTime(data.notifiTime)
            }
        },
        newNotifications: async (obj, args, { req, res }) => {
            return {
                likeAndComments: obj.newNotifications.likeAndComments,
                messages: obj.newNotifications.messages
            };
        }
    },
    ListUser: {
        userID: async (obj, args, { req, res }) => {
            return obj._id
        }
    },
    UserAccountInterface: {
        __resolveType(obj, context, info) {
            if (obj.jwt) {
                return 'SignInInfo';
            }
            return 'UserAccount';
        },
    },
}