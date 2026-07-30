import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLingui } from "@lingui/react";
import Button from "../../../components/common/Button";
import FormInput from "../../../components/common/FormInput";
import { requestPasswordReset } from "../services/authService";
import { translateErrorMessage } from "../../../utils/errorMessages";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { i18n } = useLingui();
  const t = (id, message) => i18n._({ id, message });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      await requestPasswordReset(email);
      setMessage(t("auth.forgot.success", "Revisa tu correo para continuar"));
    } catch (err) {
      setMessage(translateErrorMessage(err, t("auth.forgot.error", "No se pudo enviar la solicitud"), i18n));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-5 py-10">
      <div className="w-full max-w-[380px] text-center">
        <h1 className="font-nunito text-2xl font-extrabold text-text mb-7">
          {t("auth.forgot.title", "Recuperar contraseña")}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <FormInput
            id="forgot-email"
            label={t("auth.forgot.email", "Correo electrónico")}
            type="email"
            placeholder={t("auth.forgot.emailPlaceholder", "usuario@correo.com")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {message && (
            <p className="text-sm text-center text-main">{message}</p>
          )}

          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? t("auth.forgot.loading", "Enviando...") : t("auth.forgot.button", "Enviar enlace de recuperación")}
          </Button>
        </form>

        <Button variant="link" onClick={() => navigate("/login")}>
          {t("auth.forgot.backToLogin", "Volver al inicio de sesión")}
        </Button>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;

