function ConfirmDialog({
  title,
  body,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
  confirmDisabled = false,
  danger = false,
}) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 sm:p-6 z-[1300] animate-fadeIn"
      onClick={onCancel}
    >
      <div
        className="bg-card-bg text-text rounded-2xl shadow-2xl w-full max-w-sm max-h-[calc(100vh-2rem)] overflow-y-auto p-5 sm:p-6 transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        {body && <p className="text-sm opacity-80 mb-5">{body}</p>}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-snd-bg text-text rounded-full py-2.5 text-sm font-bold cursor-pointer hover:opacity-80 transition"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={confirmDisabled}
            className={`flex-1 rounded-full py-2.5 text-sm font-bold cursor-pointer disabled:opacity-60 transition text-white ${
              danger ? "bg-red-500 hover:bg-red-600" : "bg-main hover:bg-hover"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
