import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.middleware.js";
import {
  sendMessage,
  getMessage,
  getAllMessageSenders,
} from "../controllers/message.controller.js";

const router = express.Router();
// don't change the order 
router.get("/conversations", protectedRoute, getAllMessageSenders)
router.get("/:id", protectedRoute, getMessage)
router.post("/send/:id", protectedRoute, sendMessage)


export default router;
