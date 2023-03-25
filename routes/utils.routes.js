import express from "express"
import { updateProfile } from "../controllers/user.controller.js"
import { validateAccessToken } from "../middlewares/auth.js"
import {user} from "../middlewares/validation.js"
import trim from "../middlewares/trim.js"
const router=express.Router()
router.route("/signed-url/:key")
    .get(validateAccessToken,trim,updateProfile)
export default router