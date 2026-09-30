import type React from "react";
import { useGoogleOneTapLogin } from "@react-oauth/google";
import { useAuth } from "../../context";

/**
 * ==============================================================================
 * COMPONENT: GoogleOneTap
 * MỤC ĐÍCH: Kích hoạt Google One Tap Login hiển thị ở góc trên bên phải màn hình
 *           khi học viên chưa đăng nhập (!isAuthenticated)
 * ==============================================================================
 */
export const GoogleOneTap: React.FC = () => {
  const { isAuthenticated, loginWithGoogle } = useAuth();

  useGoogleOneTapLogin({
    onSuccess: async (credentialResponse) => {
      try {
        if (!credentialResponse.credential) return;

        // Trích xuất thông tin người dùng từ JWT Credential của Google
        let email: string | undefined;
        let name: string | undefined;
        let picture: string | undefined;
        let googleId: string | undefined;

        try {
          const base64Url = credentialResponse.credential.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join(""),
          );
          const decoded = JSON.parse(jsonPayload);
          email = decoded.email;
          name = decoded.name;
          picture = decoded.picture;
          googleId = decoded.sub;
        } catch (e) {
          console.warn("Không thể giải mã client token Google:", e);
        }

        // Đăng nhập / Tạo tài khoản học viên qua Google vào hệ thống
        await loginWithGoogle({
          credential: credentialResponse.credential,
          email,
          name,
          picture,
          googleId,
        });
      } catch (err) {
        console.error("Lỗi đăng nhập Google One Tap:", err);
      }
    },
    onError: () => {
      console.log("Google One Tap đóng hoặc không khả dụng");
    },
    disabled: isAuthenticated,
  });

  return null;
};
