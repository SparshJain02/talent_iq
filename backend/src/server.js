import express from "express"
import path from "path"
import { ENV } from "./lib/env.js";

const app = express();
const __dirname = path.resolve();

app.get("/admin", (req, res) => {
    res.status(200).send({ message: "Welcome admin!" })
})

app.get("/sparsh", (req, res) => {
    res.status(200).send({ message: "yep that's me..." });
})

app.listen(ENV.PORT, () => {
    console.log("server is running on port" , ENV.PORT)
})
// make our app ready for deployment
if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    // if none of the server routes match the request then follows our react app 
    app.get("/{*any}", (req, res) => {
        console.log("i am here");
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
    })
}
