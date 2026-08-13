import { useLingui } from "@lingui/react";

function Modal({ onClose, children, maxWidthClass = "max-w-sm" }) {
  const { i18n } = useLingui();
  const t = (id, message) => i18n._({ id, message });

  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 sm:p-6 z-[1500] animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`bg-card-bg text-text rounded-2xl shadow-2xl w-full ${maxWidthClass} max-h-[calc(100vh-2rem)] overflow-y-auto p-5 sm:p-6 relative transition-colors duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold text-text hover:text-hover"
          aria-label={t("common.close", "Cerrar")}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
