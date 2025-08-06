import joi from 'joi'

export const loginSchema={
  body:joi.object({
    email:joi.string().email().required(),
    password:joi.string().min(5).max(10).required()
  })
}


export const confirmEmailSchema=joi.object({
  email:joi.string().email().required(),
  otp:joi.number().required(),
  id:joi.string().required()
})