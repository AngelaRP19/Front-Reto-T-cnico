import { useState } from "react";
import { useTheme } from "./../../../components/layout/navbar";
import CardChallenges from "./pages/cardChallenges";

export function MiPagina() {
  return (
    <>
      <div>
        <h1>"Retos de la comunidad"</h1>
        <p>"Únete a los desafíos creados por otros jugadores y gana insignias exclusivas."</p>
      </div>
      <CardChallenges
      titulo="Construye tu barrio soñado"
      fechaInicio="1 ago 2026"
      fechaFin="15 ago 2026"
      onAceptarReto={(estado) => console.log("Reto aceptado:", estado)}
    />
    <CardChallenges
      titulo="Familia de 3 generaciones"
      fechaInicio="3 ago 2026"
      fechaFin="30 ago 2026"
      onAceptarReto={(estado) => console.log("Reto aceptado:", estado)}
    />
    <CardChallenges
      titulo="Sube de nivel una carrera"
      fechaInicio="10 ago 2026"
      fechaFin="24 ago 2026"
      onAceptarReto={(estado) => console.log("Reto aceptado:", estado)}
    />
    <CardChallenges
      titulo="Sin comprar objetos nuevos"
      fechaInicio="12 ago 2026"
      fechaFin="19 ago 2026"
      onAceptarReto={(estado) => console.log("Reto aceptado:", estado)}
    />
    </>
  );
}


