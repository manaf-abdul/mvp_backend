import express from "express"
import { updateProfile, usernameChecker } from "../controllers/user.controller.js"
import { validateAccessToken } from "../middlewares/auth.js"
import {user} from "../middlewares/validation.js"
import trim from "../middlewares/trim.js"
const router=express.Router()
router.route("/update-profile")
    .put(validateAccessToken,trim,user("profileUpdate"),updateProfile)
router.route("/user-name-availability/:userName")
    .get(validateAccessToken,usernameChecker)
export default router