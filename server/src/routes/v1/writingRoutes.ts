import { Router } from "express";
import {
  getWritingExercises,
  submitWriting,
} from "../../controllers/writingController.js";
import { verifyToken } from "../../middlewares/authMiddleware.js";

export const writingRoute = Router();
export const writingRoutes = writingRoute;

writingRoute.get("/", getWritingExercises);
writingRoute.post("/submit", verifyToken, submitWriting);
