import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import sessMiddleware from './middlewares/session.mjs';
import jwtMiddleware from './middlewares/jwt.mjs';

import getPath from './utility/getPath.mjs';

import getRouter from './routes/getRouter.mjs';
import postRouter from './routes/postRouter.mjs';

const app = express();
dotenv.config();

// middlewares below
app.use(morgan('dev'));
app.use(express.json());
app.use(sessMiddleware);  // session 발급

app.use(cookieParser());  // jwt는 cookie-parser 가 필요함
app.use(jwtMiddleware);  // access token 재발급 if necessary

app.use(express.static(getPath(import.meta.url, null, ['public'])));

// routes
app.use(getRouter);
app.use(postRouter);

app.listen(process.env.PORT, () => {
  console.log(`Client server has started and is listening on port number: ${process.env.PORT}`);
});