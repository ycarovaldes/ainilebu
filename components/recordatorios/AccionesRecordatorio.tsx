"use client";

import { useState } from "react";
import { CheckCircle2, Clock, X, Calendar, Phone, MessageSquare } from "lucide-react";
import { marcarHecho, posponer, cancelarRecordatorio } from "@/lib/actions/recordatorios";
import type { RecordatorioPendiente } from "@/lib/db/queries";

const tipoColor: Record<string, { bg: string; color: string; label: string }> = {
  control:        { bg: "#F0F9FF", color: "#0369A1", label: "Control" },
  pago:           { bg: "#FFFBEB", color: "#D97706", label: "Pago" },
  medicacion:     { bg: "#F0FDF4", color: "#15803D", label: "Medicación" },
  vacuna:         { bg: "#EEF2FF", color: "#4F46E5", label: "Vacuna" },
  desparasitacion:{ bg: "#FDF4FF", color: "#9333EA", label: "Desparasitación" },
  otro:           { bg: "var(--color-fondo)", color: "var(--color-texto-suave)", label: "Otro" },
};

function diasRestantes(fecha: string) {
  const d = new Date(fecha + "T12:00:00");
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - hoy.getTime()) / 86400000);
  if (diff < 0) return { texto: `Hace ${Math.abs(diff)} día${Math.abs(diff) !== 1 ? "s" : ""}`, urgente: true };
  if (diff === 0) return { texto: "Hoy", urgente: true };
  if (diff === 1) return { texto: "Mañana", urgente: true };
  return { texto: `En ${diff} días`, urgente: false };
}

export function AccionesRecordatorio({ recordatorio: r }: { recordatorio: RecordatorioPendiente }) {
  const [ejecutando, setEjecutando] = useState<string | null>(null);
  const [posponiendo, setPosponiendo] = useState(false);
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [hecho, setHecho] = useState(false);

  if (hecho) return null;

  const tc = tipoColor[r.tipo] ?? tipoColor.otro;
  const { texto: textoFecha, urgente } = diasRestantes(r.fecha_objetivo);

  async function handleMarcarHecho() {
    setEjecutando("hecho");
    await marcarHecho(r.id);
    setHecho(true);
  }

  async function handlePosponer() {
    if (!nuevaFecha) return;
    setEjecutando("posponer");
    await posponer(r.id, nuevaFecha);
    setPosponiendo(false);
    setEjecutando(null);
  }

  async function handleCancelar() {
    setEjecutando("cancelar");
    await cancelarRecordatorio(r.id);
    setHecho(true);
  }

  const telefonoWa = r.tutor_telefono?.replace(/\D/g, "").slice(-9);

  return (
    <div style={{
      background: "white", borderRadius: 16, padding: "16px 18px",
      border: urgente ? "1.5px solid var(--color-alerta)" : "1px solid var(--color-borde)",
      boxShadow: urgente ? "0 0 0 3px var(--color-alerta-suave)" : "none",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", background: tc.bg, color: tc.color, padding: "2px 8px", borderRadius: 99 }}>
              {tc.label}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: urgente ? "var(--color-alerta)" : "var(--color-texto-tenue)", display: "flex", alignItems: "center", gap: 4 }}>
              <Clock size={11} /> {textoFecha}
            </span>
          </div>
          <p style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 700, color: "var(--color-texto)" }}>
            {r.paciente_nombre}
          </p>
          {(r.nota ?? r.titulo) && (
            <p style={{ margin: 0, fontSize: 13, color: "var(--color-texto-suave)" }}>{r.nota ?? r.titulo}</p>
          )}
          {r.tutor_nombre && (
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--color-texto-tenue)" }}>
              Tutor: {r.tutor_nombre}
            </p>
          )}
        </div>

        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          {telefonoWa && (
            <a href={`https://wa.me/56${telefonoWa}`} target="_blank" rel="noreferrer"
              title="WhatsApp"
              style={{ width: 34, height: 34, borderRadius: 10, background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", color: "#16A34A" }}>
              <MessageSquare size={15} />
            </a>
          )}
          {r.tutor_telefono && (
            <a href={`tel:${r.tutor_telefono}`} title="Llamar"
              style={{ width: 34, height: 34, borderRadius: 10, background: "#F0F9FF", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", color: "#0369A1" }}>
              <Phone size={15} />
            </a>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
        <button disabled={ejecutando === "hecho"} onClick={handleMarcarHecho}
          style={{ flex: 1, minWidth: 100, padding: "9px 12px", borderRadius: 10, border: "none", background: "var(--color-verde)", color: "white", fontSize: 13, fontWeight: 700, fontFamily: "var(--font-ui)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, opacity: ejecutando ? 0.7 : 1 }}>
          <CheckCircle2 size={14} /> Listo
        </button>
        <button onClick={() => setPosponiendo(true)} disabled={!!ejecutando}
          style={{ padding: "9px 12px", borderRadius: 10, border: "1.5px solid var(--color-borde-fuerte)", background: "white", color: "var(--color-texto)", fontSize: 13, fontWeight: 600, fontFamily: "var(--font-ui)", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
          <Calendar size={13} /> Posponer
        </button>
        <button onClick={handleCancelar} disabled={!!ejecutando}
          style={{ padding: "9px 12px", borderRadius: 10, border: "1.5px solid var(--color-borde)", background: "white", color: "var(--color-texto-tenue)", fontSize: 13, fontWeight: 600, fontFamily: "var(--font-ui)", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
          <X size={13} /> Cancelar
        </button>
      </div>

      {posponiendo && (
        <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center" }}>
          <input type="date" value={nuevaFecha} onChange={(e) => setNuevaFecha(e.target.value)}
            style={{ flex: 1, padding: "8px 12px", borderRadius: 10, border: "1.5px solid var(--color-verde-claro)", fontSize: 14, fontFamily: "var(--font-ui)", outline: "none" }} />
          <button onClick={handlePosponer} disabled={!nuevaFecha || ejecutando === "posponer"}
            style={{ padding: "8px 14px", borderRadius: 10, border: "none", background: nuevaFecha ? "var(--color-verde)" : "var(--color-borde)", color: nuevaFecha ? "white" : "var(--color-texto-tenue)", fontSize: 13, fontWeight: 700, fontFamily: "var(--font-ui)", cursor: nuevaFecha ? "pointer" : "default" }}>
            {ejecutando === "posponer" ? "..." : "Confirmar"}
          </button>
          <button onClick={() => setPosponiendo(false)} style={{ padding: "8px", borderRadius: 10, border: "1px solid var(--color-borde)", background: "white", cursor: "pointer" }}>
            <X size={14} color="var(--color-texto-tenue)" />
          </button>
        </div>
      )}
    </div>
  );
}
