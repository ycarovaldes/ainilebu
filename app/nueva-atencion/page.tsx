import { AppShell } from "@/components/layout/AppShell";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NuevaAtencionPage() {
  return (
    <AppShell>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "36px 24px 48px" }}>
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
            marginBottom: 24,
          }}
        >
          <ArrowLeft size={15} /> Volver
        </Link>

        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: "var(--color-texto)",
            margin: "0 0 8px",
            letterSpacing: "-0.02em",
          }}
        >
          Nueva atención
        </h1>
        <p style={{ color: "var(--color-texto-suave)", fontSize: 14, margin: 0 }}>
          Próximamente — formulario de atención rápida con dictado por voz.
        </p>
      </div>
    </AppShell>
  );
}
