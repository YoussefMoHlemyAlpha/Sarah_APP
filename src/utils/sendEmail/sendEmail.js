import nodemailer from 'nodemailer'


export const sendEmail=async({to,subject,html})=> {
  
const transporter= nodemailer.createTransport({
    host:process.env.host,
    port:process.env.EmailPort,
    secure:true,
    service:"gmail",
    auth:{
        user:process.env.user,
        pass:process.env.pass
    }
})
const main =async()=>{
const info=await transporter.sendMail({
    from:`sarahApp "<${process.env.user}>"`,
    to,
    subject,
    html
})
console.log({info})
}
main().catch((err)=>{
console.log(err);

})
}