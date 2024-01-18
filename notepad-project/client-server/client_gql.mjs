import https from 'https';
import fs from 'fs/promises';
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';

import renderDomainPage from './controllers_gql/renderDomainPage.mjs';
import renderLoginPage from './controllers_gql/renderLoginPage.mjs';
import renderUserPage from './controllers_gql/renderUserPage.mjs';
import renderSignupPage from './controllers_gql/renderSignupPage.mjs';

const app = express();
dotenv.config();

// middlewares below
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(process.env.__PUBLIC_GQL));

app.get("/", renderDomainPage);

app.get("/login", renderLoginPage);

app.get("/user/:id", renderUserPage);

app.get("/signup", renderSignupPage);

// HTTPS server options
const httpsOptions = {
  key: await fs.readFile(process.env.__CA + 'client_key.pem'),
  cert: await fs.readFile(process.env.__CA + 'client_cert.pem'),
};

// HTTPS server
const httpsServer = https.createServer(httpsOptions, app);

httpsServer.listen(process.env.PORT_GQL, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Client server has started and is listening on port number: ${process.env.PORT_GQL}`);
  }
});