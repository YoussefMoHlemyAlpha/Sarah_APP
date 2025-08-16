import joi from 'joi'
import { Genders, Roles } from '../../DB/user.model.js'
import { generalValidation } from '../../middleware/validation.middleware.js'

export const loginSchema={
  body:joi.object({
    email:generalValidation.email.required(),
    password:joi.string().min(8).max(20).required()
  })
}

export const confirmEmailSchema=joi.object({
  email:generalValidation.email.required(),
  otp:joi.number().required(),
  id:joi.string().required()
})

export const signupSchema={
  body:joi.object({
     name:generalValidation.name.required(),
     email:generalValidation.email,
     password:generalValidation.password.required(),
     confirmPassword:generalValidation.confirmPassword.required(),
     phone:generalValidation.phone.required(),
     gender:generalValidation.gender,
     role:generalValidation.role,
     age:generalValidation.age
  }).required()
}