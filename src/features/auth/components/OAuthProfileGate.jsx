import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLingui } from "@lingui/react";
import { useAuth } from "../../../context/AuthContext";

// Se muestra una vez por carga de página cuando el usuario logueado (típicamente
// por Google/Meta) todavía no tiene país cargado — country es obligatorio en el
// registro normal, así que su ausencia es en sí misma la señal de "perfil incompleto
// por OAuth", sin necesitar ningún flag nuevo del backend.
function OAuthProfileGate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useLingui();
  const t = (id, message) => i18n._({ id, message });
  const [checked, setChecked] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (checked || !user) return;
    setChecked(true);
    if (!user.country && location.pathname !== "/completar-perfil") {
      setShow(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 min-[2560px]:p-10 min-[3840px]:p-16 z-[1500] animate-fadeIn">
      <div className="bg-card-bg text-text rounded-2xl min-[2560px]:rounded-3xl shadow-2xl w-[90%] max-w-sm min-[2560px]:max-w-2xl min-[3840px]:max-w-4xl p-6 min-[2560px]:p-10 min-[3840px]:p-14 text-center transition-colors duration-300">
        <h3 className="text-lg min-[2560px]:text-3xl min-[3840px]:text-5xl font-bold mb-2 min-[2560px]:mb-4">{t("oauth.completeProfile.title", "Completá tu perfil")}</h3>
        <p className="text-sm min-[2560px]:text-xl min-[3840px]:text-3xl opacity-80 mb-5 min-[2560px]:mb-8">
          {t("oauth.completeProfile.body", "Nos falta un dato para terminar de armar tu cuenta.")}
        </p>
        <button
          onClick={() => {
            setShow(false);
            navigate("/completar-perfil");
          }}
          className="w-full bg-main hover:bg-hover text-bg rounded-full py-2.5 min-[2560px]:py-4 min-[3840px]:py-6 text-sm min-[2560px]:text-2xl min-[3840px]:text-4xl font-bold cursor-pointer transition"
        >
          {t("oauth.completeProfile.button", "Completar mi perfil")}
        </button>
      </div>
    </div>
  );
}

export default OAuthProfileGate;
