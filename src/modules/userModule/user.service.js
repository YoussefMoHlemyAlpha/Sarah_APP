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
console.log(user)
//user.phone=decrypt(user.phone,process.env.cryptoKey)
sucessRes({res,data:user,status:200})
}



