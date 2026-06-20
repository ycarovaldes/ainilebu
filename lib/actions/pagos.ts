"use server";

import { db } from "@/lib/db";
import { pagos } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function registrarAbono(id: string, montoAbono: number) {
  const [pago] = await db.select().from(pagos).where(eq(pagos.id, id)).limit(1);
  if (!pago) return;

  const nuevo = parseFloat(pago.monto_pagado) + montoAbono;
  const total = parseFloat(pago.monto_total);
  const nuevoEstado = nuevo >= total ? "pagado" : "parcial";

  await db
    .update(pagos)
    .set({
      monto_pagado: String(Math.min(nuevo, total)),
      estado: nuevoEstado,
      updated_at: new Date(),
    })
    .where(eq(pagos.id, id));

  revalidatePath("/pagos");
  revalidatePath("/dashboard");
}

export async function marcarPagado(id: string) {
  const [pago] = await db.select().from(pagos).where(eq(pagos.id, id)).limit(1);
  if (!pago) return;

  await db
    .update(pagos)
    .set({
      monto_pagado: pago.monto_total,
      estado: "pagado",
      updated_at: new Date(),
    })
    .where(eq(pagos.id, id));

  revalidatePath("/pagos");
  revalidatePath("/dashboard");
}

export async function createPago(input: {
  paciente_id: string;
  descripcion: string;
  monto_total: number;
  monto_pagado?: number;
  estado?: string;
  atencion_id?: string;
  fecha_compromiso?: string;
  nota?: string;
}) {
  const montoPagado = input.monto_pagado ?? 0;
  const estado =
    input.estado ??
    (montoPagado >= input.monto_total
      ? "pagado"
      : montoPagado > 0
      ? "parcial"
      : "pendiente");

  await db.insert(pagos).values({
    paciente_id: input.paciente_id,
    atencion_id: input.atencion_id || null,
    descripcion: input.descripcion,
    monto_total: String(input.monto_total),
    monto_pagado: String(montoPagado),
    estado,
    fecha_compromiso: input.fecha_compromiso || null,
    nota: input.nota || null,
  });

  revalidatePath("/pagos");
  revalidatePath("/dashboard");
}
