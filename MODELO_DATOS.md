# MODELO DE DATOS

Postgres (Supabase). Esquema inicial. Regla general: **casi todo es nullable**
salvo lo mínimo para identificar a un paciente y su tutor. Esto permite "escribir
incompleto y ordenar después".

Todas las tablas tienen `id uuid pk default gen_random_uuid()`, `created_at` y,
donde corresponde, `updated_at`.

---

## tutores
| Campo | Tipo | Notas |
|---|---|---|
| nombre | text | opcional (puede registrarse solo con teléfono) |
| telefono | text | **obligatorio** (identificador práctico del tutor) |
| rut | text | opcional |
| correo | text | opcional |
| direccion | text | opcional |
| notas | text | opcional |

## pacientes
| Campo | Tipo | Notas |
|---|---|---|
| tutor_id | uuid fk → tutores | obligatorio |
| nombre | text | **obligatorio** |
| especie | text | opcional (canino, felino, …) |
| raza | text | opcional |
| sexo | text | opcional |
| fecha_nacimiento | date | opcional |
| edad_texto | text | opcional (ej. "8 años", si no hay fecha exacta) |
| color_sena | text | opcional |
| peso_referencia | numeric | opcional (kg) |
| n_ficha | int | autoincremental/secuencial, único por clínica |
| es_endocrino | boolean | default false |
| alertas | text | opcional (ej. "agresivo", "alérgico a X") |
| activo | boolean | default true |

> Crear un paciente requiere en la práctica solo: `pacientes.nombre` +
> `tutores.telefono`. El resto se completa luego.

## atenciones
| Campo | Tipo | Notas |
|---|---|---|
| paciente_id | uuid fk → pacientes | obligatorio |
| fecha | timestamptz | default now() |
| plantilla | text | consulta_general, vacuna, desparasitacion, control, urgencia, cirugia, medicacion, seguimiento |
| peso | numeric | opcional (kg) |
| motivo | text | opcional |
| nota_clinica | text | opcional (texto libre, admite dictado) |
| diagnostico_presuntivo | text | opcional |
| tratamiento | text | opcional |
| medicamentos | text | opcional (texto libre o lista serializada) |
| vacuna | text | opcional |
| proximo_control | date | opcional → dispara recordatorio |
| estado | text | abierta \| cerrada \| pendiente (default abierta) |
| creado_por | uuid fk → usuarios | opcional |

## constantes
Constantes fisiológicas asociadas a una atención (para hospitalización / epicrisis).
Una atención puede tener varias filas (ingreso, egreso, controles).

| Campo | Tipo | Notas |
|---|---|---|
| atencion_id | uuid fk → atenciones | obligatorio |
| momento | text | ingreso \| egreso \| control |
| peso | numeric | kg |
| fc | numeric | frecuencia cardíaca |
| fr | numeric | frecuencia respiratoria |
| temperatura | numeric | °C |
| mucosas | text | ej. "RP" (rosado pálido) |
| pas | numeric | presión arterial sistólica |
| pad | numeric | presión arterial diastólica |
| pam | numeric | presión arterial media |
| dsh | numeric | % deshidratación |
| registrado_at | timestamptz | default now() |

## recordatorios
| Campo | Tipo | Notas |
|---|---|---|
| paciente_id | uuid fk → pacientes | obligatorio |
| atencion_id | uuid fk → atenciones | opcional |
| tipo | text | control \| vacuna \| seguimiento \| pago \| otro |
| titulo | text | corto |
| nota | text | opcional |
| fecha_objetivo | date | obligatorio |
| estado | text | pendiente \| hecho \| cancelado (default pendiente) |

## pagos
Servicios con pago aplazado y abonos.

| Campo | Tipo | Notas |
|---|---|---|
| paciente_id | uuid fk → pacientes | obligatorio |
| atencion_id | uuid fk → atenciones | opcional |
| descripcion | text | qué se cobró |
| monto_total | numeric | obligatorio |
| monto_pagado | numeric | default 0 |
| estado | text | pendiente \| parcial \| pagado (derivable de los montos) |
| fecha_servicio | date | default hoy |
| fecha_compromiso | date | opcional (cuándo prometió pagar) → recordatorio |
| nota | text | opcional |

## documentos
Documentos generados (ver `DOCUMENTOS.md`).

| Campo | Tipo | Notas |
|---|---|---|
| paciente_id | uuid fk → pacientes | obligatorio |
| atencion_id | uuid fk → atenciones | opcional |
| tipo | text | epicrisis \| certificado_viaje \| presupuesto \| informe_cirugia \| consentimiento \| autorizacion_eutanasia |
| datos | jsonb | snapshot de los campos usados al generarlo |
| pdf_path | text | ruta en Supabase Storage (opcional) |
| creado_por | uuid fk → usuarios | opcional |

## fichas_endocrinas
Una por paciente endócrino (ver `ENDOCRINOS.md`).

| Campo | Tipo | Notas |
|---|---|---|
| paciente_id | uuid fk → pacientes | único, obligatorio |
| enfermedad | text | diabetes \| cushing \| hipotiroidismo \| hipertiroidismo \| addison \| otro |
| fecha_diagnostico | date | opcional |
| notas_manejo | text | opcional |

## controles_endocrinos
Línea de tiempo de controles del paciente endócrino.

| Campo | Tipo | Notas |
|---|---|---|
| paciente_id | uuid fk → pacientes | obligatorio |
| fecha | date | default hoy |
| peso | numeric | opcional |
| parametros | jsonb | valores de laboratorio según enfermedad (ver ENDOCRINOS.md) |
| dosis_actual | text | ej. "Insulina NPH 8 UI c/12h" |
| ajuste | text | cambio respecto al control anterior |
| nota | text | opcional |

## usuarios
Perfil ligado a Supabase Auth.

| Campo | Tipo | Notas |
|---|---|---|
| nombre | text | |
| rol | text | veterinaria \| recepcion \| admin |
| email | text | |

---

## Relaciones (resumen)

```
tutores 1──* pacientes 1──* atenciones 1──* constantes
                       │             └──* documentos
                       ├──* recordatorios
                       ├──* pagos
                       ├──1 fichas_endocrinas
                       └──* controles_endocrinos
```

## Notas de implementación

- `estado` de pagos puede calcularse en la app desde `monto_total`/`monto_pagado`,
  o materializarse. Mantenerlo simple.
- `parametros` y `datos` como `jsonb` para flexibilidad sin migraciones constantes.
- Índices útiles: `pacientes(nombre)`, `tutores(telefono)`, `pacientes(n_ficha)`,
  `atenciones(paciente_id, fecha)`, `recordatorios(fecha_objetivo, estado)`,
  `pagos(estado)`. Considerar índice de búsqueda por texto (trigram) para el buscador.
- RLS de Supabase: como es single-tenant, basta con "usuario autenticado de la
  clínica". No construir permisos por recurso en el MVP.
