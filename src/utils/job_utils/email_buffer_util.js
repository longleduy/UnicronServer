import { htmlSignUpVerify } from '../contants/email_content'
import { convertStringToBuffer } from '../common'
import { emailBufferModel } from '../../models/email_buffer_model'
import { userModel } from '../../models/user_model'
export const insertEmailActiveAccBuffer = async (email) => {
    try {
        //const userArr = await userModel.find({});
         const asyncFuncArr = [];
        // userArr.forEach(async (user, idx) => {
        //     const urlEndPoint = new Buffer(user.email).toString('base64');
        //     const emailBufferContent = htmlSignUpVerify(urlEndPoint);
        //     const newEmailBuffer = new emailBufferModel({
        //         email: user.email,
        //         content: emailBufferContent,
        //         status: 'waiting'
        //     })
        //     asyncFuncArr.push(newEmailBuffer.save());
        // })
        // for(let i = 0;i < 100;i++){
        //     const urlEndPoint = new Buffer('duongtt07@gmail.com').toString('base64');
        //     const emailBufferContent = htmlSignUpVerify(urlEndPoint);
        //     const newEmailBuffer = new emailBufferModel({
        //         email: 'duongtt07@gmail.com',
        //         content: emailBufferContent,
        //         status: 'waiting'
        //     })
        //     asyncFuncArr.push(newEmailBuffer.save());
        // }
        // Promise.all(asyncFuncArr);
        const urlEndPoint = new Buffer(email).toString('base64');
        const emailBufferContent = htmlSignUpVerify(urlEndPoint,email);
        const newEmailBuffer = new emailBufferModel({
            email:email,
            content: emailBufferContent,
            status: 'waiting'
        })
        const result = await newEmailBuffer.save();
    } catch (error) {
        throw error;
    }

}