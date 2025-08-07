import { loginSchema } from "../modules/authModule/auth.validation.js"
import joi from "joi"
import { Genders,Roles } from "../DB/user.model.js"
import { isValidObjectId } from "mongoose"

const dataMethods =['body','params','query']

export const validation=(schema)=>{
  return(req,res,next)=>{
const validationErrors=[]
dataMethods.forEach(key=>{
 const result=schema[key]?.validate(req[key],{abortEarly:false})
  if(result?.error){
    validationErrors.push(result.error)
  }
 })

 if(validationErrors.length>0){
    return next(new Error(validationErrors,{cause:400}))
 }
 next()
}
}


export const generalValidation={
 email:joi.string().email(),
 name:joi.string().min(3).max(30),
 password:joi.string().min(8).max(20),
 confirmPassword:joi.string().valid(joi.ref('password')),
 phone:joi.string().regex(new RegExp(/^(\+20|0020|0)?1[0125][0-9]{8}$/)),
 gender:joi.string().valid(Genders.male,Genders.female),
 role:joi.string().valid(Roles.user,Roles.admin),
 age:joi.number().min(18).max(50),
 id:joi.string().custom((value,helpers)=>{
   if(isValidObjectId(value)){
      return value
   }else{
      return helpers.message('in-valid objectId')
   }
 })
}