import { useState, useEffect } from "react"; 
import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import RequireAuth from "./components/common/RequireAuth";
import HomePage from "./features/catalog/pages/HomePage";
import ExpansionDetailPage from "./features/catalog/pages/ExpansionDetailPage";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/registerPage";
import SubscriptionForm from "./features/beta/components/subscriptionForm";
import ChallengesPage from "./features/challenges/pages/ChallengesPage";
import { getExpansionPacks } from "./features/catalog/services/expansionsService";
import { useTranslation } from "react-i18next";
import ProfileLayout from "./features/profile/pages/ProfileLayout";
import ProfileInfoTab from "./features/profile/pages/ProfileInfoTab";
import ProfileChallengesTab from "./features/profile/pages/ProfileChallengesTab";
import ProfilePurchasesTab from "./features/profile/pages/ProfilePurchasesTab";
import ProfileSettingsTab from "./features/profile/pages/ProfileSettingsTab";
import NotFoundPage from "./pages/NotFoundPage";
import axios from "axios";
import i18n from "./i18n/i18n";
import Navbar from "./components/layout/navbar.jsx";
import Hero from "./components/layout/hero.jsx";
import Card from "./components/layout/card.jsx";
import Footer from "./components/layout/footer.jsx";

// sincroniza idioma con backend
i18n.on("languageChanged", (lng) => {
  axios.defaults.headers.common["Accept-Language"] = lng;
});

function App() {
  const [showForm, setShowForm] = useState(false);
  const [packs, setPacks] = useState([]);
  const [loadingPacks, setLoadingPacks] = useState(true);
  const [packsError, setPacksError] = useState("");
  const { t } = useTranslation("catalog");

  useEffect(() => {
    getExpansionPacks()
      .then(setPacks)
      .catch((err) => setPacksError(err.message))
      .finally(() => setLoadingPacks(false));
  }, []);

  return (
    <>
      <Navbar abrirFormulario={() => setShowForm(true)} />

      <Hero onExploreClick={() => {
        const catalogSection = document.getElementById("catalogo");
        if (catalogSection) {
          catalogSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }} />

      <section
        id="catalogo"
        className="w-[90%] mx-auto my-[60px] flex justify-center flex-wrap gap-[30px] px-5 py-[30px] md:p-[70px] bg-bg transition-colors duration-400"
      >
        {loadingPacks ? (
          <p className="text-text w-full text-center py-10">{t("loading")}</p>
        ) : packsError ? (
          <p className="text-text w-full text-center py-10">{packsError || t("error")}</p>
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

      {showForm && (
        <SubscriptionForm cerrarFormulario={() => setShowForm(false)} />
      )}

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

      <Footer />
    </>
  );
}

export default App;
