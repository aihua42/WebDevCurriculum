import errorHandler from '../helpers-src/errorHandler.mts'
import hashPW from '../helpers-src/hashPW.mts'

import * as db from '../models-src/index.ts'
import { type Request, type Response } from 'express'
import { type DB } from '../types.ts'

const { User } = db as DB

const signup = async (req: Request, res: Response): Promise<void> => {
  const { userId, nickname, pw } = req.body

  try {
    const userFound = await User!.findOne({ where: { userId } })
    if (userFound !== null) {
      errorHandler(
        209,
        `${userId} already exists in User DB, from "signup" controller`,
        null,
        res
      )
    }
  } catch (err) {
    errorHandler(
      500,
      'Error during loading User data in "signup" controller',
      err,
      res
    )
  }

  hashPW(pw as string)
    .then(async (hashedPW) => {
      const userData = { userId, nickname, pw: hashedPW }

      try {
        await User!.create(userData)
        return res
          .status(201)
          .json({ success: true, message: 'Successfully sign up' })
      } catch (err) {
        errorHandler(
          500,
          'Failed to sign up, from "signup" controller',
          err,
          res
        )
      }
    })
    .catch((err) => {
      errorHandler(500, 'Failed to hash the password', err, res)
    })
}

export default signup
