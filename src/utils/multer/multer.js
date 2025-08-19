import multer from "multer";
import fs from 'fs'
import path from 'path'

export const fileTypes={
    image:[
        'image/gif',
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/jpg'
    ],
    video:[
        'video/mp4',
        'video/webm'
    ]
};

export const uploadFile=({folder="general",type=fileTypes.image})=>{

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

const fileFilter=(req,file,callback)=>{
    if(type.includes(file.minetype)){
       return callback(null,true)
    }
    return callback(new Error('invalid file type',{cause:400}),false)
}
    return multer({
        storage,
        fileFilter,
    })
}