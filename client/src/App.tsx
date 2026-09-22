import { GoogleOAuthProvider } from "@react-oauth/google";
import { MainLayout } from "./layouts/mainLayout";
import HomePage from "./pages/home/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context";
import { env } from "./config/enviroment";

function App() {
  return (
    <GoogleOAuthProvider clientId={env.GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth/signin" element={<HomePage />} />
              <Route path="/auth/signup" element={<HomePage />} />
              <Route path="/auth/forgot-password" element={<HomePage />} />
              <Route path="/auth/reset-password" element={<HomePage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
