import { Router } from "express";
import { authRoute } from "./authRoutes.js";
import { vocabRoute } from "./vocabRoute.js";
import { questionRoutes } from "./questionRoutes.js";
import { examRoutes } from "./examRoutes.js";
import { resultRoute } from "./resultRoutes.js";
import { writingRoute } from "./writingRoutes.js";

const router = Router();

router.use("/auth", authRoute);
router.use("/vocabularies", vocabRoute);
router.use("/questions", questionRoutes);
router.use("/exams", examRoutes);
router.use("/results", resultRoute);
router.use("/writings", writingRoute);

export const apiV1 = router;
export * from "./authRoutes.js";
export * from "./vocabRoute.js";
export * from "./questionRoutes.js";
export * from "./examRoutes.js";
export * from "./resultRoutes.js";
export * from "./writingRoutes.js";
