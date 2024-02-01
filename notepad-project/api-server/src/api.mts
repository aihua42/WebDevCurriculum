import https from 'https'
import fs from 'fs/promises'
import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

import corsMiddleware from '../middlewares-src/cors.mts'
import sessMiddleware from '../middlewares-src/session.mts'
// import validateSess from './middlewares-src/validateSess.mts'
import validateJWT from '../middlewares-src/validateJWT.mts'

import router from '../routes-src/user.mts'

import signup from '../controllers-src/signup.mts'
// import loginSess from './controllers-src/loginSess.mts'
// import logoutSess from './controllers-src/logoutSess.mts'
import loginJWT from '../controllers-src/loginJWT.mts'
import logoutJWT from '../controllers-src/logoutJWT.mts'
import refreshAccessToken from '../controllers-src/refreshAccessToken.mts'

// set the port
const app = express()
dotenv.config()

// middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser()) // jwt는 cookie-parser 가 필요함

app.use(corsMiddleware) // cors
app.use(sessMiddleware) // session 발급

app.post('/signup', signup)

// app.post("/login", loginSess);
// app.post("/logout", logoutSess);
// app.use("/user/:userId", validateSess);

app.post('/login', loginJWT)
app.post('/logout', logoutJWT)
app.use('/user/:userId', validateJWT)

app.use('/user', router)
app.post('/token', refreshAccessToken)

// HTTPS server options
const httpsOptions = {
  key: await fs.readFile(process.env.__CA + 'api_key.pem'),
  cert: await fs.readFile(process.env.__CA + 'api_cert.pem')
}

// HTTPS server
const httpsServer = https.createServer(httpsOptions, app)

httpsServer.listen(process.env.PORT, () => {
  console.log(
    `API server has started and is listening on port number: ${process.env.PORT}`
  )
})
