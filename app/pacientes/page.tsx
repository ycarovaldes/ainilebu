import { AppShell } from "@/components/layout/AppShell";
import { searchPacientes } from "@/lib/db/queries";
import { BuscadorPacientes } from "@/components/pacientes/BuscadorPacientes";

export default async function PacientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const pacientes = await searchPacientes(q);

  return (
    <AppShell>
      <BuscadorPacientes pacientesIniciales={pacientes} queryInicial={q ?? ""} />
    </AppShell>
  );
}
