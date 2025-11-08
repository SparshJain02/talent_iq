import express from "express"
import path from "path"
import { ENV } from "./lib/env.js";
import { connectDb } from "./lib/db.js";
import {serve} from "inngest/express"
import { inngest,functions } from "./lib/inngest.js";
import { clerkMiddleware } from '@clerk/express'
import chatRoutes from "./routes/chatRoutes.js";
import cors from "cors"
const app = express();
const __dirname = path.resolve();

// middlewares
app.use(express.json());
app.use(clerkMiddleware())
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use(cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
}))

app.get("/admin", (req, res) => {
    res.status(200).send({ message: "Welcome admin!" })
})

// routes
app.use("/api/chat",chatRoutes);

app.listen(ENV.PORT, async () => {
    await connectDb();
    console.log("server is running on port" , ENV.PORT)
})

// make our app ready for deployment
if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    // if none of the server routes match the request then follows our react app 
    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
    })
}
