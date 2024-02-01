import express from 'express'

import sendText from '../controllers-src/sendText.mts'
import addText from '../controllers-src/addText.mts'
import updateText from '../controllers-src/updateText.mts'
import deleteText from '../controllers-src/deleteText.mts'
import sendTabs from '../controllers-src/sendTabs.mts'

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
