import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/common/Button";
import FormInput from "../../../components/common/FormInput";
import { requestPasswordReset } from "../services/authService";
import { Trans } from "@lingui/react";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      await requestPasswordReset(email);
      setMessage(<Trans>Revisa tu correo para continuar</Trans>);
    } catch (err) {
      setMessage(err.message || <Trans>No se pudo enviar la solicitud</Trans>);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-5 py-10">
      <div className="w-full max-w-[380px] text-center">
        <h1 className="font-nunito text-2xl font-extrabold text-text mb-7">
          Recuperar contraseña
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <FormInput
            id="forgot-email"
            label="Correo electrónico"
            type="email"
            placeholder="usuario@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {message && (
            <p className="text-sm text-center text-main">{message}</p>
          )}

          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Enviando..." : "Enviar enlace de recuperación"}
          </Button>
        </form>

        <Button variant="link" onClick={() => navigate("/login")}>
          Volver al inicio de sesión
        </Button>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;

