"use client";

import { Phone, MessageCircle } from "lucide-react";

function limpiarTelefono(tel: string): string {
  return tel.replace(/[\s\-\(\)]/g, "").replace(/^\+/, "");
}

export function BotonesContacto({
  telefono,
  nombre,
  size = "sm",
}: {
  telefono: string;
  nombre?: string;
  size?: "sm" | "md";
}) {
  const numLimpio = limpiarTelefono(telefono);
  const waNum = numLimpio.startsWith("56") ? numLimpio : `56${numLimpio}`;
  const waMsg = nombre ? `Hola ${nombre}, le contacta la Clínica Veterinaria Ainilebu.` : "";
  const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(waMsg)}`;

  const pad = size === "md" ? "9px 14px" : "6px 10px";
  const fs = size === "md" ? 14 : 12;
  const iconSz = size === "md" ? 15 : 13;

  return (
    <div style={{ display: "inline-flex", gap: 6 }}>
      <a
        href={`tel:${telefono}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          padding: pad,
          borderRadius: 8,
          background: "var(--color-verde-suave)",
          color: "var(--color-verde)",
          fontSize: fs,
          fontWeight: 600,
          textDecoration: "none",
          fontFamily: "var(--font-ui)",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "#d4eddc")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--color-verde-suave)")}
      >
        <Phone size={iconSz} />
        Llamar
      </a>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          padding: pad,
          borderRadius: 8,
          background: "#DCFCE7",
          color: "#15803D",
          fontSize: fs,
          fontWeight: 600,
          textDecoration: "none",
          fontFamily: "var(--font-ui)",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "#bbf7d0")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "#DCFCE7")}
      >
        <MessageCircle size={iconSz} />
        WhatsApp
      </a>
    </div>
  );
}
