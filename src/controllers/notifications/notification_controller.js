//Todo: Model
import {notificationModel} from '../../models/notification_model'

export const getNotification = async ({ limitNumber, skipNumber }, req = null, res = null) => {
    const userID = req.session.user._id;
    const result = await notificationModel.find({userID,action:{$in:['LIKE','COMMENT']}}).skip(skipNumber).limit(limitNumber).populate('fromUser', 'profileName avatar').sort({ _id: -1 });
    await notificationModel.updateMany({userID,action:{$in:['LIKE','COMMENT']}},{$set:{isNewNotif:false}})
    return result;
}
export const getMessage = async ({ limitNumber, skipNumber }, req = null, res = null) => {
    const userID = req.session.user._id;
    const result = await notificationModel.find({userID,action:{$in:['CHAT']}}).skip(skipNumber).limit(limitNumber).populate('fromUser', 'profileName avatar').sort({ notifiTime:-1,_id: -1 });
    await notificationModel.updateMany({userID,action:{$in:['CHAT']}},{$set:{isNewNotif:false}});
    return result;
}

