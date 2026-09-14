import { Router } from "express";
import { requireAdmin, verifyToken } from "../middlewares/authMiddleware.js";
import {
  getAdminDashBoardStats,
  getUserHistory,
} from "../controllers/resultController.js";

export const resultRoute = Router();

resultRoute.get("/history", verifyToken, getUserHistory);
resultRoute.get(
  "/admin/dashboard",
  verifyToken,
  requireAdmin,
  getAdminDashBoardStats,
);
