import { UserModel } from "./user.model.js"

export const findOne=async({model,filter={},populate=[]})=>{
const data=await model.findOne(filter).populate(populate)
return data
}

export const findById=async(model,id,populate=[])=>{
const data=await model.findById(id).populate(populate)
return data
}

export const find=async(model,filter={},populate=[])=>{
const data=await model.find(filter).populate(populate)
return data
}


export const create=async({model,data={}})=>{
const docu=await model.create(data)
return docu
}

export const findOneAndUpdate=async(model,filter={},data={},options={new:true})=>{
const docu=await model.findOneAndUpdate(filter,data,options)
return docu
}

export const findByIdAndUpdate=async(model,filter={},data={},options={new:true})=>{
const docu=await model.findByIdAndUpdate(filter,data,options)
return docu
}

export const findOneAndDelete=async(model,filter={},)=>{
const docu=await model.findOneAndDelete(filter)
return docu
}
export const findByIdAndDelete=async(model,id,filter={})=>{
const docu=await model.findByIdAndDelete(id,filter)
return docu
}