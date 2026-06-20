import { db } from "./index";
import { pacientes, tutores, atenciones, recordatorios, pagos } from "./schema";
import { eq, and, or, ilike, desc, sql, ne } from "drizzle-orm";

// ─── Tipos exportados ─────────────────────────────────────────────────────────

export type PacienteConTutor = {
  id: string;
  nombre: string;
  especie: string | null;
  raza: string | null;
  sexo: string | null;
  edad_texto: string | null;
  fecha_nacimiento: string | null;
  peso_referencia: string | null;
  n_ficha: number | null;
  es_endocrino: boolean;
  alertas: string | null;
  activo: boolean;
  tutor: { id: string; nombre: string | null; telefono: string };
};

export type AtencionCompleta = {
  id: string;
  paciente_id: string;
  fecha: Date;
  plantilla: string;
  peso: string | null;
  motivo: string | null;
  nota_clinica: string | null;
  diagnostico_presuntivo: string | null;
  tratamiento: string | null;
  medicamentos: string | null;
  vacuna: string | null;
  proximo_control: string | null;
  estado: string;
  paciente?: { nombre: string; especie: string | null };
  tutor?: { nombre: string | null; telefono: string };
};

export type RecordatorioPendiente = {
  id: string;
  tipo: string;
  titulo: string | null;
  nota: string | null;
  fecha_objetivo: string;
  estado: string;
  paciente_id: string;
  paciente_nombre: string;
  tutor_nombre: string | null;
  tutor_telefono: string;
};

export type PagoPendiente = {
  id: string;
  descripcion: string | null;
  monto_total: string;
  monto_pagado: string;
  estado: string;
  fecha_servicio: string | null;
  fecha_compromiso: string | null;
  nota: string | null;
  paciente_id: string;
  paciente_nombre: string;
  tutor_nombre: string | null;
  tutor_telefono: string;
};

// ─── Pacientes ────────────────────────────────────────────────────────────────

export async function searchPacientes(query?: string): Promise<PacienteConTutor[]> {
  const rows = await db
    .select({
      id: pacientes.id,
      nombre: pacientes.nombre,
      especie: pacientes.especie,
      raza: pacientes.raza,
      sexo: pacientes.sexo,
      edad_texto: pacientes.edad_texto,
      fecha_nacimiento: pacientes.fecha_nacimiento,
      peso_referencia: pacientes.peso_referencia,
      n_ficha: pacientes.n_ficha,
      es_endocrino: pacientes.es_endocrino,
      alertas: pacientes.alertas,
      activo: pacientes.activo,
      tutor_id: tutores.id,
      tutor_nombre: tutores.nombre,
      tutor_telefono: tutores.telefono,
    })
    .from(pacientes)
    .innerJoin(tutores, eq(pacientes.tutor_id, tutores.id))
    .where(
      query?.trim()
        ? and(
            eq(pacientes.activo, true),
            or(
              ilike(pacientes.nombre, `%${query}%`),
              ilike(tutores.nombre, `%${query}%`),
              ilike(tutores.telefono, `%${query.replace(/\s/g, "")}%`),
              sql`${pacientes.n_ficha}::text ilike ${`%${query}%`}`
            )
          )
        : eq(pacientes.activo, true)
    )
    .orderBy(desc(pacientes.created_at))
    .limit(60);

  return rows.map((r) => ({
    id: r.id,
    nombre: r.nombre,
    especie: r.especie,
    raza: r.raza,
    sexo: r.sexo,
    edad_texto: r.edad_texto,
    fecha_nacimiento: r.fecha_nacimiento,
    peso_referencia: r.peso_referencia,
    n_ficha: r.n_ficha,
    es_endocrino: r.es_endocrino,
    alertas: r.alertas,
    activo: r.activo,
    tutor: { id: r.tutor_id, nombre: r.tutor_nombre, telefono: r.tutor_telefono },
  }));
}

export async function getPacienteById(id: string): Promise<PacienteConTutor | null> {
  const rows = await db
    .select({
      id: pacientes.id,
      nombre: pacientes.nombre,
      especie: pacientes.especie,
      raza: pacientes.raza,
      sexo: pacientes.sexo,
      edad_texto: pacientes.edad_texto,
      fecha_nacimiento: pacientes.fecha_nacimiento,
      peso_referencia: pacientes.peso_referencia,
      n_ficha: pacientes.n_ficha,
      es_endocrino: pacientes.es_endocrino,
      alertas: pacientes.alertas,
      activo: pacientes.activo,
      tutor_id: tutores.id,
      tutor_nombre: tutores.nombre,
      tutor_telefono: tutores.telefono,
    })
    .from(pacientes)
    .innerJoin(tutores, eq(pacientes.tutor_id, tutores.id))
    .where(eq(pacientes.id, id))
    .limit(1);

  if (!rows[0]) return null;
  const r = rows[0];
  return {
    id: r.id,
    nombre: r.nombre,
    especie: r.especie,
    raza: r.raza,
    sexo: r.sexo,
    edad_texto: r.edad_texto,
    fecha_nacimiento: r.fecha_nacimiento,
    peso_referencia: r.peso_referencia,
    n_ficha: r.n_ficha,
    es_endocrino: r.es_endocrino,
    alertas: r.alertas,
    activo: r.activo,
    tutor: { id: r.tutor_id, nombre: r.tutor_nombre, telefono: r.tutor_telefono },
  };
}

// ─── Atenciones ──────────────────────────────────────────────────────────────

export async function getAtencionesByPaciente(pacienteId: string): Promise<AtencionCompleta[]> {
  const rows = await db
    .select()
    .from(atenciones)
    .where(eq(atenciones.paciente_id, pacienteId))
    .orderBy(desc(atenciones.fecha));
  return rows;
}

export async function getAtencionesDia(): Promise<(AtencionCompleta & { paciente_nombre: string; tutor_telefono: string })[]> {
  const rows = await db
    .select({
      id: atenciones.id,
      paciente_id: atenciones.paciente_id,
      fecha: atenciones.fecha,
      plantilla: atenciones.plantilla,
      peso: atenciones.peso,
      motivo: atenciones.motivo,
      nota_clinica: atenciones.nota_clinica,
      diagnostico_presuntivo: atenciones.diagnostico_presuntivo,
      tratamiento: atenciones.tratamiento,
      medicamentos: atenciones.medicamentos,
      vacuna: atenciones.vacuna,
      proximo_control: atenciones.proximo_control,
      estado: atenciones.estado,
      paciente_nombre: pacientes.nombre,
      paciente_especie: pacientes.especie,
      paciente_alertas: pacientes.alertas,
      tutor_telefono: tutores.telefono,
      tutor_nombre: tutores.nombre,
    })
    .from(atenciones)
    .innerJoin(pacientes, eq(atenciones.paciente_id, pacientes.id))
    .innerJoin(tutores, eq(pacientes.tutor_id, tutores.id))
    .where(sql`${atenciones.fecha}::date = CURRENT_DATE`)
    .orderBy(desc(atenciones.fecha));

  return rows.map((r) => ({
    ...r,
    paciente: { nombre: r.paciente_nombre, especie: r.paciente_especie },
    tutor: { nombre: r.tutor_nombre, telefono: r.tutor_telefono },
  }));
}

export async function getAtencionById(id: string): Promise<AtencionCompleta | null> {
  const rows = await db
    .select()
    .from(atenciones)
    .where(eq(atenciones.id, id))
    .limit(1);
  return rows[0] ?? null;
}

// ─── Recordatorios ───────────────────────────────────────────────────────────

export async function getRecordatoriosPendientes(): Promise<RecordatorioPendiente[]> {
  const rows = await db
    .select({
      id: recordatorios.id,
      tipo: recordatorios.tipo,
      titulo: recordatorios.titulo,
      nota: recordatorios.nota,
      fecha_objetivo: recordatorios.fecha_objetivo,
      estado: recordatorios.estado,
      paciente_id: pacientes.id,
      paciente_nombre: pacientes.nombre,
      tutor_nombre: tutores.nombre,
      tutor_telefono: tutores.telefono,
    })
    .from(recordatorios)
    .innerJoin(pacientes, eq(recordatorios.paciente_id, pacientes.id))
    .innerJoin(tutores, eq(pacientes.tutor_id, tutores.id))
    .where(eq(recordatorios.estado, "pendiente"))
    .orderBy(recordatorios.fecha_objetivo);

  return rows;
}

export async function getRecordatoriosByPaciente(pacienteId: string): Promise<RecordatorioPendiente[]> {
  const rows = await db
    .select({
      id: recordatorios.id,
      tipo: recordatorios.tipo,
      titulo: recordatorios.titulo,
      nota: recordatorios.nota,
      fecha_objetivo: recordatorios.fecha_objetivo,
      estado: recordatorios.estado,
      paciente_id: pacientes.id,
      paciente_nombre: pacientes.nombre,
      tutor_nombre: tutores.nombre,
      tutor_telefono: tutores.telefono,
    })
    .from(recordatorios)
    .innerJoin(pacientes, eq(recordatorios.paciente_id, pacientes.id))
    .innerJoin(tutores, eq(pacientes.tutor_id, tutores.id))
    .where(
      and(
        eq(recordatorios.paciente_id, pacienteId),
        ne(recordatorios.estado, "cancelado")
      )
    )
    .orderBy(desc(recordatorios.fecha_objetivo));

  return rows;
}

// ─── Pagos ───────────────────────────────────────────────────────────────────

export async function getPagosPendientes(): Promise<PagoPendiente[]> {
  const rows = await db
    .select({
      id: pagos.id,
      descripcion: pagos.descripcion,
      monto_total: pagos.monto_total,
      monto_pagado: pagos.monto_pagado,
      estado: pagos.estado,
      fecha_servicio: pagos.fecha_servicio,
      fecha_compromiso: pagos.fecha_compromiso,
      nota: pagos.nota,
      paciente_id: pacientes.id,
      paciente_nombre: pacientes.nombre,
      tutor_nombre: tutores.nombre,
      tutor_telefono: tutores.telefono,
    })
    .from(pagos)
    .innerJoin(pacientes, eq(pagos.paciente_id, pacientes.id))
    .innerJoin(tutores, eq(pacientes.tutor_id, tutores.id))
    .where(ne(pagos.estado, "pagado"))
    .orderBy(desc(pagos.created_at));

  return rows;
}

export async function getPagosByPaciente(pacienteId: string): Promise<PagoPendiente[]> {
  const rows = await db
    .select({
      id: pagos.id,
      descripcion: pagos.descripcion,
      monto_total: pagos.monto_total,
      monto_pagado: pagos.monto_pagado,
      estado: pagos.estado,
      fecha_servicio: pagos.fecha_servicio,
      fecha_compromiso: pagos.fecha_compromiso,
      nota: pagos.nota,
      paciente_id: pacientes.id,
      paciente_nombre: pacientes.nombre,
      tutor_nombre: tutores.nombre,
      tutor_telefono: tutores.telefono,
    })
    .from(pagos)
    .innerJoin(pacientes, eq(pagos.paciente_id, pacientes.id))
    .innerJoin(tutores, eq(pacientes.tutor_id, tutores.id))
    .where(eq(pagos.paciente_id, pacienteId))
    .orderBy(desc(pagos.created_at));

  return rows;
}
