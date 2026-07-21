import { useState } from "react";
import Button from "../components/common/Button";
import FormInput from "../components/common/FormInput";
import "../styles/login.css";

function Login({ onBack }) {
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
    <div className="login-page">
      <div className="login-card">
        <div
          className="login-icon"
          onClick={onBack}
          title="Volver al inicio"
        >
          S
        </div>

        <h1 className="login-title">Inicia sesión en tu cuenta The Sims</h1>

        <div className="oauth-buttons">
          <Button variant="oauth" onClick={() => console.log("Login con Google")}>
            Google
          </Button>
          <Button variant="oauth" onClick={() => console.log("Login con Meta")}>
            Meta
          </Button>
        </div>

        <div className="divider">
          <span>o</span>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <FormInput
            id="login-email"
            label="Correo electrónico o usuario"
            placeholder="tucorreo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="remember-row">
            <input
              type="checkbox"
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

        <Button variant="outline" onClick={() => console.log("Crear cuenta")}>
          Crear cuenta
        </Button>
      </div>
    </div>
  );
}

export default Login;
