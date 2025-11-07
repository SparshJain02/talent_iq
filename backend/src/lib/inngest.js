import {Inngest} from "inngest"
import { connectDb } from "./db.js"
import { User } from "../models/User.js"

export const inngest = new Inngest({ id: "talent-iq" });

const sync_user = inngest.createFunction(
    {id: "sync-user"},
    {event: "webhook-integration/user.created"},
    async ({event})=>{
        try {
            // Ensure DB connection (server also connects on startup)
            await connectDb();
            const {email_addresses,first_name,id,image_url,last_name} = event.data;
            const currUser = {
                name: `${first_name || ""} ${last_name || ""}`.trim(),
                email: email_addresses[0]?.email_address, // email_addresses[0]["email_address"]
                profilePhoto: image_url,
                clerkId: id
            };

            const created = await User.create(currUser);
            console.log('sync-user: user created', created._id?.toString());
        } catch (err) {
            console.error('sync-user: failed to sync user', err, event?.data);
            throw err;
        }
    }

)
const delete_user = inngest.createFunction(
    {id: "delete-user"},
    {event: "webhook-integration/user.deleted"},
    async (event)=>{
        try {
            await connectDb();
            const {id} = event.data;
            const res = await User.deleteOne({clerkId: id});
        } catch (err) {
            console.error('delete-user: failed to delete user', err, event?.data);
            throw err;
        }
    }

)
export const functions = [sync_user,delete_user];