import type React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, LayoutDashboard, User } from "lucide-react";
import { useAuth, useTheme } from "../../context";
import {
  UserProfile,
} from "../../modules/user";
import {
  STUDY_GOAL_STORAGE_KEY,
  DEFAULT_STUDY_GOAL,
  type UserStudyGoal,
} from "../../modules/dashboard";

/**
 * ==============================================================================
 * TRANG NGƯỜI DÙNG: UserPage.tsx (/user hoặc /profile)
 * MỤC ĐÍCH: Trang chuyên biệt hiển thị & quản lý Hồ sơ người dùng và cài đặt:
 *   - Thanh điều hướng Breadcrumb quay về Dashboard
 *   - Nhúng UserProfile module hóa chuyên sâu
 * ==============================================================================
 */

export const UserPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !user) {
      navigate("/");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  // Key lưu trữ mục tiêu học tập theo từng tài khoản
  const userStorageKey = user?.email
    ? `${STUDY_GOAL_STORAGE_KEY}_${user.email}`
    : STUDY_GOAL_STORAGE_KEY;

  // Khởi tạo trạng thái mục tiêu từ localStorage
  const [studyGoal, setStudyGoal] = useState<UserStudyGoal>(() => {
    try {
      const saved = localStorage.getItem(userStorageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return DEFAULT_STUDY_GOAL;
  });

  const handleSaveGoal = (newGoal: UserStudyGoal) => {
    setStudyGoal(newGoal);
    try {
      localStorage.setItem(userStorageKey, JSON.stringify(newGoal));
    } catch {
      // ignore
    }
  };

  return (
    <div
      className={`min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 xl:px-12 transition-colors duration-200 ${
        isDarkMode ? "text-slate-100" : "text-slate-900"
      }`}
    >
      <div className="max-w-[1300px] mx-auto">
        {/* THANH ĐIỀU HƯỚNG BREADCRUMB */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/dashboard"
            className={`inline-flex items-center gap-2 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-xl border transition-all ${
              isDarkMode
                ? "bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
                : "bg-white border-slate-200 text-slate-700 hover:text-indigo-600 hover:bg-slate-50 shadow-sm"
            }`}
          >
            <ArrowLeft size={15} />
            <span>Quay lại Bảng điều khiển</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link
              to="/dashboard"
              className="hover:text-indigo-400 transition-colors flex items-center gap-1"
            >
              <LayoutDashboard size={13} />
              <span>Dashboard</span>
            </Link>
            <span>/</span>
            <span className="text-purple-500 font-bold flex items-center gap-1">
              <User size={13} />
              <span>Hồ sơ cá nhân</span>
            </span>
          </div>
        </div>

        {/* NỘI DUNG USER PROFILE ĐƯỢC MODULE HÓA */}
        <UserProfile
          goal={studyGoal}
          onSaveGoal={handleSaveGoal}
        />
      </div>
    </div>
  );
};

export default UserPage;
