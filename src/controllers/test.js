import { emailBufferModel } from '../models/email_buffer_model'
import {userModel} from '../models/user_model'
export const update = async () => {
        // const start = Date.now()
        // let i = 0
        // function res(n) {
        //     const id = ++i
        //     return new Promise((resolve, reject) => {
        //         setTimeout(() => {
        //             resolve()
        //             console.log(`res #${id} called after ${n} milliseconds`, Date.now() - start)
        //         }, n)
        //     })
        // }
        const listUser = await userModel.find({active:false,createTime:{$lt: new Date((new Date()).getTime() - 1*24*60*60000)}});
        console.log(listUser);
    }
