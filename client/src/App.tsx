import { MainLayout } from "./layouts/mainLayout";
import HomePage from "./pages/home/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/login" element={<HomePage />} />
          <Route path="/login" element={<HomePage />} />
          <Route path="/auth/register" element={<HomePage />} />
          <Route path="/register" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
