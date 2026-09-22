import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, type IUser } from "../models/User.js";
import { sendOtpEmail } from "./mailService.js";

export const signupUser = async (
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

export const signinUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Email hoặc mật khẩu không chính xác!");
  }

  if (!user.passwordHash) {
    throw new Error(
      "Tài khoản này được đăng ký bằng Google. Vui lòng đăng nhập với Google!",
    );
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
      avatar: user.avatar,
    },
  };
};

// Yêu cầu cấp mã OTP Quên mật khẩu
export const requestForgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Email này chưa được đăng ký trong hệ thống!");
  }

  // Sinh mã OTP 6 số ngẫu nhiên
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

  user.resetPasswordOtp = otp;
  user.resetPasswordExpires = expires;
  await user.save();

  // Gửi email OTP bằng Nodemailer
  const mailResult = await sendOtpEmail(email, otp, user.fullName);

  return {
    message: mailResult.sentByEmail
      ? "Mã xác thực OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư đến (hoặc thư mục Spam)!"
      : "Mã xác thực OTP đã được tạo. Vui lòng kiểm tra email hoặc console server.",
    email,
    devOtp: process.env.NODE_ENV !== "production" ? otp : undefined,
  };
};

// Đặt lại mật khẩu mới bằng OTP
export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string,
) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Không tìm thấy thông tin tài khoản!");
  }

  if (!user.resetPasswordOtp || user.resetPasswordOtp !== otp.trim()) {
    throw new Error("Mã OTP không chính xác. Vui lòng kiểm tra lại!");
  }

  if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
    throw new Error("Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới!");
  }

  const salt = await bcrypt.genSalt(10);
  user.passwordHash = await bcrypt.hash(newPassword, salt);
  user.resetPasswordOtp = null;
  user.resetPasswordExpires = null;
  await user.save();

  return {
    message: "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.",
  };
};

// Đăng nhập hoặc tạo tài khoản bằng Google
export const googleLoginUser = async (data: {
  credential?: string;
  email?: string;
  name?: string;
  picture?: string;
  googleId?: string;
}) => {
  let email = data.email;
  let fullName = data.name;
  let avatar = data.picture;
  let googleId = data.googleId;

  // Nếu frontend gửi Google ID token (JWT)
  if (data.credential) {
    try {
      const decoded: any = jwt.decode(data.credential);
      if (decoded && decoded.email) {
        email = decoded.email;
        fullName = decoded.name || decoded.email.split("@")[0];
        avatar = decoded.picture;
        googleId = decoded.sub;
      }
    } catch (e) {
      console.warn("Không thể giải mã Google Credential:", e);
    }
  }

  if (!email) {
    throw new Error("Không thể xác thực thông tin tài khoản Google (thiếu email)!");
  }

  let user = await User.findOne({ email });

  if (!user) {
    const finalName: string = fullName || email.split("@")[0] || "Học viên TOEIC";
    user = await User.create({
      fullName: finalName,
      email,
      role: "student",
      authType: "google",
      googleId: googleId || null,
      avatar: avatar || null,
    } as any);
  } else {
    let modified = false;
    if (!user.googleId && googleId) {
      user.googleId = googleId;
      modified = true;
    }
    if (!user.avatar && avatar) {
      user.avatar = avatar;
      modified = true;
    }
    if (modified) await user.save();
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
      avatar: user.avatar,
    },
  };
};
