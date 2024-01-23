import https from 'https';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';

import renderDomainPage from './controllers/renderDomainPage.js';
import renderUserPage from './controllers/renderUserPage.js';
import renderLoginPage from './controllers/renderLoginPage.js';
import renderSignupPage from './controllers/renderSignupPage.js';

const app = express();
dotenv.config();

// middlewares below
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(process.env.PUBLIC as string));

app.get('/', renderDomainPage);

app.get('/login', renderLoginPage);

app.get('/user/:id', renderUserPage);

app.get('/signup', renderSignupPage);

// HTTPS server options
const createHttpsOptions = async () => ({
  key: await fs.readFile(`${process.env.CA as string}client_key.pem`),
  cert: await fs.readFile(`${process.env.CA}client_cert.pem`),
});

// HTTPS server
createHttpsOptions().then((options) => {
  const httpsServer = https.createServer(options, app);

  httpsServer.listen(process.env.PORT as string, () => {
    console.log(`Client server has started and is listening on port number: ${process.env.PORT}`);
  });
});
