import { AppShell } from "@/components/layout/AppShell";
import { recordatorios } from "@/lib/mock-data";
import { Bell, Phone } from "lucide-react";

const etiqueta: Record<string, { label: string; bg: string; color: string }> = {
  control:     { label: "Control",     bg: "#EBF5EF", color: "#1E5C3A" },
  vacuna:      { label: "Vacuna",      bg: "#EEF2FF", color: "#4F46E5" },
  seguimiento: { label: "Seguimiento", bg: "#F5F0FF", color: "#7C3AED" },
  pago:        { label: "Pago",        bg: "#FEF3C7", color: "#D97706" },
  otro:        { label: "Otro",        bg: "#F1F5F9", color: "#64748B" },
};

function diasRestantes(fecha: string) {
  const hoy = new Date(); hoy.setHours(0,0,0,0);
  const obj = new Date(fecha);
  const diff = Math.ceil((obj.getTime() - hoy.getTime()) / 86400000);
  if (diff < 0) return { texto: `Vencido hace ${Math.abs(diff)} días`, urgente: true };
  if (diff === 0) return { texto: "Hoy", urgente: true };
  if (diff === 1) return { texto: "Mañana", urgente: true };
  return { texto: `En ${diff} días`, urgente: false };
};

export default function RecordatoriosPage() {
  const pendientes = recordatorios.filter((r) => r.estado === "pendiente");

  return (
    <AppShell>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "36px 24px 48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <Bell size={22} color="var(--color-verde)" />
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--color-texto)", margin: 0, letterSpacing: "-0.02em" }}>
            Recordatorios
          </h1>
        </div>

        {pendientes.length === 0 ? (
          <div style={{ background: "white", borderRadius: 16, padding: "48px 24px", textAlign: "center", border: "1px solid var(--color-borde)", color: "var(--color-texto-suave)" }}>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Sin recordatorios pendientes</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {pendientes.map((r) => {
              const { texto, urgente } = diasRestantes(r.fecha_objetivo);
              const et = etiqueta[r.tipo];
              return (
                <div
                  key={r.id}
                  style={{
                    background: urgente ? "var(--color-alerta-suave)" : "white",
                    borderRadius: 16,
                    padding: "18px 20px",
                    border: `1px solid ${urgente ? "var(--color-alerta)" : "var(--color-borde)"}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "var(--color-texto)" }}>
                        {r.paciente.nombre}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700, background: et.bg, color: et.color, padding: "2px 8px", borderRadius: 99, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {et.label}
                      </span>
                    </div>
                    <p style={{ margin: "0 0 4px", fontSize: 13, color: "var(--color-texto-suave)" }}>{r.titulo}</p>
                    <a href={`tel:${r.paciente.tutor_telefono}`} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--color-verde)", textDecoration: "none", fontWeight: 600 }}>
                      <Phone size={11} /> {r.paciente.tutor_telefono}
                    </a>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: urgente ? "var(--color-alerta)" : "var(--color-texto-suave)" }}>
                      {texto}
                    </p>
                    <p style={{ margin: "3px 0 0", fontSize: 11, color: "var(--color-texto-tenue)" }}>
                      {new Date(r.fecha_objetivo).toLocaleDateString("es-CL", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
