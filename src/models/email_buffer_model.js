import mongoose from 'mongoose'

const emailBufferSchema = mongoose.Schema({
    email:{type:String,require:true},
    content:{type:Buffer,require:true},
    status:{type:String}
})

export const emailBufferModel = mongoose.model('email_buffers', emailBufferSchema);