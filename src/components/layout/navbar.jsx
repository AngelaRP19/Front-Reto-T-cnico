import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { logout } from "../../features/auth/services/authService";


function Navbar({ onLoginClick, abrirFormulario }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, clearUser } = useAuth();

  const displayName = user?.firstName || user?.name || user?.username || "";
  const initial = displayName.charAt(0).toUpperCase() || "?";

  const handleLogout = async () => {
    await logout();
    clearUser();
    setShowUserMenu(false);
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
          <li><a href="#" className="no-underline text-text text-lg font-semibold transition-colors duration-300 hover:text-main">Inicio</a></li>
          <li><a href="#" className="no-underline text-text text-lg font-semibold transition-colors duration-300 hover:text-main">Catálogo</a></li>
          <li><a href="#" className="no-underline text-text text-lg font-semibold transition-colors duration-300 hover:text-main">Comunidad</a></li>
        </ul>

        <div className="flex items-center gap-4 lg:ml-auto">

  <button
    onClick={abrirFormulario}
    className="
      bg-[#7CFC00]
      text-black
      font-semibold
      px-5
      py-3
      rounded-full
      transition-all
      duration-300
      hover:scale-110
      hover:shadow-[0_0_20px_#7CFC00]
      hover:-translate-y-1
      active:scale-95
      animate-pulse"
  >
    ¿Quieres ser Beta testing?
  </button>

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
      onClick={onLoginClick}
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
