import { Router } from "express";
import {
  createQuestion,
  getQuestionById,
  getQuestions,
} from "../controllers/questionController.js";
import { requireAdmin, verifyToken } from "../middlewares/authMiddleware.js";

export const questionRoutes = Router();

questionRoutes.get("/", getQuestions);
questionRoutes.get("/:id", getQuestionById);
questionRoutes.post("/", verifyToken, requireAdmin, createQuestion);
