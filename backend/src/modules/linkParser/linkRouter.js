import express from 'express'
import { fetchLinkPreview } from './linkController.js'

const router = express.Router()

router.get('/fetch-url', fetchLinkPreview)

export default router
