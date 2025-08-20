
import { cloudConfig } from "./cloudinary.js"

export const uploadSingleFile=async({path,folder="others"})=>{
   const {public_id,secure_url}= await cloudConfig().uploader.upload(path,{
          folder:`${process.env.APP_NAME}/${folder}`
        })
        return {public_id,secure_url}
}


export const  destorySingleFile=async({public_id})=>{
    cloudConfig().uploader.destroy(public_id)
}


export const deleteManyFile=async({public_ids=[]})=>{
      await cloudConfig().api.delete_resources(public_ids)
}

export const deleteByPrefix=async({prefix=""})=>{
await cloudConfig().api.delete_resources_by_prefix(`${process.env.APP_NAME}/${prefix}`)
}

export const deleteFolder=async({folder=""})=>{
await cloudConfig().api.delete_folder(`${process.env.APP_NAME}/${folder}`)
}