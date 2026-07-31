import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import RequireAuth from "./components/common/RequireAuth";
import HomePage from "./features/catalog/pages/HomePage";
import ExpansionDetailPage from "./features/catalog/pages/ExpansionDetailPage";
import ChallengesPage from "./features/challenges/pages/ChallengesPage";
import LoginPage from "./features/auth/pages/loginPage";
import RegisterPage from "./features/auth/pages/registerPage";
import ProfileLayout from "./features/profile/pages/ProfileLayout";
import ProfileInfoTab from "./features/profile/pages/ProfileInfoTab";
import ProfileChallengesTab from "./features/profile/pages/ProfileChallengesTab";
import ProfilePurchasesTab from "./features/profile/pages/ProfilePurchasesTab";
import ProfileSettingsTab from "./features/profile/pages/ProfileSettingsTab";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogo/:packId" element={<ExpansionDetailPage />} />
        <Route path="/comunidad" element={<ChallengesPage />} />
        <Route
          path="/perfil"
          element={
            <RequireAuth>
              <ProfileLayout />
            </RequireAuth>
          }
        >
          <Route index element={<ProfileInfoTab />} />
          <Route path="retos" element={<ProfileChallengesTab />} />
          <Route path="compras" element={<ProfilePurchasesTab />} />
          <Route path="configuracion" element={<ProfileSettingsTab />} />
        </Route>
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
