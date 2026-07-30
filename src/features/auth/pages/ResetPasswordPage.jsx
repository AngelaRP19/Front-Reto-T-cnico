import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../../components/common/Button";
import FormInput from "../../../components/common/FormInput";
import { resetPassword } from "../services/authService";
import { useTranslation } from "react-i18next";

function ResetPasswordPage() {
  const { token } = useParams(); // token viene de la URL
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const { t } = useTranslation("auth");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage(t("reset.mismatch")); // "Las contraseñas no coinciden"
      return;
    }
    setSubmitting(true);
    setMessage("");
    try {
      await resetPassword(token, newPassword);
      setMessage(t("reset.success")); // "Contraseña actualizada correctamente"
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.message || t("reset.error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-5 py-10">
      <div className="w-full max-w-[380px] text-center">
        <h1 className="font-nunito text-2xl font-extrabold text-text mb-7">
          {t("reset.title")}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <FormInput
            id="new-password"
            label={t("reset.newPassword")}
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <FormInput
            id="confirm-password"
            label={t("reset.confirmPassword")}
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {message && (
            <p className="text-sm text-center text-main">{message}</p>
          )}

          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? t("reset.loading") : t("reset.button")}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
