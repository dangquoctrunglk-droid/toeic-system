import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { env } from "../config/enviroment.js";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}
// Bắt buộc phải đăng nhập
export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res
      .status(401)
      .json({ message: "Bạn chưa đăng nhập hoặc token không hợp lệ!" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "token không hợp lệ" });
    return;
  }
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    return;
  }
};
// Bắt buộc phải là Admin
export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({
      message: "Bạn không có quyền thực hiện hành động này (Yêu cầu Admin)!",
    });
    return;
  }
  next();
};
