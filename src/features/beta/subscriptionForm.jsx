import { useState } from "react";

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

        <div
             className="
             bg-white
             rounded-2xl
             shadow-2xl
             w-[550px]
             p-8
             relative
             animate-[zoomIn_.35s_ease]"
        >
            
        <button
          onClick={cerrarFormulario}
          className="absolute top-4 right-4 text-2xl font-bold text-gray-500 hover:text-red-500"
        >
          ×
        </button>

        <h2 className="text-3xl font-bold text-center mb-6">
          Inscripción a la comunidad
        </h2>

        <form
            onSubmit={handleSubmit}
            className="space-y-4"
        >

          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <select 
            name="tipoSuscripcion"
            value={formData.tipoSuscripcion}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          >

            <option value="">Seleccione el tipo de suscripción</option>
            <option value="Retos Simer">Retos Simmer</option>
            <option value="Beta Testing">Beta Testing</option>
          </select>

          <input
            type="text"
            name="pais"
            placeholder="País"
            value={formData.pais}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <div className="flex items-start gap-2">
            <input 
            type="checkbox"
            name="terminos"
            checked={formData.terminos}
            onChange={handleChange}
             />

            <label>
              Acepto los términos y condiciones.
            </label>
          </div>

          <div className="flex items-start gap-2">
            <input 
             type="checkbox" 
             name="marketing"
             checked={formData.marketing}
             onChange={handleChange}
              />

            <label>
              Deseo recibir información y promociones por correo.
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition"
          >
            Enviar inscripción
          </button>

        </form>

      </div>

    </div>
  );
}

export default SubscriptionForm;