import { type Request, type Response } from 'express'

import isInTextList from '../helpers/isInTextDB.js'
import errorHandler from '../helpers/errorHandler.js'

import * as db from '../models/index.js'
import { type DB } from '../types'

const { Text } = db as DB

const addText = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId

  let textList = []
  try {
    textList = await Text!.findAll({ where: { userId } })
  } catch (err: unknown) {
    errorHandler(
      500,
      'Error during loading Text data in "addText" controller',
      err,
      res
    )
    return
  }

  const { textId, title, text } = req.body

  if (isInTextList(title as string, textList)) {
    errorHandler(
      409,
      `Title "${title}" already exists, from "addText" controller`,
      null,
      res
    )
    return
  }

  const textToAdd = { userId, textId, title, text }

  try {
    await Text!.create(textToAdd)
    res
      .status(201)
      .json({ success: true, message: 'Text successfully added!' })
  } catch (err) {
    errorHandler(
      500,
      'Failed to add text in "addText" controller...',
      err,
      res
    )
  }
}

export default addText
