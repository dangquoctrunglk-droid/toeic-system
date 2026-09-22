/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { authService } from "../services/authService";
import type {
  User,
  SigninInputs,
  SignupInputs,
  AuthResponse,
} from "../types/authTypes";

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signin: (
    credentials: SigninInputs,
    rememberMe?: boolean,
  ) => Promise<AuthResponse>;
  signup: (data: SignupInputs) => Promise<AuthResponse>;
  loginWithGoogle: (
    data: import("../types/authTypes").GoogleAuthInputs,
    rememberMe?: boolean,
  ) => Promise<AuthResponse>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Khởi tạo trạng thái xác thực từ storage
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser());
  const [token, setToken] = useState<string | null>(() => authService.getToken());
  const [isLoading] = useState<boolean>(false);

  // Hàm xử lý đăng nhập
  const signin = useCallback(
    async (
      credentials: SigninInputs,
      rememberMe: boolean = true,
    ): Promise<AuthResponse> => {
      const data = await authService.signin(credentials, rememberMe);
      if (data.token) {
        setToken(data.token);
      }
      if (data.user) {
        setUser(data.user);
      }
      return data;
    },
    [],
  );

  // Hàm xử lý đăng ký
  const signup = useCallback(
    async (formData: SignupInputs): Promise<AuthResponse> => {
      const data = await authService.signup(formData);
      if (data.token) {
        setToken(data.token);
      }
      if (data.user) {
        setUser(data.user);
      }
      return data;
    },
    [],
  );

  // Hàm xử lý đăng nhập bằng Google
  const loginWithGoogle = useCallback(
    async (
      data: import("../types/authTypes").GoogleAuthInputs,
      rememberMe: boolean = true,
    ): Promise<AuthResponse> => {
      const response = await authService.loginWithGoogle(data, rememberMe);
      if (response.token) {
        setToken(response.token);
      }
      if (response.user) {
        setUser(response.user);
      }
      return response;
    },
    [],
  );

  // Hàm xử lý đăng xuất
  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = useMemo(() => Boolean(token), [token]);

  // Tối ưu hóa giá trị Context để hạn chế re-render không cần thiết
  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isAuthenticated,
      isLoading,
      signin,
      signup,
      loginWithGoogle,
      logout,
      setUser,
    }),
    [user, token, isAuthenticated, isLoading, signin, signup, loginWithGoogle, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook useAuth để truy xuất AuthContext an toàn & tiện lợi
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong <AuthProvider />");
  }
  return context;
};

export default AuthContext;
