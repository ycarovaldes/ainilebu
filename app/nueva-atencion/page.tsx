import { AppShell } from "@/components/layout/AppShell";
import { FormAtencion } from "@/components/atenciones/FormAtencion";
import { getPacienteById } from "@/lib/db/queries";

export default async function NuevaAtencionPage({
  searchParams,
}: {
  searchParams: Promise<{ paciente_id?: string }>;
}) {
  const { paciente_id } = await searchParams;
  const paciente = paciente_id ? await getPacienteById(paciente_id) : null;

  return (
    <AppShell>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 20px 0" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--color-texto)", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
          Nueva atención
        </h1>
        <p style={{ fontSize: 13, color: "var(--color-texto-suave)", margin: "0 0 24px" }}>
          Autoguardado activo — puedes salir en cualquier momento.
        </p>
      </div>
      <FormAtencion pacienteInicial={paciente ?? undefined} />
    </AppShell>
  );
}
