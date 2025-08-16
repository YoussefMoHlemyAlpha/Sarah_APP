import multer from "multer";
import fs from 'fs'
import path from 'path'


export const uploadFile=(folder="general")=>{

const storage=multer.diskStorage({
destination:(req,file,callback)=>{
    const dest=`uploads/${folder}/${req.user._id}_${req.user.name}`
    req.dest=dest
    const fullDest=path.resolve('.',dest)
    console.log(dest);
    
if(!fs.existsSync(fullDest)){
        fs.mkdirSync(fullDest,{recursive:true})
    }
callback(null,fullDest)
},
filename:(req,file,callback)=>{
    const name=req.user.name+"_"+Date.now()+"_"+file.originalname
    callback(null,name)
}
})
    return multer({
        storage
    })
}