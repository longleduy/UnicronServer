import "regenerator-runtime/runtime";
import chai from 'chai'
import chaiHttp from 'chai-http'
import {insertEmailActiveAccBuffer} from '../../utils/job_utils/email_buffer_util'
chai.use(chaiHttp)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
process.env.STATUS = "Test"
export const insertEmailBuffer = (action = 'run') => {
    return describe('Insert Email ActiveAcc Buffer', () => {
        it('Insert success', async () => {
            try {
                const result = await insertEmailActiveAccBuffer('longld@gmail.com');
                console.log(result);
                result.should.to.be.an('object');
                result.email.should.not.be.equal(null);
            } catch (error) {
                throw error
            }
        })
    })
}
