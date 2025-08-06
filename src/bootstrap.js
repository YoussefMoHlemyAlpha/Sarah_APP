import { authRouter } from "./modules/authModule/auth.controller.js"
import { userRouter} from "./modules/userModule/user.controller.js"
import { messageRouter } from "./modules/messageModule/message.controller.js"
import { DBConnection } from "./DB/Connection.js"
import { sendEmail } from "./utils/sendEmail/sendEmail.js"
import cors from 'cors'

export const bootstrap=(app,express)=>{
    app.use(cors())
DBConnection()
app.use(express.json())
app.use('/auth',authRouter)
app.use('/user',userRouter)
app.use('/message',messageRouter)

app.use((err,req,res,next)=>{
    res.status(err.cause||500).json({
        errMsg:err.message,
        status:err.cause||500,
        stack:err.stack
    })
})


app.listen(process.env.PORT,()=>{
    console.log("Server Running on port ",process.env.PORT,);
    
})


}