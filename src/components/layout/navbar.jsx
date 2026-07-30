import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLingui } from "@lingui/react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import {
  logout,
  setBetaTester,
} from "../../features/auth/services/authService";

function Navbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showBetaConfirm, setShowBetaConfirm] = useState(false);
  const [betaSubmitting, setBetaSubmitting] = useState(false);
  const [betaError, setBetaError] = useState("");

  const { theme, toggleTheme } = useTheme();
  const { i18n } = useLingui();
  const { user, clearUser } = useAuth();

  // ==========================================
  // INFORMACIÓN DEL USUARIO
  // ==========================================

  const displayName =
    user?.firstName ||
    user?.name ||
    user?.username ||
    "";

  const initial =
    displayName.charAt(0).toUpperCase() || "?";


  // ==========================================
  // CERRAR SESIÓN
  // ==========================================

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearUser();
      setShowUserMenu(false);
      setMenuOpen(false);
    }
  };


  // ==========================================
  // BOTÓN BETA TESTER
  // ==========================================

  const handleBetaButtonClick = () => {
    // Si no hay sesión, ir al registro
    if (!user) {
      navigate("/register");
      setMenuOpen(false);
      return;
    }

    setBetaError("");
    setShowBetaConfirm((prev) => !prev);
  };


  // ==========================================
  // CONFIRMAR BETA TESTER
  // ==========================================

  const handleBetaConfirm = async (accept) => {
    setShowBetaConfirm(false);

    if (!accept) {
      return;
    }

    setBetaSubmitting(true);
    setBetaError("");

    try {
      const updated = await setBetaTester(true);

      setUser({
        ...user,
        ...updated,
      });

    } catch (err) {

      if (err.sessionExpired) {
        clearUser();
      }

      setBetaError(
        err.message ||
          "No se pudo activar beta testing. Intenta de nuevo."
      );

    } finally {
      setBetaSubmitting(false);
    }
  };


  return (

    <header
      className="
        relative
        z-[1000]

        flex
        items-center
        justify-between

        w-full
        min-h-20

        px-4
        py-2

        sm:px-6
        lg:px-12

        bg-bg

        shadow-[0_2px_10px_rgba(0,0,0,0.08)]

        mb-5
        sm:mb-8

        transition-colors
        duration-[400ms]
      "
    >

      {/* ==================================================
          LOGO
      ================================================== */}

      <div className="flex items-center flex-shrink-0">

        <img
          src="https://res.cloudinary.com/w1jl4sa5/image/upload/v1784825556/Logo_of_The_Sims_4.svg_jagzsl.webp"
          alt="Logo The Sims 4"
          className="
            w-20
            h-16

            sm:w-24
            sm:h-18

            object-contain
          "
        />

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


        {/* ==================================================
            ENLACES DEL MENÚ
        ================================================== */}

        <ul
          className="
            flex
            flex-col

            items-center

            gap-5
            md:gap-6

            lg:flex-row
            lg:gap-[30px]

            lg:mr-auto

            list-none

            w-full
            lg:w-auto

            px-4
            sm:px-6
            lg:px-0
          "
        >

          {/* INICIO */}

          <li>

            <Link
              to="/"

              onClick={() => {
                setMenuOpen(false);
              }}

              className="
                no-underline

                text-text

                text-lg

                font-semibold

                transition-colors
                duration-300

                hover:text-main
              "
            >
              Inicio
            </Link>

          </li>


          {/* CATÁLOGO */}

          <li>

            <Link
              to="/#catalogo"

              onClick={() => {
                setMenuOpen(false);
              }}

              className="
                no-underline

                text-text

                text-lg

                font-semibold

                transition-colors
                duration-300

                hover:text-main
              "
            >
              Catálogo
            </Link>

          </li>


          {/* COMUNIDAD */}

          <li>

            <Link
              to="/comunidad"

              onClick={() => {
                setMenuOpen(false);
              }}

              className="
                no-underline

                text-text

                text-lg

                font-semibold

                transition-colors
                duration-300

                hover:text-main
              "
            >
              Comunidad
            </Link>

          </li>

        </ul>


        {/* ==================================================
            ACCIONES

            CELULAR / TABLET:

            [ Beta tester ]

            [ Iniciar sesión ]

            🌙

            PC:

            [ Beta tester ] [ Iniciar sesión ] 🌙
        ================================================== */}

        <div
          className="
            flex
            flex-col

            w-full

            justify-center
            items-center

            gap-4

            px-5
            sm:px-8

            mt-6
            lg:mt-0

            lg:flex-row

            lg:w-auto

            lg:items-center

            lg:px-0

            lg:ml-auto
          "
        >


          {/* ==================================================
              BETA TESTER
          ================================================== */}

          {user?.betaTester ? (

            <span
              className="
                w-full
                max-w-sm

                lg:w-auto

                text-center

                px-4
                py-2

                rounded-full

                text-sm
                font-bold

                text-accent

                border-2
                border-accent

                bg-accent/10
              "
            >
              Beta tester
            </span>

          ) : (

            <div
              className="
                relative

                w-full
                max-w-sm

                lg:w-auto
              "
            >

              <button
                onClick={handleBetaButtonClick}

                disabled={betaSubmitting}

                className="
                  bg-accent

                  text-black

                  font-semibold

                  w-full
                  lg:w-auto

                  px-4
                  sm:px-5

                  py-2.5

                  rounded-full

                  transition-all
                  duration-300

                  hover:scale-105

                  hover:shadow-[0_0_20px_var(--accent-color)]

                  active:scale-95

                  disabled:opacity-60

                  text-sm
                  sm:text-base
                "
              >
                ¿Quieres ser beta tester?
              </button>


              {/* ==================================================
                  CONFIRMACIÓN BETA TESTER
              ================================================== */}

              {showBetaConfirm && (

                <div
                  className="
                    absolute

                    left-1/2
                    -translate-x-1/2

                    lg:left-auto
                    lg:right-0
                    lg:translate-x-0

                    top-full

                    mt-2

                    w-72
                    max-w-[90vw]

                    bg-card-bg
                    text-text

                    rounded-xl

                    shadow-xl

                    p-4

                    z-[1300]
                  "
                >

                  <p
                    className="
                      text-sm
                      font-bold
                      mb-3
                    "
                  >
                    ¿Quieres suscribirte a beta testing?
                  </p>


                  <div
                    className="
                      flex
                      gap-2
                    "
                  >

                    <button
                      onClick={() =>
                        handleBetaConfirm(true)
                      }

                      className="
                        flex-1

                        bg-accent
                        text-black

                        rounded-full

                        py-2

                        text-sm

                        font-bold

                        cursor-pointer
                      "
                    >
                      Sí, quiero
                    </button>


                    <button
                      onClick={() =>
                        handleBetaConfirm(false)
                      }

                      className="
                        flex-1

                        bg-snd-bg
                        text-text

                        rounded-full

                        py-2

                        text-sm

                        font-bold

                        cursor-pointer
                      "
                    >
                      No, gracias
                    </button>

                  </div>

                </div>

              )}


              {/* ==================================================
                  ERROR BETA TESTER
              ================================================== */}

              {betaError && (

                <div
                  className="
                    absolute

                    left-1/2
                    -translate-x-1/2

                    lg:left-auto
                    lg:right-0
                    lg:translate-x-0

                    top-full

                    mt-2

                    w-72
                    max-w-[90vw]

                    bg-card-bg
                    text-text

                    rounded-xl

                    shadow-xl

                    p-3

                    z-[1300]
                  "
                >

                  <p
                    className="
                      text-red-400

                      text-xs

                      font-semibold
                    "
                  >
                    {betaError}
                  </p>

                </div>

              )}

            </div>

          )}


          {/* ==================================================
              INICIAR SESIÓN

              IMPORTANTE:

              - Si NO hay usuario:
                aparece el botón.

              - Si hay usuario:
                NO aparece aquí.

                El avatar está ARRIBA,
                junto al menú hamburguesa
                en celular/tablet.

                En PC el avatar aparece aquí.
          ================================================== */}

          {!user && (

            <button
              className="
                w-full
                max-w-sm

                lg:w-auto

                bg-main

                text-white

                px-5
                py-2.5

                rounded-full

                font-bold

                text-sm
                sm:text-base

                hover:bg-hover

                transition
              "

              onClick={() => {

                navigate("/login");

                setMenuOpen(false);

              }}
            >
              Iniciar sesión
            </button>

          )}


          {/* ==================================================
              AVATAR PARA PC

              IMPORTANTE:

              En celular/tablet NO aparece aquí.

              Ya existe arriba junto al menú.

              Por eso usamos hidden lg:flex.
          ================================================== */}

          {user && (

            <div
              className="
                relative

                hidden
                lg:flex
              "
            >

              <button
                onClick={() =>
                  setShowUserMenu(
                    (prev) => !prev
                  )
                }

                className="
                  w-10
                  h-10

                  rounded-full

                  bg-main

                  text-white

                  font-bold

                  flex
                  items-center
                  justify-center

                  hover:bg-hover

                  transition-colors

                  shadow-md
                "

                aria-label="Menú de perfil"
              >

                {initial}

              </button>


              {/* MENÚ DEL PERFIL EN PC */}

              {showUserMenu && (

                <div
                  className="
                    absolute

                    right-0
                    top-full

                    mt-2

                    w-64

                    bg-card-bg
                    text-text

                    rounded-xl

                    shadow-xl

                    p-4

                    z-[1300]
                  "
                >

                  <p
                    className="
                      font-bold
                      text-base
                      mb-1
                    "
                  >
                    {displayName || "Usuario"}
                  </p>


                  {user.email && (

                    <p
                      className="
                        text-sm

                        opacity-70

                        mb-3

                        break-all
                      "
                    >
                      {user.email}
                    </p>

                  )}


                  <button
                    onClick={() => {

                      navigate("/perfil");

                      setShowUserMenu(false);

                    }}

                    className="
                      w-full

                      text-sm

                      font-bold

                      text-text

                      hover:text-hover

                      transition-colors

                      text-left

                      mb-2
                    "
                  >
                    Ver perfil
                  </button>


                  <button
                    onClick={handleLogout}

                    className="
                      w-full

                      text-sm

                      font-bold

                      text-main

                      hover:text-hover

                      transition-colors

                      text-left
                    "
                  >
                    Cerrar sesión
                  </button>

                </div>

              )}

            </div>

          )}


          {/* ==================================================
              CAMBIAR TEMA
          ================================================== */}

          <button
            onClick={toggleTheme}

            className="
              self-center

              text-xl
              sm:text-2xl

              text-accent

              hover:rotate-12

              transition

              cursor-pointer
            "

            aria-label="Cambiar tema"
          >

            {theme === "light"
              ? "🌙"
              : "☀️"}

          </button>

        </div>

      </nav>

    </header>
  );
}

export default Navbar;