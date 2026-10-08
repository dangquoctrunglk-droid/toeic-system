import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

/**
 * ==============================================================================
 * CONTEXT: UIContext.tsx
 * MỤC ĐÍCH: Quản lý trạng thái giao diện toàn cục (Navbar, Footer, Chế độ Luyện tập / Học ngay)
 * TÍNH NĂNG:
 *   - isPracticeMode: Khi vào "Học ngay" hoặc "Luyện tập", tự động ẩn Navbar để tập trung làm bài
 *   - isNavbarVisible: Bật / tắt thanh điều hướng chính
 *   - isFooterVisible: Bật / tắt chân trang
 * ==============================================================================
 */

export interface UIContextType {
  isNavbarVisible: boolean;
  setIsNavbarVisible: (visible: boolean) => void;
  hideNavbar: () => void;
  showNavbar: () => void;
  isPracticeMode: boolean;
  setIsPracticeMode: (practicing: boolean) => void;
  isFooterVisible: boolean;
  setIsFooterVisible: (visible: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isNavbarExplicitlyVisible, setIsNavbarExplicitlyVisible] =
    useState<boolean>(true);
  const [isPracticeMode, setIsPracticeMode] = useState<boolean>(false);
  const [isFooterVisible, setIsFooterVisible] = useState<boolean>(true);

  const hideNavbar = useCallback(() => setIsNavbarExplicitlyVisible(false), []);
  const showNavbar = useCallback(() => setIsNavbarExplicitlyVisible(true), []);

  // Nếu đang ở chế độ Luyện tập / Học ngay (isPracticeMode = true), Navbar luôn tự động ẩn
  const isNavbarVisible = isPracticeMode ? false : isNavbarExplicitlyVisible;

  const value = useMemo(
    () => ({
      isNavbarVisible,
      setIsNavbarVisible: setIsNavbarExplicitlyVisible,
      hideNavbar,
      showNavbar,
      isPracticeMode,
      setIsPracticeMode,
      isFooterVisible: isPracticeMode ? false : isFooterVisible,
      setIsFooterVisible,
    }),
    [isNavbarVisible, isPracticeMode, isFooterVisible, hideNavbar, showNavbar],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within an UIProvider");
  }
  return context;
};

export default UIContext;
