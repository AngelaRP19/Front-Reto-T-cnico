import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import FormInput from "../../../components/common/FormInput";
import FormSelect from "../../../components/common/FormSelect";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import PasswordModal from "../components/PasswordModal";
import COUNTRIES from "../../auth/data/countries";
import { NAME_RE, EMAIL_RE } from "../../auth/utils/validators";
import { setBetaTester } from "../../auth/services/authService";
import { updateProfile } from "../services/profileService";

function buildForm(user) {
  return {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
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

  const hasProvider = Boolean(user?.provider);

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
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
    if (!NAME_RE.test(form.firstName.trim())) fieldErrors.firstName = "Solo letras y espacios";
    if (!NAME_RE.test(form.lastName.trim())) fieldErrors.lastName = "Solo letras y espacios";
    if (!EMAIL_RE.test(form.email.trim())) fieldErrors.email = "Ingresá un correo electrónico válido";
    if (!form.country) fieldErrors.country = "Selecciona tu país";
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
        email: form.email.trim(),
        country: form.country,
      });
      setUser({ ...user, ...updated });
      setIsEditing(false);
    } catch (err) {
      if (err.sessionExpired) clearUser();
      setServerError(err.message || "No se pudo guardar. Intentá de nuevo.");
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
      setBetaError(err.message || "No se pudo cancelar. Intentá de nuevo.");
    } finally {
      setBetaSubmitting(false);
    }
  };

  return (
    <div className="bg-card-bg rounded-2xl shadow-sm border border-snd-bg p-6 sm:p-8 transition-colors duration-300">
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <h1 className="text-2xl font-extrabold text-text">Mi perfil</h1>
        <div className="flex items-center gap-3">
          {user?.betaTester && (
            <button
              onClick={() => setShowBetaCancelConfirm(true)}
              disabled={betaSubmitting}
              className="px-4 py-2 rounded-full text-sm font-bold text-accent border-2 border-accent bg-accent/10 hover:bg-accent/20 transition cursor-pointer disabled:opacity-60"
            >
              Beta tester
            </button>
          )}
          {!isEditing && (
            <button
              onClick={handleEditClick}
              className="bg-main text-white px-5 py-2 rounded-full font-bold hover:bg-hover transition"
            >
              Editar
            </button>
          )}
        </div>
      </div>

      {betaError && <p className="text-red-400 text-sm mb-4">{betaError}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <FormInput
          id="profile-firstName"
          label="Nombre"
          value={form.firstName}
          onChange={updateField("firstName")}
          error={errors.firstName}
          disabled={!isEditing}
        />
        <FormInput
          id="profile-lastName"
          label="Apellido"
          value={form.lastName}
          onChange={updateField("lastName")}
          error={errors.lastName}
          disabled={!isEditing}
        />
      </div>

      <FormInput
        id="profile-username"
        label="Nombre de usuario"
        value={user?.username || ""}
        onChange={() => {}}
        disabled
        hint="El nombre de usuario no se puede cambiar."
      />

      <FormInput
        id="profile-email"
        label="Correo electrónico"
        type="email"
        value={form.email}
        onChange={updateField("email")}
        error={errors.email}
        disabled={!isEditing}
      />

      <FormSelect
        id="profile-country"
        label="País"
        placeholder="Selecciona tu país"
        options={COUNTRIES}
        value={form.country}
        onChange={updateField("country")}
        error={errors.country}
        disabled={!isEditing}
      />

      <div className="w-full mb-4">
        <label className="block text-xs font-bold tracking-[0.5px] uppercase text-text opacity-70 mb-2">
          Contraseña
        </label>
        <div className="flex items-center gap-3">
          <input
            type="password"
            value="········"
            disabled
            className="flex-1 px-4 py-3 rounded-[10px] border border-snd-bg bg-snd-bg text-text text-[15px]"
          />
          <button
            onClick={() => setShowPasswordModal(true)}
            className="text-sm font-bold text-main hover:text-hover transition whitespace-nowrap"
          >
            {hasProvider ? "Agregar" : "Cambiar"}
          </button>
        </div>
      </div>

      {passwordSuccess && (
        <p className="text-accent text-sm font-bold mb-4">Contraseña actualizada correctamente.</p>
      )}

      {serverError && <p className="text-red-400 text-sm mb-4">{serverError}</p>}

      {isEditing && (
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleCancelEdit}
            className="flex-1 bg-snd-bg text-text rounded-full py-3 text-sm font-bold cursor-pointer hover:opacity-80 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveClick}
            disabled={submitting}
            className="flex-1 bg-main hover:bg-hover text-white rounded-full py-3 text-sm font-bold cursor-pointer disabled:opacity-60 transition"
          >
            {submitting ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      )}

      {showSaveConfirm && (
        <ConfirmDialog
          title="¿Guardar los cambios?"
          body="Se van a actualizar los datos de tu perfil."
          confirmLabel="Guardar"
          onConfirm={handleConfirmSave}
          onCancel={() => setShowSaveConfirm(false)}
        />
      )}

      {showBetaCancelConfirm && (
        <ConfirmDialog
          title="¿Quieres cancelar tu suscripción a Beta Testing?"
          body="Perderás el acceso anticipado a nuevos expansion packs y contenido experimental."
          confirmLabel="Sí, cancelar"
          cancelLabel="Mantener suscripción"
          danger
          confirmDisabled={betaSubmitting}
          onConfirm={handleBetaCancelConfirm}
          onCancel={() => setShowBetaCancelConfirm(false)}
        />
      )}

      {showPasswordModal && (
        <PasswordModal
          hasProvider={hasProvider}
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
