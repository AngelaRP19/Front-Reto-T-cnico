import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";
import { activateLocale } from "./i18n"; // tu configuración de Lingui

// importa tus componentes
import Navbar from "./components/layout/Navbar";
import Hero from "./components/layout/Hero";
import Card from "./components/layout/Card";
import SubscriptionForm from "./features/beta/components/subscriptionForm";
import MainLayout from "./components/layout/MainLayout";
import RequireAuth from "./components/common/RequireAuth";
import HomePage from "./features/catalog/pages/HomePage";
import ExpansionDetailPage from "./features/catalog/pages/ExpansionDetailPage";
import ChallengesPage from "./features/challenges/pages/ChallengesPage";
import ProfileLayout from "./features/profile/pages/ProfileLayout";
import ProfileInfoTab from "./features/profile/pages/ProfileInfoTab";
import ProfileChallengesTab from "./features/profile/pages/ProfileChallengesTab";
import ProfilePurchasesTab from "./features/profile/pages/ProfilePurchasesTab";
import ProfileSettingsTab from "./features/profile/pages/ProfileSettingsTab";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";
import NotFoundPage from "./pages/NotFoundPage";
import Footer from "./components/layout/Footer";

import { getExpansionPacks } from "./features/catalog/services/expansionsService";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [packs, setPacks] = useState([]);
  const [loadingPacks, setLoadingPacks] = useState(true);
  const [packsError, setPacksError] = useState("");

  useEffect(() => {
    getExpansionPacks()
      .then(setPacks)
      .catch((err) => setPacksError(err.message))
      .finally(() => setLoadingPacks(false));
  }, []);

  // activar idioma inicial (ejemplo: inglés)
  useEffect(() => {
    activateLocale("es");
  }, []);

  return (
    <I18nProvider i18n={i18n}>
      <Navbar abrirFormulario={() => setShowForm(true)} />

      <Hero
        onExploreClick={() => {
          const catalogSection = document.getElementById("catalogo");
          if (catalogSection) {
            catalogSection.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }}
      />

      <section
        id="catalogo"
        className="w-[90%] mx-auto my-[60px] flex justify-center flex-wrap gap-[30px] px-5 py-[30px] md:p-[70px] bg-bg transition-colors duration-400"
      >
        {loadingPacks ? (
          <p className="text-text w-full text-center py-10">Loading...</p>
        ) : packsError ? (
          <p className="text-text w-full text-center py-10">{packsError || "Error"}</p>
        ) : (
          packs.map((pack) => (
            <div key={pack.id} className="cursor-pointer">
              <Card
                plataforma={pack.platform}
                titulo={pack.title}
                precio={pack.price}
                image={pack.image}
              />
            </div>
          ))
        )}
      </section>

      {showForm && <SubscriptionForm cerrarFormulario={() => setShowForm(false)} />}

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
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />
    </I18nProvider>
  );
}

export default App;
