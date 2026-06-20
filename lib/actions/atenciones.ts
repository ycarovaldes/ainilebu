"use server";

import { db } from "@/lib/db";
import { atenciones, recordatorios } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type AtencionInput = {
  paciente_id: string;
  plantilla: string;
  peso?: string;
  motivo?: string;
  nota_clinica?: string;
  diagnostico_presuntivo?: string;
  tratamiento?: string;
  medicamentos?: string;
  vacuna?: string;
  proximo_control?: string;
  estado?: string;
};

export async function createAtencion(input: AtencionInput): Promise<string> {
  const [nueva] = await db
    .insert(atenciones)
    .values({
      paciente_id: input.paciente_id,
      plantilla: input.plantilla || "consulta_general",
      peso: input.peso || null,
      motivo: input.motivo || null,
      nota_clinica: input.nota_clinica || null,
      diagnostico_presuntivo: input.diagnostico_presuntivo || null,
      tratamiento: input.tratamiento || null,
      medicamentos: input.medicamentos || null,
      vacuna: input.vacuna || null,
      proximo_control: input.proximo_control || null,
      estado: input.estado || "abierta",
    })
    .returning({ id: atenciones.id });

  revalidatePath("/dashboard");
  revalidatePath(`/pacientes/${input.paciente_id}`);
  return nueva.id;
}

export async function updateAtencion(id: string, input: Partial<AtencionInput>) {
  await db
    .update(atenciones)
    .set({
      plantilla: input.plantilla ?? undefined,
      peso: input.peso || null,
      motivo: input.motivo || null,
      nota_clinica: input.nota_clinica || null,
      diagnostico_presuntivo: input.diagnostico_presuntivo || null,
      tratamiento: input.tratamiento || null,
      medicamentos: input.medicamentos || null,
      vacuna: input.vacuna || null,
      proximo_control: input.proximo_control || null,
      estado: input.estado ?? undefined,
      updated_at: new Date(),
    })
    .where(eq(atenciones.id, id));

  if (input.paciente_id) {
    revalidatePath(`/pacientes/${input.paciente_id}`);
  }
  revalidatePath("/dashboard");
}

export async function cerrarAtencion(
  id: string,
  pacienteId: string,
  extras: {
    proximo_control?: string;
    pago_descripcion?: string;
    pago_monto?: string;
    pago_estado?: string;
  }
) {
  await db
    .update(atenciones)
    .set({ estado: "cerrada", updated_at: new Date() })
    .where(eq(atenciones.id, id));

  // Recordatorio automático si hay próximo control
  if (extras.proximo_control) {
    await db.insert(recordatorios).values({
      paciente_id: pacienteId,
      atencion_id: id,
      tipo: "control",
      titulo: "Próximo control",
      fecha_objetivo: extras.proximo_control,
      estado: "pendiente",
    });
  }

  // Pago pendiente si corresponde
  if (
    extras.pago_monto &&
    parseFloat(extras.pago_monto) > 0 &&
    extras.pago_estado &&
    extras.pago_estado !== "pagado"
  ) {
    const { pagos } = await import("@/lib/db/schema");
    await db.insert(pagos).values({
      paciente_id: pacienteId,
      atencion_id: id,
      descripcion: extras.pago_descripcion || "Servicio veterinario",
      monto_total: extras.pago_monto,
      monto_pagado: "0",
      estado: extras.pago_estado,
    });
    // Recordatorio de pago
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + 7);
    const fechaPago = hoy.toISOString().split("T")[0];
    await db.insert(recordatorios).values({
      paciente_id: pacienteId,
      atencion_id: id,
      tipo: "pago",
      titulo: `Cobro pendiente — ${extras.pago_descripcion || "servicio"}`,
      fecha_objetivo: fechaPago,
      estado: "pendiente",
    });
  }

  revalidatePath("/dashboard");
  revalidatePath(`/pacientes/${pacienteId}`);
  revalidatePath("/recordatorios");
  revalidatePath("/pagos");
}
