import { useState } from "react";
import { useLingui } from "@lingui/react";
import { useAuth } from "../../../context/AuthContext";
import FormInput from "../../../components/common/FormInput";
import FormSelect from "../../../components/common/FormSelect";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import PasswordModal from "../components/PasswordModal";
import COUNTRIES from "../../auth/data/countries";
import { NAME_RE, EMAIL_RE, USERNAME_RE } from "../../auth/utils/validators";
import { setBetaTester } from "../../auth/services/authService";
import { updateProfile } from "../services/profileService";
import { translateErrorMessage, isFieldErrorMap } from "../../../utils/errorMessages";

function buildForm(user) {
  return {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    username: user?.username || "",
    email: user?.email || "",
    country: user?.country || "",
  };
}

function ProfileInfoTab() {
  const { user, setUser, clearUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(() => buildForm(user));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  const [showBetaCancelConfirm, setShowBetaCancelConfirm] = useState(false);
  const [betaSubmitting, setBetaSubmitting] = useState(false);
  const [betaError, setBetaError] = useState("");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const { i18n } = useLingui();
  const t = (id, message) => i18n._({ id, message });
  const hasPassword = user?.hasPassword !== false;

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleEditClick = () => {
    setForm(buildForm(user));
    setErrors({});
    setServerError("");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setForm(buildForm(user));
    setErrors({});
    setServerError("");
    setIsEditing(false);
  };

  const validate = () => {
    const fieldErrors = {};
    if (!NAME_RE.test(form.firstName.trim())) fieldErrors.firstName = t("profile.info.errors.name", "Solo letras y espacios");
    if (!NAME_RE.test(form.lastName.trim())) fieldErrors.lastName = t("profile.info.errors.name", "Solo letras y espacios");
    if (!USERNAME_RE.test(form.username.trim())) fieldErrors.username = t("profile.info.errors.username", "3-30 caracteres: letras, números y guion bajo");
    if (!EMAIL_RE.test(form.email.trim())) fieldErrors.email = t("profile.info.errors.email", "Ingresá un correo electrónico válido");
    if (!form.country) fieldErrors.country = t("profile.info.errors.country", "Selecciona tu país");
    return fieldErrors;
  };

  const handleSaveClick = () => {
    const fieldErrors = validate();
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;
    setShowSaveConfirm(true);
  };

  const handleConfirmSave = async () => {
    setShowSaveConfirm(false);
    setSubmitting(true);
    setServerError("");
    try {
      const updated = await updateProfile({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        country: form.country,
      });
      setUser({ ...user, ...updated });
      setIsEditing(false);
    } catch (err) {
      if (err.sessionExpired) clearUser();
      if (isFieldErrorMap(err.data)) {
        setErrors((prev) => ({ ...prev, ...err.data }));
        setServerError(t("profile.info.reviewFields", "Revisá los campos marcados."));
      } else {
        setServerError(translateErrorMessage(err, t("profile.info.saveError", "No se pudo guardar. Intentá de nuevo."), i18n));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleBetaCancelConfirm = async () => {
    setShowBetaCancelConfirm(false);
    setBetaSubmitting(true);
    setBetaError("");
    try {
      const updated = await setBetaTester(false);
      setUser({ ...user, ...updated });
    } catch (err) {
      if (err.sessionExpired) clearUser();
      setBetaError(translateErrorMessage(err, t("profile.info.betaCancelError", "No se pudo cancelar. Intentá de nuevo."), i18n));
    } finally {
      setBetaSubmitting(false);
    }
  };

  return (
    <div className="bg-card-bg rounded-2xl min-[2560px]:rounded-3xl shadow-sm border border-snd-bg p-6 sm:p-8 min-[2560px]:p-12 min-[3840px]:p-16 transition-colors duration-300">
      <div className="flex items-start justify-between gap-4 min-[2560px]:gap-6 mb-6 min-[2560px]:mb-10 flex-wrap">
        <h1 className="text-2xl min-[2560px]:text-5xl min-[3840px]:text-7xl font-extrabold text-text">{t("profile.info.title", "Mi perfil")}</h1>
        <div className="flex items-center gap-3">
          {user?.betaTester && (
            <button
              onClick={() => setShowBetaCancelConfirm(true)}
              disabled={betaSubmitting}
              className="px-4 py-2 min-[2560px]:px-6 min-[2560px]:py-4 min-[2560px]:text-xl min-[3840px]:px-8 min-[3840px]:py-5 min-[3840px]:text-3xl rounded-full text-sm font-bold text-accent-text border-2 border-accent bg-accent/10 hover:bg-accent/20 transition cursor-pointer disabled:opacity-60"
            >
              {t("profile.info.betaTester", "Beta tester")}
            </button>
          )}
          {!isEditing && (
            <button
              onClick={handleEditClick}
              className="bg-main text-bg px-5 py-2 min-[2560px]:px-8 min-[2560px]:py-4 min-[2560px]:text-2xl min-[3840px]:px-10 min-[3840px]:py-5 min-[3840px]:text-3xl rounded-full font-bold hover:bg-hover transition"
            >
              {t("profile.info.edit", "Editar")}
            </button>
          )}
        </div>
      </div>

      {betaError && <p className="text-error text-sm mb-4">{betaError}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <FormInput
          id="profile-firstName"
          label={t("profile.info.firstName", "Nombre")}
          value={isEditing ? form.firstName : ""}
          placeholder={isEditing ? undefined : form.firstName}
          onChange={updateField("firstName")}
          error={errors.firstName}
          disabled={!isEditing}
        />
        <FormInput
          id="profile-lastName"
          label={t("profile.info.lastName", "Apellido")}
          value={isEditing ? form.lastName : ""}
          placeholder={isEditing ? undefined : form.lastName}
          onChange={updateField("lastName")}
          error={errors.lastName}
          disabled={!isEditing}
        />
      </div>

      <FormInput
        id="profile-username"
        label={t("profile.info.username", "Nombre de usuario")}
        value={isEditing ? form.username : ""}
        placeholder={isEditing ? undefined : form.username}
        onChange={updateField("username")}
        error={errors.username}
        disabled={!isEditing}
      />

      <FormInput
        id="profile-email"
        label={t("profile.info.email", "Correo electrónico")}
        type="email"
        value={isEditing ? form.email : ""}
        placeholder={isEditing ? undefined : form.email}
        onChange={updateField("email")}
        error={errors.email}
        disabled={!isEditing}
      />

      <FormSelect
        id="profile-country"
        label={t("profile.info.country", "País")}
        placeholder={t("profile.info.countryPlaceholder", "Selecciona tu país")}
        options={COUNTRIES}
        value={form.country}
        onChange={updateField("country")}
        error={errors.country}
        disabled={!isEditing}
      />

      {hasPassword && (
        <div className="w-full mb-4">
          <label className="block text-xs min-[2560px]:text-base min-[3840px]:text-xl font-bold tracking-[0.03125rem] uppercase text-text opacity-70 mb-2 min-[2560px]:mb-3">
            {t("profile.info.password", "Contraseña")}
          </label>
          <div className="flex items-center gap-3">
            <input
              type="password"
              value="········"
              disabled
              className="flex-1 px-4 py-3 min-[2560px]:px-6 min-[2560px]:py-4.5 min-[3840px]:px-8 min-[3840px]:py-6 rounded-[0.625rem] min-[2560px]:rounded-xl min-[3840px]:rounded-2xl border border-snd-bg bg-snd-bg text-text text-[0.9375rem] min-[2560px]:text-xl min-[3840px]:text-3xl"
            />
            <button
              onClick={() => setShowPasswordModal(true)}
              className="text-sm min-[2560px]:text-xl min-[3840px]:text-3xl font-bold text-main hover:text-hover transition whitespace-nowrap"
            >
              {t("profile.info.changePassword", "Cambiar")}
            </button>
          </div>
        </div>
      )}

      {passwordSuccess && (
        <p className="text-accent-text text-sm font-bold mb-4">{t("profile.info.passwordUpdated", "Contraseña actualizada correctamente.")}</p>
      )}

      {serverError && <p className="text-error text-sm mb-4">{serverError}</p>}

      {isEditing && (
        <div className="flex gap-3 min-[2560px]:gap-5 mt-4 min-[2560px]:mt-6">
          <button
            onClick={handleCancelEdit}
            className="flex-1 bg-snd-bg text-text rounded-full py-3 min-[2560px]:py-4.5 min-[3840px]:py-6 text-sm min-[2560px]:text-xl min-[3840px]:text-3xl font-bold cursor-pointer hover:opacity-80 transition"
          >
            {t("profile.info.cancel", "Cancelar")}
          </button>
          <button
            onClick={handleSaveClick}
            disabled={submitting}
            className="flex-1 bg-main hover:bg-hover text-bg rounded-full py-3 min-[2560px]:py-4.5 min-[3840px]:py-6 text-sm min-[2560px]:text-xl min-[3840px]:text-3xl font-bold cursor-pointer disabled:opacity-60 transition"
          >
            {submitting ? t("profile.info.saving", "Guardando...") : t("profile.info.save", "Guardar cambios")}
          </button>
        </div>
      )}

      {showSaveConfirm && (
        <ConfirmDialog
          title={t("profile.info.confirmTitle", "¿Guardar los cambios?")}
          body={t("profile.info.confirmBody", "Se van a actualizar los datos de tu perfil.")}
          confirmLabel={t("profile.info.confirmButton", "Guardar")}
          onConfirm={handleConfirmSave}
          onCancel={() => setShowSaveConfirm(false)}
        />
      )}

      {showBetaCancelConfirm && (
        <ConfirmDialog
          title={t("profile.info.betaConfirmTitle", "¿Quieres cancelar tu suscripción a Beta Testing?")}
          body={t("profile.info.betaConfirmBody", "Perderás el acceso anticipado a nuevos expansion packs y contenido experimental.")}
          confirmLabel={t("profile.info.betaConfirmOk", "Sí, cancelar")}
          cancelLabel={t("profile.info.betaConfirmCancel", "Mantener suscripción")}
          danger
          confirmDisabled={betaSubmitting}
          onConfirm={handleBetaCancelConfirm}
          onCancel={() => setShowBetaCancelConfirm(false)}
        />
      )}

      {showPasswordModal && (
        <PasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSuccess={() => {
            setPasswordSuccess(true);
            setTimeout(() => setPasswordSuccess(false), 4000);
          }}
        />
      )}
    </div>
  );
}

export default ProfileInfoTab;
