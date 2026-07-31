import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function ProfileLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const displayName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "Usuario";
  const initial = (user.firstName || user.name || user.username || "?").charAt(0).toUpperCase();

  const navItems = [
    { path: "/perfil", label: "Mi Información", icon: "👤", end: true },
    { path: "/perfil/retos", label: "Mis Retos", icon: "🏆", end: false },
    { path: "/perfil/compras", label: "Mis Compras", icon: "🛍️", end: false },
    { path: "/perfil/configuracion", label: "Configuración", icon: "⚙️", end: false },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-card-bg shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-snd-bg mb-8 transition-all duration-300">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-main text-white font-extrabold text-3xl sm:text-4xl flex items-center justify-center shadow-md animate-fadeIn">
          {initial}
        </div>
        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
            <h2 className="text-2xl font-extrabold text-text leading-tight">{displayName}</h2>
            {user.betaTester && (
              <span className="self-center sm:self-auto px-3 py-1 rounded-full text-xs font-bold text-accent border border-accent bg-accent/10">
                Beta tester
              </span>
            )}
          </div>
          <p className="text-sm text-text opacity-70 mt-1">@{user.username}</p>
          <p className="text-xs text-text opacity-50 mt-1">{user.email}</p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2.5 rounded-full border border-snd-bg hover:bg-snd-bg text-sm font-semibold text-text transition-all cursor-pointer"
        >
          Volver a Inicio
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1">
          <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 border-b border-snd-bg lg:border-b-0">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-main text-white shadow-md shadow-main/20 scale-[1.02]"
                      : "text-text hover:bg-snd-bg opacity-80 hover:opacity-100"
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Content Panel */}
        <main className="lg:col-span-3 bg-card-bg rounded-2xl border border-snd-bg shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-6 md:p-8 min-h-[400px] transition-colors duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
