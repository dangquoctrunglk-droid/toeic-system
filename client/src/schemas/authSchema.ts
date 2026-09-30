import { z } from "zod";

/**
 * Schema Validate Form Đăng ký tài khoản
 */
export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập họ và tên")
      .min(2, "Họ và tên phải có ít nhất 2 ký tự")
      .max(50, "Họ và tên tối đa 50 ký tự"),
    email: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập địa chỉ email")
      .email("Địa chỉ email không đúng định dạng"),
    password: z
      .string()
      .min(1, "Vui lòng nhập mật khẩu")
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(/[A-Za-z]/, "Mật khẩu phải chứa ít nhất 1 chữ cái")
      .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 chữ số"),
    confirmPassword: z.string().min(1, "Vui lòng nhập lại mật khẩu để xác nhận"),
    agreeTerms: z
      .boolean()
      .refine((val) => val === true, "Bạn phải đồng ý với Điều khoản dịch vụ để tiếp tục"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type SignupSchemaType = z.infer<typeof signupSchema>;

/**
 * Schema Validate Form Đăng nhập tài khoản
 */
export const signinSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập địa chỉ email")
    .email("Địa chỉ email không đúng định dạng"),
  password: z
    .string()
    .min(1, "Vui lòng nhập mật khẩu"),
  rememberMe: z.boolean().optional(),
});

export type SigninSchemaType = z.infer<typeof signinSchema>;

/**
 * Schema Validate Form Quên mật khẩu
 */
export const forgotPasswordEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập địa chỉ email")
    .email("Địa chỉ email không đúng định dạng"),
});

export type ForgotPasswordEmailSchemaType = z.infer<typeof forgotPasswordEmailSchema>;

/**
 * Schema Validate Xác thực OTP
 */
export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .trim()
    .length(6, "Mã OTP phải có đúng 6 chữ số")
    .regex(/^\d+$/, "Mã OTP chỉ bao gồm chữ số"),
});

export type VerifyOtpSchemaType = z.infer<typeof verifyOtpSchema>;

/**
 * Schema Validate Đặt lại mật khẩu mới
 */
export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "Vui lòng nhập mật khẩu mới")
      .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự")
      .regex(/[A-Za-z]/, "Mật khẩu phải chứa ít nhất 1 chữ cái")
      .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 chữ số"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
