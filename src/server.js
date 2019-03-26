
import chalk from 'chalk'
import "regenerator-runtime/runtime"
import { ApolloServer,gra } from 'apollo-server-express'
import * as https from 'https'
import * as http from 'http'
import * as fs from 'fs'
//Todo: DB connect
import { connectMongooseDB } from './utils/mongoose'
//Todo: App middleware
import app from './app'
//Todo: GraphQl
import { schema } from './graphqls/schemas/schemas'
//Todo: Error handler
import { ErrorLogger } from './utils/logger'
//Todo: Ultis
import * as ServerInfo from './utils/contants/host_contants'
//Todo: ENV
const connectApolloServer = async () => {
  const configurations = {
    production: { ssl: false, port: `${process.env.PORT}`, hostname: `${process.env.HOST_NAME_DEV}` },
    development: { ssl: true, port: `${process.env.PORT}`, hostname: `${process.env.HOST_NAME_DEV}` }
  }
  const environment = process.env.NODE_ENV || 'development'
  const config = configurations[environment]

  const server = new ApolloServer({
    schema,
    context: async ({ req, res, next }) => {
      return { req, res }
    },
    formatError: error => {
      const message = error.message;
      if(process.env.NODE_ENV =='production'){
          console.log(error);
      }
      else{
        if (error.extensions.exception.name !== "dataFormInvalid") {
          // ErrorLogger(error.extensions.exception.stacktrace);
          console.log(error);
        }
      }
      return {
        ...error,
        message,
      };
    },
    playground: false
  });
  //Todo: Disable cors của ApolloServer nếu không nó sẽ đè lên cors của app => vấn đề về Sameorigin
  server.applyMiddleware({ app, cors: false });
  var sslServer;
  if (config.ssl) {
    sslServer = https.createServer({
      key: fs.readFileSync('./ssl/server.key'),
      cert: fs.readFileSync('./ssl/server.crt')
    }, app)
  } else {
    sslServer = http.createServer(app)
  }
  server.installSubscriptionHandlers(sslServer)
  sslServer.listen({ port: `${process.env.PORT}`});
}
  const run = async () => {
    try {
      const connectDB = connectMongooseDB();
      const connectServer = connectApolloServer();
      await connectDB;
      await connectServer;
      console.log(`🛡️  ${chalk.cyan('Apollo server')},${chalk.green('MongoDB')} connecting..., ${chalk.cyan('Port')} ${process.env.PORT}`)
    } catch (error) {
      console.log(error);
    }
  }
  run();
