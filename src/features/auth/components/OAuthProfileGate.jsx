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
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[1400] animate-fadeIn">
      <div className="bg-card-bg text-text rounded-2xl shadow-2xl w-[90%] max-w-sm p-6 text-center transition-colors duration-300">
        <h3 className="text-lg font-bold mb-2">{t("oauth.completeProfile.title", "Completá tu perfil")}</h3>
        <p className="text-sm opacity-80 mb-5">
          {t("oauth.completeProfile.body", "Nos falta un dato para terminar de armar tu cuenta.")}
        </p>
        <button
          onClick={() => {
            setShow(false);
            navigate("/completar-perfil");
          }}
          className="w-full bg-main hover:bg-hover text-white rounded-full py-2.5 text-sm font-bold cursor-pointer transition"
        >
          {t("oauth.completeProfile.button", "Completar mi perfil")}
        </button>
      </div>
    </div>
  );
}

export default OAuthProfileGate;
