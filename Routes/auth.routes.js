import express from "express"
import {verifyOtp, register, logIn} from "../controllers/auth.controller.js"
import trim from "../middlewares/trim.js"
import {auth} from "../middlewares/validation.js"

const router=express.Router()
router.route("/verify-otp")
    .post(trim,auth("verifyOtp"),verifyOtp)
router.route("/register")
    .post(trim,auth("register"),register)
router.route("/login")
    .post(trim,auth("login"),logIn)
export default router