import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, type IUser } from "../models/User.js";

export const registerUser = async (
  fullName: string,
  email: string,
  password: string,
): Promise<Partial<IUser>> => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email này đã được sử dụng!");
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    fullName,
    email,
    passwordHash,
    role: "student",
  });

  return {
    fullName: newUser.fullName,
    email: newUser.email,
    role: newUser.role,
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Email hoặc mật khẩu không chính xác!");
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new Error("Email hoặc mật khẩu không chính xác!");
  }

  const jwtSecret = process.env.JWT_SECRET || "fallback_secret_key";
  const token = jwt.sign({ userId: user._id, role: user.role }, jwtSecret, {
    expiresIn: "7d",
  });

  return {
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  };
};
