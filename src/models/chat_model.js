import mongoose from 'mongoose'

const notificationSchema = mongoose.Schema({
    userID:{type: String,require: true},
    fromUser:{type: mongoose.Schema.Types.ObjectId, ref:'tripled_accounts'},
    action:{type: String,require:true},
    content:{type: String},
    postID:{type: String},
    notifiTime: {type: Date, default: Date.now},
    isNewNotif : {type: Boolean,default: true},
    isReadNotif: {type: Boolean,default: false},
})
export const notificationModel = mongoose.model('notifications',notificationSchema)