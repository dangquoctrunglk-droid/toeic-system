import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import { env } from "../config/enviroment.js";
import jwt from "jsonwebtoken";
import { loginUser, registerUser } from "../service/authService.js";

//
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Vui lòng nhập đầy đủ thông tin" });
      return;
    }
    const user = await registerUser(fullName, email, password);
    res.status(StatusCodes.CREATED).json({
      message: "Đăng ký thành công",
      user,
    });
  } catch (error: any) {
    console.error("Lỗi đăng ký:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Lỗi server khi đăng ký",
      error: error?.message || error,
    });
  }
};

//
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Vui lòng nhập đầy đủ thông tin" });
      return;
    }
    const data = await loginUser(email, password);

    res.status(StatusCodes.OK).json({
      message: "Đăng nhập thành công",
      ...data,
    });
  } catch (error: any) {
    console.error("Lỗi đăng nhập:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Lỗi server khi đăng nhập",
      error: error?.message || error,
    });
  }
};
