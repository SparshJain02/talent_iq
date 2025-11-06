import mongoose from "mongoose"
import { ENV } from "./env.js"

export async function connectDb(){
    if (!ENV.MONGO_URI) {
        throw new Error('MONGO_URI environment variable is not defined');
    }
    
    try{
        await mongoose.connect(ENV.MONGO_URI);
        console.log("db connected successfully");
    }
    catch(err){
        console.error("error connecting to db", err);
        throw err;
    }
}