import { useState } from "react";
import Modal from "../../../components/common/Modal";
import FormInput from "../../../components/common/FormInput";
import { PASSWORD_RE } from "../../auth/utils/validators";
import { changePassword } from "../services/profileService";

function PasswordModal({ hasProvider, onClose, onSuccess }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const fieldErrors = {};
    if (!hasProvider && !currentPassword) {
      fieldErrors.currentPassword = "Ingresá tu contraseña actual";
    }
    if (!PASSWORD_RE.test(newPassword)) {
      fieldErrors.newPassword = "Mín. 8 caracteres, con mayúscula, minúscula, número y símbolo";
    }
    if (newPassword !== confirmPassword) {
      fieldErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setSubmitting(true);
    try {
      const payload = hasProvider ? { newPassword } : { currentPassword, newPassword };
      await changePassword(payload);
      onSuccess?.();
      onClose();
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h3 className="text-lg font-bold mb-4">
        {hasProvider ? "Agregar contraseña" : "Cambiar contraseña"}
      </h3>
      <form onSubmit={handleSubmit} className="text-left">
        {!hasProvider && (
          <FormInput
            id="password-current"
            label="Contraseña actual"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            error={errors.currentPassword}
          />
        )}
        <FormInput
          id="password-new"
          label="Nueva contraseña"
          type="password"
          placeholder="••••••••"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={errors.newPassword}
        />
        <FormInput
          id="password-confirm"
          label="Confirmar nueva contraseña"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
        />

        {serverError && <p className="text-red-400 text-sm mb-4">{serverError}</p>}

        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-snd-bg text-text rounded-full py-2.5 text-sm font-bold cursor-pointer hover:opacity-80 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-main hover:bg-hover text-white rounded-full py-2.5 text-sm font-bold cursor-pointer disabled:opacity-60 transition"
          >
            {submitting ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default PasswordModal;
