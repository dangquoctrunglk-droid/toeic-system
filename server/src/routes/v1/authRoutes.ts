import { Router } from "express";
import {
  forgotPassword,
  googleLogin,
  resetPasswordController,
  signin,
  signup,
  verifyOtpController,
} from "../../controllers/authController.js";
import { validateData } from "../../middlewares/validationMiddleware.js";
import {
  signinSchema,
  signupSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
} from "../../validations/authValidation.js";

export const authRoute = Router();
authRoute.post("/signup", validateData(signupSchema), signup);
authRoute.post("/signin", validateData(signinSchema), signin);
authRoute.post(
  "/forgot-password",
  validateData(forgotPasswordSchema),
  forgotPassword,
);
authRoute.post(
  "/verify-otp",
  validateData(verifyOtpSchema),
  verifyOtpController,
);
authRoute.post(
  "/reset-password",
  validateData(resetPasswordSchema),
  resetPasswordController,
);
authRoute.post("/google", googleLogin);
