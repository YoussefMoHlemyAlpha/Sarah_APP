import {Router} from "express"
import {  signup,getUserProfile, shareProfile, userProfile, updateUser, softDelete, restoreAccount, hardDelete, uploadImage } from "./user.service.js"
import { refreshToken } from "../authModule/auth.service.js"
import { allowTo, auth } from "../../middleware/auth.middleware.js"
import { Roles } from "../../DB/user.model.js"
import { signupSchema } from "../authModule/auth.validation.js"
import { validation } from "../../middleware/validation.middleware.js"
import { getUserProfileSchema } from "./user.validation.js"
import { uploadFile } from "../../utils/multer/multer.js"

export const userRouter=Router()
userRouter.post('/signup',validation(signupSchema),signup)
userRouter.post('/refresh',refreshToken)
userRouter.get('/',auth(),allowTo(Roles.admin),getUserProfile)
userRouter.get('/share-profile',auth(),shareProfile)
userRouter.get('/user-profile/:id',userProfile)
//userRouter.get('/:id',validation(getUserProfileSchema),getUserProfile)
userRouter.patch('/update',auth(),updateUser)
userRouter.patch('/restore/:id',auth(false),restoreAccount)
userRouter.delete('/hard-delete/:id',auth(),allowTo(Roles.admin),hardDelete)
userRouter.patch('/upload-image',auth(),uploadFile().single('image'),uploadImage)

