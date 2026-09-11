import type { Request, Response } from "express";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import { env } from "../config/enviroment.js";
import jwt from "jsonwebtoken";

//
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
      return;
    }
    const exitingUser = await User.findOne({ email });
    if (exitingUser) {
      res.status(400).json({ message: "Email đã tồn tại" });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      fullName,
      email,
      passwordHash,
      role: "student",
    });
    res.status(201).json({
      message: "Đăng ký thành công",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    console.error("Lỗi đăng ký:", error);
    res.status(500).json({
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
      res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
      return;
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Tài khoản không tồn tại" });
      return;
    }
    const isMatchPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isMatchPassword) {
      res.status(400).json({ message: "Mật khẩu không chính xác" });
      return;
    }

    const jwtSecret = env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not configured in environment variables");
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, jwtSecret, {
      expiresIn: (env.JWT_EXPIRES_IN as any) || "7d",
    });

    res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Lỗi đăng nhập:", error);
    res.status(500).json({
      message: "Lỗi server khi đăng nhập",
      error: error?.message || error,
    });
  }
};
