import { type Request, type Response } from 'express'

import isInTextList from '../helpers-src/isInTextList.mts'
import errorHandler from '../helpers-src/errorHandler.mts'

import * as db from '../models-src/index.ts'
import { type DB, type TextRecord } from '../types.ts'

const { Text } = db as DB

const addText = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId

  let textList: TextRecord[] = []
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
