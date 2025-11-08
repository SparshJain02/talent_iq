import {StreamChat } from "stream-chat";
import {StreamClient} from "@stream-io/node-sdk"
import { ENV } from "./env.js";


const api_key = ENV.STREAM_API_KEY
const api_secret =ENV.STREAM_API_SECRET  

if(!api_key || !api_secret){
    console.error("stream api key or stream api secret is missing")
    
}
export const streamChatClient = StreamChat.getInstance(api_key,api_secret); // for chats
export const streamVideoClient = new StreamClient(api_key,api_secret) // for video calls

export const upsertStreamClient = async(userObject)=>{
    try{
        await streamChatClient.upsertUser(userObject);
        console.log("user added in stream")
    }
    catch(err){
        console.log("error adding user in stream",err);
    }
}

export const deleteStreamClient = async(id)=>{
    try{
        await streamChatClient.deleteUser(id);
        console.log("user deleted from stream successfully");
    }
    catch(err){
        console.log("Failed to delete user from stream: ",err)
    }
}