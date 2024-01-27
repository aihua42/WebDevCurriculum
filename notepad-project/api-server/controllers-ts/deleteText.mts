import { type Request, type Response } from 'express'

import isInTextList from '../helpers/isInTextDB.js'
import errorHandler from '../helpers/errorHandler.js'

import * as db from '../models/index.js'
import { type DB } from '../types'

const { Text } = db as DB

const deleteText = async (req: Request, res: Response): Promise<void> => {
  const { userId, textId } = req.params

  let textList = []
  try {
    textList = await Text!.findAll({ where: { userId } })
  } catch (err) {
    errorHandler(
      500,
      'Error during loading Text data in "deleteText" controller',
      err,
      res
    )
    return
  }

  if (!isInTextList(textId, textList, 'textId')) {
    errorHandler(
      404,
      `Title of textId "${textId}" does NOT exist, from "deleteText" controller`,
      null,
      res
    )
    return
  }

  try {
    await Text!.destroy({ where: { userId, textId } })

    res
      .status(200)
      .json({ success: true, message: 'Text successfully deleted' })
  } catch (err) {
    errorHandler(
      500,
      'Failed to delete text in "deleteText" controller...',
      err,
      res
    )
  }
}

export default deleteText
