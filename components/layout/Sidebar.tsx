"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Bell,
  CreditCard,
  Plus,
  Stethoscope,
} from "lucide-react";

const nav = [
  { href: "/dashboard",     icon: LayoutDashboard, label: "Inicio" },
  { href: "/pacientes",     icon: Search,           label: "Pacientes" },
  { href: "/recordatorios", icon: Bell,             label: "Recordatorios" },
  { href: "/pagos",         icon: CreditCard,       label: "Pagos" },
];

export function Sidebar() {
  const path = usePathname();

  return (
    <aside
      style={{
        width: 220,
        minHeight: "100dvh",
        background: "#FFFFFF",
        borderRight: "1px solid var(--color-borde)",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "28px 20px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: "var(--color-verde)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Stethoscope size={20} color="white" strokeWidth={2} />
          </div>
          <div>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: 15,
                fontWeight: 400,
                color: "var(--color-texto)",
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              Ainilebu
            </p>
            <p
              style={{
                fontSize: 10,
                color: "var(--color-texto-tenue)",
                margin: 0,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Veterinaria
            </p>
          </div>
        </div>
      </div>

      {/* Nueva atención */}
      <div style={{ padding: "0 12px 24px" }}>
        <Link href="/nueva-atencion" style={{ textDecoration: "none" }}>
          <button
            style={{
              width: "100%",
              background: "var(--color-verde)",
              color: "white",
              border: "none",
              borderRadius: 12,
              padding: "12px 16px",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "var(--font-ui)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-verde-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-verde)")}
          >
            <Plus size={18} strokeWidth={2.5} />
            Nueva atención
          </button>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ padding: "0 8px", flex: 1 }}>
        {nav.map(({ href, icon: Icon, label }) => {
          const active = path === href || path.startsWith(href + "/");
          return (
            <Link key={href} href={href} style={{ textDecoration: "none" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 10,
                  marginBottom: 2,
                  background: active ? "var(--color-verde-suave)" : "transparent",
                  color: active ? "var(--color-verde)" : "var(--color-texto-suave)",
                  fontWeight: active ? 600 : 400,
                  fontSize: 14,
                  transition: "background 0.1s, color 0.1s",
                  cursor: "pointer",
                  borderLeft: active ? "3px solid var(--color-verde)" : "3px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!active) (e.currentTarget as HTMLDivElement).style.background = "var(--color-fondo)";
                }}
                onMouseLeave={(e) => {
                  if (!active) (e.currentTarget as HTMLDivElement).style.background = "transparent";
                }}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                {label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid var(--color-borde)",
          fontSize: 11,
          color: "var(--color-texto-tenue)",
          letterSpacing: "0.03em",
        }}
      >
        Libreta Ainilebu v1
      </div>
    </aside>
  );
}
