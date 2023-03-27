import express from "express"
import {verifyOtp, register, logIn, forgotPassword, changePassword, getOtp} from "../controllers/auth.controller.js"
import { validateAccessToken } from "../middlewares/auth.js"
import trim from "../middlewares/trim.js"
import {auth} from "../middlewares/validation.js"

const router=express.Router()
router.route("/verify-otp")
    .post(trim,auth("verifyOtp"),verifyOtp)
router.route("/register")
    .post(trim,auth("register"),register)
router.route("/login")
    .post(trim,auth("login"),logIn)
router.route("/forgot-password")
        .post(trim,auth("forgetPassword"),forgotPassword)
router.route("/forgot-password/:email")
    .get(getOtp)
router.route("/change-password")
    .post(validateAccessToken,trim,auth("changePassword"),changePassword)
export default router