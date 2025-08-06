import bcrypt from 'bcrypt'

export const hash=(text)=>{
return  bcrypt.hashSync(text,Number(process.env.salt))
}

export const compare=(text,hashed)=>{
return bcrypt.compareSync(text,hashed)
}