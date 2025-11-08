import {requireAuth ,} from "@clerk/express";
import { User } from "../models/User.js";


export const protectRoute = [
    requireAuth({signInUrl: "/signup"}), // this will redirect user authentication
    async(req,res,next)=>{
        // let me find whether user exists in db or not
        const clerkId = req.auth.userId; // req.auth.userId contains clerkId
        try{
            const user = await User.findOne({clerkId})
              if(!user){
                return res.status(401).json({message:"user does not exist"})
            }
            // if user exist and in db then: 
            req.user = user;
            next();
        }
        catch(err){
          console.log("Error in protected Route middleware",err);
          res.status(500).json({message: "user authentication failed!"});
        }
    }
]