import errorHandler from '../helpers-src/errorHandler.mts'

import { type Request, type Response } from 'express'
import * as db from '../models-src/index.ts'
import { type DB } from '../types.ts'

const { Text } = db as DB

const updateText = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId
  const key = req.params.key
  const { textId, before, after } = req.body

  let newObj = {}
  let where = {}
  if (key === 'title') {
    newObj = { textId, title: after }
    where = { userId, title: before }
  } else {
    newObj = { text: after }
    where = { userId, textId }
  }

  try {
    const [affectedRows] = await Text!.update(newObj, { where })

    if (affectedRows > 0) {
      res.status(200).json({ success: true, message: 'Successfully updated' })
    } else {
      errorHandler(
        209,
        `Nothing changed when updating the ${key} of text id - ${textId}, from "updateText" controller`,
        null,
        res
      )
    }
  } catch (err) {
    errorHandler(
      500,
      'Error during try to update the text in Text DB, from "updateText" controller',
      err,
      res
    )
  }
}

export default updateText
