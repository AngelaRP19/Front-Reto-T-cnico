import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import { setBetaTester } from "../../auth/services/authService";

export default function ProfileSettingsTab() {
  const { user, setUser, clearUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [betaSubmitting, setBetaSubmitting] = useState(false);
  const [betaError, setBetaError] = useState("");
  
  // Simulated form states
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" });
  const [passwordStatus, setPasswordStatus] = useState({ type: "", message: "" });
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    country: user?.country || "",
  });
  const [profileStatus, setProfileStatus] = useState({ type: "", message: "" });

  const handleBetaToggle = async () => {
    setBetaSubmitting(true);
    setBetaError("");
    const newValue = !user.betaTester;
    try {
      const updated = await setBetaTester(newValue);
      setUser({ ...user, ...updated });
    } catch (err) {
      if (err.sessionExpired) clearUser();
      setBetaError(err.message || "No se pudo actualizar el estado de beta testing.");
    } finally {
      setBetaSubmitting(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordStatus({ type: "", message: "" });

    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
      setPasswordStatus({ type: "error", message: "Todos los campos son requeridos." });
      return;
    }

    if (passwordForm.new !== passwordForm.confirm) {
      setPasswordStatus({ type: "error", message: "La nueva contraseña y su confirmación no coinciden." });
      return;
    }

    if (passwordForm.new.length < 8) {
      setPasswordStatus({ type: "error", message: "La nueva contraseña debe tener al menos 8 caracteres." });
      return;
    }

    // Mock successful update
    setPasswordStatus({ type: "success", message: "¡Contraseña actualizada con éxito!" });
    setPasswordForm({ current: "", new: "", confirm: "" });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setProfileStatus({ type: "", message: "" });

    if (!profileForm.firstName.trim() || !profileForm.lastName.trim() || !profileForm.country) {
      setProfileStatus({ type: "error", message: "Todos los campos son requeridos." });
      return;
    }

    // Update local user state
    setUser({
      ...user,
      firstName: profileForm.firstName.trim(),
      lastName: profileForm.lastName.trim(),
      country: profileForm.country.trim(),
    });

    setProfileStatus({ type: "success", message: "¡Datos del perfil actualizados con éxito!" });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h3 className="text-xl font-extrabold text-text">Configuración</h3>
        <p className="text-sm text-text opacity-70 mt-1">
          Personaliza tu cuenta y ajusta tus preferencias del sitio.
        </p>
      </div>

      {/* Preferencias Visuales y Beta Testing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tema */}
        <div className="p-5 rounded-xl border border-snd-bg bg-snd-bg/10 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-sm text-text mb-1">Apariencia del Sitio</h4>
            <p className="text-xs text-text opacity-60 mb-4">
              Cambia entre el modo claro y oscuro para una lectura cómoda.
            </p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-text">
              Tema actual: <span className="capitalize font-bold text-main">{theme === "light" ? "Claro ☀️" : "Oscuro 🌙"}</span>
            </span>
            <button
              onClick={toggleTheme}
              className="bg-main text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-hover transition cursor-pointer"
            >
              Cambiar Tema
            </button>
          </div>
        </div>

        {/* Beta Tester */}
        <div className="p-5 rounded-xl border border-snd-bg bg-snd-bg/10 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-sm text-text mb-1">Programa Beta Testing</h4>
            <p className="text-xs text-text opacity-60 mb-4">
              Recibe correos e invitaciones exclusivas para probar nuevas expansiones antes del lanzamiento.
            </p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-text">
              Estado: <span className={`font-bold ${user?.betaTester ? "text-accent" : "opacity-60"}`}>{user?.betaTester ? "Suscrito" : "No Suscrito"}</span>
            </span>
            <button
              onClick={handleBetaToggle}
              disabled={betaSubmitting}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                user?.betaTester
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-accent text-black hover:opacity-90"
              }`}
            >
              {betaSubmitting ? "Cargando..." : user?.betaTester ? "Cancelar Suscripción" : "Suscribirme"}
            </button>
          </div>
          {betaError && <p className="text-red-400 text-xs mt-2">{betaError}</p>}
        </div>
      </div>

      {/* Editar Información de Perfil */}
      <div className="p-6 rounded-xl border border-snd-bg bg-snd-bg/10">
        <h4 className="font-bold text-sm text-text mb-4 uppercase tracking-wide opacity-75">
          Editar Información Personal
        </h4>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text opacity-70 mb-1">Nombre</label>
              <input
                type="text"
                value={profileForm.firstName}
                onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-snd-bg bg-card-bg text-text focus:outline-none focus:border-main text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text opacity-70 mb-1">Apellido</label>
              <input
                type="text"
                value={profileForm.lastName}
                onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-snd-bg bg-card-bg text-text focus:outline-none focus:border-main text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-text opacity-70 mb-1">País</label>
            <input
              type="text"
              value={profileForm.country}
              onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-snd-bg bg-card-bg text-text focus:outline-none focus:border-main text-sm"
            />
          </div>

          {profileStatus.message && (
            <p className={`text-xs font-bold ${profileStatus.type === "success" ? "text-emerald-500" : "text-red-400"}`}>
              {profileStatus.message}
            </p>
          )}

          <button
            type="submit"
            className="bg-main text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-hover transition cursor-pointer"
          >
            Guardar Cambios
          </button>
        </form>
      </div>

      {/* Cambiar Contraseña */}
      <div className="p-6 rounded-xl border border-snd-bg bg-snd-bg/10">
        <h4 className="font-bold text-sm text-text mb-4 uppercase tracking-wide opacity-75">
          Cambiar Contraseña
        </h4>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-text opacity-70 mb-1">Contraseña Actual</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwordForm.current}
              onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-snd-bg bg-card-bg text-text focus:outline-none focus:border-main text-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text opacity-70 mb-1">Nueva Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwordForm.new}
                onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-snd-bg bg-card-bg text-text focus:outline-none focus:border-main text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text opacity-70 mb-1">Confirmar Nueva Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-snd-bg bg-card-bg text-text focus:outline-none focus:border-main text-sm"
              />
            </div>
          </div>

          {passwordStatus.message && (
            <p className={`text-xs font-bold ${passwordStatus.type === "success" ? "text-emerald-500" : "text-red-400"}`}>
              {passwordStatus.message}
            </p>
          )}

          <button
            type="submit"
            className="bg-main text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-hover transition cursor-pointer"
          >
            Actualizar Contraseña
          </button>
        </form>
      </div>
    </div>
  );
}
