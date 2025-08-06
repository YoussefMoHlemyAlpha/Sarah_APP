import {Router} from "express"
import { changePass, confirmEmail, forgetPass, login, resendCode, socialLogin } from "./auth.service.js"
import { loginSchema,confirmEmailSchema } from "./auth.validation.js"
import { validation } from "../../middleware/validation.middleware.js"


export const authRouter=Router()
authRouter.post('/login',validation(loginSchema),login)
authRouter.post('/confirm-email',validation(confirmEmailSchema),confirmEmail)
authRouter.post('/forget-password',forgetPass)
authRouter.patch('/change-password',changePass)
authRouter.patch('/resend-email-otp',resendCode)
authRouter.patch('/resend-password-otp',resendCode)
authRouter.post('/social-login',socialLogin)