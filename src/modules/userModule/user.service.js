import { UserModel } from "../../DB/user.model.js";
import { sucessRes } from "../../utils/sucess.res.js";
import { findById, findOne ,create} from "../../DB/DBServices.js";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken"
import { encrypt,decrypt } from "../../utils/crypto.js";
import { customAlphabet, nanoid } from "nanoid";
import { Template } from "../../utils/sendEmail/generateHTML.js";
import { sendEmail } from "../../utils/sendEmail/sendEmail.js";
import { hash } from "../../utils/bcrypt.js";
import { createOtp, emailEmitter } from "../../utils/sendEmail/emailEvents.js";
import { NotFoundError } from "../../utils/Error.js";
import { Roles } from "../../DB/user.model.js";

// sign up
export const signup=async(req,res,next)=>{
const{name,email,password,role,gender,phone}=req.body
const isExist=await findOne({
    model:UserModel,
    filter:{
        $or:[
            {email},
            {phone}
        ]
    }
})
if(isExist){
    return next(new Error(isExist.phone==phone?
        "please enter another phone"
        :"please enter another email",{cause:400}
    ))
}
const otp=createOtp()
const user=await create({
    model:UserModel,
    data:{name,email,password,phone:encrypt(phone,process.env.cryptoKey),gender,role,emailOtp:{
        otp:hash(otp),
        expiredIn:Date.now()+60*1000
    }}
})

emailEmitter.emit('confirmEmail',{email:user.email,otp,userName:user.name})
sucessRes({res,data:user,status:201})

}



export const getUserProfile= async(req,res,next)=>{

const user =req.user

//user.phone=decrypt(user.phone,process.env.cryptoKey)
sucessRes({res,data:user,status:200})
}



export const shareProfile= async(req,res,next)=>{
    const user = req.user;
    const link=`${req.protocol}://${req.host}/user/user-profile/${user._id}`
    sucessRes({res,data:link})
    
}

export const userProfile=async(req,res,next)=>{
  const id=req.params.id;
  const user=await UserModel.findById(id).select('email name phone gender age profileImage')
  user.profileImage=`${req.protocol}://${req.host}/${user.profileImage}`
  sucessRes({res,data:user})
}

export const updateUser=async(req,res,next)=>{
 const {name,phone}=req.body
 const user=req.user
 await UserModel.updateOne({_id:user._id},{
    name,
    phone
 })
 sucessRes({res})
}

export const softDelete=async(req,res,next)=>{
const id=req.params.id
const loggedUser=req.user
let user =await UserModel.findById(id)
if(!user){
    return next(new NotFoundError())
}
if(loggedUser._id!=user._id && loggedUser.role!=Roles.admin){
return next(new Error('You are Not allowed to delete this acount'))
}
user.isActive=false
user.deletedBy=loggedUser._id
await user.save()
sucessRes({res})

}


export const restoreAccount=async(req,res,next)=>{
    const id=req.params.id
    const loggedUser=req.user
    const user=await UserModel.findById(id)
    if(!user){
        return next(new NotFoundError())
    }
    if(user.isActive){
        return next(new Error("this Account not deleted",{cause:409}))
    }
    if(!(loggedUser.role==Roles.admin || (user._id.toString()==id && user.deletedBy.toString()==user._id.toString()))){
        return next(new Error('You are Not allowed to restore this account',{cause:401}))
    }
    user.isActive=true;
    user.deletedBy=undefined
    await user.save()
    sucessRes({res})
}


export const hardDelete=async(req,res,next)=>{
    const id=req.params.id
    const user=await UserModel.findById(id)
    if(user.role==Roles.admin){
        return next(new Error("admin account can not be deleted",{cause:400}))
    }
    await user.deleteOne()
    sucessRes({res})
}


export const uploadImage=async(req,res,next)=>{
    console.log(req.files)
    const user=req.user
    user.profileImage=req.dest+"/"+req.file.filename
    await user.save()
    sucessRes({res})
}