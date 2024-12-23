import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.middleware.js";
import { sendMessage,getMessage } from "../controllers/message.controller.js";

const router = express.Router();
router.post("/send/:id", protectedRoute, sendMessage)
router.get("/:id", protectedRoute, getMessage)


export default router;
