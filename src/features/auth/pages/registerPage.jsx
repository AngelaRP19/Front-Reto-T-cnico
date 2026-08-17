import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLingui } from "@lingui/react";
import Button from "../../../components/common/Button";
import FormInput from "../../../components/common/FormInput";
import FormSelect from "../../../components/common/FormSelect";
import { register, fetchCurrentUser } from "../services/authService";
import { API_BASE_URL, clearLoggedOutMark } from "../../../services/apiClient";
import { useAuth } from "../../../context/AuthContext";
import COUNTRIES from "../data/countries";
import { translateErrorMessage, isFieldErrorMap } from "../../../utils/errorMessages";
import { USERNAME_RE, PASSWORD_RE, NAME_RE, EMAIL_RE } from "../utils/validators";

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  country: "",
  password: "",
  confirmPassword: "",
};

// Paliativo mientras el backend no devuelve un mapa de errores para username/email
// duplicados (ver ROUTING.md/plan de trabajo): hoy responde con un string plano,
// así que lo interpretamos para al menos marcar el campo correcto.
function parseDuplicateFieldError(message) {
  if (!message) return null;
  const lower = message.toLowerCase();
  const fieldErrors = {};
  if (lower.includes("usuario")) fieldErrors.username = message;
  if (lower.includes("correo")) fieldErrors.email = message;
  return Object.keys(fieldErrors).length > 0 ? fieldErrors : null;
}

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [betaConsent, setBetaConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const { i18n } = useLingui();
  const t = (id, message) => i18n._({ id, message });
  const { setUser } = useAuth();

  const validate = (form) => {
    const errors = {};
    if (!NAME_RE.test(form.firstName.trim()))
      errors.firstName = t("register.errors.name", "Solo letras y espacios");
    if (!NAME_RE.test(form.lastName.trim()))
      errors.lastName = t("register.errors.name", "Solo letras y espacios");
    if (!USERNAME_RE.test(form.username.trim()))
      errors.username = t("register.errors.username", "Usuario inválido");
    if (!EMAIL_RE.test(form.email.trim()))
      errors.email = t("register.errors.email", "Correo inválido");
    if (form.country.trim().length < 2 || form.country.trim().length > 56)
      errors.country = t("register.errors.country", "Seleccioná un país válido");
    if (!PASSWORD_RE.test(form.password))
      errors.password = t("register.errors.password", "La contraseña no cumple los requisitos");
    if (form.password !== form.confirmPassword)
      errors.confirmPassword = t("register.errors.confirmPassword", "Las contraseñas no coinciden");
    return errors;
  };

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!acceptedTerms) {
      setServerError(t("register.errors.terms", "Debes aceptar los términos"));
      return;
    }

    const fieldErrors = validate(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setSubmitting(true);
    try {
      await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        country: form.country.trim(),
        password: form.password,
        betaTester: betaConsent,
      });

      const me = await fetchCurrentUser();
      setUser({
        username: form.username.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        ...me,
      });
      navigate("/");
    } catch (err) {
      const duplicateFieldErrors = !isFieldErrorMap(err.data) && parseDuplicateFieldError(err.message);
      if (isFieldErrorMap(err.data)) {
        setErrors((prev) => ({ ...prev, ...err.data }));
        setServerError(t("register.formReview", "Revisá los campos marcados en el formulario."));
      } else if (duplicateFieldErrors) {
        setErrors((prev) => ({ ...prev, ...duplicateFieldErrors }));
        setServerError(t("register.formReview", "Revisá los campos marcados en el formulario."));
      } else {
        setServerError(translateErrorMessage(err, t("errors.generic", "Ocurrió un error"), i18n));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleOAuthRegister = (provider) => {
    clearLoggedOutMark();
    window.location.href = `${API_BASE_URL}/oauth2/authorization/${provider}`;
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-bg px-5 py-10 min-[2560px]:px-12 min-[2560px]:py-16 min-[3840px]:px-20 min-[3840px]:py-24 transition-colors duration-400">
      <div className="w-full max-w-[23.75rem] min-[2560px]:max-w-[48rem] min-[3840px]:max-w-[62rem] flex flex-col items-center text-center">
        <button
          type="button"
          onClick={() => navigate("/")}
          title={t("auth.backToHome", "Volver al inicio")}
          className="cursor-pointer"
        >
          <img
            src="https://res.cloudinary.com/w1jl4sa5/image/upload/v1784825556/Logo_of_The_Sims_4.svg_jagzsl.webp"
            alt="Logo"
            className="w-[7.5rem] h-[7.5rem] min-[2560px]:w-[11rem] min-[2560px]:h-[11rem] min-[3840px]:w-[14rem] min-[3840px]:h-[14rem] object-contain"
          />
        </button>

        <h1 className="font-nunito text-2xl min-[2560px]:text-5xl min-[3840px]:text-7xl font-extrabold text-text mb-7 min-[2560px]:mb-12 transition-colors duration-400">
          {t("register.title", "Crear cuenta")}
        </h1>

        <form className="w-full flex flex-col text-left" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormInput
              id="register-firstName"
              label={t("register.firstName", "Nombre")}
              placeholder={t("register.firstNamePlaceholder", "Tu nombre")}
              value={form.firstName}
              onChange={updateField("firstName")}
              error={errors.firstName}
              autoComplete="off"
            />
            <FormInput
              id="register-lastName"
              label={t("register.lastName", "Apellido")}
              placeholder={t("register.lastNamePlaceholder", "Tu apellido")}
              value={form.lastName}
              onChange={updateField("lastName")}
              error={errors.lastName}
              autoComplete="off"
            />
          </div>

          <FormInput
            id="register-username"
            label={t("register.username", "Usuario")}
            placeholder={t("register.usernamePlaceholder", "Elige un usuario")}
            value={form.username}
            onChange={updateField("username")}
            error={errors.username}
            hint={!errors.username ? t("register.usernameHint", "Mínimo 4 caracteres") : undefined}
            autoComplete="off"
          />

          <FormInput
            id="register-email"
            label={t("register.email", "Correo electrónico")}
            placeholder={t("register.emailPlaceholder", "tu@email.com")}
            type="email"
            value={form.email}
            onChange={updateField("email")}
            error={errors.email}
            autoComplete="off"
          />

          <FormSelect
            id="register-country"
            label={t("register.country", "País")}
            placeholder={t("register.countryPlaceholder", "Seleccioná tu país")}
            options={COUNTRIES}
            value={form.country}
            onChange={updateField("country")}
            error={errors.country}
            autoComplete="off"
          />

          <div className="grid grid-cols-2 gap-3">
            <FormInput
              id="register-password"
              label={t("register.password", "Contraseña")}
              type="password"
              placeholder={t("register.passwordPlaceholder", "Mínimo 8 caracteres")}
              value={form.password}
              onChange={updateField("password")}
              error={errors.password}
              autoComplete="new-password"
            />
            <FormInput
              id="register-confirmPassword"
              label={t("register.confirmPassword", "Confirmar contraseña")}
              type="password"
              placeholder={t("register.passwordPlaceholder", "Mínimo 8 caracteres")}
              value={form.confirmPassword}
              onChange={updateField("confirmPassword")}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />
          </div>

          {!errors.password && (
            <p className="w-full text-text opacity-50 text-xs min-[2560px]:text-sm min-[3840px]:text-xl -mt-2 mb-4">
              {t("auth.passwordRequirements", "Debe incluir mayúscula, minúscula, número y carácter especial.")}
            </p>
          )}

          <label className="flex items-center gap-3 min-[2560px]:gap-4 p-3 min-[2560px]:p-5 min-[3840px]:p-6 mb-4 min-[2560px]:mb-6 rounded-xl min-[2560px]:rounded-2xl border-2 border-accent bg-accent/10 cursor-pointer transition-colors duration-300">
            <input
              type="checkbox"
              className="accent-accent w-5 h-5 cursor-pointer shrink-0"
              checked={betaConsent}
              onChange={(e) => setBetaConsent(e.target.checked)}
            />
            <span className="text-sm min-[2560px]:text-xl min-[3840px]:text-3xl font-bold text-text">
              {t("register.betaConsent", "Acepto recibir correos para beta testing")}
            </span>
          </label>

          <label className="flex items-center gap-2 text-sm text-text mb-5 cursor-pointer transition-colors duration-400">
            <input
              type="checkbox"
              className="accent-main w-4 h-4 cursor-pointer"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            {t("register.terms", "Acepto los términos y condiciones")}
          </label>

          {serverError ? (
            <p className="text-error text-sm text-center mb-4">{serverError}</p>
          ) : null}

          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? t("register.loading", "Creando cuenta...") : t("register.button", "Crear cuenta")}
          </Button>
        </form>

        <div className="flex items-center w-full mb-6 text-text opacity-60 text-[0.8125rem] before:content-[''] before:flex-1 before:h-[0.0625rem] before:bg-snd-bg after:content-[''] after:flex-1 after:h-[0.0625rem] after:bg-snd-bg">
          <span className="px-3">{t("register.or", "o")}</span>
        </div>

        <div className="flex gap-3 w-full mb-6">
          <Button variant="oauth" onClick={() => handleOAuthRegister("google")}>
            Google
          </Button>
          <Button variant="oauth" onClick={() => handleOAuthRegister("meta")}>
            Meta
          </Button>
        </div>

        <Button variant="link" onClick={() => navigate("/login")}>
          {t("register.login", "Ya tengo cuenta")}
        </Button>
      </div>
    </div>
  );
}

export default RegisterPage;