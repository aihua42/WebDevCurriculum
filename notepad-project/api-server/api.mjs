import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import corsMiddleware from "./middlewares/cors.mjs";
import sessMiddleware from "./middlewares/session.mjs";
import varidate from "./middlewares/validate.mjs";

import router from "./routes/user.mjs";

import signup from "./controllers/signup.mjs";
import login from "./controllers/login.mjs";
import logout from "./controllers/logout.mjs";
import refreshExpiredCookie from "./controllers/refreshExpiredCookie.mjs";

// set the port
const app = express();
dotenv.config();

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser()); // jwt는 cookie-parser 가 필요함

app.use(corsMiddleware); // cors
app.use(sessMiddleware); // session 발급
app.use(varidate); // authentication

app.use("/user", router);

app.post("/signup", signup);
app.post("/login", login);
app.post("/logout", logout);
app.post("/auth", refreshExpiredCookie);

app.listen(process.env.PORT, () => {
  console.log(
    `API server has started and is listening on port number: ${process.env.PORT}`
  );
});
