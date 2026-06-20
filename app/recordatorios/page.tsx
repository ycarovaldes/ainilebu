export const dynamic = "force-dynamic";

import { AppShell } from "@/components/layout/AppShell";
import { getRecordatoriosPendientes } from "@/lib/db/queries";
import { AccionesRecordatorio } from "@/components/recordatorios/AccionesRecordatorio";
import Link from "next/link";
import { Bell, ChevronRight } from "lucide-react";

function grupoPorFecha(fecha: string) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const diff = Math.round((new Date(fecha + "T12:00:00").getTime() - hoy.getTime()) / 86400000);
  if (diff < 0) return "vencido";
  if (diff === 0) return "hoy";
  if (diff <= 7) return "semana";
  return "futuro";
}

const GRUPO_LABEL: Record<string, string> = {
  vencido: "Vencidos",
  hoy:     "Hoy",
  semana:  "Esta semana",
  futuro:  "Próximas semanas",
};

export default async function RecordatoriosPage() {
  const todos = await getRecordatoriosPendientes();

  const grupos: Record<string, typeof todos> = {};
  for (const r of todos) {
    const g = grupoPorFecha(r.fecha_objetivo);
    if (!grupos[g]) grupos[g] = [];
    grupos[g].push(r);
  }

  const orden = ["vencido", "hoy", "semana", "futuro"];

  return (
    <AppShell>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "36px 24px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--color-texto)", margin: 0, letterSpacing: "-0.02em" }}>
              Recordatorios
            </h1>
            {todos.length > 0 && (
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--color-texto-suave)" }}>
                {todos.length} pendiente{todos.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>

        {todos.length === 0 ? (
          <div style={{ background: "white", borderRadius: 18, padding: "60px 24px", textAlign: "center", border: "1px dashed var(--color-borde-fuerte)" }}>
            <Bell size={32} color="var(--color-borde-fuerte)" style={{ margin: "0 auto 12px", display: "block" }} />
            <p style={{ fontSize: 16, fontWeight: 700, color: "var(--color-texto-suave)", margin: "0 0 4px" }}>Sin recordatorios pendientes</p>
            <p style={{ fontSize: 13, color: "var(--color-texto-tenue)", margin: 0 }}>Se crean automáticamente al cerrar una atención con próximo control.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {orden.filter((g) => grupos[g]?.length).map((grupo) => (
              <div key={grupo}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: grupo === "vencido" ? "var(--color-alerta)" : "var(--color-texto-tenue)", margin: 0 }}>
                    {GRUPO_LABEL[grupo]}
                  </h2>
                  <span style={{ fontSize: 11, fontWeight: 700, background: grupo === "vencido" ? "var(--color-alerta-suave)" : "var(--color-fondo)", color: grupo === "vencido" ? "var(--color-alerta)" : "var(--color-texto-tenue)", padding: "2px 8px", borderRadius: 99 }}>
                    {grupos[grupo].length}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {grupos[grupo].map((r) => (
                    <div key={r.id} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        <AccionesRecordatorio recordatorio={r} />
                      </div>
                      <Link href={`/pacientes/${r.paciente_id}`} title="Ver ficha"
                        style={{ flexShrink: 0, width: 36, height: 36, marginTop: 6, borderRadius: 10, background: "var(--color-fondo)", border: "1px solid var(--color-borde)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", color: "var(--color-texto-tenue)" }}>
                        <ChevronRight size={15} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
