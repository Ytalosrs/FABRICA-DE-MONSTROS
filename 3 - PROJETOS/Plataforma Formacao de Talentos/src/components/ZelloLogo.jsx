// =====================================================================
// <ZelloLogo /> — símbolo oficial da Zello (o "Z" estilizado).
// Usa a tag <img> apontando para o asset da marca em /public/zello-logo.png.
// Aparece no Header, modais e badges de progresso.
//
// <ZelloWatermark /> — marca d'água de fundo com a palavra "zello"
// repetida continuamente, em branco com opacidade muito baixa.
// =====================================================================
import React from 'react';

export default function ZelloLogo({ size = 40, className = '', alt = 'Zello', rounded = 'rounded-xl' }) {
  return (
    <img
      src="/zello-logo.png"
      alt={alt}
      width={size}
      height={size}
      className={`${rounded} object-cover shadow-sm shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
      draggable="false"
    />
  );
}

// Marca d'água tileada — use dentro de um container `relative overflow-hidden`.
export function ZelloWatermark({ className = '', opacity = 0.05 }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 zello-watermark ${className}`}
      style={{ opacity }}
    />
  );
}
