import { mongo } from 'mongoose'
//Todo: Utils
import {delCharCode} from '../../utils/common'
//Todo: Models
import {userModel} from '../../models/user_model'
import {postModel} from '../../models/post_model'
export const filterPostByKeyWord = async (keyWord , req = null, res = null) => {
    let result =await postModel.find( { $text: { $search : keyWord } }).limit(5).populate('userID', 'profileName avatar');
    return result;
}
export const filterUserByKeyWord = async (keyWord , req = null, res = null) => {
    const userID = req.session.user._id;
    const _id = mongo.ObjectId(userID);
    let searchText = delCharCode(keyWord);
    let result = await userModel.find({profileName:{$regex: searchText,$options: 'i'},_id:{$ne:_id}},{ profileName: 1, avatar: 1 }).limit(5);
    return result;
}