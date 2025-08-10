import { providers, UserModel } from "../../DB/user.model.js";
import { sucessRes } from "../../utils/sucess.res.js";
import { findById, findOne } from "../../DB/DBServices.js";
import jwt from "jsonwebtoken";
import { decodeToken } from "../../middleware/auth.middleware.js";
import { types } from "../../middleware/auth.middleware.js";
import CryptoJS from "crypto-js";
import bcrypt from "bcrypt";
import { compare } from "../../utils/bcrypt.js";
import { Roles } from "../../DB/user.model.js";
import { Template } from "../../utils/sendEmail/generateHTML.js";
import { customAlphabet, nanoid } from "nanoid";
import { sendEmail } from "../../utils/sendEmail/sendEmail.js";
import { createOtp, emailEmitter } from "../../utils/sendEmail/emailEvents.js";
import { hash } from "../../utils/bcrypt.js";
import { ExpiredError, NotFoundError } from "../../utils/Error.js";
import { OAuth2Client } from "google-auth-library";
import { loginSchema } from "./auth.validation.js";
const client= new OAuth2Client()




//login
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error("email is not correct", { cause: 400 });
  }
  if(!user.confirmed){
    return next(new Error("email not confirmed", { cause: 400 })); 
  }
  if(user.provider==providers.google){
    return next(new Error("use google login ")); 
  }
  if (!compare(password, user.password)) {
    return next(new Error("password not correct", { cause: 400 }));
  }

  let accessSignature = "";
  let refreshSignature = "";

  switch (user.role) {
    case Roles.admin:
      accessSignature = process.env.admin_access_signature;
      refreshSignature = process.env.admin_refresh_signature;
      break;
    case Roles.user:
      accessSignature = process.env.user_access_signature;
      refreshSignature = process.env.user_refresh_signature;
      break;
  }

  const payload = {
    _id: user._id,
    name:user.name,
    password:user.password,
    email: email,
    phone: user.phone,
    role: user.role,
    credentialChangeAt :user.credentialChangeAt ,
    isActive:user.isActive,
    profileImage:user.profileImage,
    oldPasswords:user.oldPasswords
  };

  const accesstoken = jwt.sign(payload, accessSignature, {
    expiresIn: `60000 ms`,
  });

  const refreshToken = jwt.sign(payload, refreshSignature, {
    expiresIn: `7 d`,
  });
 
  sucessRes({ res, data: { accesstoken, refreshToken }, status: 201 });
};





export const refreshToken = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    const user = await decodeToken({
      tokenType: types.refresh,
      token: authorization,
      next,
    });

    let accessSignature = "";

    switch (user.role) {
      case Roles.admin:
        accessSignature = process.env.admin_access_signature;

        break;
      case Roles.user:
        accessSignature = process.env.user_access_signature;

        break;
    }

    const accessToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
      },
      accessSignature,
      { expiresIn: "20s" }
    );

    sucessRes({
      res,
      data: { accessToken },
      status: 202,
    });
  } catch (error) {
    next(new Error(error.message, { cause: 500 }));
  }
};


export const confirmEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp ) {
      return res.status(400).json({ message: "Email and code are required" });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if(user.emailOtp.expiredIn<= Date.now()){
     return next(new Error("otp expired... please reconfirm your email"))
    }
    if (user.banStatus && user.banTime && user.banTime > Date.now()) {
      const remainingBan = Math.ceil((user.banTime - Date.now()) / 1000);
      return res.status(403).json({ message: `Too many attempts. Try again in ${remainingBan} seconds.` });
    }

    if (!compare(otp,user.emailOtp.otp)) {
      user.failedAttempts =user.failedAttempts + 1;
      if(user.failedAttempts>4){ // it exactly suits the five attempts after trying in postman
        user.banTime=Date.now()+5*60*1000
        user.banStatus=true
        user.failedAttempts = 0;
      }
        await user.save();
      return res.status(400).json({ message: "Invalid confirmation code" });
    }
      
    user.confirmed = true;
    user.failedAttempts = 0;
    user.banTime = null;
    user.banStatus = false;
    user.emailOtp = undefined;
    await user.save();
    return res.status(200).json({ message: "Email confirmed successfully" });
  } catch (err) {
    next(err);
  }
};


export const forgetPass=async(req,res,next)=>{
  const{email}=req.body
  const user=await UserModel.findOne({email})
  if(!user){
    return next(new Error("user not found",{cause:404}))
  }
  if(!user.confirmed){
        return next(new Error("Email not confirmed",{cause:400}))
  }

 const otp =createOtp()
 user.passwordOtp={
  otp:hash(otp),
  expiredIn:Date.now()+60*1000
 }
 console.log(user);
 
 await user.save()
 emailEmitter.emit('sendPasswordOTP',{
  email:user.email,
  userName:user.name,
  otp:otp
 })
 sucessRes({res,status:202})
}

export const changePass=async(req,res,next)=>{
  const{email,otp,newPassword}=req.body
  const user=await UserModel.findOne({email})
  if(!user){
    return next(new Error("user not found ",{cause:404}))
  }
  if(!user.confirmed){
    return next(new Error("email not confirmed",{cause:400}))
  }
  if(user.emailOtp.expiredIn<= Date.now()){
    return next(new ExpiredError(),{cause:400})
    }
  if(!compare(otp,user.passwordOtp.otp)){
    return next(new Error("in-valid otp ",{cause:400}))   
  }


  await UserModel.updateOne({_id:user._id},{
    password:newPassword,
    credentialChangeAt:Date.now(),
    $unset:{
      passwordOtp:""
    }
  })
  sucessRes({res,status:202})
}

export const resendCode=async(req,res,next)=>{
 const {email}=req.body
 const user=await UserModel.findOne({email})
 if(!user){
    return next(new NotFoundError())
  }

  if (user.banStatus && user.banTime && user.banTime <= Date.now()) {
    user.failedAttempts = 0;
    user.banStatus = false;
    user.banTime = null;
  }

  let type="emailOtp"
  let event="confirmEmail"
  if(req.url.includes('password')){
  type="passwordOtp"
  event="sendPasswordOTP"
  }
  const otp=createOtp()
  user[type].otp=hash(otp)
  user[type].expiredIn=new Date(Date.now() + 120 * 1000);
  await user.save()
  emailEmitter.emit(event,{name:user.name,otp,email:user.email})

  return sucessRes({res,status:202})


}


export const socialLogin=async(req,res,next)=>{
  const{idToken}=req.body
  const ticket=await client.verifyIdToken({
    idToken,
    audience:process.env.audience
  })
  const {email,name}=ticket.getPayload()
  let user=await UserModel.findOne({email})
  if(user?.provider==providers.system){
    return next(new Error("user system login",{cause:409}))
  }
  if(!user){
    user =await UserModel.create({
    email,
    name,
    confirmed:true,
    provider:providers.google
  })   
  }
  const payload = {
    _id: user._id,
    email: email,
    phone: user.phone,
    role: user.role,
    credentialChangeAt :user.credentialChangeAt 
  };
  const accesstoken = jwt.sign(payload, process.env.user_access_signature, {
    expiresIn: `1 H`,
  });

  const refreshToken = jwt.sign(payload, process.env.user_refresh_signature, {
    expiresIn: `7 d`,
  });
  sucessRes({res,status:202,data:{
    accesstoken ,refreshToken 
  }})
}

export const updateEmail = async (req, res, next) => {
  try {
    const { newEmail } = req.body;

    // 1. Find the current user
    const user = await UserModel.findById(req.user._id);
    if (!user) return next(new Error("User not found"));

    // 2. Validate new email
    if (newEmail === user.email) {
      return next(new Error("Enter unused email"));
    }

    const emailExists = await UserModel.findOne({ email: newEmail });
    if (emailExists) {
      return next(new Error("This email already exists"));
    }

    // 3. Initialize OTP objects if not present
    if (!user.emailOtp) user.emailOtp = {};
    if (!user.newEmailOtp) user.newEmailOtp = {};

    // 4. Generate OTP for current (old) email
    const oldEmailOtp = createOtp();
    user.emailOtp.otp = hash(oldEmailOtp);
    user.emailOtp.expiredIn = Date.now() + 60 * 1000;

    emailEmitter.emit("confirmEmail", {
      email: user.email,
      userName: user.name,
      otp: oldEmailOtp,
    });

    // 5. Generate OTP for new email
    const newEmailOtp = createOtp();
    user.newEmailOtp.otp = hash(newEmailOtp);
    user.newEmailOtp.expiredIn = Date.now() + 60 * 1000;

    // 6. Save new email and reset confirmation
    user.newEmail = newEmail;
    user.confirmed = false;

    emailEmitter.emit("confirmEmail", {
      email: newEmail, // Direct use of new email
      userName: user.name,
      otp: newEmailOtp,
    });

    // 7. Save user and send success response
    await user.save();

    sucessRes({ res });
  } catch (err) {
    next(err);
  }
};


export const confirmUpdateEmail=async(req,res,next)=>{
  
  const{oldEmailOtp,newEmailOtp,email}=req.body
  const user=await UserModel.findOne({email})
  if(!user){
    return next(new Error("User not found",{cause:404}));
  }
  if(user.emailOtp.expiredIn<= Date.now() ||user.newEmailOtp.expiredIn<= Date.now()){
     return next(new Error("otp expired... please reconfirm your email"))
    }
  
  if (!compare(oldEmailOtp,user.emailOtp.otp ||!compare(newEmailOtp,user.newEmailOtp.otp ))) {
      return res.status(400).json({ message: "Invalid confirmation code" });
    }
    user.email=user.newEmail
    user.confirmed=true
    user.emailOtp=undefined
    user.newEmail=undefined
    user.newEmailOtp=undefined
    await user.save()
    sucessRes({res,data:user})
}



export const resendUpdateEmailOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return next(new NotFoundError("User not found"));
    }

    // If newEmail is not set, there's nothing to confirm
    if (!user.newEmail) {
      return next(new Error("No pending email update found"));
    }

    // Ensure nested OTP objects are initialized
    if (!user.emailOtp) user.emailOtp = {};
    if (!user.newEmailOtp) user.newEmailOtp = {};

    // Generate OTP for current (old) email
    const oldEmailOtp = createOtp();
    user.emailOtp.otp = hash(oldEmailOtp);
    user.emailOtp.expiredIn = Date.now() + 60 * 1000;

    emailEmitter.emit("confirmEmail", {
      email: user.email,
      userName: user.name,
      otp: oldEmailOtp,
    });

    // Generate OTP for new email
    const newEmailOtp = createOtp();
    user.newEmailOtp.otp = hash(newEmailOtp);
    user.newEmailOtp.expiredIn = Date.now() + 60 * 1000;

    emailEmitter.emit("confirmEmail", {
      email: user.newEmail,
      userName: user.name,
      otp: newEmailOtp,
    });

    await user.save();

    return sucessRes({ res, status: 202, message: "OTP resent successfully" });
  } catch (err) {
    next(err);
  }
};


export const updatePassword = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);
    const { newPassword,oldPassword } = req.body;

    if (!compare(oldPassword, user.password)) {
      return next(new Error("old password not correct", { cause: 400 }));
    }
    if (!user) {
      return next(new Error("User not found", { cause: 404 }));
    }

    // Compare new password with current
    if (compare(newPassword, user.password)) {
      return next(new Error("Enter unused password", { cause: 400 }));
    }

    // Compare new password with old ones
    for (const old of user.oldPasswords || []) {
      if (compare(newPassword, old)) {
        return next(new Error("Enter unused password", { cause: 400 }));
      }
    }

    user.oldPasswords.push(user.password);
    user.password = newPassword;
    user.credentialChangeAt=Date.now()
    await user.save();

    return sucessRes({ res, data: { message: "Password updated successfully" } });
  } catch (err) {
    next(err);
  }
};
