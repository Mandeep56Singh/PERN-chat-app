import express, { RequestHandler } from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login as RequestHandler);
router.post("/signup", signup as RequestHandler);
router.post("/logout", logout as RequestHandler);

export default router;
