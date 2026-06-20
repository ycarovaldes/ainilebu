"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Search, AlertCircle, Plus, ChevronRight, Phone } from "lucide-react";
import { searchPacientesAction } from "@/lib/actions/pacientes";
import type { PacienteConTutor } from "@/lib/db/queries";

export function BuscadorPacientes({
  pacientesIniciales,
  queryInicial,
}: {
  pacientesIniciales: PacienteConTutor[];
  queryInicial: string;
}) {
  const [query, setQuery] = useState(queryInicial);
  const [pacientes, setPacientes] = useState(pacientesIniciales);
  const [buscando, setBuscando] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  function handleBusqueda(q: string) {
    setQuery(q);
    clearTimeout(timer.current);
    setBuscando(true);
    timer.current = setTimeout(async () => {
      const res = await searchPacientesAction(q);
      setPacientes(res);
      setBuscando(false);
    }, 180);
  }

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "36px 24px 80px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--color-texto)", margin: 0, letterSpacing: "-0.02em" }}>
          Pacientes
        </h1>
        <Link href="/pacientes/nuevo" style={{ textDecoration: "none" }}>
          <button style={{
            background: "var(--color-verde)", color: "white", border: "none",
            borderRadius: 12, padding: "10px 16px", fontSize: 14, fontWeight: 700,
            fontFamily: "var(--font-ui)", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <Plus size={16} strokeWidth={2.5} /> Nuevo paciente
          </button>
        </Link>
      </div>

      {/* Buscador */}
      <div style={{ position: "relative", marginBottom: 24 }}>
        <Search size={18} color="var(--color-texto-tenue)"
          style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        <input
          autoFocus
          type="text"
          placeholder="Buscar por nombre, teléfono, ficha o raza…"
          value={query}
          onChange={(e) => handleBusqueda(e.target.value)}
          style={{
            width: "100%", padding: "14px 16px 14px 46px", fontSize: 16,
            fontFamily: "var(--font-ui)", background: "white",
            border: "1.5px solid var(--color-borde)", borderRadius: 14,
            outline: "none", color: "var(--color-texto)", boxSizing: "border-box",
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--color-verde-claro)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--color-borde)")}
        />
        {buscando && (
          <div style={{
            position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
            width: 16, height: 16, border: "2px solid var(--color-verde-claro)",
            borderTopColor: "transparent", borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
          }} />
        )}
      </div>

      {/* Resultados */}
      {pacientes.length === 0 ? (
        <div style={{ background: "white", borderRadius: 18, padding: "48px 24px", textAlign: "center", border: "1px solid var(--color-borde)" }}>
          <p style={{ fontSize: 16, fontWeight: 600, color: "var(--color-texto-suave)", margin: "0 0 12px" }}>
            {query ? `Sin resultados para "${query}"` : "Sin pacientes registrados aún"}
          </p>
          <Link
            href={`/pacientes/nuevo${query ? `?telefono=${encodeURIComponent(query)}` : ""}`}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "12px 20px", background: "var(--color-verde)", color: "white",
              borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: "none",
            }}
          >
            <Plus size={16} /> Crear paciente nuevo
          </Link>
        </div>
      ) : (
        <>
          {query && (
            <p style={{ fontSize: 12, color: "var(--color-texto-tenue)", margin: "0 0 12px", fontWeight: 500 }}>
              {pacientes.length} resultado{pacientes.length !== 1 ? "s" : ""}
            </p>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {pacientes.map((p) => (
              <Link key={p.id} href={`/pacientes/${p.id}`} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    background: "white", borderRadius: 16, padding: "16px 18px",
                    border: "1px solid var(--color-borde)", display: "flex",
                    alignItems: "center", gap: 14, cursor: "pointer",
                    transition: "box-shadow 0.15s, border-color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "var(--shadow-md)";
                    e.currentTarget.style.borderColor = "var(--color-verde-claro)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "var(--color-borde)";
                  }}
                >
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                    background: p.especie === "felino" ? "#EEEEFF" : "var(--color-verde-suave)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
                  }}>
                    {p.especie === "felino" ? "🐱" : "🐶"}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 17, fontWeight: 800, color: "var(--color-texto)" }}>{p.nombre}</span>
                      {p.alertas && <AlertCircle size={14} color="var(--color-alerta)" />}
                      {p.es_endocrino && (
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", background: "#EEF2FF", color: "#4F46E5", padding: "2px 6px", borderRadius: 99 }}>
                          Endócrino
                        </span>
                      )}
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: "var(--color-texto-suave)" }}>
                      {[p.raza, p.edad_texto, p.sexo === "macho" ? "♂" : p.sexo === "hembra" ? "♀" : null, p.peso_referencia ? `${p.peso_referencia} kg` : null].filter(Boolean).join(" · ")}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--color-texto-tenue)", display: "flex", alignItems: "center", gap: 4 }}>
                      <Phone size={10} /> {p.tutor.nombre ? `${p.tutor.nombre} · ` : ""}{p.tutor.telefono}
                    </p>
                  </div>

                  <div style={{ textAlign: "right", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--color-texto-tenue)", fontVariantNumeric: "tabular-nums" }}>
                      #{p.n_ficha}
                    </span>
                    <ChevronRight size={16} color="var(--color-borde-fuerte)" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
