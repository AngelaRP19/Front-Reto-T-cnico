import { useState } from "react";
import Button from "../../../components/common/Button";
import FormInput from "../../../components/common/FormInput";
import { createSubscription } from "../services/subscriptionService";

function SubscriptionForm({ cerrarFormulario }) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    tipoSuscripcion: "",
    pais: "",
    terminos: false,
    marketing: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.terminos) {
      alert("Debes aceptar los términos y condiciones para continuar.");
      return;
    }

    setServerError("");
    setSubmitting(true);
    try {
      await createSubscription({
        name: formData.nombre,
        email: formData.email,
        subscriptionType: formData.tipoSuscripcion,
        country: formData.pais,
        consentMarketing: formData.marketing,
      });
      setSubmitted(true);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="
        fixed inset-0
        bg-black/60
        flex justify-center items-center
        z-50
        animate-fadeIn"
    >
      <div className="rounded-2xl shadow-2xl w-[550px] p-8 relative animate-[zoomIn_.35s_ease] bg-card-bg text-text transition-colors duration-300">
        <button
          onClick={cerrarFormulario}
          className="absolute top-4 right-4 text-2xl font-bold text-text hover:text-hover"
        >
          ×
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <p className="text-text text-lg font-semibold mb-6">
              ¡Gracias por registrarte! Te enviaremos más información al correo registrado.
            </p>
            <Button variant="primary" onClick={cerrarFormulario}>
              Cerrar
            </Button>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center mb-6">
              Inscripción a la comunidad
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                id="subscription-nombre"
                name="nombre"
                label="Nombre completo"
                placeholder="Nombre completo"
                value={formData.nombre}
                onChange={handleChange}
              />

              <FormInput
                id="subscription-email"
                name="email"
                type="email"
                label="Correo electrónico"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
              />

              <select
                name="tipoSuscripcion"
                value={formData.tipoSuscripcion}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-[10px] border border-snd-bg bg-snd-bg text-text font-nunito focus:outline-none focus:border-main"
              >
                <option value="">Seleccione el tipo de suscripción</option>
                <option value="SIMMER_CHALLENGE">Retos Simmer</option>
                <option value="BETA_TESTING">Beta Testing</option>
              </select>

              <FormInput
                id="subscription-pais"
                name="pais"
                label="País"
                placeholder="País"
                value={formData.pais}
                onChange={handleChange}
              />

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="terminos"
                  checked={formData.terminos}
                  onChange={handleChange}
                  className="accent-main w-4 h-4 cursor-pointer"
                />
                <label className="text-text">Acepto los términos y condiciones.</label>
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="marketing"
                  checked={formData.marketing}
                  onChange={handleChange}
                  className="accent-main w-4 h-4 cursor-pointer"
                />
                <label className="text-text">
                  Deseo recibir información y promociones por correo.
                </label>
              </div>

              {serverError ? (
                <p className="text-red-400 text-sm text-center">{serverError}</p>
              ) : null}

              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? "Enviando..." : "Enviar inscripción"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default SubscriptionForm;
