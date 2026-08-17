import { useEffect } from "react";
import { useLingui } from "@lingui/react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { fetchCurrentUser } from "../../auth/services/authService";

const NAV_ITEMS = [
  { to: "/perfil", labelKey: "profile.nav.profile", label: "Mi perfil", end: true },
  { to: "/perfil/retos", labelKey: "profile.nav.challenges", label: "Mis retos" },
  { to: "/perfil/compras", labelKey: "profile.nav.purchases", label: "Historial de compras" },
  { to: "/perfil/beta-testing", labelKey: "profile.nav.betaTesting", label: "Beta testing", betaOnly: true },
  { to: "/perfil/configuracion", labelKey: "profile.nav.settings", label: "Configuración" },
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
    <div className="w-full max-w-5xl min-[2560px]:max-w-[110rem] min-[3840px]:max-w-[140rem] mx-auto px-5 min-[2560px]:px-10 min-[3840px]:px-14 py-10 min-[2560px]:py-16 min-[3840px]:py-24 flex flex-col md:flex-row gap-8 min-[2560px]:gap-12">
      <aside className="w-full md:w-56 min-[2560px]:md:w-80 min-[3840px]:md:w-[24rem] shrink-0">
        <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          {NAV_ITEMS.filter((item) => !item.betaOnly || user?.betaTester).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `whitespace-nowrap px-4 py-3 min-[2560px]:px-6 min-[2560px]:py-4 min-[3840px]:px-8 min-[3840px]:py-5 rounded-xl min-[2560px]:rounded-2xl text-sm min-[2560px]:text-xl min-[3840px]:text-3xl font-bold transition-colors ${
                  isActive ? "bg-main text-bg" : "text-text hover:bg-snd-bg"
                }`
              }
            >
              {t(item.labelKey, item.label)}
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
