import { useState } from "react";
import Button from "../../../components/common/Button";
import FormInput from "../../../components/common/FormInput";
import { register } from "../services/authService";

const USERNAME_RE = /^[a-zA-Z0-9_]{3,30}$/;
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/;
const NAME_RE = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/;
const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  username: "",
  nickname: "",
  email: "",
  country: "",
  password: "",
  confirmPassword: "",
};

function validate(form) {
  const errors = {};

  if (!NAME_RE.test(form.firstName.trim())) errors.firstName = "Solo letras y espacios";
  if (!NAME_RE.test(form.lastName.trim())) errors.lastName = "Solo letras y espacios";
  if (!USERNAME_RE.test(form.username.trim()))
    errors.username = "3-30 caracteres: letras, números y guion bajo";
  if (form.nickname.trim().length < 3 || form.nickname.trim().length > 30)
    errors.nickname = "Debe tener entre 3 y 30 caracteres";
  if (!EMAIL_RE.test(form.email.trim())) errors.email = "Correo inválido";
  if (form.country.trim().length < 2) errors.country = "País inválido";
  if (!PASSWORD_RE.test(form.password))
    errors.password = "Mín. 8 caracteres, con mayúscula, minúscula, número y símbolo";
  if (form.password !== form.confirmPassword)
    errors.confirmPassword = "Las contraseñas no coinciden";

  return errors;
}

function RegisterPage({ onBack, onHomeClick, onRegistered }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!acceptedTerms) {
      setServerError("Debes aceptar los términos y la política de privacidad");
      return;
    }

    const fieldErrors = validate(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setSubmitting(true);
    try {
      const data = await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        username: form.username.trim(),
        nickname: form.nickname.trim(),
        email: form.email.trim(),
        country: form.country.trim(),
        password: form.password,
      });

      onRegistered?.(data);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-bg px-5 py-10 transition-colors duration-400">
      <div className="w-full max-w-[380px] flex flex-col items-center text-center">
        <button
          type="button"
          onClick={onHomeClick}
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
          Crea tu cuenta The Sims
        </h1>

        <form className="w-full flex flex-col text-left" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <FormInput
              id="register-firstName"
              label="Nombre"
              placeholder="Sarah"
              value={form.firstName}
              onChange={updateField("firstName")}
              error={errors.firstName}
            />
            <FormInput
              id="register-lastName"
              label="Apellido"
              placeholder="Lopez"
              value={form.lastName}
              onChange={updateField("lastName")}
              error={errors.lastName}
            />
          </div>

          <FormInput
            id="register-username"
            label="Nombre de usuario"
            placeholder="panda7"
            value={form.username}
            onChange={updateField("username")}
            error={errors.username}
            hint={!errors.username ? "Letras, números y guion bajo" : undefined}
          />

          <FormInput
            id="register-nickname"
            label="Nickname"
            placeholder="Panda7"
            value={form.nickname}
            onChange={updateField("nickname")}
            error={errors.nickname}
            hint={!errors.nickname ? "Así te van a ver otros simmers" : undefined}
          />

          <FormInput
            id="register-email"
            label="Correo electrónico"
            type="email"
            placeholder="tucorreo@ejemplo.com"
            value={form.email}
            onChange={updateField("email")}
            error={errors.email}
          />

          <FormInput
            id="register-country"
            label="País"
            placeholder="Colombia"
            value={form.country}
            onChange={updateField("country")}
            error={errors.country}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormInput
              id="register-password"
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={updateField("password")}
              error={errors.password}
            />
            <FormInput
              id="register-confirmPassword"
              label="Confirmar"
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={updateField("confirmPassword")}
              error={errors.confirmPassword}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-text mb-5 cursor-pointer transition-colors duration-400">
            <input
              type="checkbox"
              className="accent-main w-4 h-4 cursor-pointer"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            Acepto los términos y la política de privacidad
          </label>

          {serverError ? (
            <p className="text-red-400 text-sm text-center mb-4">{serverError}</p>
          ) : null}

          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </form>

        <div className="flex items-center w-full mb-6 text-text opacity-60 text-[13px] before:content-[''] before:flex-1 before:h-px before:bg-snd-bg after:content-[''] after:flex-1 after:h-px after:bg-snd-bg">
          <span className="px-3">o regístrate con</span>
        </div>

        <div className="flex gap-3 w-full mb-6">
          <Button variant="oauth" onClick={() => console.log("Registro con Google")}>
            Google
          </Button>
          <Button variant="oauth" onClick={() => console.log("Registro con Meta")}>
            Meta
          </Button>
        </div>

        <Button variant="link" onClick={onBack}>
          ¿Ya tienes cuenta? Inicia sesión
        </Button>
      </div>
    </div>
  );
}

export default RegisterPage;
