import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLingui } from "@lingui/react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { logout, setBetaTester } from "../../features/auth/services/authService";
import LanguageSelector from "../common/LanguageSelector";
import Modal from "../common/Modal";
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
  const [checkoutMessage, setCheckoutMessage] = useState("");

  const userMenuRef = useRef(null);
  const betaWrapperRef = useRef(null);
  useClickOutside(userMenuRef, () => setShowUserMenu(false), showUserMenu);
  useClickOutside(betaWrapperRef, () => setShowBetaConfirm(false), showBetaConfirm);

  const { theme, toggleTheme } = useTheme();
  const { user, setUser, clearUser } = useAuth();
  const { i18n } = useLingui();
  const itemCount = useCartStore((state) => state.getItemCount());
  const cartItems = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
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

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    clearCart();
    setCheckoutMessage(t("cart.checkoutSuccess", "Compra finalizada con éxito."));
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-center w-full h-auto md:h-20 p-5 md:px-10 lg:px-[4.375rem] lg:py-0 gap-5 md:gap-0 bg-bg shadow-[0_0.125rem_0.625rem_rgba(0,0,0,0.08)] mb-[1.875rem] ml-auto transition-colors duration-[400ms]">
      <div className="flex items-center gap-[0.9375rem] justify-start">
        <div>
          <img
            src="https://res.cloudinary.com/w1jl4sa5/image/upload/v1784825556/Logo_of_The_Sims_4.svg_jagzsl.webp"
            alt="Logo"
            className="w-[7.5rem] h-[7.5rem] m-4 object-contain"
          />
        </div>
      </div>

      <button
        type="button"
        className="block lg:hidden text-[2rem] cursor-pointer text-text absolute top-[1.5625rem] right-[1.875rem] z-[1200]"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={t("navbar.openMenu", "Abrir menú")}
        aria-expanded={menuOpen}
      >
        ☰
      </button>

      <nav
        className={`absolute lg:static top-20 left-0 w-full lg:w-auto bg-snd-bg lg:bg-transparent shadow-[0_0.375rem_1.125rem_rgba(0,0,0,0.25)] lg:shadow-none overflow-hidden lg:overflow-visible transition-[max-height,opacity] duration-[400ms] ease-in-out lg:flex lg:items-center lg:gap-10 lg:grow lg:max-h-none lg:opacity-100 lg:pointer-events-auto lg:py-0 lg:transition-none ${
          menuOpen
            ? "max-h-[25rem] opacity-100 pointer-events-auto py-[1.875rem]"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col items-center gap-[0.9375rem] md:gap-5 lg:flex-row lg:gap-[1.875rem] lg:mr-auto list-none">
          <li>
            <Link to="/" className="no-underline text-text text-lg font-semibold transition-colors duration-300 hover:text-main">
              {t("navbar.home", "Inicio")}
            </Link>
          </li>
          <li>
            <Link to="/#catalogo" className="no-underline text-text text-lg font-semibold transition-colors duration-300 hover:text-main">
              {t("navbar.catalog", "Catálogo")}
            </Link>
          </li>
          <li>
            <Link to="/comunidad" className="no-underline text-text text-lg font-semibold transition-colors duration-300 hover:text-main">
              {t("navbar.community", "Comunidad")}
            </Link>
          </li>
        </ul>

        <div className="flex flex-col w-full justify-center items-center gap-4 px-5 sm:px-8 mt-6 lg:mt-0 lg:flex-row lg:w-auto lg:items-center lg:px-0 lg:ml-auto">
          {user?.betaTester ? (
            <span className="w-full max-w-sm lg:w-auto text-center px-4 py-2 rounded-full text-sm font-bold text-accent border-2 border-accent bg-accent/10">
              {t("profile.info.betaTester", "Beta tester")}
            </span>
          ) : (
            <div className="relative w-full max-w-sm lg:w-auto" ref={betaWrapperRef}>
              <button
                onClick={handleBetaButtonClick}
                disabled={betaSubmitting}
                className="bg-accent text-black font-semibold w-full lg:w-auto px-4 sm:px-5 py-2.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_1.25rem_var(--accent-color)] active:scale-95 disabled:opacity-60 text-sm sm:text-base"
              >
                {t("beta.title", "¿Quieres ser beta tester?")}
              </button>

              {showBetaConfirm && (
                <div className="absolute left-1/2 -translate-x-1/2 lg:left-auto lg:right-0 lg:translate-x-0 top-full mt-2 w-72 max-w-[90vw] bg-card-bg text-text rounded-xl shadow-xl p-4 z-[1300] transition-colors duration-300">
                  <p className="text-sm font-bold mb-3">{t("beta.confirmTitle", "¿Quieres suscribirte a beta testing?")}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBetaConfirm(true)}
                      className="flex-1 bg-accent text-black rounded-full py-2 text-sm font-bold cursor-pointer"
                    >
                      {t("beta.yes", "Sí, quiero")}
                    </button>
                    <button
                      onClick={() => handleBetaConfirm(false)}
                      className="flex-1 bg-snd-bg text-text rounded-full py-2 text-sm font-bold cursor-pointer"
                    >
                      {t("beta.no", "No, gracias")}
                    </button>
                  </div>
                </div>
              )}

              {betaError && (
                <div className="absolute left-1/2 -translate-x-1/2 lg:left-auto lg:right-0 lg:translate-x-0 top-full mt-2 w-72 max-w-[90vw] bg-card-bg text-text rounded-xl shadow-xl p-3 z-[1300]">
                  <p className="text-red-400 text-xs font-semibold">{betaError}</p>
                </div>
              )}
            </div>
          )}

          {!user ? (
            <button
              className="w-full max-w-sm lg:w-auto bg-main text-white px-5 py-2.5 rounded-full font-bold text-sm sm:text-base hover:bg-hover transition"
              onClick={() => {
                navigate("/login");
                setMenuOpen(false);
              }}
            >
              {t("navbar.login", "Iniciar sesión")}
            </button>
          ) : (
            <div className="relative hidden lg:flex" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu((prev) => !prev)}
                className="w-10 h-10 rounded-full bg-main text-white font-bold flex items-center justify-center hover:bg-hover transition-colors shadow-md"
                aria-label="Menú de perfil"
              >
                {initial}
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-card-bg text-text rounded-xl shadow-lg p-4 z-50 transition-colors duration-300">
                  <p className="font-bold text-base mb-1">{displayName || t("navbar.user", "Usuario")}</p>
                  {user.email && (
                    <p className="text-sm opacity-70 mb-1 break-all">{user.email}</p>
                  )}
                  {user.provider && (
                    <p className="text-xs opacity-60 mb-3">{t("navbar.connectedWith", "Conectado con {provider}").replace("{provider}", user.provider)}</p>
                  )}
                  <button
                    onClick={() => {
                      navigate("/perfil");
                      setShowUserMenu(false);
                    }}
                    className="w-full text-sm font-bold text-text hover:text-hover transition-colors text-left mb-2"
                  >
                    {t("navbar.viewProfile", "Ver perfil")}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full mt-2 text-sm font-bold text-main hover:text-hover transition-colors text-left"
                  >
                    {t("navbar.logout", "Cerrar sesión")}
                  </button>
                </div>
              )}
            </div>
          )}

          {canAccessCart(user) ? (
            <div className="relative">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-snd-bg text-text font-semibold border border-snd-bg hover:border-main transition"
                onClick={() => {
                  setShowCart(true);
                  setCheckoutMessage("");
                }}
              >
                🛒 {t("cart.title", "Carrito")}
                {itemCount > 0 && (
                  <span className="bg-main text-white rounded-full min-w-6 h-6 flex items-center justify-center px-2 text-sm">
                    {itemCount}
                  </span>
                )}
              </button>

              {showCart && (
                <Modal onClose={() => setShowCart(false)} maxWidthClass="max-w-xl">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-2xl">{t("cart.title", "Carrito")}</p>
                        <p className="text-sm text-text/70">{t("cart.fullCartLabel", "Tu carrito completo")}</p>
                      </div>
                      <button onClick={() => setShowCart(false)} className="text-sm text-main font-semibold">
                        {t("cart.close", "Cerrar")}
                      </button>
                    </div>

                    {checkoutMessage && (
                      <div className="rounded-2xl bg-main/10 border border-main text-main p-3 text-sm font-semibold">
                        {checkoutMessage}
                      </div>
                    )}

                    {cartItems.length === 0 ? (
                      <p className="text-sm text-text/70">{t("cart.empty", "Aún no agregaste paquetes de expansión.")}</p>
                    ) : (
                      <div className="space-y-4">
                        {cartItems.map((item) => (
                          <div key={`${item.id}-${item.platform}`} className="flex flex-col gap-3 rounded-2xl bg-snd-bg/80 p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="font-semibold text-base truncate">{item.title}</p>
                                <p className="text-xs text-text/70">{item.platform || t("cart.defaultPlatform", "Pack de expansión")}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-accent font-semibold">{item.price}</p>
                                <button
                                  onClick={() => removeItem(item.id, item.platform)}
                                  className="text-xs text-main font-semibold mt-1"
                                >
                                  {t("cart.remove", "Quitar")}
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(item.id, item.platform, item.quantity - 1)}
                                  className="w-8 h-8 rounded-full bg-bg text-text font-bold"
                                >
                                  −
                                </button>
                                <span className="text-sm font-semibold">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.platform, item.quantity + 1)}
                                  className="w-8 h-8 rounded-full bg-bg text-text font-bold"
                                >
                                  +
                                </button>
                              </div>
                              <p className="text-sm text-text/70">{t("cart.itemTotal", "Total del artículo")}: {item.price}</p>
                            </div>
                          </div>
                        ))}

                        <div className="border-t border-snd-bg pt-4 flex items-center justify-between">
                          <span className="text-sm font-semibold">{t("cart.subtotal", "Subtotal")}</span>
                          <span className="text-accent font-bold">{useCartStore.getState().getSubtotal().toLocaleString("es-CO", { style: "currency", currency: "COP" })}</span>
                        </div>

                        <div className="flex flex-col gap-3">
                          <button
                            onClick={handleCheckout}
                            disabled={cartItems.length === 0}
                            className="w-full rounded-full bg-main text-white py-3 font-semibold disabled:opacity-50"
                          >
                            {t("cart.checkout", "Finalizar compra")}
                          </button>
                          <button
                            onClick={() => clearCart()}
                            className="w-full rounded-full bg-snd-bg text-text py-3 font-semibold border border-snd-bg hover:border-main transition"
                          >
                            {t("cart.clear", "Vaciar carrito")}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </Modal>
              )}
            </div>
          ) : null}

          <LanguageSelector />

          <button
            onClick={toggleTheme}
            className="self-center text-xl sm:text-2xl text-accent hover:rotate-12 transition cursor-pointer"
            aria-label="Cambiar tema"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
