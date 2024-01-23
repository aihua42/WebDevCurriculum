import https from 'https';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import renderDomainPage from './controllers/renderDomainPage.js';
import renderUserPage from './controllers/renderUserPage.js';
import renderLoginPage from './controllers/renderLoginPage.js';
import renderSignupPage from './controllers/renderSignupPage.js';

const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P((resolve) => { resolve(value); });
  }

  return new (P || (P = Promise))((resolve, reject) => {
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

const app = express();
dotenv.config();
// middlewares below
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(process.env.PUBLIC));
app.get('/', renderDomainPage);
app.get('/login', renderLoginPage);
app.get('/user/:id', renderUserPage);
app.get('/signup', renderSignupPage);
// HTTPS server options
const createHttpsOptions = () => __awaiter(void 0, void 0, void 0, function* () {
  return ({
    key: yield fs.readFile(`${process.env.CA}client_key.pem`),
    cert: yield fs.readFile(`${process.env.CA}client_cert.pem`),
  });
});
// HTTPS server
createHttpsOptions().then((options) => {
  const httpsServer = https.createServer(options, app);
  httpsServer.listen(process.env.PORT, () => {
    console.log(`Client server has started and is listening on port number: ${process.env.PORT}`);
  });
});
