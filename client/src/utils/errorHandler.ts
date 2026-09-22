import axios from "axios";

/**
 * Trích xuất thông báo lỗi an toàn từ response Axios hoặc Error object
 */
export const getErrorMessage = (
  error: unknown,
  fallbackMessage: string = "Đã xảy ra lỗi, vui lòng thử lại!",
): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallbackMessage;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return fallbackMessage;
};
