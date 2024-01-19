import https from 'https';
import fs from 'fs/promises';
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import corsMiddleware from "./middlewares/cors.mjs";
import sessMiddleware from "./middlewares/session.mjs";
import validateSess from "./middlewares/validateSess.mjs";
import validateJWT from "./middlewares/validateJWT.mjs";

import router from "./routes/user.mjs";

import signup from "./controllers/signup.mjs";
import loginSess from "./controllers/loginSess.mjs";
import logoutSess from "./controllers/logoutSess.mjs";
import loginJWT from "./controllers/loginJWT.mjs";
import logoutJWT from "./controllers/logoutJWT.mjs";
import refreshAccessToken from "./controllers/refreshAccessToken.mjs";

// set the port
const app = express();
dotenv.config();

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser()); // jwt는 cookie-parser 가 필요함

app.use(corsMiddleware); // cors
app.use(sessMiddleware); // session 발급

app.post("/signup", signup);

// app.post("/login", loginSess);
// app.post("/logout", logoutSess);
// app.use("/user/:userId", validateSess);

app.post("/login", loginJWT);
app.post("/logout", logoutJWT);
app.use("/user/:userId", validateJWT); 

app.use("/user", router);
app.post("/token", refreshAccessToken);

// HTTPS server options
const httpsOptions = {
  key: await fs.readFile(process.env.__CA + 'api_key.pem'),
  cert: await fs.readFile(process.env.__CA + 'api_cert.pem'),
};

// HTTPS server
const httpsServer = https.createServer(httpsOptions, app);

httpsServer.listen(process.env.PORT, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(
      `API server has started and is listening on port number: ${process.env.PORT}`
    );
  }
});
