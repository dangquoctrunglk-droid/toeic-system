import { Router } from "express";
import {
  getWritingExercises,
  submitWriting,
} from "../controllers/writingController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

export const writingRoute = Router();

writingRoute.get("/", getWritingExercises);
writingRoute.post("/submit", verifyToken, submitWriting);
