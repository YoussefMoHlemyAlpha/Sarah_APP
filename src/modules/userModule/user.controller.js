import {Router} from "express"
import {  signup,getUserProfile } from "./user.service.js"
import { refreshToken } from "../authModule/auth.service.js"
import { allowTo, auth } from "../../middleware/auth.middleware.js"
import { Roles } from "../../DB/user.model.js"
export const userRouter=Router()
userRouter.post('/signup',signup)
userRouter.post('/refresh',refreshToken)
userRouter.get('/',auth(),allowTo(Roles.admin),getUserProfile)