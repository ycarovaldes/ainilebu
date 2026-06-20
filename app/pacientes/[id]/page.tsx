import { AppShell } from "@/components/layout/AppShell";
import { pacientes, atenciones } from "@/lib/mock-data";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  AlertTriangle,
  Plus,
  Stethoscope,
  Syringe,
  Bug,
  Activity,
  Zap,
  Scissors,
  Pill,
  RotateCcw,
} from "lucide-react";

const iconoPlantilla: Record<string, React.ReactNode> = {
  consulta_general: <Stethoscope size={14} />,
  vacuna:           <Syringe size={14} />,
  desparasitacion:  <Bug size={14} />,
  control:          <Activity size={14} />,
  urgencia:         <Zap size={14} />,
  cirugia:          <Scissors size={14} />,
  medicacion:       <Pill size={14} />,
  seguimiento:      <RotateCcw size={14} />,
};

const colorPlantilla: Record<string, { bg: string; color: string }> = {
  consulta_general: { bg: "var(--color-verde-suave)",  color: "var(--color-verde)" },
  vacuna:           { bg: "#EEF2FF", color: "#4F46E5" },
  desparasitacion:  { bg: "#F0FDF4", color: "#15803D" },
  control:          { bg: "#F0F9FF", color: "#0369A1" },
  urgencia:         { bg: "var(--color-alerta-suave)",  color: "var(--color-alerta)" },
  cirugia:          { bg: "#FDF4FF", color: "#9333EA" },
  medicacion:       { bg: "#FFFBEB", color: "#D97706" },
  seguimiento:      { bg: "#F8FAFC", color: "#64748B" },
};

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-CL", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

export default async function PacientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paciente = pacientes.find((p) => p.id === id);
  if (!paciente) notFound();

  const historial = atenciones
    .filter((a) => a.paciente_id === id)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  const esGato = paciente.especie === "felino";
  const avatarBg = esGato ? "#E8E7FF" : "var(--color-verde-suave)";

  return (
    <AppShell>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "24px 24px 48px" }}>

        {/* Volver */}
        <Link
          href="/pacientes"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            color: "var(--color-texto-suave)",
            textDecoration: "none",
            marginBottom: 20,
          }}
        >
          <ArrowLeft size={15} /> Pacientes
        </Link>

        {/* Hero del paciente */}
        <div
          style={{
            background: "white",
            borderRadius: 20,
            padding: "28px",
            border: "1px solid var(--color-borde)",
            marginBottom: 20,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            {/* Avatar grande — apuesta de diseño */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 20,
                background: avatarBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
                flexShrink: 0,
              }}
            >
              {esGato ? "🐱" : "🐶"}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                <h1
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: "var(--color-texto)",
                    margin: 0,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {paciente.nombre}
                </h1>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--color-texto-tenue)",
                    background: "var(--color-fondo)",
                    padding: "3px 9px",
                    borderRadius: 99,
                    border: "1px solid var(--color-borde)",
                  }}
                >
                  Ficha #{paciente.n_ficha}
                </span>
                {paciente.es_endocrino && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      background: "#EEF2FF",
                      color: "#4F46E5",
                      padding: "3px 8px",
                      borderRadius: 99,
                    }}
                  >
                    Endócrino
                  </span>
                )}
              </div>

              <p style={{ margin: "0 0 10px", fontSize: 14, color: "var(--color-texto-suave)", textTransform: "capitalize" }}>
                {paciente.especie} {paciente.raza && `· ${paciente.raza}`} · {paciente.sexo === "macho" ? "Macho" : "Hembra"} · {paciente.edad} · {paciente.peso} kg
              </p>

              {/* Tutor */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div>
                  <span style={{ fontSize: 13, color: "var(--color-texto-suave)" }}>
                    {paciente.tutor.nombre || "Tutor sin nombre"}
                  </span>
                  <a
                    href={`tel:${paciente.tutor.telefono}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      marginLeft: 10,
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--color-verde)",
                      textDecoration: "none",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    <Phone size={12} />
                    {paciente.tutor.telefono}
                  </a>
                </div>
              </div>
            </div>

            {/* Acción rápida */}
            <Link href="/nueva-atencion" style={{ textDecoration: "none", flexShrink: 0 }}>
              <button
                style={{
                  background: "var(--color-verde)",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  padding: "10px 16px",
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "var(--font-ui)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  whiteSpace: "nowrap",
                }}
              >
                <Plus size={16} strokeWidth={2.5} />
                Nueva atención
              </button>
            </Link>
          </div>

          {/* Alerta */}
          {paciente.alerta && (
            <div
              style={{
                marginTop: 16,
                background: "var(--color-alerta-suave)",
                border: "1px solid var(--color-alerta)",
                borderRadius: 12,
                padding: "10px 14px",
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <AlertTriangle size={16} color="var(--color-alerta)" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "var(--color-alerta)" }}>
                {paciente.alerta}
              </p>
            </div>
          )}
        </div>

        {/* Historial clínico */}
        <h2
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "var(--color-texto)",
            margin: "0 0 14px",
          }}
        >
          Historial clínico
        </h2>

        {historial.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: "40px 24px",
              textAlign: "center",
              border: "1px dashed var(--color-borde-fuerte)",
              color: "var(--color-texto-suave)",
            }}
          >
            <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600 }}>Sin atenciones registradas</p>
            <p style={{ margin: 0, fontSize: 13 }}>La primera aparecerá aquí.</p>
          </div>
        ) : (
          <div style={{ position: "relative" }}>
            {/* Línea de tiempo */}
            <div
              style={{
                position: "absolute",
                left: 19,
                top: 0,
                bottom: 0,
                width: 2,
                background: "var(--color-borde)",
              }}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingLeft: 48 }}>
              {historial.map((a, i) => {
                const plantillaStyle = colorPlantilla[a.plantilla] ?? colorPlantilla.seguimiento;
                return (
                  <div key={a.id} style={{ position: "relative" }}>
                    {/* Dot de la línea de tiempo */}
                    <div
                      style={{
                        position: "absolute",
                        left: -37,
                        top: 18,
                        width: 12,
                        height: 12,
                        borderRadius: 99,
                        background: i === 0 ? "var(--color-verde)" : "white",
                        border: `2px solid ${i === 0 ? "var(--color-verde)" : "var(--color-borde-fuerte)"}`,
                        zIndex: 1,
                      }}
                    />

                    <div
                      style={{
                        background: "white",
                        borderRadius: 16,
                        padding: "18px 20px",
                        border: "1px solid var(--color-borde)",
                        boxShadow: i === 0 ? "var(--shadow-sm)" : "none",
                      }}
                    >
                      {/* Cabecera */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                        <div>
                          <p style={{ margin: 0, fontSize: 12, color: "var(--color-texto-tenue)", textTransform: "capitalize", fontWeight: 500 }}>
                            {formatFecha(a.fecha)}
                          </p>
                          <p style={{ margin: "3px 0 0", fontSize: 15, fontWeight: 700, color: "var(--color-texto)" }}>
                            {a.motivo}
                          </p>
                        </div>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            background: plantillaStyle.bg,
                            color: plantillaStyle.color,
                            padding: "4px 10px",
                            borderRadius: 99,
                            flexShrink: 0,
                          }}
                        >
                          {iconoPlantilla[a.plantilla] ?? <Activity size={12} />}
                          {a.plantilla.replace("_", " ")}
                        </span>
                      </div>

                      {/* Nota clínica */}
                      {a.nota_clinica && (
                        <p
                          style={{
                            margin: "0 0 8px",
                            fontSize: 14,
                            color: "var(--color-texto)",
                            lineHeight: 1.6,
                            background: "var(--color-fondo)",
                            padding: "10px 14px",
                            borderRadius: 10,
                            borderLeft: "3px solid var(--color-borde-fuerte)",
                          }}
                        >
                          {a.nota_clinica}
                        </p>
                      )}

                      {/* Diagnóstico / tratamiento */}
                      {(a.diagnostico || a.tratamiento) && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }} className="dx-grid">
                          {a.diagnostico && (
                            <div style={{ background: "var(--color-fondo)", borderRadius: 10, padding: "10px 12px" }}>
                              <p style={{ margin: "0 0 3px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--color-texto-tenue)" }}>
                                Diagnóstico
                              </p>
                              <p style={{ margin: 0, fontSize: 13, color: "var(--color-texto)", fontWeight: 500 }}>
                                {a.diagnostico}
                              </p>
                            </div>
                          )}
                          {a.tratamiento && (
                            <div style={{ background: "var(--color-verde-suave)", borderRadius: 10, padding: "10px 12px" }}>
                              <p style={{ margin: "0 0 3px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--color-verde)" }}>
                                Tratamiento
                              </p>
                              <p style={{ margin: 0, fontSize: 13, color: "var(--color-texto)", fontWeight: 500 }}>
                                {a.tratamiento}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Peso registrado */}
                      {a.peso && (
                        <p style={{ margin: "8px 0 0", fontSize: 12, color: "var(--color-texto-tenue)" }}>
                          Peso: <strong style={{ color: "var(--color-texto-suave)" }}>{a.peso} kg</strong>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 600px) {
          .dx-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </AppShell>
  );
}
