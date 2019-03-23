import mongoose from 'mongoose'
export const connectMongooseDB = async () => {
    try {
        mongoose.set('useCreateIndex', true);
        mongoose.set('useFindAndModify', false);
        mongoose.set('useNewUrlParser', true);
        mongoose.connect(process.env.MONGODB_PATH, { useNewUrlParser: true });
    } catch (error) {
        console.log("MongooseError: "+error);
    }

}


