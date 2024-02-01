import https from 'https'
import fs from 'fs/promises'
import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

import corsMiddleware from '../originals/middlewares/cors.mjs'
import sessMiddleware from '../originals/middlewares/session.mjs'
// import validateSess from "./originals/middlewares/validateSess.mjs"
import validateJWT from '../originals/middlewares/validateJWT.mjs'

import router from '../originals/routes/user.mjs'

import signup from '../originals/controllers/signup.mjs'
// import loginSess from "./originals/controllers/loginSess.mjs"
// import logoutSess from "./originals/controllers/logoutSess.mjs"
import loginJWT from '../originals/controllers/loginJWT.mjs'
import logoutJWT from '../originals/controllers/logoutJWT.mjs'
import refreshAccessToken from '../originals/controllers/refreshAccessToken.mjs'

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

// app.post("/login", loginSess)
// app.post("/logout", logoutSess)
// app.use("/user/:userId", validateSess)

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

httpsServer.listen(process.env.PORT, (err) => {
  if (err) {
    console.error(err)
  } else {
    console.log(
      `API server has started and is listening on port number: ${process.env.PORT}`
    )
  }
})
