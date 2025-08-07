import joi from 'joi'
import { generalValidation } from '../../middleware/validation.middleware.js'

export const getUserProfileSchema={
params:joi.object({
    id:generalValidation.id
})
}

