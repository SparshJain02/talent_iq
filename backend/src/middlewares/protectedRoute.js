import { User } from "../models/User.js";
import jwt from "jsonwebtoken"
// import { verifyToken } from "@clerk/backend";
export const protectRoute = async (req, res, next) => {
        const token = req.headers["authorization"].split(" ")[1];
        let jwtKey = process.env.CLERK_JWT_KEY;
        jwtKey = jwtKey.replace(/\\n/g, '\n');
        jwt.verify(token,jwtKey,{algorithms: ['RS256']},async function(err,decoded){
            if(err && err.name === "TokenExpiredError"){
                console.log(err.message);
                return res.status(401).json({message: "Unauthorized token expired"});
            }
            else if(!decoded){
                return res.status(422).json({message: "Invalid token"});
            }
            const clerkId = decoded.sub; // req.auth.userId contains clerkId
            const user = await User.findOne({ clerkId })
            if (!user) {
                return res.status(401).json({ message: "user does not exist" })
            }
            // if user exist and in db then: 
                req.user = user;
                next();
            }
        )
    }

