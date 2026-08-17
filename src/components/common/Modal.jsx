import { useLingui } from "@lingui/react";

function Modal({ onClose, children, maxWidthClass = "max-w-sm" }) {
  const { i18n } = useLingui();
  const t = (id, message) => i18n._({ id, message });

  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 sm:p-6 min-[2560px]:p-10 min-[3840px]:p-16 z-[1500] animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`bg-card-bg text-text rounded-2xl min-[2560px]:rounded-3xl shadow-2xl w-full ${maxWidthClass} min-[2560px]:max-w-2xl min-[3840px]:max-w-4xl max-h-[calc(100vh-2rem)] overflow-y-auto p-5 sm:p-6 min-[2560px]:p-10 min-[3840px]:p-14 relative transition-colors duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 min-[2560px]:top-6 min-[2560px]:right-6 min-[3840px]:top-8 min-[3840px]:right-8 text-2xl min-[2560px]:text-4xl min-[3840px]:text-5xl font-bold text-text hover:text-hover"
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
