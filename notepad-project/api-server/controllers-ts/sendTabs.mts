import errorHandler from '../helpers/errorHandler.js'

import { type Request, type Response } from 'express'
import { type DB } from '../types'
import * as db from '../models/index.js'

const { Tab } = db as DB

const sendTabs = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId

  let tabRecordList = []
  try {
    tabRecordList = await Tab!.findAll({ where: { userId } })
  } catch (err) {
    errorHandler(
      500,
      'Error during loading Tab data in "sendTabs" controller',
      err,
      res
    )
    return
  }

  let activeTitle
  const textList = tabRecordList.map((record) => {
    if (record.active) {
      activeTitle = record.title
    }
    return { title: record.title, text: record.text }
  })

  if (activeTitle === undefined) {
    errorHandler(
      500,
      'Active title is missing in "sendTabs" controller',
      null,
      res
    )
    return
  }

  const tabObj = { userId, activeTitle, tabs: textList }

  res.send(tabObj)
}

export default sendTabs
