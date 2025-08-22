import { Schema,Types,model } from "mongoose"
import mongoose from "mongoose"

const imageSchema=new Schema({
    secure_url:String,
    public_id:String
})


const messaageSchema=new Schema({
    body:{ //message body
        type:String,
        required:function(){
            if(this.images.length>0){
                return false
            }
            return true
        }
    },
    images:[imageSchema],
    from:{
        type:mongoose.Schema.Types.ObjectId,
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    }
},{timestamps:true})

export const messageModel=model('messages',messaageSchema)