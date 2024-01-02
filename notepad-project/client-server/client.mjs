import express from 'express';
import morgan from 'morgan';

import getPath from './common-functions/getPath.mjs';
import sessMiddleware from './middlewares/session.mjs';
import getRouter from './routes/getRouter.mjs';
import postRouter from './routes/postRouter.mjs';

// set the port
const app = express();
app.set('port', 3000);

// middlewares below
app.use(morgan('dev'));
app.use(express.json());
app.use(sessMiddleware);
app.use(express.static(getPath(import.meta.url, null, ['public'])));

// routes
app.use(getRouter);
app.use(postRouter);

app.listen(app.get('port'), () => {
  console.log(`Client server has started and is listening on port number: ${app.get('port')}`);
});