import React, { useState } from 'react';

export function Card(props) {
  const [isAccepted, setIsAccepted] = useState(false);

  const handleAccept = () => {
    const nextState = !isAccepted;
    setIsAccepted(nextState);
    if (props.onAceptar) {
      props.onAceptar(nextState);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto font-sans">
      {/* Contenedor de la Tarjeta */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs transition-all duration-200 hover:border-slate-300">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Miniatura e Información dinámica desde props */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
              {props.image || props.imagen ? (
                <img 
                  src={props.image || props.imagen} 
                  alt={props.titulo || 'Reto'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate tracking-tight">
                {props.titulo}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-1.5 font-normal">
                <span>Inicio: {props.fechaInicio}</span>
                <span className="text-slate-300">·</span>
                <span>Fin: {props.fechaFin}</span>
              </p>
            </div>
          </div>

          {/* Botón de Acción Principal */}
          <div className="w-full sm:w-auto flex items-center justify-end shrink-0">
            <button
              onClick={handleAccept}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                isAccepted
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
            >
              {isAccepted 
                ? (props.botonAceptadoTexto || '✓ Reto Aceptado') 
                : (props.botonTexto || 'Acepto el reto')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}