import redis from 'redis'
import Bluebird from 'bluebird'
import chalk from 'chalk'
import redisConnect from 'connect-redis'
import session from 'express-session'
import * as Promise from 'bluebird'
Bluebird.promisifyAll(redis.RedisClient.prototype)
Bluebird.promisifyAll(redis.Multi.prototype)

const RedisStore = redisConnect(session);
export const client = redis.createClient()

client.on('connect', function () {
    if (process.env.NODE_ENV != 'test') {
        console.log(`🛡️  ${chalk.red('RedisDB')} connecting...`)
    }
});
client.on("error", function (err) {
    throw err;
});
export const redisServer = session({
    secret: "longld",
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({ host: 'localhost', port: 6379, client: client }),
    cookie: {
        //must be served over https
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24,
        expires: false
    }
});
export const asyncClient = Promise.promisifyAll(client);