import express from "express"
import { protectRoute } from "../middlewares/protectedRoute.js";
import { getStreamToken } from "../controllers/chatController.js";
const chatRoutes = express.Router();

chatRoutes.post("/token",protectRoute,getStreamToken)

export default chatRoutes;