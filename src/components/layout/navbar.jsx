import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLingui } from "@lingui/react";
import { ShoppingCart, Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { logout, setBetaTester } from "../../features/auth/services/authService";
import LanguageSelector from "../common/LanguageSelector";
import ConfirmDialog from "../common/ConfirmDialog";
import useClickOutside from "../../hooks/useClickOutside";
import useCartStore from "../../store/cartStore";
import { canAccessCart } from "../../utils/cartAccess";

function Navbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showBetaConfirm, setShowBetaConfirm] = useState(false);
  const [betaSubmitting, setBetaSubmitting] = useState(false);
  const [betaError, setBetaError] = useState("");
  const [showBetaCancelConfirm, setShowBetaCancelConfirm] = useState(false);
  const [betaCancelSubmitting, setBetaCancelSubmitting] = useState(false);

  const userMenuRef = useRef(null);
  const mobileUserMenuRef = useRef(null);
  const cartWrapperRef = useRef(null);
  const mobileCartWrapperRef = useRef(null);
  const mobileNavWrapperRef = useRef(null);
  useClickOutside([userMenuRef, mobileUserMenuRef], () => setShowUserMenu(false), showUserMenu);
  useClickOutside([cartWrapperRef, mobileCartWrapperRef], () => setShowCart(false), showCart);
  useClickOutside(mobileNavWrapperRef, () => setMenuOpen(false), menuOpen);

  const { theme, toggleTheme } = useTheme();
  const { user, setUser, clearUser } = useAuth();
  const { i18n } = useLingui();
  const cartItems = useCartStore((state) => state.items);
  const itemCount = useCartStore((state) => state.getItemCount());
  const removeItem = useCartStore((state) => state.removeItem);
  const t = (id, message) => i18n._({ id, message });

  const displayName = user?.firstName || user?.name || user?.username || "";
  const initial = displayName ? displayName.charAt(0).toUpperCase() : "?";

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearUser();
      setShowUserMenu(false);
      setMenuOpen(false);
    }
  };

  const handleBetaButtonClick = () => {
    if (!user) {
      navigate("/register");
      setMenuOpen(false);
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
      setBetaError(err.message || t("beta.error", "No se pudo activar beta testing. Intentá de nuevo."));
    } finally {
      setBetaSubmitting(false);
    }
  };

  const handleBetaCancelConfirm = async () => {
    setShowBetaCancelConfirm(false);
    setBetaCancelSubmitting(true);
    setBetaError("");
    try {
      const updated = await setBetaTester(false);
      setUser({ ...user, ...updated });
    } catch (err) {
      if (err.sessionExpired) clearUser();
      setBetaError(err.message || t("profile.info.betaCancelError", "No se pudo cancelar. Intentá de nuevo."));
    } finally {
      setBetaCancelSubmitting(false);
    }
  };

  return (
    <header className="sticky top-0 z-[1000] flex flex-col md:flex-row justify-between items-center w-full h-auto md:h-20 min-[2560px]:md:h-[6.5rem] min-[3840px]:md:h-[8rem] min-[2560px]:text-[1.15rem] min-[3840px]:text-[1.45rem] p-5 md:px-10 lg:px-[4.375rem] lg:py-0 min-[2560px]:px-16 min-[2560px]:py-3 min-[3840px]:px-24 min-[3840px]:py-5 gap-5 md:gap-0 min-[2560px]:gap-6 bg-bg shadow-[0_0.125rem_0.625rem_rgba(0,0,0,0.08)] mb-[1.875rem] min-[2560px]:mb-8 ml-auto transition-colors duration-[400ms]">
      <div className="contents" ref={mobileNavWrapperRef}>
      {/* Fila superior mobile/tablet: hamburguesa+idioma+tema | logo | carrito+perfil, siempre visible */}
      <div className="flex lg:hidden items-center justify-between w-full gap-2 min-[2560px]:gap-4">
        <div className="flex items-center gap-2 min-[2560px]:gap-4">
          <button
            type="button"
            className="text-[2rem] min-[2560px]:text-[2.3rem] min-[3840px]:text-[2.9rem] cursor-pointer text-text leading-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={t("navbar.openMenu", "Abrir menú")}
            aria-expanded={menuOpen}
          >
            ☰
          </button>
          <LanguageSelector />
          <button
            onClick={toggleTheme}
            className="text-accent min-[2560px]:scale-95 min-[3840px]:scale-105 hover:rotate-12 transition cursor-pointer"
            aria-label={t("navbar.changeTheme", "Cambiar tema")}
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>

        <Link to="/" className="flex items-center justify-center shrink-0">
          <img
            width={128}
            height={128}
            src="https://res.cloudinary.com/w1jl4sa5/image/upload/f_auto,q_auto,w_128/v1784825556/Logo_of_The_Sims_4.svg_jagzsl.webp"
            srcSet="
            https://res.cloudinary.com/w1jl4sa5/image/upload/f_auto,q_auto,w_128/v1784825556/Logo_of_The_Sims_4.svg_jagzsl.webp 128w,
            https://res.cloudinary.com/w1jl4sa5/image/upload/f_auto,q_auto,w_256/v1784825556/Logo_of_The_Sims_4.svg_jagzsl.webp 256w"
            sizes="(max-width: 2559px) 64px, 112px"
            alt="Logo"
            className="w-16 h-16 min-[2560px]:w-[5.5rem] min-[2560px]:h-[5.5rem] min-[3840px]:w-[7rem] min-[3840px]:h-[7rem] object-contain"
          />
        </Link>

        <div className="flex items-center gap-3 min-[2560px]:gap-5">
          {canAccessCart(user) && (
            <div className="relative" ref={mobileCartWrapperRef}>
              <button
                className="relative text-text min-[2560px]:scale-95 min-[3840px]:scale-105"
                onClick={() => setShowCart((prev) => !prev)}
                aria-label={t("cart.title", "Carrito")}
              >
                <ShoppingCart size={22} />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-main text-bg rounded-full min-w-[1.125rem] h-[1.125rem] min-[2560px]:min-w-6 min-[2560px]:h-6 min-[3840px]:min-w-7 min-[3840px]:h-7 flex items-center justify-center px-1 text-[0.65rem] min-[2560px]:text-[0.75rem] min-[3840px]:text-[0.9rem]">
                    {itemCount}
                  </span>
                )}
              </button>

              {showCart && (
                <div className="absolute right-0 top-full mt-2 min-[2560px]:mt-3 w-80 min-[2560px]:w-[28rem] min-[3840px]:w-[34rem] max-w-[90vw] bg-card-bg text-text rounded-2xl min-[2560px]:rounded-3xl shadow-2xl border border-snd-bg p-4 min-[2560px]:p-6 min-[3840px]:p-8 z-[1400]">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-bold text-lg min-[2560px]:text-3xl min-[3840px]:text-4xl">{t("cart.title", "Carrito")}</p>
                    <button onClick={() => setShowCart(false)} className="text-sm min-[2560px]:text-[1rem] min-[3840px]:text-[1.25rem] text-main font-semibold">{t("cart.close", "Cerrar")}</button>
                  </div>

                  {cartItems.length === 0 ? (
                    <p className="text-sm min-[2560px]:text-xl min-[3840px]:text-2xl text-text/70">{t("cart.empty", "Aún no agregaste paquetes de expansión.")}</p>
                  ) : (
                    <div className="space-y-3 min-[2560px]:space-y-5">
                      {cartItems.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-start gap-3 min-[2560px]:gap-4 rounded-xl min-[2560px]:rounded-2xl bg-snd-bg/50 p-3 min-[2560px]:p-4">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm min-[2560px]:text-xl min-[3840px]:text-2xl truncate">{item.title}</p>
                            <p className="text-xs min-[2560px]:text-base min-[3840px]:text-lg text-text/70">{item.platform || t("cart.defaultPlatform", "Pack de expansión")}</p>
                            <p className="text-sm min-[2560px]:text-xl min-[3840px]:text-2xl text-price font-semibold mt-1">{item.price}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <button onClick={() => removeItem(item.id, item.platform)} className="text-xs min-[2560px]:text-[0.9rem] min-[3840px]:text-[1.1rem] text-main font-semibold">
                              {t("cart.remove", "Quitar")}
                            </button>
                          </div>
                        </div>
                      ))}

                      {cartItems.length > 3 && (
                        <p className="text-xs min-[2560px]:text-base min-[3840px]:text-lg text-text/70 text-center">
                          {i18n._({ id: "cart.moreItems", message: "y {count} más", values: { count: cartItems.length - 3 } })}
                        </p>
                      )}

                      <div className="border-t border-snd-bg pt-3 flex items-center justify-between">
                        <span className="text-sm min-[2560px]:text-xl min-[3840px]:text-2xl font-semibold">{t("cart.subtotal", "Subtotal")}</span>
                        <span className="text-price min-[2560px]:text-xl min-[3840px]:text-2xl font-bold">{useCartStore.getState().getSubtotal().toLocaleString("es-CO", { style: "currency", currency: "COP" })}</span>
                      </div>

                      <Link
                        to="/carrito"
                        onClick={() => setShowCart(false)}
                        className="block w-full text-center rounded-full bg-main hover:bg-hover text-bg py-2 min-[2560px]:py-2.5 min-[3840px]:py-3 min-[2560px]:text-[1rem] min-[3840px]:text-[1.2rem] font-semibold"
                      >
                        {t("cart.viewCart", "Ver carrito")}
                      </Link>
                      <p className="text-xs min-[2560px]:text-base min-[3840px]:text-lg text-text/60 text-center">
                        {t("cart.viewCartHint", "Ahí vas a ver todos tus paquetes y la opción de comprar.")}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {user ? (
            <div className="relative" ref={mobileUserMenuRef}>
              <button
                onClick={() => setShowUserMenu((prev) => !prev)}
                className="w-9 h-9 min-[2560px]:w-10 min-[2560px]:h-10 min-[3840px]:w-11 min-[3840px]:h-11 rounded-full bg-main text-bg font-bold flex items-center justify-center hover:bg-hover transition-colors shadow-md text-sm min-[2560px]:text-[0.9rem] min-[3840px]:text-[1rem]"
                aria-label={t("navbar.profileMenu", "Menú de perfil")}
              >
                {initial}
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 min-[2560px]:mt-3 w-64 min-[2560px]:w-96 min-[3840px]:w-[30rem] max-w-[90vw] bg-card-bg text-text rounded-xl min-[2560px]:rounded-2xl shadow-lg p-4 min-[2560px]:p-6 min-[3840px]:p-8 z-[1300] transition-colors duration-300">
                  <p className="font-bold text-base min-[2560px]:text-2xl min-[3840px]:text-3xl mb-1 min-[2560px]:mb-2">{displayName || t("navbar.user", "Usuario")}</p>
                  {user.email && (
                    <p className="text-sm min-[2560px]:text-xl min-[3840px]:text-2xl opacity-70 mb-1 break-all">{user.email}</p>
                  )}
                  {user.provider && (
                    <p className="text-xs min-[2560px]:text-base min-[3840px]:text-lg opacity-60 mb-3 min-[2560px]:mb-5">{t("navbar.connectedWith", "Conectado con {provider}").replace("{provider}", user.provider)}</p>
                  )}
                  <button
                    onClick={() => {
                      navigate("/perfil");
                      setShowUserMenu(false);
                      setMenuOpen(false);
                    }}
                    className="w-full text-sm min-[2560px]:text-xl min-[3840px]:text-2xl font-bold text-text hover:text-hover transition-colors text-left mb-2 min-[2560px]:mb-3"
                  >
                    {t("navbar.viewProfile", "Ver perfil")}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full mt-2 min-[2560px]:mt-3 text-sm min-[2560px]:text-xl min-[3840px]:text-2xl font-bold text-main hover:text-hover transition-colors text-left"
                  >
                    {t("navbar.logout", "Cerrar sesión")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
                setMenuOpen(false);
              }}
              className="text-base sm:text-lg min-[2560px]:text-[1.1rem] min-[3840px]:text-[1.45rem] font-bold text-main hover:text-hover transition-colors"
            >
              {t("navbar.login", "Iniciar sesión")}
            </button>
          )}
        </div>
      </div>

      {/* Logo exclusivo de escritorio */}
      <div className="hidden lg:flex items-center gap-[0.9375rem] min-[2560px]:gap-6 justify-start">
        <div>
          <img
            width={256}
            height={256}
            src="https://res.cloudinary.com/w1jl4sa5/image/upload/f_auto,q_auto,w_256/v1784825556/Logo_of_The_Sims_4.svg_jagzsl.webp"
            srcSet="
            https://res.cloudinary.com/w1jl4sa5/image/upload/f_auto,q_auto,w_128/v1784825556/Logo_of_The_Sims_4.svg_jagzsl.webp 128w,
            https://res.cloudinary.com/w1jl4sa5/image/upload/f_auto,q_auto,w_256/v1784825556/Logo_of_The_Sims_4.svg_jagzsl.webp 256w,
            https://res.cloudinary.com/w1jl4sa5/image/upload/f_auto,q_auto,w_512/v1784825556/Logo_of_The_Sims_4.svg_jagzsl.webp 512w"
            sizes="(max-width: 2559px) 128px, 192px"
            alt="Logo"
            className="w-[7.5rem] h-auto min-[2560px]:w-[9rem] min-[3840px]:w-[12rem] m-4 object-contain"
          />
        </div>
      </div>

      <nav
        className={`absolute lg:static top-20 left-0 w-full lg:w-auto bg-snd-bg lg:bg-transparent shadow-[0_0.375rem_1.125rem_rgba(0,0,0,0.25)] lg:shadow-none overflow-hidden lg:overflow-visible transition-[max-height,opacity] duration-[400ms] ease-in-out lg:flex lg:items-center lg:gap-10 lg:grow lg:max-h-none lg:opacity-100 lg:pointer-events-auto lg:py-0 lg:transition-none z-[1100] ${
          menuOpen
            ? "max-h-[25rem] opacity-100 pointer-events-auto py-[1.875rem]"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col items-center gap-[0.9375rem] md:gap-5 min-[2560px]:gap-6 lg:flex-row lg:gap-[1.875rem] min-[2560px]:lg:gap-8 lg:mr-auto list-none">
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)} className="no-underline text-text text-lg min-[2560px]:text-[2rem] min-[3840px]:text-[2.7rem] font-semibold transition-colors duration-300 hover:text-main">
              {t("navbar.home", "Inicio")}
            </Link>
          </li>
          <li>
            <Link to="/#catalogo" onClick={() => setMenuOpen(false)} className="no-underline text-text text-lg min-[2560px]:text-[2rem] min-[3840px]:text-[2.7rem] font-semibold transition-colors duration-300 hover:text-main">
              {t("navbar.catalog", "Catálogo")}
            </Link>
          </li>
          <li>
            <Link to="/comunidad" onClick={() => setMenuOpen(false)} className="no-underline text-text text-lg min-[2560px]:text-[2rem] min-[3840px]:text-[2.7rem] font-semibold transition-colors duration-300 hover:text-main">
              {t("navbar.community", "Comunidad")}
            </Link>
          </li>
        </ul>

        <div className="flex flex-col w-full justify-center items-center gap-4 min-[2560px]:gap-6 px-5 sm:px-8 mt-6 lg:mt-0 lg:flex-row lg:w-auto lg:items-center lg:px-0 lg:ml-auto">
          {user?.betaTester ? (
            <button
              onClick={() => setShowBetaCancelConfirm(true)}
              disabled={betaCancelSubmitting}
              className="w-full max-w-sm lg:w-auto text-center px-4 py-2 min-[2560px]:px-3.5 min-[2560px]:py-2 min-[2560px]:text-[1.1rem] min-[3840px]:px-5 min-[3840px]:py-2.5 min-[3840px]:text-[1.45rem] rounded-full text-sm font-bold text-accent-text border-2 border-accent bg-accent/10 hover:bg-accent/20 transition cursor-pointer disabled:opacity-60"
            >
              {t("profile.info.betaTester", "Beta tester")}
            </button>
          ) : (
            <div className="w-full max-w-sm lg:w-auto">
              <button
                onClick={handleBetaButtonClick}
                disabled={betaSubmitting}
                className="bg-accent text-text font-semibold w-full lg:w-auto px-4 sm:px-5 min-[2560px]:px-[1.125rem] min-[3840px]:px-6 py-2.5 min-[2560px]:py-2 min-[3840px]:py-2.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_1.25rem_var(--accent-color)] active:scale-95 disabled:opacity-60 text-sm sm:text-base min-[2560px]:text-[1.15rem] min-[3840px]:text-[1.5rem]"
              >
                {t("beta.title", "¿Quieres ser beta tester?")}
              </button>
            </div>
          )}
          {/* Login/avatar, carrito, idioma y tema: solo escritorio (en mobile viven en la fila superior) */}
          <div className="hidden lg:flex lg:items-center lg:gap-[1.875rem] min-[2560px]:lg:gap-8 min-[3840px]:lg:gap-10">
          {!user ? (
            <button
              className="w-full max-w-sm lg:w-auto bg-main text-bg px-5 py-2.5 min-[2560px]:px-5 min-[2560px]:py-2 min-[3840px]:px-7 min-[3840px]:py-2.5 rounded-full font-bold text-sm sm:text-base min-[2560px]:text-[1.15rem] min-[3840px]:text-[1.5rem] hover:bg-hover transition"
              onClick={() => {
                navigate("/login");
                setMenuOpen(false);
              }}
            >
              {t("navbar.login", "Iniciar sesión")}
            </button>
          ) : (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu((prev) => !prev)}
                className="w-10 h-10 min-[2560px]:w-10 min-[2560px]:h-10 min-[3840px]:w-11 min-[3840px]:h-11 rounded-full bg-main text-bg font-bold flex items-center justify-center hover:bg-hover transition-colors shadow-md min-[2560px]:text-[0.8rem] min-[3840px]:text-[0.95rem]"
                aria-label={t("navbar.profileMenu", "Menú de perfil")}
              >
                {initial}
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 min-[2560px]:mt-3 w-64 min-[2560px]:w-96 min-[3840px]:w-[30rem] bg-card-bg text-text rounded-xl min-[2560px]:rounded-2xl shadow-lg p-4 min-[2560px]:p-6 min-[3840px]:p-8 z-50 transition-colors duration-300">
                  <p className="font-bold text-base min-[2560px]:text-2xl min-[3840px]:text-3xl mb-1 min-[2560px]:mb-2">{displayName || t("navbar.user", "Usuario")}</p>
                  {user.email && (
                    <p className="text-sm min-[2560px]:text-xl min-[3840px]:text-2xl opacity-70 mb-1 break-all">{user.email}</p>
                  )}
                  {user.provider && (
                    <p className="text-xs min-[2560px]:text-base min-[3840px]:text-lg opacity-60 mb-3 min-[2560px]:mb-5">{t("navbar.connectedWith", "Conectado con {provider}").replace("{provider}", user.provider)}</p>
                  )}
                  <button
                    onClick={() => {
                      navigate("/perfil");
                      setShowUserMenu(false);
                    }}
                    className="w-full text-sm min-[2560px]:text-xl min-[3840px]:text-2xl font-bold text-text hover:text-hover transition-colors text-left mb-2 min-[2560px]:mb-3"
                  >
                    {t("navbar.viewProfile", "Ver perfil")}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full mt-2 min-[2560px]:mt-3 text-sm min-[2560px]:text-xl min-[3840px]:text-2xl font-bold text-main hover:text-hover transition-colors text-left"
                  >
                    {t("navbar.logout", "Cerrar sesión")}
                  </button>
                </div>
              )}
            </div>
          )}

          {canAccessCart(user) ? (
            <div className="relative" ref={cartWrapperRef}>
              <button
                className="flex items-center gap-2 min-[2560px]:gap-1.5 px-4 py-2 min-[2560px]:px-4 min-[2560px]:py-2 min-[3840px]:px-5 min-[3840px]:py-2.5 rounded-full bg-snd-bg text-text font-semibold text-sm min-[2560px]:text-[1.1rem] min-[3840px]:text-[1.4rem] border border-snd-bg hover:border-main transition"
                onClick={() => setShowCart((prev) => !prev)}
              >
                <ShoppingCart size={18} /> {t("cart.title", "Carrito")}
                {itemCount > 0 && (
                  <span className="bg-main text-bg rounded-full min-w-6 h-6 min-[2560px]:min-w-6 min-[2560px]:h-6 min-[3840px]:min-w-7 min-[3840px]:h-7 flex items-center justify-center px-2 text-sm min-[2560px]:text-[0.75rem] min-[3840px]:text-[0.9rem]">
                    {itemCount}
                  </span>
                )}
              </button>

              {showCart && (
              <div className="absolute left-1/2 -translate-x-1/2 lg:left-auto lg:right-0 lg:translate-x-0 top-full mt-2 min-[2560px]:mt-3 w-80 min-[2560px]:w-[30rem] min-[3840px]:w-[36rem] max-w-[90vw] bg-card-bg text-text rounded-2xl min-[2560px]:rounded-3xl shadow-2xl border border-snd-bg p-4 min-[2560px]:p-6 min-[3840px]:p-8 z-[1400]">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-lg min-[2560px]:text-3xl min-[3840px]:text-4xl">{t("cart.title", "Carrito")}</p>
                  <button onClick={() => setShowCart(false)} className="text-sm min-[2560px]:text-xl min-[3840px]:text-2xl text-main font-semibold">{t("cart.close", "Cerrar")}</button>
                </div>

                {cartItems.length === 0 ? (
                  <p className="text-sm min-[2560px]:text-xl min-[3840px]:text-2xl text-text/70">{t("cart.empty", "Aún no agregaste paquetes de expansión.")}</p>
                ) : (
                  <div className="space-y-3 min-[2560px]:space-y-5">
                    {cartItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-start gap-3 min-[2560px]:gap-4 rounded-xl min-[2560px]:rounded-2xl bg-snd-bg/50 p-3 min-[2560px]:p-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm min-[2560px]:text-xl min-[3840px]:text-2xl truncate">{item.title}</p>
                          <p className="text-xs min-[2560px]:text-base min-[3840px]:text-lg text-text/70">{item.platform || t("cart.defaultPlatform", "Pack de expansión")}</p>
                          <p className="text-sm min-[2560px]:text-xl min-[3840px]:text-2xl text-price font-semibold mt-1">{item.price}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <button onClick={() => removeItem(item.id, item.platform)} className="text-xs min-[2560px]:text-base min-[3840px]:text-lg text-main font-semibold">
                            {t("cart.remove", "Quitar")}
                          </button>
                        </div>
                      </div>
                    ))}

                    {cartItems.length > 3 && (
                      <p className="text-xs min-[2560px]:text-base min-[3840px]:text-lg text-text/70 text-center">
                        {i18n._({ id: "cart.moreItems", message: "y {count} más", values: { count: cartItems.length - 3 } })}
                      </p>
                    )}

                    <div className="border-t border-snd-bg pt-3 flex items-center justify-between">
                      <span className="text-sm min-[2560px]:text-xl min-[3840px]:text-2xl font-semibold">{t("cart.subtotal", "Subtotal")}</span>
                      <span className="text-price min-[2560px]:text-xl min-[3840px]:text-2xl font-bold">{useCartStore.getState().getSubtotal().toLocaleString("es-CO", { style: "currency", currency: "COP" })}</span>
                    </div>

                    <Link
                      to="/carrito"
                      onClick={() => setShowCart(false)}
                      className="block w-full text-center rounded-full bg-main hover:bg-hover text-bg py-2 min-[2560px]:py-2.5 min-[3840px]:py-3 min-[2560px]:text-[1rem] min-[3840px]:text-[1.2rem] font-semibold"
                    >
                      {t("cart.viewCart", "Ver carrito")}
                    </Link>
                    <p className="text-xs min-[2560px]:text-base min-[3840px]:text-lg text-text/60 text-center">
                      {t("cart.viewCartHint", "Ahí vas a ver todos tus paquetes y la opción de comprar.")}
                    </p>
                  </div>
                )}
              </div>
            )}
            </div>
          ) : null}

          <LanguageSelector />

          <button
            onClick={toggleTheme}
            className="self-center text-accent min-[2560px]:scale-95 min-[3840px]:scale-105 hover:rotate-12 transition cursor-pointer"
            aria-label={t("navbar.changeTheme", "Cambiar tema")}
          >
            {theme === "light" ? <Moon size={22} /> : <Sun size={22} />}
          </button>
          </div>
        </div>
      </nav>
      </div>

      {showBetaConfirm && (
        <ConfirmDialog
          title={t("beta.confirmTitle", "¿Quieres suscribirte a beta testing?")}
          confirmLabel={t("beta.yes", "Sí, quiero")}
          cancelLabel={t("beta.no", "No, gracias")}
          confirmDisabled={betaSubmitting}
          onConfirm={() => handleBetaConfirm(true)}
          onCancel={() => handleBetaConfirm(false)}
        />
      )}

      {betaError && (
        <div className="fixed inset-x-4 bottom-4 sm:inset-x-auto sm:right-6 sm:bottom-6 min-[2560px]:right-10 min-[2560px]:bottom-10 max-w-sm min-[2560px]:max-w-lg bg-card-bg text-text rounded-xl min-[2560px]:rounded-2xl shadow-xl p-4 min-[2560px]:p-6 z-[1500] transition-colors duration-300">
          <p className="text-error text-sm min-[2560px]:text-base font-semibold">{betaError}</p>
        </div>
      )}

      {showBetaCancelConfirm && (
        <ConfirmDialog
          title={t("profile.info.betaConfirmTitle", "¿Quieres cancelar tu suscripción a Beta Testing?")}
          body={t("profile.info.betaConfirmBody", "Perderás el acceso anticipado a nuevos expansion packs y contenido experimental.")}
          confirmLabel={t("profile.info.betaConfirmOk", "Sí, cancelar")}
          cancelLabel={t("profile.info.betaConfirmCancel", "Mantener suscripción")}
          danger
          confirmDisabled={betaCancelSubmitting}
          onConfirm={handleBetaCancelConfirm}
          onCancel={() => setShowBetaCancelConfirm(false)}
        />
      )}
    </header>
  );
}

export default Navbar;