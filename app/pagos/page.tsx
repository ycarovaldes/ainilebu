export const dynamic = "force-dynamic";

import { AppShell } from "@/components/layout/AppShell";
import { getPagosPendientes } from "@/lib/db/queries";
import { AccionesPago } from "@/components/pagos/AccionesPago";
import { CreditCard } from "lucide-react";

function formatMonto(n: number) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);
}

export default async function PagosPage() {
  const pendientes = await getPagosPendientes();
  const totalPendiente = pendientes.reduce((s, p) => s + (Number(p.monto_total) - Number(p.monto_pagado ?? 0)), 0);

  return (
    <AppShell>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "36px 24px 80px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--color-texto)", margin: 0, letterSpacing: "-0.02em" }}>
              Pagos pendientes
            </h1>
            {pendientes.length > 0 && (
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--color-texto-suave)" }}>
                {pendientes.length} cobro{pendientes.length !== 1 ? "s" : ""} por gestionar
              </p>
            )}
          </div>
          {pendientes.length > 0 && (
            <div style={{ background: "var(--color-alerta-suave)", border: "1px solid var(--color-alerta)", borderRadius: 14, padding: "10px 18px", textAlign: "right" }}>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-alerta)", marginBottom: 2 }}>Total por cobrar</p>
              <p style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "var(--color-alerta)", letterSpacing: "-0.02em" }}>{formatMonto(totalPendiente)}</p>
            </div>
          )}
        </div>

        {pendientes.length === 0 ? (
          <div style={{ background: "white", borderRadius: 18, padding: "60px 24px", textAlign: "center", border: "1px dashed var(--color-borde-fuerte)" }}>
            <CreditCard size={32} color="var(--color-borde-fuerte)" style={{ margin: "0 auto 12px", display: "block" }} />
            <p style={{ fontSize: 16, fontWeight: 700, color: "var(--color-texto-suave)", margin: "0 0 4px" }}>Sin pagos pendientes</p>
            <p style={{ fontSize: 13, color: "var(--color-texto-tenue)", margin: 0 }}>Los pagos se registran al cerrar una atención con monto pendiente.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {pendientes.map((p) => (
              <AccionesPago key={p.id} pago={p} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
