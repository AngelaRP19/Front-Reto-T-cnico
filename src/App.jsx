import { Routes, Route } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";
import RequireAuth from "./components/common/RequireAuth";
import HomePage from "./features/catalog/pages/HomePage";
import ExpansionDetailPage from "./features/catalog/pages/ExpansionDetailPage";
import ChallengesPage from "./features/challenges/pages/ChallengesPage";
import ProfileLayout from "./features/profile/pages/ProfileLayout";
import ProfileInfoTab from "./features/profile/pages/ProfileInfoTab";
import ProfileChallengesTab from "./features/profile/pages/ProfileChallengesTab";
import ProfilePurchasesTab from "./features/profile/pages/ProfilePurchasesTab";
import ProfileBetaTestingTab from "./features/profile/pages/ProfileBetaTestingTab";
import ProfileSettingsTab from "./features/profile/pages/ProfileSettingsTab";
import LoginPage from "./features/auth/pages/loginPage";
import RegisterPage from "./features/auth/pages/registerPage";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";
import CompleteProfilePage from "./features/auth/pages/CompleteProfilePage";
import OAuthProfileGate from "./features/auth/components/OAuthProfileGate";
import NotFoundPage from "./pages/NotFoundPage";
import { CartPage } from "./features/cart/CartPage";

function App() {
  return (
    <>
      <OAuthProfileGate />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo/:packId" element={<ExpansionDetailPage />} />
          <Route path="/comunidad" element={<ChallengesPage />} />
          <Route
            path="/carrito"
            element={
              <RequireAuth>
                <CartPage />
              </RequireAuth>
            }
          />
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
            <Route path="beta-testing" element={<ProfileBetaTestingTab />} />
            <Route path="configuracion" element={<ProfileSettingsTab />} />
          </Route>
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route
          path="/completar-perfil"
          element={
            <RequireAuth>
              <CompleteProfilePage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;