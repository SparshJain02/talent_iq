import express from "express"
import { protectRoute } from "../middlewares/protectedRoute.js";
import { createSession, endSession, getActiveSessions, getMyRecentSessions, getSessionById, joinSession } from "../controllers/sessionController.js";
const Router = express.Router();

Router.post("/",protectRoute,createSession)
Router.get("/active",protectRoute,getActiveSessions)
Router.get("/my-recent",protectRoute,getMyRecentSessions)

Router.get("/:id",protectRoute,getSessionById);
Router.post("/:id/join",protectRoute,joinSession);
Router.post("/:id/end",protectRoute,endSession);

export default Router;