"use server";

import { db } from "@/lib/db";
import { recordatorios } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function marcarHecho(id: string) {
  await db
    .update(recordatorios)
    .set({ estado: "hecho", updated_at: new Date() })
    .where(eq(recordatorios.id, id));
  revalidatePath("/recordatorios");
  revalidatePath("/dashboard");
}

export async function posponer(id: string, nuevaFecha: string) {
  await db
    .update(recordatorios)
    .set({ fecha_objetivo: nuevaFecha, updated_at: new Date() })
    .where(eq(recordatorios.id, id));
  revalidatePath("/recordatorios");
  revalidatePath("/dashboard");
}

export async function cancelarRecordatorio(id: string) {
  await db
    .update(recordatorios)
    .set({ estado: "cancelado", updated_at: new Date() })
    .where(eq(recordatorios.id, id));
  revalidatePath("/recordatorios");
  revalidatePath("/dashboard");
}

export async function createRecordatorio(input: {
  paciente_id: string;
  tipo: string;
  titulo: string;
  fecha_objetivo: string;
  nota?: string;
  atencion_id?: string;
}) {
  await db.insert(recordatorios).values({
    paciente_id: input.paciente_id,
    atencion_id: input.atencion_id || null,
    tipo: input.tipo,
    titulo: input.titulo,
    nota: input.nota || null,
    fecha_objetivo: input.fecha_objetivo,
    estado: "pendiente",
  });
  revalidatePath("/recordatorios");
  revalidatePath("/dashboard");
}
