
import { Schema,model,Types } from "mongoose";

const revokeTokenSchema= new Schema({
    jti:{
        type:String,
        required:true,
        unique:true
    },
    expireIn:{
        type:Date,
        required:true
    },
    userId:{
        type:Types.ObjectId,
        ref:"user",
        required:true
    }


},{timestamps:true})

export const revokeTokenModel=model("revokeToken",revokeTokenSchema)