import kue from 'kue'
const queue = kue.createQueue();

const job = queue.create('test',{
    name:"long"
}).save((err) => {
    if(err) console.log(job.id);
})
export const runJob = () => {
    queue.process('test',(job,done) => {
        testJob(job.data,done);
    })
    const testJob = (name,done) => {
        console.log(object);
        done();
    }
}