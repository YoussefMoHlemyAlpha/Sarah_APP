export const sucessRes=({res,message="Done",data={},status=200})=>{
return res.status(status).json({message,data,status})
}