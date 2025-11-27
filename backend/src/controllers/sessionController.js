import { Session } from "../models/Session.js";
import {streamChatClient, streamVideoClient} from "../lib/stream.js"

export const  createSession = async (req,res)=>{
    try{

        // host is the one who will send post request 
        console.log(req.body);
        const {problem,difficulty} = req.body;
        if(!problem || !difficulty){
            console.error("problem and difficulty are missing -> session_controller");
            return res.status(400).json({message: "session fields are missing"})
        }
        const clerkId = req.user.clerkId;
        const userId = req.user._id;
        const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
        //  so i have all the details rn so lets create session
        const sessionRes = await Session.create({problem,difficulty,host:userId,callId})
        
        // now setup the video call
        await streamVideoClient.video.call("default",callId).getOrCreate({
            data:{
                created_by_id: clerkId,
                custom: {
                    problem,
                    difficulty,
                    sessionId: sessionRes._id.toString()
                }
            }
        })
        // now setup the chatting functionality
        const channel = streamChatClient.channel("messaging",callId,{
            name: `${problem} Session`,
            created_by_id: clerkId,
            members: [clerkId]
        })
        await channel.create();
        res.status(201).json({session: sessionRes});
    }
    catch(err){
        console.error("Error generated in createSession Controller -> sessionController.js",err.message)
        res.status(500).json({message: "Internal Server Error"})
    }
}
export const  getActiveSessions = async (_,res)=>{
    try{
        const sessions = await Session.find({status: "active"})
        .populate("host","name email profilePhoto clerkId")
        .populate("participant","name email profilePhoto clerkId")
        .limit(20)
        .sort({createdAt: -1})

        // rn if sessions will be null then what's going to happen idk 
        res.status(200).json({sessions})
    }
    catch(err){
        console.error("Error in getActiveSession Controller -> sessionController.js",err.message);
        res.status(500).json({message: "Internal Server Error"})
    }
}
export const  getMyRecentSessions = async (req,res)=>{
    try{
        const userId = req.user._id;
        // recent sessions will be the one where user could be either host or participant
        const sessions = await Session.find({
            $or: [{host: userId},{participant:userId}],
        })
        .sort({createdAt: -1})
        .limit(20);
        res.status(200).json({sessions});
    }
    catch(err){
        console.error("Error fetching getMyRecentSession -> sessionController.js",err);
        res.status(500).json({message: "Internal Server Error"});
    }
}
export const  getSessionById = async (req,res)=>{
    try{
        const {id} = req.params;
        const session = await Session.findById(id)
        .populate("host","name email profilePhoto clerkId")
        .populate("participant","name email profilePhoto clerkId")
        if(!session){
            return res.status(404).json({message: "No Session Found"});
        }
        res.status(200).json({session});
    }
    catch(err){
        console.error("Failed to get Session by Id sessionController.js",);
        res.status(500).json({message: "Internal Server Error"});
    }
}
export const  joinSession = async (req,res)=>{
    // to join a session i need token and i guess callId it's 
    const {id} = req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;
   const session = await Session.findOneAndUpdate(
    {_id: id,participant: null,status: "active"},
    {$set: {participant:userId}},
    {new: true});
    if(!session){
        return res.status(404).json({message: "session is not found or already full"});
    }
    const channel = streamChatClient.channel("messaging",session.callId);
    await channel.addMembers([clerkId])
    return res.status(200).json({
       message: "Joined session successfully"
   });
}
export const  endSession = async (req,res)=>{
    try{
        const {id} = req.params;
        const userId = req.user._id;
        const session = await Session.findById(id);
        if(!session){
            return res.status(404).json({message: "Session not Found"});
        }
        if(session.host.toString() !== userId.toString()){
            return res.status(403).json({message: "Only host can end the session"})
        }
        if(session.status === "completed"){
            return res.status(404).json({message: "Session is completed"});
        }
        
        // delete video call
        const videoCall = streamVideoClient.video.call("default",session.callId);
        await videoCall.delete();
        
        // delete chat 
        const channel = streamChatClient.channel("messaging",session.callId);
        await channel.delete();
        
        res.status(200).json({message: "Session ended successfully"});

        session.status = "completed";
        await session.save();
        res.status(200).json({session,message: "Session deleted successfully"})
    }
    catch(err){
        console.error("Error ending the session -> sessionController.js",err)
        res.status(500).json({message: "Internal Server Error"});
    }
}
