function Navbar() {
  return (
    <header className="navbar">

      <div className="logo">
        <h1>The Sims</h1>
      </div>

      <nav className="menu">
        <ul>
          <li><a href="#">Inicio</a></li>
          <li><a href="#">Catálogo</a></li>
          <li><a href="#">Expansiones</a></li>
          <li><a href="#">Comunidad</a></li>
        </ul>
      </nav>

      <button className="btn-login">
        Iniciar sesión
      </button>

    </header>
  );
}

export default Navbar;