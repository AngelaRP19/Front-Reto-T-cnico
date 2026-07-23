import { useState } from "react";
import Button from "../../../components/common/Button";
import FormInput from "../../../components/common/FormInput";

function SubscriptionForm({ cerrarFormulario }) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    tipoSuscripcion: "",
    pais: "",
    terminos: false,
    marketing: false,
  });

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

    const datos = {
      nombre: formData.nombre,
      email: formData.email,
      tipoSuscripcion: formData.tipoSuscripcion,
      pais: formData.pais,
      marketing: formData.marketing,
    };

    console.log(datos);
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
            <option value="Retos Simer">Retos Simmer</option>
            <option value="Beta Testing">Beta Testing</option>
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

          <Button type="submit" variant="primary">
            Enviar inscripción
          </Button>
        </form>
      </div>
    </div>
  );
}

export default SubscriptionForm;
