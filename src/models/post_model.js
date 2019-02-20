import mongoose from 'mongoose';
const postSchema = mongoose.Schema({
    userID: {type: mongoose.Schema.Types.ObjectId, ref:'tripled_accounts'},
    content: {type: String,require:true},
    createTime: {type: Date, default: Date.now},
    location: {type: String},
    tag:[{type: String}],
    image:{type: String}
});
postSchema.index({content: 'text'});
export const postModel = mongoose.model('tripled_posts', postSchema);