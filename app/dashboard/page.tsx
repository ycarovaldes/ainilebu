"use client";
import { AppShell } from "@/components/layout/AppShell";
import { atenciones, recordatorios, pagos, pacientes } from "@/lib/mock-data";
import Link from "next/link";
import {
  Bell,
  CreditCard,
  ChevronRight,
  AlertCircle,
  Clock,
} from "lucide-react";

function fechaHoy() {
  return new Date().toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function horaAtencion(iso: string) {
  return new Date(iso).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
}

function diasRestantes(fecha: string) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const objetivo = new Date(fecha);
  const diff = Math.ceil((objetivo.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "hoy";
  if (diff === 1) return "mañana";
  if (diff < 0) return `hace ${Math.abs(diff)} días`;
  return `en ${diff} días`;
}

function esUrgente(fecha: string) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const objetivo = new Date(fecha);
  const diff = Math.ceil((objetivo.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
  return diff <= 2;
}

const atencionesDia = atenciones.filter((a) =>
  a.fecha.startsWith("2026-06-20")
);

const recordatoriosPendientes = recordatorios.filter((r) => r.estado === "pendiente").slice(0, 4);
const pagosPendientes = pagos.filter((p) => p.estado !== "pagado");

function formatPeso(n: number) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);
}

const tipoRecordatorioBorde: Record<string, string> = {
  control:     "var(--color-verde-claro)",
  vacuna:      "#818CF8",
  seguimiento: "#A78BFA",
  pago:        "var(--color-advertencia)",
  otro:        "var(--color-borde-fuerte)",
};

export default function DashboardPage() {
  return (
    <AppShell>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "36px 24px 48px" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <p
            style={{
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--color-texto-tenue)",
              margin: "0 0 4px",
              fontWeight: 600,
            }}
          >
            {fechaHoy()}
          </p>
          <h1
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: "var(--color-texto)",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Buenos días
          </h1>
        </div>

        {/* Estadísticas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
            marginBottom: 36,
          }}
          className="stats-grid"
        >
          {[
            {
              label: "Atenciones hoy",
              value: atencionesDia.length,
              color: "var(--color-verde)",
              bg: "var(--color-verde-suave)",
            },
            {
              label: "Recordatorios",
              value: recordatoriosPendientes.length,
              color: "#F59E0B",
              bg: "var(--color-adv-suave)",
              icon: <Bell size={14} />,
            },
            {
              label: "Pagos por cobrar",
              value: pagosPendientes.length,
              color: "var(--color-alerta)",
              bg: "var(--color-alerta-suave)",
              icon: <CreditCard size={14} />,
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "white",
                borderRadius: 16,
                padding: "20px",
                boxShadow: "var(--shadow-sm)",
                border: "1px solid var(--color-borde)",
              }}
            >
              <p style={{ fontSize: 12, color: "var(--color-texto-suave)", margin: "0 0 8px", fontWeight: 500 }}>
                {s.label}
              </p>
              <p style={{ fontSize: 38, fontWeight: 800, color: s.color, margin: 0, lineHeight: 1 }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Atenciones del día */}
        <section style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--color-texto)", margin: 0 }}>
              Atenciones de hoy
            </h2>
            <Link
              href="/nueva-atencion"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--color-verde)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              + Nueva
            </Link>
          </div>

          {atencionesDia.length === 0 ? (
            <div
              style={{
                background: "white",
                borderRadius: 14,
                padding: "32px 20px",
                textAlign: "center",
                border: "1px solid var(--color-borde)",
                color: "var(--color-texto-suave)",
                fontSize: 14,
              }}
            >
              Sin atenciones registradas hoy.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {atencionesDia.map((a) => {
                const p = pacientes.find((x) => x.id === a.paciente_id);
                return (
                  <Link
                    key={a.id}
                    href={`/pacientes/${a.paciente_id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{
                        background: "white",
                        borderRadius: 14,
                        padding: "16px 18px",
                        border: "1px solid var(--color-borde)",
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        cursor: "pointer",
                        transition: "box-shadow 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-md)")}
                      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                    >
                      {/* Avatar */}
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          background: p?.especie === "felino" ? "#F0F0FF" : "var(--color-verde-suave)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 20,
                          flexShrink: 0,
                        }}
                      >
                        {p?.especie === "felino" ? "🐱" : "🐶"}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "var(--color-texto)" }}>
                          {p?.nombre}
                          {p?.alerta && (
                            <AlertCircle
                              size={13}
                              color="var(--color-alerta)"
                              style={{ display: "inline", marginLeft: 6, verticalAlign: "middle" }}
                            />
                          )}
                        </p>
                        <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--color-texto-suave)" }}>
                          {a.motivo}
                        </p>
                      </div>

                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "var(--color-texto-suave)" }}>
                          <Clock size={12} style={{ display: "inline", marginRight: 3, verticalAlign: "middle" }} />
                          {horaAtencion(a.fecha)}
                        </p>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            color: "var(--color-verde)",
                            background: "var(--color-verde-suave)",
                            padding: "2px 7px",
                            borderRadius: 99,
                            display: "inline-block",
                            marginTop: 4,
                          }}
                        >
                          {a.plantilla}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Recordatorios próximos */}
        <section style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--color-texto)", margin: 0 }}>
              Próximos recordatorios
            </h2>
            <Link href="/recordatorios" style={{ fontSize: 13, color: "var(--color-texto-suave)", textDecoration: "none", display: "flex", alignItems: "center", gap: 2 }}>
              Ver todos <ChevronRight size={14} />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {recordatoriosPendientes.map((r) => {
              const urgente = esUrgente(r.fecha_objetivo);
              return (
                <div
                  key={r.id}
                  style={{
                    background: urgente ? "var(--color-alerta-suave)" : "white",
                    borderRadius: 14,
                    padding: "14px 18px",
                    border: `1px solid ${urgente ? "var(--color-alerta)" : "var(--color-borde)"}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 99,
                      background: tipoRecordatorioBorde[r.tipo],
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "var(--color-texto)" }}>
                      {r.titulo}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--color-texto-suave)" }}>
                      {r.paciente.tutor_telefono}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: urgente ? "var(--color-alerta)" : "var(--color-texto-suave)",
                      flexShrink: 0,
                    }}
                  >
                    {diasRestantes(r.fecha_objetivo)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Pagos pendientes */}
        {pagosPendientes.length > 0 && (
          <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--color-texto)", margin: 0 }}>
                Pagos por cobrar
              </h2>
              <Link href="/pagos" style={{ fontSize: 13, color: "var(--color-texto-suave)", textDecoration: "none", display: "flex", alignItems: "center", gap: 2 }}>
                Ver todos <ChevronRight size={14} />
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {pagosPendientes.map((p) => {
                const porcentaje = Math.round((p.monto_pagado / p.monto_total) * 100);
                return (
                  <div
                    key={p.id}
                    style={{
                      background: "white",
                      borderRadius: 14,
                      padding: "16px 18px",
                      border: "1px solid var(--color-borde)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "var(--color-texto)" }}>
                          {p.paciente.nombre}
                        </p>
                        <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--color-texto-suave)" }}>
                          {p.descripcion}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ margin: 0, fontWeight: 800, fontSize: 16, color: p.estado === "parcial" ? "var(--color-advertencia)" : "var(--color-alerta)" }}>
                          {formatPeso(p.monto_total - p.monto_pagado)}
                        </p>
                        <p style={{ margin: "2px 0 0", fontSize: 11, color: "var(--color-texto-tenue)" }}>
                          saldo pendiente
                        </p>
                      </div>
                    </div>

                    {/* Barra de progreso */}
                    <div style={{ background: "var(--color-fondo)", borderRadius: 99, height: 5, overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${porcentaje}%`,
                          background: "var(--color-verde-claro)",
                          borderRadius: 99,
                          transition: "width 0.3s",
                        }}
                      />
                    </div>
                    <p style={{ margin: "6px 0 0", fontSize: 11, color: "var(--color-texto-tenue)" }}>
                      {porcentaje}% pagado · {p.paciente.tutor_telefono}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>

      <style>{`
        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </AppShell>
  );
}
