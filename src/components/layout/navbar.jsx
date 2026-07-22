import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";


function Navbar({ onLoginClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex flex-col md:flex-row justify-between items-center w-full h-auto md:h-20 p-5 md:px-10 lg:px-[70px] lg:py-0 gap-5 md:gap-0 bg-bg shadow-[0_2px_10px_rgba(0,0,0,0.08)] mb-[30px] ml-auto transition-colors duration-[400ms]">
      <div className="flex items-center gap-[15px] justify-start">
        <div>
          <h1 className="font-nunito text-[42px] font-extrabold text-main cursor-pointer">The Sims</h1>
        </div>

        {/*  Botón modo oscuro al lado del logo */}
        <button
          className="bg-transparent border-none text-accent text-[1.6rem] cursor-pointer transition duration-300 ease-in-out hover:rotate-[20deg] hover:text-hover"
          onClick={toggleTheme}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
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
          <li><a href="#" className="no-underline text-text text-lg font-semibold transition-colors duration-300 hover:text-main">Expansiones</a></li>
          <li><a href="#" className="no-underline text-text text-lg font-semibold transition-colors duration-300 hover:text-main">Comunidad</a></li>
        </ul>
        <button
          className="block bg-main text-white px-[30px] py-[14px] rounded-full text-base font-bold cursor-pointer transition-colors duration-300 hover:bg-hover mx-auto mt-[25px] mb-[10px] lg:mx-0 lg:mt-0 lg:mb-0 lg:ml-auto lg:px-[28px] lg:py-[12px]"
          onClick={onLoginClick}
        >
          Iniciar sesión
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
