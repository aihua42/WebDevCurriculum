import { type Request, type Response } from 'express'

import errorHandler from '../helpers-src/errorHandler.mts'
import createToken from '../helpers-src/createToken.mts'
import comparePW from '../helpers-src/comparePW.mts'
import cookieOptions from '../helpers-src/cookieOptions.mts'

import * as db from '../models-src/index.ts'
import { type DB, type UserAttributes } from '../types.ts'

const { User, Token } = db as DB

const loginJWT = async (req: Request, res: Response): Promise<void> => {
  const { userId, pw } = req.body
  console.log('user id and pw logging in: ', req.body)

  // find user data from User DB.
  let userData: null | UserAttributes
  try {
    userData = await User!.findOne({ where: { userId } })
    if (userData === null) {
      errorHandler(
        204,
        `${userId} not found, from "loginJWT" controller`,
        null,
        res
      )
      return
    }
  } catch (err) {
    errorHandler(
      500,
      'Error during loading User data in "loginJWT" controller',
      err,
      res
    )
    return
  }

  try {
    if (userData.pw === undefined) {
      errorHandler(
        500,
        'Passwords are missing in "loginJWT" controller',
        null,
        res
      )
      return
    }

    const checkPW = await comparePW(pw as string, userData.pw)
    if (!checkPW) {
      errorHandler(
        209,
        'Passwords do not match, from "loginJWT" controller',
        null,
        res
      )
      return
    }
  } catch (err) {
    errorHandler(
      500,
      'Error when compare the passwords, from "loginJWT" controller',
      err,
      res
    )
    return
  }

  const userDataCloned: UserAttributes = JSON.parse(JSON.stringify(userData))
  delete userDataCloned.pw

  // refresh token은 로그인 성공했을 때 항상 새로 발급
  let refreshToken = ''
  try {
    refreshToken = createToken(userDataCloned, 'refresh')
    await Token!.create({ userId, token: refreshToken })
  } catch (err) {
    errorHandler(
      500,
      'Failed to create the refreshToken, from "loginJWT" controller',
      err,
      res
    )
    return
  }

  // access token. client에게 전송됨
  try {
    const accessToken = createToken(userDataCloned, 'access')
    res.cookie('accessToken', accessToken, cookieOptions as object)

    res.status(201).send({ success: true, refreshToken })
  } catch (err) {
    errorHandler(
      500,
      `${userId} failed to log in, from "loginJWT" controller`,
      err,
      res
    )
  }
}

export default loginJWT
