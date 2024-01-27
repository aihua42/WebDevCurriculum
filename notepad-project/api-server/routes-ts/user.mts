import express from 'express'

import sendText from '../controllers-ts/sendText.mts'
import addText from '../controllers-ts/addText.mts'
import updateText from '../controllers-ts/updateText.mts'
import deleteText from '../controllers-ts/deleteText.mts'
import sendTabs from '../controllers-ts/sendTabs.mts'

const router = express.Router()

// GET method - send the saved text
router.get('/:userId/:textId', sendText)

// GET method - send tabs
router.get('/:userId', sendTabs)

// POST method - when client save a new text
router.post('/:userId', addText)

// PATCH method - update title or text
router.patch('/:userId/:key', updateText)

// DELETE method - remove from server directory
router.delete('/:userId/:textId', deleteText)

export default router
