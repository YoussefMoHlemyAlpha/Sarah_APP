import joi from 'joi'
import { generalValidation } from '../../middleware/validation.middleware.js'
import { fileTypes } from '../../utils/multer/multer.js'

export const getUserProfileSchema={
params:joi.object({
    id:generalValidation.id
})
}

export const uploadImageSchema={
    file: generalValidation.file.required()
    
}

export const coverImagesSchema={

    files:joi.array().items(generalValidation.file).max(3).required()


}