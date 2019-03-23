import { mongo } from 'mongoose'
//Todo: Model
import { userModel } from '../../models/user_model'
import {notificationModel} from '../../models/notification_model'

import fs from 'fs'
import util from 'util'
//Todo: Utils
import * as passWordUtil from '../../utils/password_util'
import {insertEmailActiveAccBuffer} from '../../utils/job_utils/email_buffer_util'
import { AuthenticationError } from 'apollo-server-express'
import * as commonUtils from '../../utils/common'
import * as errorHandler from '../../utils/error_handler'
import { uploadImage } from '../../utils/common'
import { refreshJWT } from '../../middlewares/refresh_jwt'
import {asyncClient} from '../../utils/redis'
//Todo: Contants
import { ACCOUNT_NOT_AVAILABLE, WRONG_PASSWORD, ERROR_EMAIL_NOT_VERIFY } from '../../utils/contants/error_message_contants'

const readFile = util.promisify(fs.readFile);

export const checkEmail = async (email) => {
    const result = await userModel.find({ email });
    if (result.length > 0) {
        return {
            status: true
        }
    }
    return {
        status: false
    }
}
export const addNewUserAccount = async (args) => {
    const passWord = await passWordUtil.hashPassWordAsync(args.passWord);
    let newUserAccount = new userModel({
        firstName: args.firstName,
        lastName: args.lastName,
        email: args.email,
        profileName: `${args.firstName} ${args.lastName}`,
        passWord: passWord,
        gender: null,
        dateOfBirth: null,
        level: "Member",
        point: 0,
        rank: 1,
        facebookAdress: null,
        instagramAdress: null,
        active: false,
        avatar: null
    });
    let result = await newUserAccount.save();
    let { email } = args;
    insertEmailActiveAccBuffer(email);
    return result;
};
export const verifyEmail = async (secretKey) => {
    const emailEncoded = secretKey;
    const email = new Buffer(emailEncoded, 'base64').toString('ascii');
    const data = await userModel.findOneAndUpdate({ email: email, active: false }, { $set: { active: true } });
    if (!data) {
        throw new Error('Email verify invalid')
    }
    return {
        status: "Active"
    }
}
export const signIn = async (formData,clientIP) => {
    const { email, passWord } = formData;
    const result = await userModel.findOne({ email });
    if (result) {
        if (!result.active) {
           let field = 'email';
           let blockTime;
           let badRequestsCount = await setBadRequestClientIP(clientIP);
           if(badRequestsCount === 'SIGN_IN_BLOCK'){
             field = 'SIGN_IN_BLOCK';
             blockTime = 300
           }
            throw new errorHandler.dataFormInvalid({
                message: ERROR_EMAIL_NOT_VERIFY,
                data: {
                    field,
                    blockTime
                }
            })
        }
        else {
            const verifyPasswordStatus = await passWordUtil.comparePassWordAsync(passWord, result.passWord);
            if (!verifyPasswordStatus) {
                let field = 'passWord';
                let blockTime;
                let badRequestsCount = await setBadRequestClientIP(clientIP);
                if(badRequestsCount === 'SIGN_IN_BLOCK'){
                    field = 'SIGN_IN_BLOCK'
                    blockTime = 300;
                }
                throw new errorHandler.dataFormInvalid({
                    message: WRONG_PASSWORD,
                    data: {
                        field,
                        blockTime
                    }
                })
            }
            else {
                const date = new Date(result.createTime);
                const joinAt = date.toDateString();
                let dateOfBirthString;
                if (result.dateOfBirth != null) {
                    const newDate = new Date(result.dateOfBirth);
                    dateOfBirthString = newDate.toDateString();;
                }
                const payload = {
                    userID:result._id,
                    avatar: result.avatar,
                    email: result.email,
                    profileName: result.profileName,
                    level: result.level,
                    gender: result.gender,
                    dateOfBirth: dateOfBirthString ? dateOfBirthString : result.dateOfBirth,
                    joinAt: joinAt,
                    facebookAdress: result.facebookAdress,
                    instagramAdress: result.instagramAdress,
                }
                const jwt = commonUtils.genJWT(payload, process.env.SECRET_KEY, '5s');
                result["jwt"] = jwt;
                asyncClient.delAsync(`bad_request_client_ip_list:${clientIP}`);
                return result;
            }
        }

    }
    else {
            let field = 'email';
            let blockTime;
                let badRequestsCount = await setBadRequestClientIP(clientIP);
                if(badRequestsCount === 'SIGN_IN_BLOCK'){
                    field = 'SIGN_IN_BLOCK'
                    blockTime =300
                }
        throw new errorHandler.dataFormInvalid({
            message: ACCOUNT_NOT_AVAILABLE,
            data: {
                field,
                blockTime
            }
        })
    }
}
export const updateUserInfo = async (updateData, req, res) => {
    const _id = mongo.ObjectId(req.session.user._id);
    if (updateData.avatar != '' && updateData.avatar != null) {
        const avatarUrl = await uploadImage(updateData.avatar, { width: 300, height: 300, radius: 'max', crop: "fill" });
        updateData["avatar"] = avatarUrl;
    }
    const fieldResult = { ...updateData };
    Object.keys(fieldResult).forEach(v => fieldResult[v] = 1)
    const data = await userModel.findOneAndUpdate({ _id: _id }, { $set: updateData }, { new: true, fields: fieldResult });
    const result = data.toObject();
    if (result.dateOfBirth != null) {
        const date = new Date(result.dateOfBirth);
        const dateStr = date.toDateString();
        result.dateOfBirth = dateStr;
    }
    await refreshJWT(req, res, result);
    return result;
}
export const getNewNotification = async (args,req,res) => {
    const userID = req.session.user._id;
    const countLikeAndPostAsyncFunc = notificationModel.countDocuments({userID,action:{$in:['LIKE','COMMENT']},isNewNotif:true});
    const countMessageAsyncFunc = notificationModel.countDocuments({userID,action:{$in:['CHAT']},isNewNotif:true});
    const getNewestNotificationAsyncFunc = notificationModel.find({userID,isNewNotif:true}).populate('fromUser', 'profileName avatar').sort({ notifiTime:-1,_id: -1 });
    const likeAndComments = await  countLikeAndPostAsyncFunc;
    const messages = await  countMessageAsyncFunc;
    const newestNotification = await getNewestNotificationAsyncFunc;
    return {
        newNotifications:{
            likeAndComments,
            messages
        },
        newestNotificationInfo: newestNotification[0]
    }
}
export const getSignInBlockTime = async (clientIP) => {
    let count = await asyncClient.ttlAsync(`bad_request_client_ip_list:${clientIP}`);
    let status = await asyncClient.getAsync(`bad_request_client_ip_list:${clientIP}`);
    return {
        count,
        status
    };
}
export const getMailUserID = (userID) => {
    return `email_buffer:${userID}`;
}
export const setBadRequestClientIP = async (clientIP) => {
  let badRequestsCount = await asyncClient.getAsync(`bad_request_client_ip_list:${clientIP}`);
  let expireTime;
  if(badRequestsCount >3){
      asyncClient.setexAsync(`bad_request_client_ip_list:${clientIP}`,300,'SIGN_IN_BLOCK');
      badRequestsCount = 'SIGN_IN_BLOCK'
  }
  else{
    await asyncClient.incrAsync(`bad_request_client_ip_list:${clientIP}`);
    asyncClient.expireAsync(`bad_request_client_ip_list:${clientIP}`,86400);
  }
  return badRequestsCount;
}
