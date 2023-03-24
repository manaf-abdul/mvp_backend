import  express  from "express";
import { signUp } from "../Controllers/user.Controller";
const router=express.Router()

router.post("/signup", signUp)

export default router