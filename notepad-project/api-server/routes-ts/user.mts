import express from 'express'

import sendText from '../controllers/sendText.js'
import addText from '../controllers/addText.js'
import updateText from '../controllers/updateText.js'
import deleteText from '../controllers/deleteText.js'
import sendTabs from '../controllers/sendTabs.js'

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
