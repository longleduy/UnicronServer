import { gql } from 'apollo-server-express'
//Todo: Controllers
import {filterPostByKeyWord,filterUserByKeyWord} from '../../../controllers/search/search_controller'
//Todo: Utils
import { authorizationMiddleWare } from '../../../middlewares/authorization_middleware'
export const typeDefs = gql`
    type PostInfo{
        id: String
        userInfo2:userInfo
        content: String!
        image:String
        postTime: String!
        postDate: String!
        location: String
        tag: [String]!
    }
    type SearchResults{
        userSearchResult: [userInfo]
        postSearchResult: [PostInfo]
    }
    extend type Query{
        filterAllByKeyWord(keyWord: String!):SearchResults
    }
`;
export const resolvers = {
     Query: {
        filterAllByKeyWord: async (obj, args, { req, res }) => {
            return args.keyWord;
        }
     },
     SearchResults:{
        userSearchResult: async (obj, args, { req, res }) => {
            let data = await authorizationMiddleWare(req, res, filterUserByKeyWord, obj);
            return data;
        },
        postSearchResult: async (obj, args, { req, res }) => {
            let data = await authorizationMiddleWare(req, res, filterPostByKeyWord, obj);
            return data;
        }
     },
     PostInfo:{
        userInfo2: async (obj, args, { req, res }) => {
            return {
                id:obj.userID.id,
                profileName:obj.userID.profileName,
				avatar:obj.userID.avatar
            }
        }
     }

}