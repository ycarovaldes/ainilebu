"use client";

import { AppShell } from "@/components/layout/AppShell";
import { pacientes } from "@/lib/mock-data";
import Link from "next/link";
import { useState } from "react";
import { Search, AlertCircle, Plus, ChevronRight } from "lucide-react";

function normalizar(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export default function PacientesPage() {
  const [query, setQuery] = useState("");

  const resultados = query.trim()
    ? pacientes.filter((p) => {
        const q = normalizar(query);
        return (
          normalizar(p.nombre).includes(q) ||
          normalizar(p.tutor.nombre ?? "").includes(q) ||
          p.tutor.telefono.replace(/\s/g, "").includes(q.replace(/\s/g, "")) ||
          String(p.n_ficha).includes(q) ||
          normalizar(p.raza ?? "").includes(q)
        );
      })
    : pacientes;

  return (
    <AppShell>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "36px 24px 48px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--color-texto)", margin: 0, letterSpacing: "-0.02em" }}>
            Pacientes
          </h1>
          <Link href="/nueva-atencion" style={{ textDecoration: "none" }}>
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
              }}
            >
              <Plus size={16} strokeWidth={2.5} />
              Nueva atención
            </button>
          </Link>
        </div>

        {/* Buscador */}
        <div style={{ position: "relative", marginBottom: 28 }}>
          <Search
            size={18}
            color="var(--color-texto-tenue)"
            style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
          />
          <input
            autoFocus
            type="text"
            placeholder="Buscar por nombre, teléfono, ficha o raza…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px 14px 44px",
              fontSize: 16,
              fontFamily: "var(--font-ui)",
              background: "white",
              border: "1.5px solid var(--color-borde)",
              borderRadius: 14,
              outline: "none",
              color: "var(--color-texto)",
              boxSizing: "border-box",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--color-verde-claro)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--color-borde)")}
          />
        </div>

        {/* Resultados */}
        {resultados.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: "48px 24px",
              textAlign: "center",
              border: "1px solid var(--color-borde)",
            }}
          >
            <p style={{ fontSize: 18, fontWeight: 600, color: "var(--color-texto-suave)", margin: "0 0 6px" }}>
              Sin resultados para "{query}"
            </p>
            <p style={{ fontSize: 14, color: "var(--color-texto-tenue)", margin: 0 }}>
              Prueba con otro nombre, teléfono o número de ficha.
            </p>
          </div>
        ) : (
          <>
            {query && (
              <p style={{ fontSize: 12, color: "var(--color-texto-tenue)", margin: "0 0 12px", fontWeight: 500 }}>
                {resultados.length} resultado{resultados.length !== 1 ? "s" : ""}
              </p>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {resultados.map((p) => (
                <Link key={p.id} href={`/pacientes/${p.id}`} style={{ textDecoration: "none" }}>
                  <div
                    style={{
                      background: "white",
                      borderRadius: 16,
                      padding: "16px 18px",
                      border: "1px solid var(--color-borde)",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      cursor: "pointer",
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
                    {/* Avatar */}
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 14,
                        background: p.especie === "felino" ? "#EEEEFF" : "var(--color-verde-suave)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 24,
                        flexShrink: 0,
                      }}
                    >
                      {p.especie === "felino" ? "🐱" : "🐶"}
                    </div>

                    {/* Info principal */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                        <span style={{ fontSize: 17, fontWeight: 800, color: "var(--color-texto)" }}>
                          {p.nombre}
                        </span>
                        {p.alerta && (
                          <AlertCircle size={14} color="var(--color-alerta)" />
                        )}
                        {p.es_endocrino && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              letterSpacing: "0.05em",
                              textTransform: "uppercase",
                              background: "#EEF2FF",
                              color: "#4F46E5",
                              padding: "2px 6px",
                              borderRadius: 99,
                            }}
                          >
                            Endócrino
                          </span>
                        )}
                      </div>
                      <p style={{ margin: 0, fontSize: 13, color: "var(--color-texto-suave)" }}>
                        {p.raza} · {p.edad} · {p.sexo === "macho" ? "♂" : "♀"} {p.peso} kg
                      </p>
                      <p style={{ margin: "3px 0 0", fontSize: 13, color: "var(--color-texto-tenue)" }}>
                        {p.tutor.nombre} · {p.tutor.telefono}
                      </p>
                    </div>

                    {/* Ficha + flecha */}
                    <div style={{ textAlign: "right", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "var(--color-texto-tenue)",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
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
      </div>
    </AppShell>
  );
}
