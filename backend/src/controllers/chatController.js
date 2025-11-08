import { streamServerClient } from "../lib/stream"
export const getStreamToken = (req,res)=>{
    try{
        const token =  streamServerClient.createToken(req.user.clerkId);
        res.status(200).json({
            token,
            userId: req.user.clerkId,
            userName: req.user.name,
            userImage:req.user.profilePhoto
        })
    }
    catch(err){
        console.error("Error generating token for stream",err);
        res.status(500).json({message: "Internal Server Error"});
    }
}