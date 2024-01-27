import * as db from '../models-ts/index.ts'
import { type Request, type Response } from 'express'
import { type DB } from '../types'
import errorHandler from '../helpers-ts/errorHandler.mts'

const { Text } = db as DB

const sendText = async (req: Request, res: Response): Promise<void> => {
  const textId = req.params.textId
  const userId = req.params.userId

  try {
    const foundText = await Text!.findOne({ where: { userId, textId } })

    if (foundText === null) {
      res.status(204).json({ success: false, message: 'Text not found in DB' })
    } else {
      res.status(200).json(foundText)
    }
  } catch (err) {
    errorHandler(
      500,
      'Error during try to find the text in Text DB, from "sendText" controller',
      err,
      res
    )
  }
}

export default sendText
