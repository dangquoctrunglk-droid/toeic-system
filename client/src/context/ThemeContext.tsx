/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

/**
 * ==============================================================================
 * CONTEXT: ThemeContext
 * MỤC ĐÍCH: Quản lý chế độ giao diện Sáng (Light) / Tối (Dark) trên toàn hệ thống
 * TÍNH NĂNG:
 *   1. Tự động đọc và lưu trạng thái vào localStorage ("toeic_theme")
 *   2. Cập nhật class "light" / "dark" và thuộc tính data-theme lên thẻ <html>
 *   3. Cung cấp hàm toggleTheme() và biến isDarkMode cho toàn bộ components
 * ==============================================================================
 */

export type Theme = "light" | "dark";

export interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "toeic_theme";

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Khởi tạo theme từ localStorage, mặc định là "dark" (Giao diện chuẩn TOEIC Master AI)
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (saved === "light" || saved === "dark") {
      return saved;
    }
    return "dark";
  });

  // Chuyển đổi qua lại giữa light và dark
  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_STORAGE_KEY, next);
      return next;
    });
  }, []);

  // Thiết lập theme cụ thể
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  }, []);

  // Đồng bộ class lên thẻ <html> khi theme thay đổi
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
      root.style.colorScheme = "light";
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
      root.setAttribute("data-theme", "dark");
      root.style.colorScheme = "dark";
    }
  }, [theme]);

  const value = useMemo<ThemeContextType>(
    () => ({
      theme,
      isDarkMode: theme === "dark",
      toggleTheme,
      setTheme,
    }),
    [theme, toggleTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Custom hook useTheme để lấy trạng thái và hàm đổi theme
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme phải được sử dụng bên trong <ThemeProvider />");
  }
  return context;
};

export default ThemeContext;
