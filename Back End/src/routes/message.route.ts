import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.middleware.js";
import { sendMessage } from "../controllers/message.controller.js";

const router = express.Router();
router.post("/send/:id", protectedRoute, sendMessage)

export default router;
