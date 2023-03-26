import express from "express"
import { validateAccessToken } from "../middlewares/auth.js"
import trim from "../middlewares/trim.js"
import { getSignedUrl } from "../controllers/utils.controller.js"
const router=express.Router()
router.route("/pre-signed-url")
    .get(validateAccessToken,trim,getSignedUrl)
export default router