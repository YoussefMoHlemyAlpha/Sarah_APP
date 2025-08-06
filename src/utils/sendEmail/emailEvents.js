import { EventEmitter } from "events";
import { sendEmail } from "./sendEmail.js";
import { Template } from "./generateHTML.js";
import { customAlphabet } from "nanoid";
export const emailEmitter=new EventEmitter()

export const createOtp=()=>{
    const otp=customAlphabet('0123456789',6)()
    return otp
}



 emailEmitter.on('confirmEmail',async({email,userName,otp})=>{
    console.log("Email sending...........")
  const subject='Confirm email'
  const html=Template(otp,userName,email)
  await sendEmail({
    to:email,
    html,
    subject
  })
  console.log("email sent");
})

emailEmitter.on('sendPasswordOTP',async({email,userName,otp})=>{
    console.log("Email sending...........")
  const subject='forget password'
  const html=Template(otp,userName,email)
  await sendEmail({
    to:email,
    html,
    subject
  })
  console.log("email sent");
})
