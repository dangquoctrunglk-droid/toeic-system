import { Router } from "express";
import {
  forgotPassword,
  googleLogin,
  resetPasswordController,
  signin,
  signup,
} from "../../controllers/authController.js";

export const authRoute = Router();
authRoute.post("/signup", signup);
authRoute.post("/signin", signin);
authRoute.post("/forgot-password", forgotPassword);
authRoute.post("/reset-password", resetPasswordController);
authRoute.post("/google", googleLogin);
