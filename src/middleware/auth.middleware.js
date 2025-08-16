import jwt from 'jsonwebtoken'
import { findById } from '../DB/DBServices.js'
import { UserModel } from '../DB/user.model.js'
import { Roles } from '../DB/user.model.js'
import { revokeTokenModel } from '../DB/revokeToken.model.js'
export const types={
    access:"access",
    refresh:"refresh"

}

Object.freeze(types)
export const decodeToken = async ({ tokenType = types.access, token, next }) => {
    try {
        if (!token) {
            return next(new Error("Please send token", { cause: 404 }));
        }
        const [bearer,extractedToken] = token.split(" ");
        if(!bearer || !extractedToken){
            return next(new Error("in-valid Token"))
        }

        let accessSignature = "";
        let refreshSignature="";
        switch(bearer){
            case Roles.admin:
             accessSignature=process.env.admin_access_signature
             refreshSignature=process.env.admin_refresh_signature
              break;
            case Roles.user:
             accessSignature=process.env.user_access_signature
             refreshSignature=process.env.user_refresh_signature   
              break;
        }
        
        const signature=tokenType == types.access ? accessSignature : refreshSignature
        const payload = jwt.verify(extractedToken,signature );

        const user = await findById(UserModel, payload._id);
        if (!user) {
            return next(new Error("User not found", { cause: 404 }));
        }
        if(await revokeTokenModel.findOne({jti:payload.jti}) ){
            return next(new Error('Token is revoked'))
        }
        if(!user.confirmed){
            return next(new Error("email not confirmed", { cause: 400 }));  
        }
        if(user.credentialChangeAt?.getTime()>=payload.iat * 1000){
            return next(new Error("please login again",{cause:400}))
        }
         return {user,decoded:payload};
;
    } catch (error) {
        return next(new Error(error.message, { cause: 400 }));
    }
};

export const auth = (activtion=true) => {
    return async (req, res, next) => {
        const { authorization } = req.headers;
        const {user,decoded} = await decodeToken({ token: authorization, next });
   if(activtion)   {
    console.log(user)
    if(!user.isActive){
        return next(new Error('this Account is deleted',{cause:404}))
    }
}
            req.user = user;
            req.decoded=decoded
            next();
    };
};

/*export const isActive=()=>{
return async(req,res,next)=>{
    if(!user.isActive){
        return next(new Error('this Account is deleted',{cause:404}))
    }
    next()
}
}*/





export const allowTo=(...Roles)=>{
        return async (req, res, next) => {
        const user=req.user
        console.log(Roles)
        if(!Roles.includes(user.role)){
            return next(new Error('you are not authorized to access this end point'))
        }
        next()
    };
}