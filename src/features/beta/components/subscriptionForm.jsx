import { useState } from "react";
import Button from "../../../components/common/Button";
import FormInput from "../../../components/common/FormInput";
import { createSubscription } from "../services/subscriptionService";
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation("beta");

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
      alert(t("alertTerms"));
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
              {t("success")}
            </p>

            <Button variant="primary" onClick={cerrarFormulario}>
              {t("close")}
            </Button>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center mb-6">
              {t("title")}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                id="subscription-nombre"
                name="nombre"
                label={t("name")}
                placeholder={t("namePlaceholder")}
                value={formData.nombre}
                onChange={handleChange}
              />

              <FormInput
                id="subscription-email"
                name="email"
                type="email"
                label={t("email")}
                placeholder={t("emailPlaceholder")}
                value={formData.email}
                onChange={handleChange}
              />

              <select
                name="tipoSuscripcion"
                value={formData.tipoSuscripcion}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-[10px] border border-snd-bg bg-snd-bg text-text font-nunito focus:outline-none focus:border-main"
              >
                <option value="">{t("select")}</option>
                <option value="">{t("challenges")}</option>
                <option value="">{t("beta")}</option>
              </select>

              <FormInput
                id="subscription-pais"
                name="pais"
                label={t("country")}
                placeholder={t("countryPlaceholder")}
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
                <label>{t("terms")}</label>
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="marketing"
                  checked={formData.marketing}
                  onChange={handleChange}
                  className="accent-main w-4 h-4 cursor-pointer"
                />
                <label>{t("marketing")}</label>
              </div>

              {serverError ? (
                <p className="text-red-400 text-sm text-center">
                  {serverError}
                </p>
              ) : null}

              <Button
                type="submit"
                variant="primary"
                disabled={submitting}
              >
                {submitting ? t("sending") : t("send")}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default SubscriptionForm;