import { loginSchema } from "../modules/authModule/auth.validation.js"

const data =['body','params','query']

export const validation=(schema)=>{
  return(req,res,next)=>{
    const data={
        ...req.body,
        ...req.params,
        ...req.query
    }
    const validationErrors=[]
 data.forEach(x=>{
 const result=schema.validate(data,{abortEarly:false})
  if(result?.error){
    validationErrors.push(result.error)
  }
 })

 if(validationErrors.length>0){
    return next(new Error(validationErrors,{cause:400}))
 }else{
    next()
 }
}
}