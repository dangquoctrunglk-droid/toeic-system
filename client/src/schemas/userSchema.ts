import { z } from "zod";

/**
 * Schema Validate Form Thông tin cá nhân & Kế hoạch học tập TOEIC
 */
export const profileInfoSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập họ và tên")
    .min(2, "Họ và tên tối thiểu 2 ký tự")
    .max(50, "Họ và tên tối đa 50 ký tự"),
  phoneNumber: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) =>
        !val ||
        /^(0|\+84|84)?[35789][0-9]{8}$/.test(val.replace(/[\s.-]/g, "")),
      { message: "Số điện thoại không hợp lệ (Ví dụ: 0342 777 164)" },
    ),
  birthDate: z.string().optional().or(z.literal("")),
  gender: z.enum(["male", "female", "other"], {
    message: "Vui lòng chọn giới tính",
  }),
  currentScore: z
    .number({ message: "Điểm thi thử phải là chữ số" })
    .min(0, "Điểm thi thử tối thiểu 0")
    .max(990, "Điểm thi thử tối đa 990"),
  targetScore: z
    .number({ message: "Điểm mục tiêu phải là chữ số" })
    .min(0, "Điểm mục tiêu tối thiểu 0")
    .max(990, "Điểm mục tiêu tối đa 990"),
  examDate: z.string().optional().or(z.literal("")),
  dailyMinutes: z
    .number({ message: "Thời gian học mỗi ngày phải là số phút" })
    .min(15, "Thời gian học tối thiểu 15 phút/ngày")
    .max(360, "Thời gian học tối đa 360 phút/ngày"),
});

export type ProfileInfoSchemaType = z.infer<typeof profileInfoSchema>;

/**
 * Schema Validate Form Đổi mật khẩu trong Profile
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(1, "Vui lòng nhập mật khẩu mới")
      .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự")
      .regex(/[A-Za-z]/, "Mật khẩu phải chứa ít nhất 1 chữ cái")
      .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 chữ số"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận lại mật khẩu mới"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Xác nhận mật khẩu mới không khớp!",
    path: ["confirmPassword"],
  });

export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;
