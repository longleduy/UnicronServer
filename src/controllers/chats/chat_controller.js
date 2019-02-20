import * as Promise from 'bluebird'
import { mongo } from 'mongoose'
//Todo: Model
import { notificationModel } from '../../models/notification_model'
//Todo: Utils
import { client } from '../../utils/redis'
import {getChatChanelID} from '../../utils/common'

const asyncClient = Promise.promisifyAll(client);

export const getChatMessageByChanelID = async (args, req = null, res = null) => {
    const { from,to, limitNumber, skipNumber } = args;
    const chanelID = getChatChanelID(from,to);
    const listMessageID = await asyncClient.sortAsync(`chats:${chanelID}:${chanelID}`, "alpha", "desc", "limit", skipNumber, limitNumber);
    const resultArr = [];
    for (const messageID of listMessageID) {
        const message = await asyncClient.hgetallAsync(`chats:${chanelID}:messages:${messageID}`);
        if (message) {
            const messageRespone = {
                fromUserId: message.from,
                content: message.content,
                chatTime: message.chatTime
            }
            resultArr.push(messageRespone);
        }
    }
    return resultArr;
}
export const sendMessage = async (args, req = null, res = null) => {
    const { from,to, content } = args;
    const chanelID = getChatChanelID(from,to)
    const d = new Date();
    const sendInfo = {
        profileName: req.session.user.profileName,
        avatar: req.session.user.avatar,
        id: req.session.user.id
    }
    const chatTime = d.getTime();
    const result = await asyncClient.saddAsync(`chats:${chanelID}:${chanelID}`, `${chatTime}-${chanelID}`);
    const result2 = await asyncClient.hsetAsync(`chats:${chanelID}:messages:${chatTime}-${chanelID}`, "from", from, "content", content, "to", to, "chatTime", chatTime);
    if(result < 1 || result2 < 1){
        throw new Error('Send message Error')
    }
    const newNotification = notificationModel({
        userID: to,
        fromUser: from,
        postID: null,
        action: 'CHAT',
        content: `${content}`
    });
    setNotification(newNotification);
       let notificationInfo = {
            userID: to,
            formUserName: sendInfo.profileName,
            formUserAvatar: sendInfo.avatar,
            action: 'CHAT',
            postID:null,
            content: `${content}`
        }
    return {
        fromUserId: from,
        content: content,
        chatTime,
        chanelID,
        notificationInfo
    }
}
export const getChanelIDListKey = (chanelID, count) => {
    const d = new Date();
    return `chats:chanelIDList`;
}
export const setNotification = async (notificationData) => {
    await notificationModel.findOneAndUpdate({userID: notificationData.userID,fromUser:notificationData.fromUser,action: 'CHAT'},
                                        {isNewNotif : true,
                                        isReadNotif : false,
                                        content : notificationData.content,
                                        notifiTime: notificationData.notifiTime},
                                        {upsert: true,});
}