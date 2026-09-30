import z from "zod";
/**
 * Schema Validate Đăng ký tài khoản (hỗ trợ cả fullName hoặc name từ client)
 */
export const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Họ và tên phải có ít nhất 2 ký tự")
      .max(50, "Họ và tên tối đa 50 ký tự")
      .optional(),
    name: z
      .string()
      .trim()
      .min(2, "Họ và tên phải có ít nhất 2 ký tự")
      .max(50, "Họ và tên tối đa 50 ký tự")
      .optional(),
    email: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập địa chỉ email")
      .email("Địa chỉ email không đúng định dạng"),
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(/[A-Za-z]/, "Mật khẩu phải chứa ít nhất 1 chữ cái")
      .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 chữ số"),
    confirmPassword: z.string().optional(),
    agreeTerms: z.boolean().optional(),
  })
  .refine((data) => Boolean(data.fullName || data.name), {
    message: "Vui lòng nhập họ và tên của bạn",
    path: ["fullName"],
  })
  .transform((data) => ({
    ...data,
    fullName: (data.fullName || data.name)!.trim(),
  }));

export type SignupInput = z.infer<typeof signupSchema>;
/**
 * Schema Validate Đăng nhập
 */

export const signinSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập địa chỉ email")
    .email("Địa chỉ email không đúng định dạng"),
  otp: z
    .string()
    .trim()
    .length(6, "Mã OTP phải có đúng 6 chữ số")
    .regex(/^\d+$/, "Mã OTP chỉ bao gồm chữ số"),
});

/**
 * Schema Validate Quên mật khẩu - Gửi mã OTP
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập địa chỉ email")
    .email("Địa chỉ email không đúng định dạng"),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
/**
 * Schema Validate Xác thực mã OTP
 */
export const verifyOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập địa chỉ email")
    .email("Địa chỉ email không đúng định dạng"),
  otp: z
    .string()
    .trim()
    .length(6, "Mã OTP phải có đúng 6 chữ số")
    .regex(/^\d+$/, "Mã OTP chỉ bao gồm chữ số"),
});
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
/**
 * Schema Validate Đặt lại mật khẩu mới
 */
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập địa chỉ email")
    .email("Địa chỉ email không đúng định dạng"),
  otp: z
    .string()
    .trim()
    .length(6, "Mã OTP phải có đúng 6 chữ số")
    .regex(/^\d+$/, "Mã OTP chỉ bao gồm chữ số"),
  newPassword: z
    .string()
    .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự")
    .regex(/[A-Za-z]/, "Mật khẩu mới phải chứa ít nhất 1 chữ cái")
    .regex(/[0-9]/, "Mật khẩu mới phải chứa ít nhất 1 chữ số"),
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
