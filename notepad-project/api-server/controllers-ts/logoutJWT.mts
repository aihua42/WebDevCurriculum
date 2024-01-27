import dotenv from 'dotenv'
import { type Request, type Response } from 'express'

import * as db from '../models/index.js'
import { type DB, type Tabs, type TabRecord } from '../types'

import errorHandler from '../helpers/errorHandler.js'
import createRecordList from '../helpers/createRecordList.js'

const { Tab, Token } = db as DB

dotenv.config()

const logoutJWT = async (req: Request, res: Response): Promise<void> => {
  const userId: string = req.body.userId

  if (userId === undefined) {
    errorHandler(
      409,
      'User ID is missing, from "logoutJWT" controller',
      null,
      res
    )
    return
  }

  try {
    await Tab!.destroy({ where: { userId } })
  } catch (err) {
    errorHandler(
      500,
      'Error during destroy the Tab DB in "logoutJWT" controller',
      err,
      res
    )
    return
  }

  const tabsToSave: Tabs = req.body
  try {
    const tabRecordList: TabRecord[] = createRecordList(tabsToSave, userId)
    await Tab!.bulkCreate(tabRecordList)
  } catch (err) {
    errorHandler(
      500,
      'Error during bulkCreate the Tab DB in "logoutJWT" controller',
      err,
      res
    )
    return
  }

  try {
    await Token!.destroy({ where: { userId } })

    res.clearCookie('accessToken')
    res
      .status(201)
      .json({ success: true, message: 'Successfully log out within JWT' })
  } catch (err) {
    errorHandler(
      500,
      'Error during destroy the Token DB in "logoutJWT" controller',
      err,
      res
    )
  }
}

export default logoutJWT
