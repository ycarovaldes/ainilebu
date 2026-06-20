"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Search, Bell, CreditCard, Plus } from "lucide-react";

const nav = [
  { href: "/dashboard",     icon: LayoutDashboard, label: "Inicio" },
  { href: "/pacientes",     icon: Search,           label: "Pacientes" },
  { href: "/recordatorios", icon: Bell,             label: "Recordatorios" },
  { href: "/pagos",         icon: CreditCard,       label: "Pagos" },
];

export function BottomNav() {
  const path = usePathname();

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "white",
        borderTop: "1px solid var(--color-borde)",
        display: "flex",
        alignItems: "center",
        height: 64,
        zIndex: 50,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {nav.slice(0, 2).map(({ href, icon: Icon, label }) => {
        const active = path.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              color: active ? "var(--color-verde)" : "var(--color-texto-tenue)",
              textDecoration: "none",
              fontSize: 10,
              fontWeight: active ? 600 : 400,
              paddingTop: 8,
            }}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 2} />
            {label}
          </Link>
        );
      })}

      {/* Botón central Nueva atención */}
      <Link href="/nueva-atencion" style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: 52,
            height: 52,
            background: "var(--color-verde)",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(30, 92, 58, 0.4)",
            marginTop: -16,
          }}
        >
          <Plus size={26} color="white" strokeWidth={2.5} />
        </div>
      </Link>

      {nav.slice(2).map(({ href, icon: Icon, label }) => {
        const active = path.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              color: active ? "var(--color-verde)" : "var(--color-texto-tenue)",
              textDecoration: "none",
              fontSize: 10,
              fontWeight: active ? 600 : 400,
              paddingTop: 8,
            }}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 2} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
