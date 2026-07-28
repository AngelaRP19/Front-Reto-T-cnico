function Modal({ onClose, children, maxWidthClass = "max-w-sm" }) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-[70] animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`bg-card-bg text-text rounded-2xl shadow-2xl w-[90%] ${maxWidthClass} p-6 relative transition-colors duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold text-text hover:text-hover"
          aria-label="Cerrar"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
