import { type Request, type Response } from 'express'
import * as db from '../models-ts/index.ts'
import { type DB, type Tabs, type TabRecord } from '../types'

import errorHandler from '../helpers-ts/errorHandler.mts'
import createRecordList from '../helpers-ts/createRecordList.mts'

const { Tab } = db as DB

const logoutSess = async (req: Request, res: Response): Promise<void> => {
  console.log('session when logout: ', req.session)

  const userId: string = req.body.userId
  if (userId === undefined) {
    errorHandler(
      409,
      'User ID is missing, from "logoutSess" controller',
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
      'Error during destroy the Tab DB in "logoutSess" controller',
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
      'Error during bulkCreate the Tab DB in "logoutSess" controller',
      err,
      res
    )
    return
  }

  req.session.destroy((err) => {
    if (err !== null && err !== undefined) {
      errorHandler(
        500,
        'Failed to destroy the session in "logoutSess" controller',
        err,
        res
      )
    } else {
      res.clearCookie('connect.sid')
      res
        .status(201)
        .json({ success: true, message: 'Successfully logout within session' })
    }
  })
}

export default logoutSess
