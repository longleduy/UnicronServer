import Agenda from 'agenda'
import {emailBufferModel} from '../models/email_buffer_model'
import {userModel} from '../models/user_model'
import {emailSender} from '../utils/email_sender'
export const jobs = async () => {
    try {
        let agenda = new Agenda({ db: { address: 'mongodb://localhost/TripleD'} });
        //Todo: Email sender
        agenda.define('email sender', async (job, done) => {
            const emailBufferList  = await emailBufferModel.find({status:{$ne:'pending'}}).limit(25);
            if(emailBufferList.length > 0) console.log(emailBufferList.length+" email pending...");
            var arrAsyncFunc = [];
            emailBufferList.forEach((emailBuffer, idx) => {
                arrAsyncFunc.push(emailBufferModel.findByIdAndUpdate({_id:emailBuffer._id},{$set:{status:'pending'}}))
            })
            await Promise.all(arrAsyncFunc);
            if(emailBufferList.length > 0){
                emailBufferList.forEach(async (emailBuffer,index) => {
                    const {content} = emailBuffer;
                    const {email} = emailBuffer;
                    try {
                        await emailSender(email,content,'SIGN_UP_VERIFY')
                        await emailBufferModel.findByIdAndDelete({_id:emailBuffer._id});
                        console.log(`Success: Email sended to - ${email}`);
                    } catch (error) {
                        await emailBufferModel.findByIdAndUpdate({_id:emailBuffer._id},{$set:{status:'failed'}})
                        console.log(`Error: Failed to send message to - ${email}`);
                    }
                })
            }
            done();
        });
        //Todo: Delete account not active
        agenda.define('remove accounts', async (job,done) => {
            console.log(`Remove accounts not active starting...`);
            const deleteInfo = await userModel.deleteMany({active:false,createTime:{$lt: new Date((new Date()).getTime() - 1*24*60*60000)}});
            console.log(`${deleteInfo.n} acounts were removed`);
            done();
        })
        agenda.on('ready', async function () {
            //agenda.now('email sender');
            agenda.every('5 seconds','email sender');
            agenda.every('60 minutes','remove accounts');
            agenda.start();

        });
        function graceful(){
            console.log('Something is gonna blow up.');
            agenda.stop(() => process.exit(0));
        }
        process.on('SIGTERM', graceful);
        process.on('SIGINT', graceful);
    } catch (error) {
        throw error;
    }
}