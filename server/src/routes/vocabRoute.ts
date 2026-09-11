import { Router } from "express";
import {
  getVocabularies,
  createVocabulary,
} from "../controllers/vocabController.js";
import { requireAdmin, verifyToken } from "../middlewares/authMiddleware.js";

export const vocabRoute = Router();
vocabRoute.get("/", getVocabularies);
vocabRoute.post("/", verifyToken, requireAdmin, createVocabulary);
