import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';

import renderDomainPage from './controllers/renderDomainPage.mjs';
import renderLoginPage from './controllers/renderLoginPage.mjs';
import renderUserPage from './controllers/renderUserPage.mjs';
import renderSignupPage from './controllers/renderSignupPage.mjs';

const app = express();
dotenv.config();

// middlewares below
app.use(morgan('dev'));
app.use(express.json());

app.use(express.static(process.env.__PUBLIC));

app.get("/", renderDomainPage);

app.get("/login", renderLoginPage);

app.get("/user/:id", renderUserPage);

app.get("/signup", renderSignupPage);

app.listen(process.env.PORT, () => {
  console.log(`Client server has started and is listening on port number: ${process.env.PORT}`);
});