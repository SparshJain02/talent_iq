import dotenv from "dotenv"
dotenv.config({quiet: true}); // this will stop annoying messages in terminal which shows env count and injecting stuff

export const ENV = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    NODE_ENV: process.env.NODE_ENV
}                       