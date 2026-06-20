export type Paciente = {
  id: string;
  nombre: string;
  especie: "canino" | "felino" | "otro";
  raza: string;
  sexo: "macho" | "hembra";
  edad: string;
  peso: number;
  alerta?: string;
  es_endocrino?: boolean;
  tutor: { nombre: string; telefono: string };
  ultima_atencion?: string;
  n_ficha: number;
};

export type Atencion = {
  id: string;
  fecha: string;
  plantilla: string;
  motivo: string;
  nota_clinica: string;
  diagnostico?: string;
  tratamiento?: string;
  peso?: number;
  paciente_id: string;
};

export type Recordatorio = {
  id: string;
  tipo: "control" | "vacuna" | "seguimiento" | "pago" | "otro";
  titulo: string;
  fecha_objetivo: string;
  estado: "pendiente" | "hecho" | "cancelado";
  paciente: { nombre: string; tutor_telefono: string };
};

export type Pago = {
  id: string;
  descripcion: string;
  monto_total: number;
  monto_pagado: number;
  estado: "pendiente" | "parcial" | "pagado";
  fecha_servicio: string;
  paciente: { nombre: string; tutor_nombre: string; tutor_telefono: string };
};

export const pacientes: Paciente[] = [
  {
    id: "1",
    nombre: "Tofu",
    especie: "felino",
    raza: "Persa",
    sexo: "hembra",
    edad: "4 años",
    peso: 3.8,
    n_ficha: 142,
    es_endocrino: true,
    alerta: "Diabetes — insulina NPH 2 UI c/12h",
    tutor: { nombre: "Valentina Morales", telefono: "+56 9 8123 4567" },
    ultima_atencion: "2026-06-18",
  },
  {
    id: "2",
    nombre: "Bruno",
    especie: "canino",
    raza: "Golden Retriever",
    sexo: "macho",
    edad: "6 años",
    peso: 32.5,
    n_ficha: 98,
    tutor: { nombre: "Rodrigo Salinas", telefono: "+56 9 7654 3210" },
    ultima_atencion: "2026-06-15",
  },
  {
    id: "3",
    nombre: "Luna",
    especie: "canino",
    raza: "Beagle",
    sexo: "hembra",
    edad: "2 años",
    peso: 11.2,
    n_ficha: 215,
    alerta: "Alérgica a amoxicilina",
    tutor: { nombre: "Camila Riquelme", telefono: "+56 9 9876 5432" },
    ultima_atencion: "2026-06-20",
  },
  {
    id: "4",
    nombre: "Max",
    especie: "canino",
    raza: "Labrador",
    sexo: "macho",
    edad: "8 años",
    peso: 28.0,
    n_ficha: 67,
    tutor: { nombre: "Pedro Fuentes", telefono: "+56 9 6543 2109" },
    ultima_atencion: "2026-05-30",
  },
  {
    id: "5",
    nombre: "Mimi",
    especie: "felino",
    raza: "Doméstico corto",
    sexo: "hembra",
    edad: "11 años",
    peso: 4.1,
    n_ficha: 31,
    es_endocrino: true,
    tutor: { nombre: "Rosa Jiménez", telefono: "+56 9 5432 1098" },
    ultima_atencion: "2026-06-10",
  },
  {
    id: "6",
    nombre: "Rocky",
    especie: "canino",
    raza: "Bulldog Francés",
    sexo: "macho",
    edad: "3 años",
    peso: 12.8,
    n_ficha: 178,
    tutor: { nombre: "Diego Vásquez", telefono: "+56 9 4321 0987" },
    ultima_atencion: "2026-06-20",
  },
];

export const atenciones: Atencion[] = [
  {
    id: "a1",
    paciente_id: "3",
    fecha: "2026-06-20T09:30:00",
    plantilla: "control",
    motivo: "Control post operatorio",
    nota_clinica: "Paciente en buen estado. Cicatrización correcta. Come y bebe bien.",
    diagnostico: "Evolución favorable post ovariohisterectomía",
    tratamiento: "Continuar meloxicam 0.5mg/kg por 3 días más",
    peso: 11.2,
  },
  {
    id: "a2",
    paciente_id: "6",
    fecha: "2026-06-20T11:00:00",
    plantilla: "vacuna",
    motivo: "Vacunación anual",
    nota_clinica: "Se aplica polivalente y antirrábica. Sin reacciones adversas.",
    peso: 12.8,
  },
  {
    id: "a3",
    paciente_id: "1",
    fecha: "2026-06-18T10:00:00",
    plantilla: "control",
    motivo: "Control diabetes",
    nota_clinica: "Curva de glucosa aceptable. Propietaria dice que come bien. Se mantiene dosis.",
    diagnostico: "Diabetes mellitus felina controlada",
    tratamiento: "Insulina NPH 2 UI c/12h. Control en 3 semanas.",
    peso: 3.8,
  },
];

export const recordatorios: Recordatorio[] = [
  {
    id: "r1",
    tipo: "control",
    titulo: "Control Tofu — diabetes",
    fecha_objetivo: "2026-07-09",
    estado: "pendiente",
    paciente: { nombre: "Tofu", tutor_telefono: "+56 9 8123 4567" },
  },
  {
    id: "r2",
    tipo: "vacuna",
    titulo: "Vacuna anual Bruno",
    fecha_objetivo: "2026-06-28",
    estado: "pendiente",
    paciente: { nombre: "Bruno", tutor_telefono: "+56 9 7654 3210" },
  },
  {
    id: "r3",
    tipo: "seguimiento",
    titulo: "Seguimiento Luna post-op",
    fecha_objetivo: "2026-06-27",
    estado: "pendiente",
    paciente: { nombre: "Luna", tutor_telefono: "+56 9 9876 5432" },
  },
  {
    id: "r4",
    tipo: "pago",
    titulo: "Cobro cirugía Luna",
    fecha_objetivo: "2026-06-25",
    estado: "pendiente",
    paciente: { nombre: "Luna", tutor_telefono: "+56 9 9876 5432" },
  },
];

export const pagos: Pago[] = [
  {
    id: "p1",
    descripcion: "Ovariohisterectomía + hospitalización",
    monto_total: 280000,
    monto_pagado: 100000,
    estado: "parcial",
    fecha_servicio: "2026-06-17",
    paciente: { nombre: "Luna", tutor_nombre: "Camila Riquelme", tutor_telefono: "+56 9 9876 5432" },
  },
  {
    id: "p2",
    descripcion: "Ecografía abdominal + consulta",
    monto_total: 65000,
    monto_pagado: 0,
    estado: "pendiente",
    fecha_servicio: "2026-06-10",
    paciente: { nombre: "Mimi", tutor_nombre: "Rosa Jiménez", tutor_telefono: "+56 9 5432 1098" },
  },
];
