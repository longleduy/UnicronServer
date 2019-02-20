import "regenerator-runtime/runtime";
import chai from 'chai'
import chaiHttp from 'chai-http'
import {convertToBase64URI} from '../../utils/common'
import { HOST, SERVER_PORT, GRAPHQL_ENDPOINT } from '../../utils/contants/host_contants'
const should = chai.should()
chai.use(chaiHttp)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
process.env.STATUS = "Test"
export const createPost = (action = 'run') => {
    let jwt;
    return describe('Posts', () => {
        it('sign in success', async () => {
            const signInData = `{
                email: "longldseatechit@gmail.com",
                passWord: "longkhanh"
            }`
            try {
                const res = await chai.request(`${HOST}:${SERVER_PORT}`).post(`/${GRAPHQL_ENDPOINT}`).send({ 'query': `mutation{signIn(formData:${signInData}){jwt}}` })
                res.body.data.signIn.should.to.be.an('object');
                res.body.data.signIn.should.have.property('jwt');
                res.body.data.signIn.jwt.should.not.be.equal(null);
                jwt = res.body.data.signIn.jwt
            } catch (error) {
                throw error
            }
        })
        it('createPost success', async () => {
            try {
                const imageBase64 = await convertToBase64URI('error-background2.png');
                const image = '"'+imageBase64+'"';
                const res = await chai.request(`${HOST}:${SERVER_PORT}`)
                    .post(`/${GRAPHQL_ENDPOINT}`)
                    .send({ 'query': `mutation{createPost(postData:{content:"1234",location:"",tag:["nodejs","reactjs"],image:${image}}){id,image}}` })
                res.body.data.createPost.should.not.be.equal(null)
                res.body.data.createPost.should.to.be.an('object');
            } catch (error) {
                throw error
            }
        })
    })
}
