import mongoose from 'mongoose';
const userSchema = mongoose.Schema({
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    email: { type: String,unique:true },
    profileName: { type: String, required: false },
    passWord: { type: String },
    gender: { type: String, required: false },
    dateOfBirth: { type: Date, required: false },
    level: { type: String, required: false },
    point: { type: Number, required: false },
    rank:{ type: Number, required: false },
    active: { type: Boolean, required: true },
    avatar: { type: String },
    facebookAdress: { type: String, required: false },
    instagramAdress: { type: String, required: false },
    createTime: {type: Date, default: Date.now},
    status: { type: String },
    socialKey: { type: String }

});
userSchema.methods.validPassWord =  (passWord) => {
    return bcrypt.compareSync(passWord, this.passWord);
}
export const userModel = mongoose.model('tripled_accounts', userSchema);