import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { logout, setBetaTester } from "../../features/auth/services/authService";


function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showBetaConfirm, setShowBetaConfirm] = useState(false);
  const [betaSubmitting, setBetaSubmitting] = useState(false);
  const [betaError, setBetaError] = useState("");
  const { theme, toggleTheme } = useTheme();
  const { user, setUser, clearUser } = useAuth();

  const displayName = user?.firstName || user?.name || user?.username || "";
  const initial = displayName.charAt(0).toUpperCase() || "?";

  const handleLogout = async () => {
    await logout();
    clearUser();
    setShowUserMenu(false);
  };

  const handleBetaButtonClick = () => {
    if (!user) {
      navigate("/register");
      return;
    }
    setBetaError("");
    setShowBetaConfirm((prev) => !prev);
  };

  const handleBetaConfirm = async (accept) => {
    setShowBetaConfirm(false);
    if (!accept) return;

    setBetaSubmitting(true);
    setBetaError("");
    try {
      const updated = await setBetaTester(true);
      setUser({ ...user, ...updated });
    } catch (err) {
      if (err.sessionExpired) clearUser();
      setBetaError(err.message || "No se pudo activar beta testing. Intentá de nuevo.");
    } finally {
      setBetaSubmitting(false);
    }
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-center w-full h-auto md:h-20 p-5 md:px-10 lg:px-[70px] lg:py-0 gap-5 md:gap-0 bg-bg shadow-[0_2px_10px_rgba(0,0,0,0.08)] mb-[30px] ml-auto transition-colors duration-[400ms]">
      <div className="flex items-center gap-[15px] justify-start">
        <div>
          <img
            src="https://res.cloudinary.com/w1jl4sa5/image/upload/v1784825556/Logo_of_The_Sims_4.svg_jagzsl.webp"
            alt="Logo"
            className="w-[120px] h-[120px] m-4 object-contain"
          />
          {/* <h1 className="font-nunito text-[42px] font-extrabold text-main cursor-pointer">The Sims  </h1> */}
        </div>

        </div>

      <button
        type="button"
        className="block lg:hidden text-[2rem] cursor-pointer text-text absolute top-[25px] right-[30px] z-[1200]"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Abrir menú"
        aria-expanded={menuOpen}
      >
        ☰
      </button>

          <nav
        className={`absolute lg:static top-20 left-0 w-full lg:w-auto bg-snd-bg lg:bg-transparent shadow-[0_6px_18px_rgba(0,0,0,0.25)] lg:shadow-none overflow-hidden lg:overflow-visible transition-[max-height,opacity] duration-[400ms] ease-in-out lg:flex lg:items-center lg:gap-10 lg:grow lg:max-h-none lg:opacity-100 lg:pointer-events-auto lg:py-0 lg:transition-none ${
          menuOpen
            ? "max-h-[400px] opacity-100 pointer-events-auto py-[30px]"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col items-center gap-[15px] md:gap-5 lg:flex-row lg:gap-[30px] lg:mr-auto list-none">
          <li><Link to="/" className="no-underline text-text text-lg font-semibold transition-colors duration-300 hover:text-main">Inicio</Link></li>
          <li><Link to="/#catalogo" className="no-underline text-text text-lg font-semibold transition-colors duration-300 hover:text-main">Catálogo</Link></li>
          <li><Link to="/comunidad" className="no-underline text-text text-lg font-semibold transition-colors duration-300 hover:text-main">Comunidad</Link></li>
        </ul>

        <div className="flex items-center gap-4 lg:ml-auto">

  {user?.betaTester ? (
    <span className="px-4 py-2 rounded-full text-sm font-bold text-accent border-2 border-accent bg-accent/10">
      Beta tester
    </span>
  ) : (
    <div className="relative">
      <button
        onClick={handleBetaButtonClick}
        disabled={betaSubmitting}
        className="
          bg-accent
          text-black
          font-semibold
          px-5
          py-3
          rounded-full
          transition-all
          duration-300
          hover:scale-110
          hover:shadow-[0_0_20px_var(--accent-color)]
          hover:-translate-y-1
          active:scale-95
          disabled:opacity-60
          animate-pulse"
      >
        ¿Quieres ser beta tester?
      </button>

      {showBetaConfirm && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-card-bg text-text rounded-xl shadow-lg p-4 z-50 transition-colors duration-300">
          <p className="text-sm font-bold mb-3">¿Quieres suscribirte a beta testing?</p>
          <div className="flex gap-2">
            <button
              onClick={() => handleBetaConfirm(true)}
              className="flex-1 bg-accent text-black rounded-full py-2 text-sm font-bold cursor-pointer"
            >
              Sí, quiero
            </button>
            <button
              onClick={() => handleBetaConfirm(false)}
              className="flex-1 bg-snd-bg text-text rounded-full py-2 text-sm font-bold cursor-pointer"
            >
              No, gracias
            </button>
          </div>
        </div>
      )}

      {betaError && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-card-bg text-text rounded-xl shadow-lg p-3 z-50 transition-colors duration-300">
          <p className="text-red-400 text-xs font-semibold">{betaError}</p>
        </div>
      )}
    </div>
  )}

  {user ? (
    <div className="relative">
      <button
        onClick={() => setShowUserMenu((prev) => !prev)}
        className="w-10 h-10 rounded-full bg-main text-white font-bold flex items-center justify-center hover:bg-hover transition-colors"
        aria-label="Menú de perfil"
      >
        {initial}
      </button>

      {showUserMenu && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-card-bg text-text rounded-xl shadow-lg p-4 z-50 transition-colors duration-300">
          <p className="font-bold text-base mb-1">
            {displayName || "Usuario"}
          </p>
          {user.email && (
            <p className="text-sm opacity-70 mb-1 break-all">{user.email}</p>
          )}
          {user.provider && (
            <p className="text-xs opacity-60 mb-3">Conectado con {user.provider}</p>
          )}
          <button
            onClick={handleLogout}
            className="w-full mt-2 text-sm font-bold text-main hover:text-hover transition-colors text-left"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  ) : (
    <button
      className="bg-main text-white px-[28px] py-[12px] rounded-full font-bold hover:bg-hover transition"
      onClick={() => navigate("/login")}
    >
      Iniciar sesión
    </button>
  )}

  <button
    onClick={toggleTheme}
    className="text-2xl text-accent hover:rotate-12 transition"
  >
    {theme === "light" ? "🌙" : "☀️"}
  </button>

 </div>
      </nav>
    </header>
  );
}

export default Navbar;
