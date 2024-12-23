import express, { Express, RequestHandler } from "express";
import {
  getCurrentUser,
  login,
  logout,
  signup,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/protectedRoute.middleware.js";

const router = express.Router();

router.get("/me", protectedRoute, getCurrentUser);
router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);

export default router;
