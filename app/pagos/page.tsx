import { AppShell } from "@/components/layout/AppShell";
import { pagos } from "@/lib/mock-data";
import { CreditCard, Phone } from "lucide-react";

function formatPeso(n: number) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);
}

const estadoStyle: Record<string, { label: string; bg: string; color: string }> = {
  pendiente: { label: "Pendiente", bg: "var(--color-alerta-suave)", color: "var(--color-alerta)" },
  parcial:   { label: "Abono parcial", bg: "var(--color-adv-suave)", color: "var(--color-advertencia)" },
  pagado:    { label: "Pagado", bg: "var(--color-verde-suave)", color: "var(--color-verde)" },
};

export default function PagosPage() {
  const pendientes = pagos.filter((p) => p.estado !== "pagado");
  const total = pendientes.reduce((s, p) => s + (p.monto_total - p.monto_pagado), 0);

  return (
    <AppShell>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "36px 24px 48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <CreditCard size={22} color="var(--color-verde)" />
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--color-texto)", margin: 0, letterSpacing: "-0.02em" }}>
            Pagos pendientes
          </h1>
        </div>

        {pendientes.length > 0 && (
          <p style={{ fontSize: 14, color: "var(--color-texto-suave)", margin: "0 0 28px" }}>
            Total por cobrar:{" "}
            <strong style={{ color: "var(--color-alerta)", fontSize: 18 }}>{formatPeso(total)}</strong>
          </p>
        )}

        {pendientes.length === 0 ? (
          <div style={{ background: "white", borderRadius: 16, padding: "48px 24px", textAlign: "center", border: "1px solid var(--color-borde)", color: "var(--color-texto-suave)" }}>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Sin pagos pendientes</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {pendientes.map((p) => {
              const saldo = p.monto_total - p.monto_pagado;
              const porcentaje = Math.round((p.monto_pagado / p.monto_total) * 100);
              const st = estadoStyle[p.estado];
              return (
                <div
                  key={p.id}
                  style={{
                    background: "white",
                    borderRadius: 18,
                    padding: "20px 22px",
                    border: "1px solid var(--color-borde)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <span style={{ fontSize: 17, fontWeight: 800, color: "var(--color-texto)" }}>
                          {p.paciente.nombre}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 700, background: st.bg, color: st.color, padding: "2px 8px", borderRadius: 99, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          {st.label}
                        </span>
                      </div>
                      <p style={{ margin: "0 0 6px", fontSize: 13, color: "var(--color-texto-suave)" }}>
                        {p.descripcion}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 12, color: "var(--color-texto-tenue)" }}>
                          {p.paciente.tutor_nombre}
                        </span>
                        <a href={`tel:${p.paciente.tutor_telefono}`} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--color-verde)", textDecoration: "none", fontWeight: 600 }}>
                          <Phone size={11} /> {p.paciente.tutor_telefono}
                        </a>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: p.estado === "parcial" ? "var(--color-advertencia)" : "var(--color-alerta)", letterSpacing: "-0.02em" }}>
                        {formatPeso(saldo)}
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: 11, color: "var(--color-texto-tenue)" }}>
                        de {formatPeso(p.monto_total)}
                      </p>
                    </div>
                  </div>

                  {/* Barra progreso */}
                  <div style={{ background: "var(--color-fondo)", borderRadius: 99, height: 6, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${porcentaje}%`, background: "var(--color-verde-claro)", borderRadius: 99 }} />
                  </div>
                  <p style={{ margin: "6px 0 0", fontSize: 11, color: "var(--color-texto-tenue)" }}>
                    {porcentaje > 0 ? `${formatPeso(p.monto_pagado)} abonado (${porcentaje}%)` : "Sin abonos"}
                    {" · "}
                    {new Date(p.fecha_servicio).toLocaleDateString("es-CL", { day: "numeric", month: "long" })}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
