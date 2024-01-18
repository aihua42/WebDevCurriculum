import https from "https";
import fs from "fs/promises";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";

import corsMiddleware from "./middlewares/cors.mjs";
import sessMiddleware from "./middlewares/session.mjs";
import validate_sess from "./validate_sess.mjs";
import validate_jwt from "./validate_jwt.mjs";

import schemas from "./schemas.mjs";
import resolvers from "./resolvers.mjs";

// set the port
const app = express();
dotenv.config();

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser()); // jwt는 cookie-parser 가 필요함

app.use('/graphql', corsMiddleware); // cors: credentials, origin
app.use(sessMiddleware); // session 발급

const apolloServer = new ApolloServer({
  // Define schema
  typeDefs: schemas,

  // Define resolvers
  resolvers: resolvers,

  // runs for each GraphQL operation and can access the req and res
  context: ({ req, res }) => {
    if (req['cookies'] && req.cookies['accessToken']) {
      validate_jwt(req, res);
    } else if (req['cookies'] && req.cookies['connect.sid']) {
      validate_sess(req, res);
    }

    return { req, res };
  },

  // errors
  formatError: (err) => {
    console.error("--- GraphQL Error ---");
    console.error("Path: ", err.path);
    console.error('Status code: ', err.extensions.statusCode);
    console.error("Message: ", err.message);
    console.error("Code: ", err.extensions.code);
    console.error("Original Error: ", err.originalError);
    console.error("stacktrace: ", err.extensions.exception.stacktrace);

    return err;
  },
  debug: false, 
});

await apolloServer.start();

// Apply the Apollo Server middleware
apolloServer.applyMiddleware({ app, cors: false, path: "/graphql" }); // cors: false 안해주면 항상 cors 에러...

// HTTPS server options
const httpsOptions = {
  key: await fs.readFile(process.env.__CA + "api_key.pem"),
  cert: await fs.readFile(process.env.__CA + "api_cert.pem"),
};

// HTTPS server
const httpsServer = https.createServer(httpsOptions, app);

httpsServer.listen(process.env.PORT_GRAPHQL, (err) => {
  if (err) {
    console.error(`GraphQL server error when listening on port number: ${process.env.PORT_GRAPHQL}`, err);
  } else {
    console.log(
      `GraphQL server has started and is listening on port number: ${process.env.PORT_GRAPHQL}`
    );
  }
});
