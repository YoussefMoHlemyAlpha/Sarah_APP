import {Router} from "express"
import { getAllMessage, getMessage, sendMessage } from "./message.service.js"
import { cloudUploadFile ,fileTypes} from "../../utils/multer/multer.cloud.js"
import { auth } from "../../middleware/auth.middleware.js"

export const messageRouter=Router({
    strict:true, 
    caseSensitive:true,
    mergeParams:true
})

messageRouter.post('/send-message',cloudUploadFile({type:fileTypes.image}).array('images',5),sendMessage)
messageRouter.get('/',auth(),getAllMessage)
messageRouter.get('/:id',auth(),getMessage)