import { gql } from 'apollo-server-express'
//Todo: Controllers
import * as userAccountController from '../../../controllers/users/user_controller'
import {update} from '../../../controllers/test'
import {insertEmailActiveAccBuffer} from '../../../utils/job_utils/email_buffer_util'
import { authorizationMiddleWare } from '../../../middlewares/authorization_middleware'
import {convertPostTime} from '../../../utils/common'
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
    extend type Query{
        checkEmail(email: String!): checkEmail
        verifyEmail(secretKey: String!): verifyEmail
        getNotificationInfo:NewNotificationInfo
        test:boolean
    }
    extend type Mutation {
        addNewUserAccount(formData: formData):UserAccountInterface
        signIn(formData: formData): jwtRespone
        signOut:boolean
        updateUserInfo(updateUserDataInput: updateUserDataInput):updateUserDataType
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
        getNotificationInfo: (obj, args, { req,res }) => {
            return authorizationMiddleWare(req,res, userAccountController.getNewNotification);
        },
        test: (obj, args, context) => {
            //insertEmailActiveAccBuffer();
            update();
        }
     },
    Mutation: {
        addNewUserAccount: (obj, args, context) => {
            return userAccountController.addNewUserAccount(args.formData);
        },
        signIn: async (obj, args, { req }) => {
            const user = await userAccountController.signIn(args.formData);
            req.session.user = user;
            return {jwt:user.jwt};
        },
        signOut: async (obj, args, { req }) => {
            await req.session.destroy();
            return {
                isSuccess: true
            };
        },
        updateUserInfo: async (obj, args, { req,res }) => {
            return authorizationMiddleWare(req,res, userAccountController.updateUserInfo,args.updateUserDataInput);
        }
    },
    NewNotificationInfo: {
        newestNotificationInfo : async (obj, args, { req, res }) => {
            const data = obj.newestNotificationInfo;
            if(!data) return null;
            return {
                formUserName: data.fromUser.profileName,
                formUserAvatar: data.fromUser.avatar,
                action: data.action,
                postID: data.postID,
                content: data.content,
                actionTime: convertPostTime(data.notifiTime)
            }
        },
        newNotifications : async (obj, args, { req, res }) => {
            return {
                likeAndComments: obj.newNotifications.likeAndComments,
                messages: obj.newNotifications.messages
            };
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