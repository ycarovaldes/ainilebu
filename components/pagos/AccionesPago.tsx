"use client";

import { useState } from "react";
import { CheckCircle2, DollarSign, Phone, MessageSquare } from "lucide-react";
import { registrarAbono, marcarPagado } from "@/lib/actions/pagos";
import type { PagoPendiente } from "@/lib/db/queries";

function formatMonto(n: number) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);
}

export function AccionesPago({ pago: p }: { pago: PagoPendiente }) {
  const [ejecutando, setEjecutando] = useState<string | null>(null);
  const [abonoValor, setAbonoValor] = useState("");
  const [abonando, setAbonando] = useState(false);
  const [pagado, setPagado] = useState(false);

  if (pagado) return null;

  const montoTotal = Number(p.monto_total);
  const montoPagado = Number(p.monto_pagado ?? 0);
  const pendiente = montoTotal - montoPagado;
  const porcentaje = Math.min(100, Math.round((montoPagado / montoTotal) * 100));
  const telefonoWa = p.tutor_telefono?.replace(/\D/g, "").slice(-9);

  async function handlePagarTodo() {
    setEjecutando("total");
    await marcarPagado(p.id);
    setPagado(true);
  }

  async function handleAbono() {
    const monto = parseInt(abonoValor.replace(/\D/g, ""));
    if (!monto || monto <= 0) return;
    setEjecutando("abono");
    await registrarAbono(p.id, monto);
    setAbonando(false);
    setEjecutando(null);
    setAbonoValor("");
    if (montoPagado + monto >= montoTotal) setPagado(true);
  }

  return (
    <div style={{ background: "white", borderRadius: 16, padding: "16px 18px", border: "1px solid var(--color-borde)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "var(--color-texto)" }}>
              {p.paciente_nombre}
            </p>
            {p.tutor_nombre && (
              <span style={{ fontSize: 12, color: "var(--color-texto-tenue)" }}>· {p.tutor_nombre}</span>
            )}
          </div>
          {p.descripcion && (
            <p style={{ margin: "0 0 8px", fontSize: 13, color: "var(--color-texto-suave)" }}>{p.descripcion}</p>
          )}

          <div style={{ height: 6, background: "var(--color-fondo)", borderRadius: 99, overflow: "hidden", marginBottom: 6 }}>
            <div style={{ height: "100%", width: `${porcentaje}%`, background: porcentaje < 50 ? "var(--color-advertencia)" : "var(--color-verde)", borderRadius: 99, transition: "width 0.3s" }} />
          </div>

          <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--color-texto-tenue)", flexWrap: "wrap" }}>
            <span>Total: <strong style={{ color: "var(--color-texto)" }}>{formatMonto(montoTotal)}</strong></span>
            {montoPagado > 0 && <span>Pagado: <strong style={{ color: "var(--color-verde)" }}>{formatMonto(montoPagado)}</strong></span>}
            <span style={{ color: "var(--color-alerta)", fontWeight: 700 }}>Pendiente: {formatMonto(pendiente)}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          {telefonoWa && (
            <a href={`https://wa.me/56${telefonoWa}`} target="_blank" rel="noreferrer" title="WhatsApp"
              style={{ width: 34, height: 34, borderRadius: 10, background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", color: "#16A34A" }}>
              <MessageSquare size={15} />
            </a>
          )}
          {p.tutor_telefono && (
            <a href={`tel:${p.tutor_telefono}`} title="Llamar"
              style={{ width: 34, height: 34, borderRadius: 10, background: "#F0F9FF", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", color: "#0369A1" }}>
              <Phone size={15} />
            </a>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
        <button onClick={handlePagarTodo} disabled={!!ejecutando}
          style={{ flex: 1, minWidth: 110, padding: "9px 12px", borderRadius: 10, border: "none", background: "var(--color-verde)", color: "white", fontSize: 13, fontWeight: 700, fontFamily: "var(--font-ui)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, opacity: ejecutando ? 0.7 : 1 }}>
          <CheckCircle2 size={14} /> Pagado completo
        </button>
        <button onClick={() => setAbonando(true)} disabled={!!ejecutando}
          style={{ padding: "9px 12px", borderRadius: 10, border: "1.5px solid var(--color-borde-fuerte)", background: "white", color: "var(--color-texto)", fontSize: 13, fontWeight: 600, fontFamily: "var(--font-ui)", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
          <DollarSign size={13} /> Registrar abono
        </button>
      </div>

      {abonando && (
        <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "var(--color-texto-tenue)", fontWeight: 700 }}>$</span>
            <input type="number" placeholder="Monto abono" value={abonoValor}
              onChange={(e) => setAbonoValor(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAbono()}
              style={{ width: "100%", padding: "8px 12px 8px 24px", borderRadius: 10, border: "1.5px solid var(--color-verde-claro)", fontSize: 14, fontFamily: "var(--font-ui)", outline: "none", boxSizing: "border-box" }} />
          </div>
          <button onClick={handleAbono} disabled={!abonoValor || ejecutando === "abono"}
            style={{ padding: "8px 14px", borderRadius: 10, border: "none", background: abonoValor ? "var(--color-verde)" : "var(--color-borde)", color: abonoValor ? "white" : "var(--color-texto-tenue)", fontSize: 13, fontWeight: 700, fontFamily: "var(--font-ui)", cursor: abonoValor ? "pointer" : "default" }}>
            {ejecutando === "abono" ? "..." : "Confirmar"}
          </button>
          <button onClick={() => setAbonando(false)}
            style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid var(--color-borde)", background: "white", cursor: "pointer", color: "var(--color-texto-suave)", fontSize: 13, fontFamily: "var(--font-ui)" }}>
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}
