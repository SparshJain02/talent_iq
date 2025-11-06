import {Inngest} from "inngest"
import { connectDb } from "./db.js"
import { User } from "../models/User.js"

export const inngest = new Inngest({ id: "talent-iq" });

const sync_user = inngest.createFunction(
    {id: "sync-user"},
    {event: "clerk/user.created"},
    async (event)=>{
        await connectDb();
        const {id,first_name,last_name,image_url,email_addresses} = event.data;
        const currUser = {
            name: `${first_name || ""} ${last_name || ""}`,
            email: email_addresses[0].email_address,
            profilePhoto: image_url,
            clerkId: id
        };
        await User.create(currUser);
    }

)
const delete_user = inngest.createFunction(
    {id: "delete-user"},
    {event: "clerk/user.deleted"},
    async (event)=>{
        await connectDb();
        const {id} = event.data;
        await User.deleteOne({clerkId: id})
    }

)
export const functions = [sync_user,delete_user];