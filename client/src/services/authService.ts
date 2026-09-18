import api from "./api";
import type {
  AuthResponse,
  LoginInputs,
  RegisterInputs,
  User,
} from "../types/authTypes";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export const authService = {
  /**
   * Đăng nhập tài khoản
   */
  async login(
    credentials: LoginInputs,
    rememberMe: boolean = true,
  ): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", {
      email: credentials.email,
      password: credentials.password,
    });

    const { token, user } = response.data;

    if (token) {
      if (rememberMe) {
        localStorage.setItem(TOKEN_KEY, token);
        if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
      } else {
        sessionStorage.setItem(TOKEN_KEY, token);
        if (user) sessionStorage.setItem(USER_KEY, JSON.stringify(user));
      }
    }

    return response.data;
  },

  /**
   * Đăng ký tài khoản học viên mới
   */
  async register(
    data: Omit<RegisterInputs, "confirmPassword"> | RegisterInputs,
  ): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    });

    return response.data;
  },

  /**
   * Đăng xuất tài khoản & xóa token
   */
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  },

  /**
   * Lấy token hiện tại từ storage
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  },

  /**
   * Lấy thông tin người dùng hiện tại đang đăng nhập
   */
  getCurrentUser(): User | null {
    const userStr =
      localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  /**
   * Kiểm tra xem người dùng đã đăng nhập hay chưa
   */
  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  },
};

// Xuất các hàm riêng lẻ để thuận tiện import
export const {
  login,
  register,
  logout,
  getToken,
  getCurrentUser,
  isAuthenticated,
} = authService;

export default authService;
