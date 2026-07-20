import { useState } from "react";
import "../styles/navbar.css";


function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="logo">
        <h1>The Sims</h1>
      </div>

      <div
        className={`menu-toggle ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </div>

      <nav className={`menu ${menuOpen ? "active" : ""}`}>
        <ul>
          <li><a href="#">Inicio</a></li>
          <li><a href="#">Catálogo</a></li>
          <li><a href="#">Expansiones</a></li>
          <li><a href="#">Comunidad</a></li>
        </ul>
        <button className="btn-login">Iniciar sesión</button>
      </nav>
    </header>
  );
}

export default Navbar;
