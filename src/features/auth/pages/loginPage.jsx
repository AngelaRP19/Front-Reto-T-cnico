import { useState } from "react";
import Button from "../../../components/common/Button";
import FormInput from "../../../components/common/FormInput";
import { login } from "../services/authService";
import { API_BASE_URL } from "../../../services/apiClient";
import { useAuth } from "../../../context/AuthContext";

function LoginPage({ onBack, onRegisterClick, onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSubmitting(true);
    try {
      const data = await login(username.trim(), password);
      setUser({ username: username.trim() });
      onLoginSuccess?.(data);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOAuthLogin = (provider) => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/${provider}`;
  };

  const handleForgotPassword = () => {
    console.log("¿Olvidaste tu contraseña?");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-bg px-5 py-10 transition-colors duration-400">
      <div className="w-full max-w-[380px] flex flex-col items-center text-center">
        <div
          onClick={onBack}
          title="Volver al inicio"
        >
          <img 
            src="https://res.cloudinary.com/w1jl4sa5/image/upload/v1784825556/Logo_of_The_Sims_4.svg_jagzsl.webp" 
            alt="Logo" 
            className="w-[120px] h-[120px] object-contain" 
          />
        </div>

        <h1 className="font-nunito text-2xl font-extrabold text-text mb-7 transition-colors duration-400">Inicia sesión en tu cuenta The Sims</h1>

        <form className="w-full flex flex-col text-left" onSubmit={handleSubmit}>
          <FormInput
            id="login-email"
            label="Nombre de usuario"
            placeholder="panda7"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <FormInput
            id="login-password"
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center w-full mb-6 text-text opacity-60 text-[13px] before:content-[''] before:flex-1 before:h-px before:bg-snd-bg after:content-[''] after:flex-1 after:h-px after:bg-snd-bg">
            <span className="px-3">o</span>
          </div>

          <div className="flex gap-3 w-full mb-6">
            <Button variant="oauth" onClick={() => handleOAuthLogin("google")}>
              Google
            </Button>
            <Button variant="oauth" onClick={() => handleOAuthLogin("meta")}>
              Meta
            </Button>
          </div>

          <label className="flex items-center gap-2 text-sm text-text mb-5 cursor-pointer transition-colors duration-400">
            <input
              type="checkbox"
              className="accent-main w-4 h-4 cursor-pointer"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            No cerrar sesión
          </label>

          {serverError ? (
            <p className="text-red-400 text-sm text-center mb-4">{serverError}</p>
          ) : null}

          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>

        <Button variant="link" onClick={handleForgotPassword}>
          ¿Olvidaste tu contraseña?
        </Button>

        <Button variant="outline" onClick={onRegisterClick}>
          Crear cuenta
        </Button>
      </div>
    </div>
  );
}

export default LoginPage;
