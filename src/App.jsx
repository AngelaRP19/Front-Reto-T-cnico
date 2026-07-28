import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./features/catalog/pages/HomePage";
import ExpansionDetailPage from "./features/catalog/pages/ExpansionDetailPage";
import ChallengesPage from "./features/challenges/pages/ChallengesPage";
import LoginPage from "./features/auth/pages/loginPage";
import RegisterPage from "./features/auth/pages/registerPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogo/:packId" element={<ExpansionDetailPage />} />
        <Route path="/comunidad" element={<ChallengesPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
