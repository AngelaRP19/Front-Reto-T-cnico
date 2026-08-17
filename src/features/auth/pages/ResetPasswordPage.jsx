import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLingui } from "@lingui/react";
import Button from "../../../components/common/Button";
import FormInput from "../../../components/common/FormInput";
import { resetPassword } from "../services/authService";
import { translateErrorMessage } from "../../../utils/errorMessages";

function ResetPasswordPage() {
  const { token } = useParams(); // token viene de la URL
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const { i18n } = useLingui();
  const t = (id, message) => i18n._({ id, message });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage(t("auth.reset.mismatch", "Las contraseñas no coinciden"));
      return;
    }
    setSubmitting(true);
    setMessage("");
    try {
      await resetPassword(token, newPassword);
      setMessage(t("auth.reset.success", "Contraseña actualizada correctamente"));
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(translateErrorMessage(err, t("auth.reset.error", "No se pudo restablecer la contraseña"), i18n));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-[1.25rem] min-[2560px]:px-12 min-[3840px]:px-20 py-[2.5rem] min-[2560px]:py-16 min-[3840px]:py-24">
      <div className="w-full max-w-[23.75rem] min-[2560px]:max-w-[42rem] min-[3840px]:max-w-[56rem] text-center">
        <h1 className="font-nunito text-[1.5rem] min-[2560px]:text-5xl min-[3840px]:text-7xl font-extrabold text-text mb-[1.75rem] min-[2560px]:mb-10">
          {t("auth.reset.title", "Restablecer contraseña")}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[1.25rem]">
          <FormInput
            id="new-password"
            label={t("auth.reset.newPassword", "Nueva contraseña")}
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />

          <FormInput
            id="confirm-password"
            label={t("auth.reset.confirmPassword", "Confirmar contraseña")}
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />

          {message && (
            <p className="text-sm text-center text-main">{message}</p>
          )}

          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? t("auth.reset.loading", "Actualizando...") : t("auth.reset.button", "Guardar nueva contraseña")}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
