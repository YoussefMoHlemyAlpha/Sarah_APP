import express from "express"
import { bootstrap } from "./src/bootstrap.js"
import 'dotenv/config';          
console.log(process.env.PORT); 
const app=express()
bootstrap(app,express)

