import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  googleLoginUser,
  requestForgotPassword,
  resetPassword,
  signinUser,
  signupUser,
  verifyOtp,
} from "../services/authService.js";

// Đăng ký tài khoản
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Vui lòng nhập đầy đủ thông tin" });
      return;
    }
    const user = await signupUser(fullName, email, password);
    res.status(StatusCodes.CREATED).json({
      message: "Đăng ký thành công",
      user,
    });
  } catch (error: any) {
    const isConflict = error?.message?.includes("đã được sử dụng");
    res.status(isConflict ? StatusCodes.CONFLICT : StatusCodes.BAD_REQUEST).json({
      message: error?.message || "Lỗi khi đăng ký tài khoản",
    });
  }
};

// Đăng nhập tài khoản
export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Vui lòng nhập đầy đủ thông tin" });
      return;
    }
    const data = await signinUser(email, password);

    res.status(StatusCodes.OK).json({
      message: "Đăng nhập thành công",
      ...data,
    });
  } catch (error: any) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: error?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!",
    });
  }
};

// Quên mật khẩu - Gửi mã OTP
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Vui lòng cung cấp địa chỉ email" });
      return;
    }
    const result = await requestForgotPassword(email);
    res.status(StatusCodes.OK).json(result);
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: error?.message || "Không thể xử lý yêu cầu quên mật khẩu",
    });
  }
};

// Kiểm tra xác thực mã OTP trước khi đổi mật khẩu
export const verifyOtpController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Vui lòng nhập đầy đủ Email và mã OTP",
      });
      return;
    }
    const result = await verifyOtp(email, otp);
    res.status(StatusCodes.OK).json(result);
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: error?.message || "Mã OTP không hợp lệ",
    });
  }
};

// Đặt lại mật khẩu mới với mã OTP
export const resetPasswordController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Vui lòng nhập đầy đủ Email, mã OTP và mật khẩu mới",
      });
      return;
    }
    const result = await resetPassword(email, otp, newPassword);
    res.status(StatusCodes.OK).json(result);
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: error?.message || "Đặt lại mật khẩu thất bại",
    });
  }
};

// Đăng nhập / Đăng ký qua Google
export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await googleLoginUser(req.body);
    res.status(StatusCodes.OK).json({
      message: "Đăng nhập Google thành công",
      ...data,
    });
  } catch (error: any) {
    console.error("Lỗi đăng nhập Google:", error);
    res.status(StatusCodes.BAD_REQUEST).json({
      message: error?.message || "Đăng nhập Google thất bại",
    });
  }
};
