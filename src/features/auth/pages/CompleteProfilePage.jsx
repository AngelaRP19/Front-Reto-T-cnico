import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLingui } from "@lingui/react";
import Button from "../../../components/common/Button";
import FormInput from "../../../components/common/FormInput";
import FormSelect from "../../../components/common/FormSelect";
import COUNTRIES from "../data/countries";
import { NAME_RE, EMAIL_RE, USERNAME_RE } from "../utils/validators";
import { useAuth } from "../../../context/AuthContext";
import { updateProfile } from "../../profile/services/profileService";
import { translateErrorMessage, isFieldErrorMap } from "../../../utils/errorMessages";

function CompleteProfilePage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { i18n } = useLingui();
  const t = (id, message) => i18n._({ id, message });

  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    username: user?.username || "",
    email: user?.email || "",
    country: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validate = () => {
    const fieldErrors = {};
    if (!NAME_RE.test(form.firstName.trim())) fieldErrors.firstName = t("register.errors.name", "Solo letras y espacios");
    if (!NAME_RE.test(form.lastName.trim())) fieldErrors.lastName = t("register.errors.name", "Solo letras y espacios");
    if (!USERNAME_RE.test(form.username.trim())) fieldErrors.username = t("register.errors.username", "Usuario inválido");
    if (!EMAIL_RE.test(form.email.trim())) fieldErrors.email = t("register.errors.email", "Correo inválido");
    if (form.country.trim().length < 2 || form.country.trim().length > 56) fieldErrors.country = t("register.errors.country", "Seleccioná un país válido");
    return fieldErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const fieldErrors = validate();
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setSubmitting(true);
    try {
      const updated = await updateProfile({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        country: form.country.trim(),
      });
      setUser({ ...user, ...updated });
      navigate("/");
    } catch (err) {
      if (isFieldErrorMap(err.data)) {
        setErrors((prev) => ({ ...prev, ...err.data }));
        setServerError(t("completeProfile.formReview", "Revisá los campos marcados en el formulario."));
      } else {
        setServerError(translateErrorMessage(err, t("errors.generic", "Ocurrió un error"), i18n));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-bg px-5 py-10 transition-colors duration-400">
      <div className="w-full max-w-[23.75rem] flex flex-col items-center text-center">
        <img
          src="https://res.cloudinary.com/w1jl4sa5/image/upload/v1784825556/Logo_of_The_Sims_4.svg_jagzsl.webp"
          alt="Logo"
          className="w-[7.5rem] h-[7.5rem] object-contain"
        />

        <h1 className="font-nunito text-2xl font-extrabold text-text mb-2 transition-colors duration-400">
          {t("completeProfile.title", "Completá tu perfil")}
        </h1>
        <p className="text-sm text-text opacity-70 mb-7">
          {t("completeProfile.subtitle", "Nos falta un par de datos para terminar de armar tu cuenta.")}
        </p>

        <form className="w-full flex flex-col text-left" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormInput
              id="complete-firstName"
              label={t("register.firstName", "Nombre")}
              value={form.firstName}
              onChange={updateField("firstName")}
              error={errors.firstName}
              autoComplete="off"
            />
            <FormInput
              id="complete-lastName"
              label={t("register.lastName", "Apellido")}
              value={form.lastName}
              onChange={updateField("lastName")}
              error={errors.lastName}
              autoComplete="off"
            />
          </div>

          <FormInput
            id="complete-username"
            label={t("register.username", "Usuario")}
            value={form.username}
            onChange={updateField("username")}
            error={errors.username}
            autoComplete="off"
          />

          <FormInput
            id="complete-email"
            label={t("register.email", "Correo electrónico")}
            type="email"
            value={form.email}
            onChange={updateField("email")}
            error={errors.email}
            autoComplete="off"
          />

          <FormSelect
            id="complete-country"
            label={t("register.country", "País")}
            placeholder={t("register.countryPlaceholder", "Seleccioná tu país")}
            options={COUNTRIES}
            value={form.country}
            onChange={updateField("country")}
            error={errors.country}
          />

          {serverError ? (
            <p className="text-red-400 text-sm text-center mb-4">{serverError}</p>
          ) : null}

          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? t("completeProfile.saving", "Guardando...") : t("completeProfile.button", "Guardar y continuar")}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CompleteProfilePage;
