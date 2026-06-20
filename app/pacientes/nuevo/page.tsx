import { AppShell } from "@/components/layout/AppShell";
import { FormPaciente } from "@/components/pacientes/FormPaciente";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NuevoPacientePage({
  searchParams,
}: {
  searchParams: Promise<{ telefono?: string }>;
}) {
  const { telefono } = await searchParams;

  return (
    <AppShell>
      <div style={{ maxWidth: 580, margin: "0 auto", padding: "28px 24px 60px" }}>
        <Link
          href="/pacientes"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--color-texto-suave)", textDecoration: "none", marginBottom: 20 }}
        >
          <ArrowLeft size={15} /> Volver
        </Link>

        <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--color-texto)", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
          Nuevo paciente
        </h1>
        <p style={{ fontSize: 13, color: "var(--color-texto-suave)", margin: "0 0 28px" }}>
          Solo necesitas el nombre y el teléfono del tutor. Lo demás es opcional.
        </p>

        <FormPaciente telefonoInicial={telefono ?? ""} />
      </div>
    </AppShell>
  );
}
