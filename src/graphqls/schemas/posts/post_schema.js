import { gql } from 'apollo-server-express'
import {PubSub, withFilter} from 'graphql-subscriptions'
import {createPost,getLimitedPosts,getCountInfo,likePost,delPost,commentPost,loadMoreComment} from '../../../controllers/posts/post_controller'
import { authorizationMiddleWare } from '../../../middlewares/authorization_middleware'
import {sendMessage} from '../../../controllers/chats/chat_controller'
import {getChatChanelID} from '../../../utils/common'
const pubsub = new PubSub();

const POST_LIKED = 'POST_LIKED'
const CREATE_POST_SUB = 'CREATE_POST_SUB'
const COMMENT_POST_SUB = 'COMMENT_POST_SUB'
const COMMENT_POST_COUNT_SUB = 'COMMENT_POST_COUNT_SUB'
export const typeDefs = gql`
    type Post {
        id: String
        userInfo:userInfo
        isAuthor: Boolean
        content: String!
        image:String
        postTime: String!
        postDate: String!
        location: String
        tag: [String]!
        count:Count!
    }
    
    input postData {
        content: String!
        location: String
        tag: [String]!
        image: String
    }
    input likeData{
        postID: String!
        action: String!
    }
    type userInfo{
        id: String
        profileName: String
        avatar: String
        userID: String
    }
    type status{
        status: Boolean
    }

    type Count{
        likes: Int!
        liked: Boolean!
        comments: Int!
        views: Int!
    }
    type newComment{
        commentContent: String
        userInfoComment: userInfo
        commentDate: String
        commentImage: String
    }
    type loadComment{
        commentContent: String
        userInfoComment: userInfo
        commentDate: String
        commentImage: String
    }
    type createPostData{
        id: String
        userInfo:userInfo
        isAuthor: Boolean
        content: String!
        image:String
        postTime: String!
        postDate: String!
        location: String
        tag: [String]!
        count:Count!
    }
    type createPostDataSub{
        id: String
        userInfo:userInfo
        isAuthor: Boolean
        content: String!
        image:String
        postTime: String!
        postDate: String!
        location: String
        tag: [String]!
        count:Count!
    }
    type likeRespone{
        likes: Int
        liked: Boolean
    }
    type likeResSub{
        postID: String!
        likes: Int
    }
    type newCommentCountSub{
        postID: String!
    }
    type notificationPostResSub{
        formUserName: String!
        formUserAvatar: String
        action: String!
        postID: String
        content:String
        actionTime: String!
    }
    extend type Query{
        getAllPost: [Post]
        getLimitedPost(limitNumber: Int!,skipNumber: Int!):[Post]
        loadMorePost(limitNumber: Int!,start: String):[Post]
        loadMoreComment(postID: String!,limitNumber: Int!,skipNumber: Int):[loadComment]
    }
    extend type Mutation{
        createPost(postData: postData):createPostData
        likePost(likeData: likeData):likeRespone,
        delPost(postID: String!,likes: Int!,comments: Int!,views: Int!):status,
        commentPost(postID: String!,commentContent: String!,commentImage: String!,commentCount: Int!):newComment
    }
    extend type Subscription{
        postLiked: likeResSub
        createPostSub: createPostData
        commentPostSub(postID:String!): newComment
        commentPostCountSub: newCommentCountSub
        notificationPostSub(userID: String!): notificationPostResSub
        newMessageSub(from: String!,to: String!): ChatInfo
    }
`;
export const resolvers = {
    Query: {
        getAllPost: async (obj, args, { req, res }) => {
            const data = await authorizationMiddleWare(req, res, getAllPost);
            return data;
        },
        getLimitedPost: async (obj, args, { req, res }) => {
            const data = await authorizationMiddleWare(req, res, getLimitedPosts, args);
            return data;
        },
        loadMorePost: async (obj, args, { req, res }) => {
            const data = await loadMorePost(args);
            return data;
        },
        loadMoreComment: async (obj, args, { req, res }) => {
            const data = await loadMoreComment(args);
            return data;
        }
    },
    Post: {
        userInfo: async (obj, args, { req, res }) => {
            return {
                id:obj.userID.id,
                profileName:obj.userID.profileName,
                avatar:obj.userID.avatar,
                userID:obj.userID.id
            }
        },
        count: async (obj, args, { req, res }) => {
            const data = await getCountInfo(req, obj.id);
            return data;
        }
    },
    createPostData: {
        userInfo: async (obj, args, { req, res }) => {   
            return {
                id:obj.idUser,
                profileName:obj.profileName,
                avatar:obj.avatarUser,
                userID:obj.idUser
            }
        },
        count: async (obj, args, { req, res }) => {
            return {
                likes: 0,
                liked: false,
                comments: 0,
                views: 0
            };
        }
    },
    newComment: {
        userInfoComment: async (obj, args, { req, res }) => {
            return {
                id:obj.idUser,
                profileName:obj.profileName,
				avatar:obj.avatarUser
            }
        }
    },
    loadComment: {
        userInfoComment: async (obj, args, { req, res }) => {
            return obj.userInfo
        }
    },
    Mutation: {
        createPost: async (obj, args, { req, res }) => {
            let data = await authorizationMiddleWare(req, res, createPost, args.postData);
            data["__typename"]="Post";
            pubsub.publish(CREATE_POST_SUB,{createPostSub:data});
            return data;
        },
        sendMessage: async (obj, args, { req, res }) => {
            const data = await authorizationMiddleWare(req, res, sendMessage, args);
            pubsub.publish('NEW_MESSAGE_SUB',{newMessageSub:data});
            pubsub.publish('NOTIFICATION_POST_SUB',getNotiInfor(data.notificationInfo))
            return data;
        },
        likePost: async (obj, args, { req, res }) => { 
            const data = await authorizationMiddleWare(req, res, likePost, args.likeData);
            pubsub.publish(POST_LIKED,{postLiked:{
                postID: args.likeData.postID,
                likes: data.likes
            }});
            if(data.notificationInfo){
                pubsub.publish('NOTIFICATION_POST_SUB',getNotiInfor(data.notificationInfo))
            }
            return data;
        },
        delPost: async (obj, args, { req, res }) => {
            return await authorizationMiddleWare(req, res, delPost, args);
        },
        commentPost: async (obj, args, { req, res }) => {
            const data = await authorizationMiddleWare(req, res, commentPost, args);
            pubsub.publish(COMMENT_POST_SUB,{commentPostSub:data,postID:args.postID});
            pubsub.publish(COMMENT_POST_COUNT_SUB,{commentPostCountSub:{
                postID: args.postID
            }});
            if(data.notificationInfo){
                pubsub.publish('NOTIFICATION_POST_SUB',getNotiInfor(data.notificationInfo))
            }
            return data;
        }
    },
    Subscription: {
        postLiked : {
            subscribe: () => pubsub.asyncIterator(POST_LIKED)
        },
        createPostSub: {
            subscribe: () => pubsub.asyncIterator(CREATE_POST_SUB)
        },
        commentPostSub: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(COMMENT_POST_SUB),
                (payload,variables) => {
                    return payload.postID === variables.postID
                }
            )
        },
        commentPostCountSub: {
            subscribe: () => pubsub.asyncIterator(COMMENT_POST_COUNT_SUB)
        },
        notificationPostSub: {
            subscribe: withFilter(
                () => pubsub.asyncIterator('NOTIFICATION_POST_SUB'),
                (payload,variables) => {
                    return payload.notificationPostSub.userID === variables.userID
                }
            )
        },
        newMessageSub : {
            subscribe: withFilter(
                () => pubsub.asyncIterator('NEW_MESSAGE_SUB'),
                (payload,variables) => {
                    let {from,to} = variables;
                    let chanelID = getChatChanelID(from,to)
                    return payload.newMessageSub.chanelID === chanelID;
                }
            )
    },
    }
}
export const getNotiInfor = (notificationInfo) => {
    return {
        notificationPostSub: {
            userID: notificationInfo.userID,
            formUserName: notificationInfo.formUserName,
            formUserAvatar: notificationInfo.formUserAvatar,
            action: notificationInfo.action,
            postID:notificationInfo.postID,
            content: notificationInfo.content,
            actionTime:'Just now'
        }
    }
}