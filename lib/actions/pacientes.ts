"use server";

import { db } from "@/lib/db";
import { pacientes, tutores } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type CreatePacienteInput = {
  // Tutor
  tutor_telefono: string;
  tutor_nombre?: string;
  tutor_rut?: string;
  tutor_correo?: string;
  tutor_direccion?: string;
  // Paciente
  nombre: string;
  especie?: string;
  raza?: string;
  sexo?: string;
  fecha_nacimiento?: string;
  edad_texto?: string;
  color_sena?: string;
  peso_referencia?: string;
  alertas?: string;
  es_endocrino?: boolean;
};

export async function findTutorByTelefono(telefono: string) {
  const rows = await db
    .select()
    .from(tutores)
    .where(eq(tutores.telefono, telefono.trim()))
    .limit(1);
  return rows[0] ?? null;
}

export async function createPacienteConTutor(input: CreatePacienteInput): Promise<string> {
  const telefonoLimpio = input.tutor_telefono.trim();

  // Buscar o crear tutor
  let tutorId: string;
  const tutorExistente = await findTutorByTelefono(telefonoLimpio);

  if (tutorExistente) {
    tutorId = tutorExistente.id;
    // Actualizar nombre si llegó y no tenía
    if (input.tutor_nombre && !tutorExistente.nombre) {
      await db
        .update(tutores)
        .set({ nombre: input.tutor_nombre, updated_at: new Date() })
        .where(eq(tutores.id, tutorId));
    }
  } else {
    const [nuevoTutor] = await db
      .insert(tutores)
      .values({
        telefono: telefonoLimpio,
        nombre: input.tutor_nombre || null,
        rut: input.tutor_rut || null,
        correo: input.tutor_correo || null,
        direccion: input.tutor_direccion || null,
      })
      .returning({ id: tutores.id });
    tutorId = nuevoTutor.id;
  }

  // Crear paciente
  const [nuevoPaciente] = await db
    .insert(pacientes)
    .values({
      tutor_id: tutorId,
      nombre: input.nombre.trim(),
      especie: input.especie || null,
      raza: input.raza || null,
      sexo: input.sexo || null,
      fecha_nacimiento: input.fecha_nacimiento || null,
      edad_texto: input.edad_texto || null,
      color_sena: input.color_sena || null,
      peso_referencia: input.peso_referencia || null,
      alertas: input.alertas || null,
      es_endocrino: input.es_endocrino ?? false,
    })
    .returning({ id: pacientes.id });

  revalidatePath("/pacientes");
  revalidatePath("/dashboard");
  return nuevoPaciente.id;
}

export async function updatePaciente(
  id: string,
  input: Partial<Omit<CreatePacienteInput, "tutor_telefono">> & {
    tutor_nombre?: string;
    tutor_correo?: string;
    tutor_rut?: string;
    tutor_direccion?: string;
  }
) {
  // Actualizar paciente
  await db
    .update(pacientes)
    .set({
      nombre: input.nombre,
      especie: input.especie ?? undefined,
      raza: input.raza ?? undefined,
      sexo: input.sexo ?? undefined,
      fecha_nacimiento: input.fecha_nacimiento ?? undefined,
      edad_texto: input.edad_texto ?? undefined,
      color_sena: input.color_sena ?? undefined,
      peso_referencia: input.peso_referencia ?? undefined,
      alertas: input.alertas ?? undefined,
      es_endocrino: input.es_endocrino ?? undefined,
      updated_at: new Date(),
    })
    .where(eq(pacientes.id, id));

  revalidatePath(`/pacientes/${id}`);
  revalidatePath("/pacientes");
}

export async function searchPacientesAction(query: string) {
  const { searchPacientes } = await import("@/lib/db/queries");
  return searchPacientes(query);
}
