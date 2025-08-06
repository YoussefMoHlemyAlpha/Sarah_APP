import  mongoose from "mongoose"

export const DBConnection=async()=>{
await mongoose.connect(process.env.URI)
.then(()=>{
    console.log("DB connected Successfully");
    
})
.catch((err)=>{
console.log("DB Connection Failed",err)
})

}