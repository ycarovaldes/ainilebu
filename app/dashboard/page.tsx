import { AppShell } from "@/components/layout/AppShell";
import { getAtencionesDia, getRecordatoriosPendientes, getPagosPendientes } from "@/lib/db/queries";
import Link from "next/link";
import { Bell, CreditCard, ChevronRight, AlertCircle, Clock } from "lucide-react";

function fechaHoy() {
  return new Date().toLocaleDateString("es-CL", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function horaAtencion(d: Date) {
  return new Date(d).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
}

function diasRestantes(fecha: string) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const obj = new Date(fecha + "T12:00:00");
  const diff = Math.round((obj.getTime() - hoy.getTime()) / 86400000);
  if (diff < 0) return `hace ${Math.abs(diff)} día${Math.abs(diff) !== 1 ? "s" : ""}`;
  if (diff === 0) return "hoy";
  if (diff === 1) return "mañana";
  return `en ${diff} días`;
}

function esUrgente(fecha: string) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return new Date(fecha + "T12:00:00").getTime() - hoy.getTime() <= 2 * 86400000;
}

function formatMonto(n: number) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);
}

const PLANTILLA_COLOR: Record<string, { bg: string; color: string }> = {
  consulta_general: { bg: "var(--color-verde-suave)", color: "var(--color-verde)" },
  vacuna:           { bg: "#EEF2FF", color: "#4F46E5" },
  desparasitacion:  { bg: "#F0FDF4", color: "#15803D" },
  control:          { bg: "#F0F9FF", color: "#0369A1" },
  urgencia:         { bg: "var(--color-alerta-suave)", color: "var(--color-alerta)" },
  cirugia:          { bg: "#FDF4FF", color: "#9333EA" },
  medicacion:       { bg: "#FFFBEB", color: "#D97706" },
  seguimiento:      { bg: "#F8FAFC", color: "#64748B" },
};

const TIPO_PUNTO: Record<string, string> = {
  control:     "var(--color-verde-claro)",
  vacuna:      "#818CF8",
  seguimiento: "#A78BFA",
  pago:        "var(--color-advertencia)",
  otro:        "var(--color-borde-fuerte)",
};

export default async function DashboardPage() {
  const [atencionesDia, recordatoriosPend, pagosPend] = await Promise.all([
    getAtencionesDia(),
    getRecordatoriosPendientes(),
    getPagosPendientes(),
  ]);

  const recordatoriosTop = recordatoriosPend.slice(0, 5);
  const pagosTop = pagosPend.slice(0, 5);

  return (
    <AppShell>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "36px 24px 48px" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-texto-tenue)", margin: "0 0 4px", fontWeight: 600 }}>
            {fechaHoy()}
          </p>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: "var(--color-texto)", margin: 0, letterSpacing: "-0.02em" }}>
            Buenos días
          </h1>
        </div>

        {/* Estadísticas */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 36 }} className="stats-grid">
          {[
            { label: "Atenciones hoy", value: atencionesDia.length, color: "var(--color-verde)", href: "/nueva-atencion" },
            { label: "Recordatorios", value: recordatoriosPend.length, color: "#F59E0B", href: "/recordatorios", icon: <Bell size={14} /> },
            { label: "Pagos por cobrar", value: pagosPend.length, color: "var(--color-alerta)", href: "/pagos", icon: <CreditCard size={14} /> },
          ].map((s) => (
            <Link key={s.label} href={s.href} style={{ textDecoration: "none" }}>
              <div className="stat-card" style={{ background: "white", borderRadius: 16, padding: "20px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--color-borde)", cursor: "pointer" }}>
                <p style={{ fontSize: 12, color: "var(--color-texto-suave)", margin: "0 0 8px", fontWeight: 500 }}>{s.label}</p>
                <p style={{ fontSize: 38, fontWeight: 800, color: s.color, margin: 0, lineHeight: 1 }}>{s.value}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Atenciones del día */}
        <section style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--color-texto)", margin: 0 }}>Atenciones de hoy</h2>
            <Link href="/nueva-atencion" style={{ fontSize: 13, fontWeight: 600, color: "var(--color-verde)", textDecoration: "none" }}>+ Nueva</Link>
          </div>

          {atencionesDia.length === 0 ? (
            <div style={{ background: "white", borderRadius: 14, padding: "32px 20px", textAlign: "center", border: "1px solid var(--color-borde)", color: "var(--color-texto-suave)", fontSize: 14 }}>
              Sin atenciones registradas hoy.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {atencionesDia.map((a) => {
                const pc = PLANTILLA_COLOR[a.plantilla] ?? PLANTILLA_COLOR.seguimiento;
                return (
                  <Link key={a.id} href={`/pacientes/${a.paciente_id}`} style={{ textDecoration: "none" }}>
                    <div className="hover-card" style={{ background: "white", borderRadius: 14, padding: "16px 18px", border: "1px solid var(--color-borde)", display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: a.paciente?.especie === "felino" ? "#F0F0FF" : "var(--color-verde-suave)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                        {a.paciente?.especie === "felino" ? "🐱" : "🐶"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "var(--color-texto)" }}>
                          {a.paciente?.nombre ?? "—"}
                          {(a as { paciente_alertas?: string | null }).paciente_alertas && (
                            <AlertCircle size={13} color="var(--color-alerta)" style={{ display: "inline", marginLeft: 6, verticalAlign: "middle" }} />
                          )}
                        </p>
                        <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--color-texto-suave)" }}>{a.motivo ?? "—"}</p>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "var(--color-texto-suave)", display: "flex", alignItems: "center", gap: 3 }}>
                          <Clock size={12} /> {horaAtencion(a.fecha)}
                        </p>
                        <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", background: pc.bg, color: pc.color, padding: "2px 7px", borderRadius: 99, display: "inline-block", marginTop: 4 }}>
                          {a.plantilla.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Recordatorios */}
        {recordatoriosTop.length > 0 && (
          <section style={{ marginBottom: 36 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--color-texto)", margin: 0 }}>Próximos recordatorios</h2>
              <Link href="/recordatorios" style={{ fontSize: 13, color: "var(--color-texto-suave)", textDecoration: "none", display: "flex", alignItems: "center", gap: 2 }}>
                Ver todos <ChevronRight size={14} />
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {recordatoriosTop.map((r) => {
                const urgente = esUrgente(r.fecha_objetivo);
                return (
                  <Link key={r.id} href={`/pacientes/${r.paciente_id}`} style={{ textDecoration: "none" }}>
                    <div style={{ background: urgente ? "var(--color-alerta-suave)" : "white", borderRadius: 14, padding: "14px 18px", border: `1px solid ${urgente ? "var(--color-alerta)" : "var(--color-borde)"}`, display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 99, background: TIPO_PUNTO[r.tipo] ?? TIPO_PUNTO.otro, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "var(--color-texto)" }}>{r.paciente_nombre}</p>
                        <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--color-texto-suave)" }}>{r.nota ?? r.titulo}</p>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: urgente ? "var(--color-alerta)" : "var(--color-texto-suave)", flexShrink: 0 }}>
                        {diasRestantes(r.fecha_objetivo)}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Pagos */}
        {pagosTop.length > 0 && (
          <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--color-texto)", margin: 0 }}>Pagos por cobrar</h2>
              <Link href="/pagos" style={{ fontSize: 13, color: "var(--color-texto-suave)", textDecoration: "none", display: "flex", alignItems: "center", gap: 2 }}>
                Ver todos <ChevronRight size={14} />
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {pagosTop.map((p) => {
                const total = Number(p.monto_total);
                const pagado = Number(p.monto_pagado ?? 0);
                const pct = Math.min(100, Math.round((pagado / total) * 100));
                return (
                  <Link key={p.id} href={`/pacientes/${p.paciente_id}`} style={{ textDecoration: "none" }}>
                    <div className="hover-card" style={{ background: "white", borderRadius: 14, padding: "16px 18px", border: "1px solid var(--color-borde)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "var(--color-texto)" }}>{p.paciente_nombre}</p>
                          <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--color-texto-suave)" }}>{p.descripcion}</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ margin: 0, fontWeight: 800, fontSize: 16, color: p.estado === "parcial" ? "var(--color-advertencia)" : "var(--color-alerta)" }}>
                            {formatMonto(total - pagado)}
                          </p>
                          <p style={{ margin: "2px 0 0", fontSize: 11, color: "var(--color-texto-tenue)" }}>saldo pendiente</p>
                        </div>
                      </div>
                      <div style={{ background: "var(--color-fondo)", borderRadius: 99, height: 5, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: "var(--color-verde-claro)", borderRadius: 99 }} />
                      </div>
                      <p style={{ margin: "6px 0 0", fontSize: 11, color: "var(--color-texto-tenue)" }}>
                        {pct}% pagado · {p.tutor_telefono}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>

      <style>{`
        @media (max-width: 600px) { .stats-grid { grid-template-columns: 1fr !important; } }
        .hover-card { transition: box-shadow 0.15s; }
        .hover-card:hover { box-shadow: var(--shadow-md); }
        .stat-card { transition: box-shadow 0.15s; }
        .stat-card:hover { box-shadow: var(--shadow-md); }
      `}</style>
    </AppShell>
  );
}
