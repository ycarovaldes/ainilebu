import { AppShell } from "@/components/layout/AppShell";
import { getPacienteById, getAtencionesByPaciente, getRecordatoriosByPaciente, getPagosByPaciente } from "@/lib/db/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, Plus, Stethoscope, Syringe, Bug, Activity, Zap, Scissors, Pill, RotateCcw } from "lucide-react";
import { BotonesContacto } from "@/components/ui/Contacto";
import { AccionesRecordatorio } from "@/components/recordatorios/AccionesRecordatorio";
import { AccionesPago } from "@/components/pagos/AccionesPago";

const iconoPlantilla: Record<string, React.ReactNode> = {
  consulta_general: <Stethoscope size={13} />,
  vacuna:           <Syringe size={13} />,
  desparasitacion:  <Bug size={13} />,
  control:          <Activity size={13} />,
  urgencia:         <Zap size={13} />,
  cirugia:          <Scissors size={13} />,
  medicacion:       <Pill size={13} />,
  seguimiento:      <RotateCcw size={13} />,
};

const colorPlantilla: Record<string, { bg: string; color: string }> = {
  consulta_general: { bg: "var(--color-verde-suave)",  color: "var(--color-verde)" },
  vacuna:           { bg: "#EEF2FF", color: "#4F46E5" },
  desparasitacion:  { bg: "#F0FDF4", color: "#15803D" },
  control:          { bg: "#F0F9FF", color: "#0369A1" },
  urgencia:         { bg: "var(--color-alerta-suave)", color: "var(--color-alerta)" },
  cirugia:          { bg: "#FDF4FF", color: "#9333EA" },
  medicacion:       { bg: "#FFFBEB", color: "#D97706" },
  seguimiento:      { bg: "#F8FAFC", color: "#64748B" },
};

function formatFecha(d: Date | string) {
  return new Date(d).toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export default async function PacientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [paciente, historial, recordatorios, pagosPac] = await Promise.all([
    getPacienteById(id),
    getAtencionesByPaciente(id),
    getRecordatoriosByPaciente(id),
    getPagosByPaciente(id),
  ]);

  if (!paciente) notFound();

  const esGato = paciente.especie === "felino";
  const pagosPendientes = pagosPac.filter((p) => p.estado !== "pagado");

  return (
    <AppShell>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "24px 24px 60px" }}>
        <Link href="/pacientes" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--color-texto-suave)", textDecoration: "none", marginBottom: 20 }}>
          <ArrowLeft size={15} /> Pacientes
        </Link>

        {/* Hero */}
        <div style={{ background: "white", borderRadius: 20, padding: "24px", border: "1px solid var(--color-borde)", marginBottom: 20, boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{
              width: 76, height: 76, borderRadius: 20, flexShrink: 0,
              background: esGato ? "#E8E7FF" : "var(--color-verde-suave)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34,
            }}>
              {esGato ? "🐱" : "🐶"}
            </div>

            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--color-texto)", margin: 0, letterSpacing: "-0.02em" }}>
                  {paciente.nombre}
                </h1>
                {paciente.n_ficha && (
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-texto-tenue)", background: "var(--color-fondo)", padding: "3px 9px", borderRadius: 99, border: "1px solid var(--color-borde)" }}>
                    Ficha #{paciente.n_ficha}
                  </span>
                )}
                {paciente.es_endocrino && (
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", background: "#EEF2FF", color: "#4F46E5", padding: "3px 8px", borderRadius: 99 }}>
                    Endócrino
                  </span>
                )}
                {pagosPendientes.length > 0 && (
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", background: "var(--color-adv-suave)", color: "var(--color-advertencia)", padding: "3px 8px", borderRadius: 99 }}>
                    💲 Pago pendiente
                  </span>
                )}
              </div>

              <p style={{ margin: "0 0 10px", fontSize: 14, color: "var(--color-texto-suave)", textTransform: "capitalize" }}>
                {[paciente.especie, paciente.raza, paciente.sexo === "macho" ? "Macho ♂" : paciente.sexo === "hembra" ? "Hembra ♀" : null, paciente.edad_texto, paciente.peso_referencia ? `${paciente.peso_referencia} kg` : null].filter(Boolean).join(" · ")}
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, color: "var(--color-texto-suave)" }}>
                  {paciente.tutor.nombre ?? "Tutor"}
                </span>
                <BotonesContacto telefono={paciente.tutor.telefono} nombre={paciente.tutor.nombre ?? undefined} />
              </div>
            </div>

            <Link href={`/nueva-atencion?paciente_id=${paciente.id}`} style={{ textDecoration: "none", flexShrink: 0 }}>
              <button style={{ background: "var(--color-verde)", color: "white", border: "none", borderRadius: 12, padding: "10px 16px", fontSize: 14, fontWeight: 700, fontFamily: "var(--font-ui)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                <Plus size={16} strokeWidth={2.5} /> Nueva atención
              </button>
            </Link>
          </div>

          {paciente.alertas && (
            <div style={{ marginTop: 16, background: "var(--color-alerta-suave)", border: "1px solid var(--color-alerta)", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "flex-start", gap: 10 }}>
              <AlertTriangle size={16} color="var(--color-alerta)" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "var(--color-alerta)" }}>{paciente.alertas}</p>
            </div>
          )}
        </div>

        {/* Pagos pendientes del paciente */}
        {pagosPendientes.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--color-texto)", margin: "0 0 10px" }}>Pagos pendientes</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {pagosPendientes.map((p) => (
                <AccionesPago key={p.id} pago={p} />
              ))}
            </div>
          </div>
        )}

        {/* Recordatorios del paciente */}
        {recordatorios.filter(r => r.estado === "pendiente").length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--color-texto)", margin: "0 0 10px" }}>Recordatorios</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {recordatorios.filter(r => r.estado === "pendiente").map((r) => (
                <AccionesRecordatorio key={r.id} recordatorio={r} />
              ))}
            </div>
          </div>
        )}

        {/* Historial */}
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--color-texto)", margin: "0 0 14px" }}>Historial clínico</h2>

        {historial.length === 0 ? (
          <div style={{ background: "white", borderRadius: 16, padding: "40px 24px", textAlign: "center", border: "1px dashed var(--color-borde-fuerte)", color: "var(--color-texto-suave)" }}>
            <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600 }}>Sin atenciones registradas</p>
            <p style={{ margin: 0, fontSize: 13 }}>La primera aparecerá aquí.</p>
          </div>
        ) : (
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 19, top: 6, bottom: 6, width: 2, background: "var(--color-borde)" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingLeft: 48 }}>
              {historial.map((a, i) => {
                const ps = colorPlantilla[a.plantilla] ?? colorPlantilla.seguimiento;
                return (
                  <div key={a.id} style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: -37, top: 18, width: 12, height: 12, borderRadius: 99, background: i === 0 ? "var(--color-verde)" : "white", border: `2px solid ${i === 0 ? "var(--color-verde)" : "var(--color-borde-fuerte)"}`, zIndex: 1 }} />
                    <div style={{ background: "white", borderRadius: 16, padding: "18px 20px", border: "1px solid var(--color-borde)", boxShadow: i === 0 ? "var(--shadow-sm)" : "none" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                        <div>
                          <p style={{ margin: 0, fontSize: 12, color: "var(--color-texto-tenue)", textTransform: "capitalize", fontWeight: 500 }}>{formatFecha(a.fecha)}</p>
                          <p style={{ margin: "3px 0 0", fontSize: 15, fontWeight: 700, color: "var(--color-texto)" }}>{a.motivo ?? "Sin motivo registrado"}</p>
                        </div>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", background: ps.bg, color: ps.color, padding: "4px 10px", borderRadius: 99, flexShrink: 0 }}>
                          {iconoPlantilla[a.plantilla]} {a.plantilla.replace("_", " ")}
                        </span>
                      </div>

                      {a.nota_clinica && (
                        <p style={{ margin: "0 0 8px", fontSize: 14, color: "var(--color-texto)", lineHeight: 1.6, background: "var(--color-fondo)", padding: "10px 14px", borderRadius: 10, borderLeft: "3px solid var(--color-borde-fuerte)" }}>
                          {a.nota_clinica}
                        </p>
                      )}

                      {(a.diagnostico_presuntivo || a.tratamiento) && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }} className="dx-grid">
                          {a.diagnostico_presuntivo && (
                            <div style={{ background: "var(--color-fondo)", borderRadius: 10, padding: "10px 12px" }}>
                              <p style={{ margin: "0 0 3px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--color-texto-tenue)" }}>Diagnóstico</p>
                              <p style={{ margin: 0, fontSize: 13, color: "var(--color-texto)", fontWeight: 500 }}>{a.diagnostico_presuntivo}</p>
                            </div>
                          )}
                          {a.tratamiento && (
                            <div style={{ background: "var(--color-verde-suave)", borderRadius: 10, padding: "10px 12px" }}>
                              <p style={{ margin: "0 0 3px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--color-verde)" }}>Tratamiento</p>
                              <p style={{ margin: 0, fontSize: 13, color: "var(--color-texto)", fontWeight: 500 }}>{a.tratamiento}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {(a.vacuna || a.medicamentos) && (
                        <p style={{ margin: "8px 0 0", fontSize: 12, color: "var(--color-texto-suave)" }}>
                          {a.vacuna && <><strong>Vacuna:</strong> {a.vacuna} </>}
                          {a.medicamentos && <><strong>Medicamentos:</strong> {a.medicamentos}</>}
                        </p>
                      )}

                      <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
                        {a.peso && <span style={{ fontSize: 12, color: "var(--color-texto-tenue)" }}>Peso: <strong style={{ color: "var(--color-texto-suave)" }}>{a.peso} kg</strong></span>}
                        {a.proximo_control && <span style={{ fontSize: 12, color: "var(--color-texto-tenue)" }}>Próx. control: <strong style={{ color: "var(--color-verde)" }}>{new Date(a.proximo_control).toLocaleDateString("es-CL")}</strong></span>}
                        <span style={{ fontSize: 11, fontWeight: 600, color: a.estado === "cerrada" ? "var(--color-texto-tenue)" : "var(--color-verde)", background: a.estado === "cerrada" ? "var(--color-fondo)" : "var(--color-verde-suave)", padding: "2px 8px", borderRadius: 99 }}>
                          {a.estado}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <style>{`.dx-grid { @media (max-width:600px) { grid-template-columns: 1fr !important; } }`}</style>
    </AppShell>
  );
}
