import {
  pgTable,
  uuid,
  text,
  numeric,
  integer,
  boolean,
  date,
  timestamp,
  jsonb,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

const timestamps = {
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
};

// ─── usuarios ────────────────────────────────────────────────────────────────
export const usuarios = pgTable("usuarios", {
  id: uuid("id").primaryKey().defaultRandom(),
  nombre: text("nombre"),
  rol: text("rol").notNull().default("recepcion"), // veterinaria | recepcion | admin
  email: text("email").notNull(),
  ...timestamps,
});

// ─── tutores ─────────────────────────────────────────────────────────────────
export const tutores = pgTable(
  "tutores",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    nombre: text("nombre"),
    telefono: text("telefono").notNull(),
    rut: text("rut"),
    correo: text("correo"),
    direccion: text("direccion"),
    notas: text("notas"),
    ...timestamps,
  },
  (t) => [index("tutores_telefono_idx").on(t.telefono)]
);

// ─── pacientes ───────────────────────────────────────────────────────────────
export const pacientes = pgTable(
  "pacientes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tutor_id: uuid("tutor_id")
      .notNull()
      .references(() => tutores.id),
    nombre: text("nombre").notNull(),
    especie: text("especie"),
    raza: text("raza"),
    sexo: text("sexo"),
    fecha_nacimiento: date("fecha_nacimiento"),
    edad_texto: text("edad_texto"),
    color_sena: text("color_sena"),
    peso_referencia: numeric("peso_referencia"),
    n_ficha: integer("n_ficha").generatedAlwaysAsIdentity(),
    es_endocrino: boolean("es_endocrino").notNull().default(false),
    alertas: text("alertas"),
    activo: boolean("activo").notNull().default(true),
    ...timestamps,
  },
  (t) => [
    index("pacientes_nombre_idx").on(t.nombre),
    index("pacientes_n_ficha_idx").on(t.n_ficha),
    index("pacientes_tutor_idx").on(t.tutor_id),
  ]
);

// ─── atenciones ──────────────────────────────────────────────────────────────
export const atenciones = pgTable(
  "atenciones",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    paciente_id: uuid("paciente_id")
      .notNull()
      .references(() => pacientes.id),
    creado_por: uuid("creado_por").references(() => usuarios.id),
    fecha: timestamp("fecha", { withTimezone: true }).notNull().defaultNow(),
    plantilla: text("plantilla").notNull().default("consulta_general"),
    // consulta_general | vacuna | desparasitacion | control | urgencia | cirugia | medicacion | seguimiento
    peso: numeric("peso"),
    motivo: text("motivo"),
    nota_clinica: text("nota_clinica"),
    diagnostico_presuntivo: text("diagnostico_presuntivo"),
    tratamiento: text("tratamiento"),
    medicamentos: text("medicamentos"),
    vacuna: text("vacuna"),
    proximo_control: date("proximo_control"),
    estado: text("estado").notNull().default("abierta"), // abierta | cerrada | pendiente
    ...timestamps,
  },
  (t) => [index("atenciones_paciente_fecha_idx").on(t.paciente_id, t.fecha)]
);

// ─── constantes fisiológicas ─────────────────────────────────────────────────
export const constantes = pgTable("constantes", {
  id: uuid("id").primaryKey().defaultRandom(),
  atencion_id: uuid("atencion_id")
    .notNull()
    .references(() => atenciones.id),
  momento: text("momento"), // ingreso | egreso | control
  peso: numeric("peso"),
  fc: numeric("fc"),
  fr: numeric("fr"),
  temperatura: numeric("temperatura"),
  mucosas: text("mucosas"),
  pas: numeric("pas"),
  pad: numeric("pad"),
  pam: numeric("pam"),
  dsh: numeric("dsh"),
  registrado_at: timestamp("registrado_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── recordatorios ───────────────────────────────────────────────────────────
export const recordatorios = pgTable(
  "recordatorios",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    paciente_id: uuid("paciente_id")
      .notNull()
      .references(() => pacientes.id),
    atencion_id: uuid("atencion_id").references(() => atenciones.id),
    tipo: text("tipo").notNull(), // control | vacuna | seguimiento | pago | otro
    titulo: text("titulo"),
    nota: text("nota"),
    fecha_objetivo: date("fecha_objetivo").notNull(),
    estado: text("estado").notNull().default("pendiente"), // pendiente | hecho | cancelado
    ...timestamps,
  },
  (t) => [
    index("recordatorios_fecha_estado_idx").on(t.fecha_objetivo, t.estado),
  ]
);

// ─── pagos ───────────────────────────────────────────────────────────────────
export const pagos = pgTable(
  "pagos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    paciente_id: uuid("paciente_id")
      .notNull()
      .references(() => pacientes.id),
    atencion_id: uuid("atencion_id").references(() => atenciones.id),
    descripcion: text("descripcion"),
    monto_total: numeric("monto_total").notNull(),
    monto_pagado: numeric("monto_pagado").notNull().default("0"),
    estado: text("estado").notNull().default("pendiente"), // pendiente | parcial | pagado
    fecha_servicio: date("fecha_servicio").default(sql`CURRENT_DATE`),
    fecha_compromiso: date("fecha_compromiso"),
    nota: text("nota"),
    ...timestamps,
  },
  (t) => [index("pagos_estado_idx").on(t.estado)]
);

// ─── documentos ──────────────────────────────────────────────────────────────
export const documentos = pgTable("documentos", {
  id: uuid("id").primaryKey().defaultRandom(),
  paciente_id: uuid("paciente_id")
    .notNull()
    .references(() => pacientes.id),
  atencion_id: uuid("atencion_id").references(() => atenciones.id),
  creado_por: uuid("creado_por").references(() => usuarios.id),
  tipo: text("tipo").notNull(),
  // epicrisis | certificado_viaje | presupuesto | informe_cirugia | consentimiento | autorizacion_eutanasia
  datos: jsonb("datos"),
  pdf_path: text("pdf_path"),
  ...timestamps,
});

// ─── fichas_endocrinas ───────────────────────────────────────────────────────
export const fichas_endocrinas = pgTable(
  "fichas_endocrinas",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    paciente_id: uuid("paciente_id")
      .notNull()
      .references(() => pacientes.id),
    enfermedad: text("enfermedad").notNull(),
    // diabetes | cushing | hipotiroidismo | hipertiroidismo | addison | otro
    fecha_diagnostico: date("fecha_diagnostico"),
    notas_manejo: text("notas_manejo"),
    ...timestamps,
  },
  (t) => [unique("fichas_endocrinas_paciente_unique").on(t.paciente_id)]
);

// ─── controles_endocrinos ─────────────────────────────────────────────────────
export const controles_endocrinos = pgTable("controles_endocrinos", {
  id: uuid("id").primaryKey().defaultRandom(),
  paciente_id: uuid("paciente_id")
    .notNull()
    .references(() => pacientes.id),
  fecha: date("fecha").notNull().default(sql`CURRENT_DATE`),
  peso: numeric("peso"),
  parametros: jsonb("parametros"),
  dosis_actual: text("dosis_actual"),
  ajuste: text("ajuste"),
  nota: text("nota"),
  ...timestamps,
});
