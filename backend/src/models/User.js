import mongoose from "mongoose";
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unqiue: true
    },
    profilePhoto: {
        type: String,
        default: "",
        required: true
    },
    clerkId: {
        type: String,
        required: true,
        unique: true,
    }
    
},{timestamps: true})

export const User = new mongoose.model("User",userSchema);