import { useAuth } from "../../../context/AuthContext";

export default function ProfileInfoTab() {
  const { user } = useAuth();

  if (!user) return null;

  const infoFields = [
    { label: "Nombre", value: user.firstName || "No especificado" },
    { label: "Apellido", value: user.lastName || "No especificado" },
    { label: "Nombre de usuario", value: user.username || "No especificado" },
    { label: "Correo electrónico", value: user.email || "No especificado" },
    { label: "País", value: user.country || "No especificado" },
    {
      label: "Estado de suscripción",
      value: user.betaTester ? "Beta Tester Activo" : "Usuario Estándar",
      highlight: user.betaTester,
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h3 className="text-xl font-extrabold text-text">Mi Información</h3>
        <p className="text-sm text-text opacity-70 mt-1">
          Aquí puedes ver los detalles asociados con tu cuenta The Sims.
        </p>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {infoFields.map((field, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-snd-bg bg-snd-bg/10 flex flex-col justify-center transition-all duration-300 hover:shadow-sm"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-text opacity-50 mb-1">
              {field.label}
            </span>
            <span
              className={`text-base font-semibold text-text ${
                field.highlight ? "text-accent font-bold" : ""
              }`}
            >
              {field.value}
            </span>
          </div>
        ))}
      </div>

      {/* Account Stats Section */}
      <div className="p-5 rounded-xl border border-snd-bg bg-snd-bg/20">
        <h4 className="font-bold text-sm text-text mb-4 uppercase tracking-wide opacity-75">
          Resumen de Actividad
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-lg bg-card-bg border border-snd-bg shadow-sm">
            <span className="block text-2xl font-black text-main">🟢</span>
            <span className="block text-xs font-bold text-text opacity-60 mt-1">
              Estado de Cuenta
            </span>
            <span className="block text-sm font-extrabold text-text mt-0.5">
              Activo
            </span>
          </div>
          <div className="p-4 rounded-lg bg-card-bg border border-snd-bg shadow-sm">
            <span className="block text-2xl font-black text-main">🎮</span>
            <span className="block text-xs font-bold text-text opacity-60 mt-1">
              Packs Adquiridos
            </span>
            <span className="block text-sm font-extrabold text-text mt-0.5">
              3 Packs
            </span>
          </div>
          <div className="p-4 rounded-lg bg-card-bg border border-snd-bg shadow-sm">
            <span className="block text-2xl font-black text-accent">🏆</span>
            <span className="block text-xs font-bold text-text opacity-60 mt-1">
              Retos Aceptados
            </span>
            <span className="block text-sm font-extrabold text-text mt-0.5">
              Ver pestaña retos
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
