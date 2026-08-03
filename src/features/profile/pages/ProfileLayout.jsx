import { useEffect } from "react";
import { useLingui } from "@lingui/react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { fetchCurrentUser } from "../../auth/services/authService";

const NAV_ITEMS = [
  { to: "/perfil", labelKey: "profile.nav.profile", end: true },
  { to: "/perfil/retos", labelKey: "profile.nav.challenges" },
  { to: "/perfil/compras", labelKey: "profile.nav.purchases" },
  { to: "/perfil/configuracion", labelKey: "profile.nav.settings" },
];

function ProfileLayout() {
  const { user, setUser } = useAuth();
  const { i18n } = useLingui();
  const t = (id, message) => i18n._({ id, message });

  useEffect(() => {
    let cancelled = false;
    fetchCurrentUser().then((me) => {
      if (!cancelled && me) setUser({ ...user, ...me });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-5 py-10 flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-56 shrink-0">
        <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `whitespace-nowrap px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                  isActive ? "bg-main text-white" : "text-text hover:bg-snd-bg"
                }`
              }
            >
              {t(item.labelKey, item.labelKey === "profile.nav.profile" ? "Mi perfil" : item.labelKey === "profile.nav.challenges" ? "Mis retos" : item.labelKey === "profile.nav.purchases" ? "Historial de compras" : "Configuración")}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}

export default ProfileLayout;
