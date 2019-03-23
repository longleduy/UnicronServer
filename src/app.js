
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import {redisServer} from './utils/redis'
const app = express();
const urlencodedParser = bodyParser.urlencoded({limit: '50mb',extended: false });
require('dotenv').config();
app.use(bodyParser.json({limit: '50mb'}));
app.use(urlencodedParser);
app.use(redisServer);
app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    allowedHeaders:['X-Requested-With','X-HTTP-Method-Override','Content-Type','Accept','Authorization'],
    credentials:true,
    methods:['POST','GET']
}))
export default app;