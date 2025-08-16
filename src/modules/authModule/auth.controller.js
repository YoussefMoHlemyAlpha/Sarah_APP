import {Router} from "express"
import { changePass, confirmEmail, confirmUpdateEmail, forgetPass, login, logout, logoutForAllDevices, resendCode, resendUpdateEmailOtp, socialLogin, updateEmail, updatePassword } from "./auth.service.js"
import { loginSchema,confirmEmailSchema } from "./auth.validation.js"
import { validation } from "../../middleware/validation.middleware.js"
import { auth } from "../../middleware/auth.middleware.js"

export const authRouter=Router()
authRouter.post('/login',validation(loginSchema),login)
authRouter.post('/confirm-email',validation(confirmEmailSchema),confirmEmail)
authRouter.post('/forget-password',forgetPass)
authRouter.patch('/change-password',changePass)
authRouter.patch('/resend-email-otp',resendCode)
authRouter.patch('/resend-password-otp',resendCode)
authRouter.post('/social-login',socialLogin)
authRouter.patch('/update-email',auth(),updateEmail)
authRouter.patch('/confirm-update-email',confirmUpdateEmail)
authRouter.patch('/resend-change-email-otp',resendUpdateEmailOtp)
authRouter.patch('/update-password',auth(),updatePassword)
authRouter.post('/logout',auth(),logout)
authRouter.post('/logout-all',auth(),logoutForAllDevices)