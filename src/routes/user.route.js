import express from 'express'
import protectMiddleware from '../middleware/protect.middleware.js'
import { userData } from '../controllers/user.controller.js'
const router = express.Router()

//route for get user data
router.get("/userData" , protectMiddleware , userData)

export default router