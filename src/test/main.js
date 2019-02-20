import "regenerator-runtime/runtime";
import chai from 'chai'
import chaiHttp from 'chai-http'
import cloudinary from 'cloudinary'
import { userAccountTest } from './users/user_test'
import {createPost} from './posts/post_test'
import {emailBufferModel} from '../models/email_buffer_model'
const should = chai.should()
chai.use(chaiHttp)
cloudinary.config({
    cloud_name: 'seatechit',
    api_key: '697115945411315',
    api_secret: '4X8rw_3mR8WC5G19C5JohhRYHlg'
})
describe('Main', () => {
    beforeEach(done => {
        done()
    })
    //userAccountTest();
    //getListLibFrame();
    //createPost();
    
    describe('TestUpload', () => {
        it('upload success', (done) => {
            try {
                emailBufferModel.find({},(err,data) => {
                    console.log(data);
                });
                // const result = await cloudinary.v2.uploader.upload('\public/images/avatar/avatar.jpg',
                //     { width: 300,height: 300,radius: 'max',crop: "scale" });
                // console.log(result.secure_url);
            } catch (error) {
                throw error
            }
        })
    })
})
