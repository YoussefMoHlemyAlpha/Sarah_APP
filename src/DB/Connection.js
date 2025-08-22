import chalk from "chalk";
import  mongoose from "mongoose"

export const DBConnection=async()=>{
await mongoose.connect(process.env.URI)
.then(()=>{
    console.log(chalk.bgGreen("DB connected Successfully"));
    
})
.catch((err)=>{
console.log(chalk.bgRed("DB Connection Failed",err))
})

}