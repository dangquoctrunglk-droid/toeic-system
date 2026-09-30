import { GoogleOAuthProvider } from "@react-oauth/google";
import { MainLayout } from "./layouts/mainLayout";
import HomePage from "./pages/home/HomePage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import HistoryPage from "./pages/history/HistoryPage";
import ProfilePage from "./pages/profile/ProfilePage";
import UserPage from "./pages/user/UserPage";
import ListeningPage from "./pages/listening/ListeningPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, ThemeProvider, useTheme } from "./context";
import { env } from "./config/environment";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AppToastContainer = () => {
  const { isDarkMode } = useTheme();
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={isDarkMode ? "dark" : "light"}
    />
  );
};

function App() {
  return (
    <GoogleOAuthProvider clientId={env.GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <AppToastContainer />
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/user" element={<UserPage />} />
                <Route path="/listening" element={<ListeningPage />} />
                <Route path="/auth/signin" element={<HomePage />} />
                <Route path="/auth/signup" element={<HomePage />} />
                <Route path="/auth/forgot-password" element={<HomePage />} />
                <Route path="/auth/reset-password" element={<HomePage />} />
              </Route>
            </Routes>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
