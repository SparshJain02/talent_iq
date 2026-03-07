import express from "express"
import path from "path"
import { ENV } from "./lib/env.js";
import { connectDb } from "./lib/db.js";
import {serve} from "inngest/express"
import { inngest,functions } from "./lib/inngest.js";
import { clerkMiddleware, requireAuth } from '@clerk/express' // adds req.auth.userId
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
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
// routes
app.use("/api/chat",chatRoutes);
app.use("/api/sessions",sessionRoutes);

app.use("/debug",(req,res)=>{
    console.log(req.headers.cookie);
    console.log(req.headers.authorization);
    res.json({ cookies: req.headers.cookie, auth: req.headers.authorization });
})

// await connectDb();
// export default app;
app.listen(ENV.PORT, async () => {
    await connectDb();
    console.log("server is running on port" , ENV.PORT)
})

// // make our app ready for deployment
// if (ENV.NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname, "../frontend/dist")));

//     // if none of the server routes match the request then follows our react app 
//     app.get("/{*any}", (req, res) => {
//         res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
//     })
// }
