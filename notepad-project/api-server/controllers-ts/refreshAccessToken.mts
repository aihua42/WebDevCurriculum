import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { type Request, type Response } from 'express'
import {
  type DB,
  type TokenAttributes,
  type UserAttributes
} from '../types'

import createToken from '../helpers-ts/createToken.mts'
import cookieOptions from '../helpers-ts/cookieOptions.mts'
import errorHandler from '../helpers-ts/errorHandler.mts'

import * as db from '../models-ts/index.ts'
const { Token } = db as DB

dotenv.config()

const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.body.userId
  const refreshToken: string = req.body.refreshToken

  // check refresh token's validation
  let payload
  try {
    payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET!)
  } catch (err) {
    errorHandler(
      403,
      'RefreshToken is expired, from "refreshAccessToken" controller',
      err,
      res
    )
    return
  }
  console.log(
    'payload to be used in "refreshAccessToken" controller: ',
    payload
  )

  // find out refreshToken in Token module
  let refreshTokenData: null | TokenAttributes
  try {
    refreshTokenData = await Token!.findOne({ where: { userId } }) // userId: , token:
    if (refreshTokenData === null) {
      errorHandler(
        403,
        'RefreshToken is missing in DB, from "refreshAccessToken" controller',
        null,
        res
      )
      return
    }
  } catch (err) {
    errorHandler(
      500,
      'Failed to load the refreshToken, from "refreshAccessToken" controller',
      null,
      res
    )
    return
  }

  // compare the refreshTokens
  if (refreshToken !== refreshTokenData.token) {
    errorHandler(
      403,
      'RefreshToken does NOT match, from "refreshAccessToken" controller',
      null,
      res
    )
  }

  // refresh the access token
  const { nickname } = payload as UserAttributes
  const userData = { userId, nickname }
  const accessToken = createToken(userData, 'access')
  res.cookie('accessToken', accessToken, cookieOptions as object)

  res.status(201).json({
    success: true,
    message: 'Successfully refresh the access token'
  })
}

export default refreshAccessToken
