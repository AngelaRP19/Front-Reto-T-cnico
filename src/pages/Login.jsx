import { useState } from "react";
import Button from "../components/common/Button";
import FormInput from "../components/common/FormInput";

function Login({ onBack, onRegisterClick }) {
  const [email, setEmail] = useState("");
  const [remember, setRemember] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Siguiente con:", { email, remember });
  };

  const handleForgotPassword = () => {
    console.log("¿Olvidaste tu contraseña?");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-bg px-5 py-10 transition-colors duration-400">
      <div className="w-full max-w-[380px] flex flex-col items-center text-center">
        <div
          className="w-[76px] h-[76px] rounded-full flex items-center justify-center bg-[linear-gradient(135deg,var(--main-color),var(--accent-color))] text-white font-nunito text-4xl font-extrabold cursor-pointer mb-5 transition-transform duration-300 hover:scale-105"
          onClick={onBack}
          title="Volver al inicio"
        >
          S
        </div>

        <h1 className="font-nunito text-2xl font-extrabold text-text mb-7 transition-colors duration-400">Inicia sesión en tu cuenta The Sims</h1>

        <form className="w-full flex flex-col text-left" onSubmit={handleSubmit}>
          <FormInput
            id="login-email"
            label="Correo electrónico o usuario"
            placeholder="tucorreo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="flex items-center w-full mb-6 text-text opacity-60 text-[13px] before:content-[''] before:flex-1 before:h-px before:bg-snd-bg after:content-[''] after:flex-1 after:h-px after:bg-snd-bg">
            <span className="px-3">o</span>
          </div>

          <div className="flex gap-3 w-full mb-6">
            <Button variant="oauth" onClick={() => console.log("Login con Google")}>
              Google
            </Button>
            <Button variant="oauth" onClick={() => console.log("Login con Meta")}>
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

          <Button type="submit" variant="primary">
            Siguiente
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

export default Login;