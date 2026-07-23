import { useState, useEffect } from "react";
import Navbar from "./components/layout/Navbar";
import Hero from "./components/layout/Hero";
import Card from "./components/layout/Card";
import Footer from "./components/layout/Footer";
import ExpansionDetail from "./components/ExpansionDetail";
import LoginPage from "./features/auth/pages/loginPage";
import RegisterPage from "./features/auth/pages/registerPage";
import SubscriptionForm from "./features/beta/components/subscriptionForm";
import { getExpansionPacks } from "./features/catalog/services/expansionsService";

function App() {
  const [view, setView] = useState("home");
  const [selectedPack, setSelectedPack] = useState(null);
  const [returnToCatalog, setReturnToCatalog] = useState(false);
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

  const handleSelectPack = (packData) => {
    setSelectedPack(packData);
    setView("expansion");
  };

  const handleBackToCatalog = () => {
    setReturnToCatalog(true);
    setView("home");
  };

  // Posicionamiento inmediato al volver del detalle
  useEffect(() => {
    if (view === "home" && returnToCatalog) {
      const catalogSection = document.getElementById("catalogo");
      if (catalogSection) {
        catalogSection.scrollIntoView({ behavior: "auto", block: "start" });
      }
      setReturnToCatalog(false);
    }
  }, [view, returnToCatalog]);

  // Vistas condicionales
  if (view === "login") {
    return (
      <LoginPage
        onBack={() => setView("home")}
        onRegisterClick={() => setView("register")}
        onLoginSuccess={() => setView("home")}
      />
    );
  }

  if (view === "expansion") {
    return (
      <>
        <Navbar onLoginClick={() => setView("login")} />
        <ExpansionDetail data={selectedPack} onBack={handleBackToCatalog} />
        <Footer />
      </>
    );
  }

  if (view === "register") {
    return (
      <RegisterPage
        onBack={() => setView("login")}
        onHomeClick={() => setView("home")}
        onRegistered={() => setView("home")}
      />
    );
  }

  return (
    <>
      <Navbar 
        onLoginClick={() => setView("login")}
        abrirFormulario={() => setShowForm(true)} 
      />

      {/* Función para el botón 'Ver catálogo' */}
      <Hero onExploreClick={() => {
        const catalogSection = document.getElementById("catalogo");
        if (catalogSection) {
          catalogSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }} />

      <section id="catalogo" className="w-[90%] mx-auto my-[60px] flex justify-center flex-wrap gap-[30px] px-5 py-[30px] md:p-[70px] bg-bg transition-colors duration-400">

        {loadingPacks ? (
          <p className="text-text w-full text-center py-10">Cargando catálogo...</p>
        ) : packsError ? (
          <p className="text-text w-full text-center py-10">{packsError}</p>
        ) : (
          packs.map((pack) => (
            <div key={pack.id} onClick={() => handleSelectPack(pack)} className="cursor-pointer">
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
        <SubscriptionForm 
          cerrarFormulario={() => setShowForm(false)}
        />
      )}

      <Footer />
    </>
  );
}

export default App;