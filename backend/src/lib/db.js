import mongoose from "mongoose"
import { ENV } from "./env.js"

export async function connectDb(){
    try{
        await mongoose.connect(ENV.MONGO_URI);
        console.log("db connected successfully");
    }
    catch(err){
        console.log("error connecting to db",err)
    }
    
}