import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/common/Button";
import FormInput from "../../../components/common/FormInput";
import FormSelect from "../../../components/common/FormSelect";
import { register, fetchCurrentUser } from "../services/authService";
import { API_BASE_URL, clearLoggedOutMark } from "../../../services/apiClient";
import { useAuth } from "../../../context/AuthContext";
import { useTranslation } from "react-i18next";
import COUNTRIES from "../data/countries";
import { USERNAME_RE, PASSWORD_RE, NAME_RE, EMAIL_RE } from "../utils/validators";

const USERNAME_RE = /^[a-zA-Z0-9_]{3,30}$/;
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/;
const NAME_RE = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/;
const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  country: "",
  password: "",
  confirmPassword: "",
};

function validate(form){
  const errors = {};

  if (!NAME_RE.test(form.firstName.trim())) errors.firstName = t("register.errors.name");
  if (!NAME_RE.test(form.lastName.trim())) errors.lastName = t("register.errors.name");
  if (!USERNAME_RE.test(form.username.trim()))
    errors.username = t("register.errors.username");
  if (!EMAIL_RE.test(form.email.trim())) errors.email = t("register.errors.email");
  if (form.country.trim().length < 2 || form.country.trim().length > 56)
    errors.country = t("register.errors.country");
  if (!PASSWORD_RE.test(form.password))
    errors.password = t("register.errors.password");
  if (form.password !== form.confirmPassword)
    errors.confirmPassword = t("register.errors.confirmPassword");

  return errors;
  
}

function isFieldErrorMap(data) {
  return (
    data &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    typeof data.message !== "string" &&
    typeof data.error !== "string"
  );
}

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [betaConsent, setBetaConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const { t } = useTranslation("auth");
  const { setUser } = useAuth();  

   
}

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!acceptedTerms) {

      setServerError(t("register.errors.terms"));

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
      if (isFieldErrorMap(err.data)) {
        setErrors((prev) => ({ ...prev, ...err.data }));
        setServerError("Revisá los campos marcados en el formulario.");
      } else {
        setServerError(err.message);
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
    <div className="min-h-screen w-full flex items-center justify-center bg-bg px-5 py-10 transition-colors duration-400">
      <div className="w-full max-w-[380px] flex flex-col items-center text-center">
        <button
          type="button"
          onClick={() => navigate("/")}
          title="Volver al inicio"
          className="cursor-pointer"
        >
          <img
            src="https://res.cloudinary.com/w1jl4sa5/image/upload/v1784825556/Logo_of_The_Sims_4.svg_jagzsl.webp"
            alt="Logo"
            className="w-[120px] h-[120px] object-contain"
          />
        </button>

        <h1 className="font-nunito text-2xl font-extrabold text-text mb-7 transition-colors duration-400">
            {t("register.title")}
        </h1>

        <form className="w-full flex flex-col text-left" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <FormInput
              id="register-firstName"
              label={t("register.firstName")}
              placeholder={t("register.firstNamePlaceholder")}
              value={form.firstName}
              onChange={updateField("firstName")}
              error={errors.firstName}
            />
            <FormInput
              id="register-lastName"
              label={t("register.lastName")}
              placeholder={t("register.lastNamePlaceholder")}
              value={form.lastName}
              onChange={updateField("lastName")}
              error={errors.lastName}
            />
          </div>

          <FormInput

            id="register-username"
            label={t("register.username")}
            placeholder={t("register.usernamePlaceholder")}
            value={form.username}
            onChange={updateField("username")}
            error={errors.username}
            hint={!errors.username ? t("register.usernameHint") : undefined}
          />

          <FormInput

            id="register-email"
            label={t("register.email")}
            placeholder={t("register.emailPlaceholder")}
            type="email"
            value={form.email}
            onChange={updateField("email")}
            error={errors.email}
          />

          <FormSelect
            id="register-country"
            label={t("register.country")}
            placeholder={t("register.countryPlaceholder")}
            options={COUNTRIES}
            value={form.country}
            onChange={updateField("country")}
            error={errors.country}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormInput
              id="register-password"
              label={t("register.password")}
              type="password"
              placeholder={t("register.passwordPlaceholder")}
              value={form.password}
              onChange={updateField("password")}
              error={errors.password}
            />
            <FormInput
              id="register-confirmPassword"
              label={t("register.confirmPassword")}
              type="password"
              placeholder={t("register.passwordPlaceholder")}
              value={form.confirmPassword}
              onChange={updateField("confirmPassword")}
              error={errors.confirmPassword}
            />
          </div>

          <label className="flex items-center gap-3 p-3 mb-4 rounded-xl border-2 border-accent bg-accent/10 cursor-pointer transition-colors duration-300">
            <input
              type="checkbox"
              className="accent-accent w-5 h-5 cursor-pointer shrink-0"
              checked={betaConsent}
              onChange={(e) => setBetaConsent(e.target.checked)}
            />
            <span className="text-sm font-bold text-text">¡Acepto recibir correos para beta testing!</span>
          </label>

          <label className="flex items-center gap-2 text-sm text-text mb-5 cursor-pointer transition-colors duration-400">
            <input
              type="checkbox"
              className="accent-main w-4 h-4 cursor-pointer"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            {t("register.terms")}
          </label>

          {serverError ? (
            <p className="text-red-400 text-sm text-center mb-4">{serverError}</p>
          ) : null}

          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? t("register.loading") : t("register.button")}
          </Button>
        </form>

        <div className="flex items-center w-full mb-6 text-text opacity-60 text-[13px] before:content-[''] before:flex-1 before:h-px before:bg-snd-bg after:content-[''] after:flex-1 after:h-px after:bg-snd-bg">
          <span className="px-3">{t("register.or")}</span>
        </div>

        <div className="flex gap-3 w-full mb-6">
          <Button variant="oauth" onClick={() => handleOAuthRegister("google")}>
            Google
          </Button>
          <Button variant="oauth" onClick={() => handleOAuthRegister("meta")}>
            Meta
          </Button>
        </div>

        <Button variant="link" onClick={() => navigate("login")}>
          {t("register.login")}
        </Button>
      </div>
    </div>

  );


export default RegisterPage;
