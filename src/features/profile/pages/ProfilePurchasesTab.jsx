import { useLingui } from "@lingui/react";

function ProfilePurchasesTab() {
  const { i18n } = useLingui();
  const t = (id, message) => i18n._({ id, message });

  return (
    <div className="bg-card-bg rounded-2xl shadow-sm border border-snd-bg p-6 sm:p-8 transition-colors duration-300">
      <h1 className="text-2xl font-extrabold text-text mb-4">{t("profile.purchases.title", "Historial de compras")}</h1>
      <p className="text-text opacity-70">{t("profile.purchases.placeholder", "Muy pronto vas a poder ver tu historial de compras acá.")}</p>
    </div>
  );
}

export default ProfilePurchasesTab;
