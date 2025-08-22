import { messageModel } from "../../DB/message.model.js"
import { UserModel } from "../../DB/user.model.js"
import { NotFoundError } from "../../utils/Error.js"
import { uploadMultiFiles } from "../../utils/multer/cloud.services.js"
import { sucessRes } from "../../utils/sucess.res.js"


export const sendMessage=async(req,res,next)=>{

const {from,to,body}=req.body

if(from){
   const sender = await UserModel.findById(from)
    if(!sender){
         throw new NotFoundError()
    }
}
const receiver=await UserModel.findById(to)
if(!receiver){
    throw new NotFoundError()
}
let images=[]
if(req?.files?.length>0){
   const paths=[]
   console.log(req.files);
   for(const file of req.files){
    paths.push(file.path)
   }
images= await uploadMultiFiles({paths,dest:`/messages/${receiver._id}`})
}
const message=await messageModel.create({
    from,to,body,images
})
return sucessRes({res,status:201,data:message})
}


export const getMessage=async(req,res,next)=>{
const message=await messageModel.findById(req.params.id)
if(!message){
    return next(new Error('No message found'))
}  

if(!message.to.equals(req.user._id)){
    return next(new Error("you are not authorized"))
}

sucessRes({res,status:200,data:message})

}



export const getAllMessage=async(req,res,next)=>{
if(req?.user?._id!=req.params.id){
    return next(new Error("you are not authorized"))
}
const messages=await messageModel.find({to:req.params.id})
if(!messages){
    return next(new Error('No messages found'))
}
sucessRes({res,status:200,data:messages})
}
