import express from 'express'
import {signController , loginController , logoutController , sendOtpController, verifyEmailController, isAuthenticated, resetPasswordOtp, resetPassword} from '../controllers/auth.controller.js'
import protectMiddleware from '../middleware/protect.middleware.js'
const router = express.Router()

//route for sign
router.post("/sign" , signController)

//route for login
router.post("/login" , loginController)

//route for logout
router.post("/logout" , logoutController)

//route for send otp via email
router.post("/sendOtp" , protectMiddleware ,sendOtpController)

//route for verify email
router.post("/veryfyEmail" , protectMiddleware ,verifyEmailController)

//route for check authenticated
router.get("/isAuth" , protectMiddleware , isAuthenticated)

//route for sent otp for reset password
router.post("/resetPasswordOtp" , protectMiddleware , resetPasswordOtp)

//route for reset password
router.post("/resetPassword" , protectMiddleware , resetPassword)

export default router