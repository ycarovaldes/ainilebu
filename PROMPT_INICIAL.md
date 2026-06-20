# PROMPT INICIAL PARA CLAUDE CODE

> Copia y pega esto en Claude Code, en la carpeta del proyecto que ya contiene
> `CLAUDE.md` y la carpeta `docs/`. Está diseñado para que Claude Code **primero
> proponga un plan y espere tu confirmación** antes de escribir código.

---

Eres el desarrollador principal de **Libreta Ainilebu**, un SaaS minimalista para
una clínica veterinaria. Toda la especificación está en este repositorio: lee
`CLAUDE.md` y la carpeta `docs/` (`PRODUCTO.md`, `PANTALLAS.md`, `MODELO_DATOS.md`,
`DOCUMENTOS.md`, `ENDOCRINOS.md`, `ROADMAP.md`) antes de hacer nada.

## Contexto que no puedes olvidar

La usuaria principal es una veterinaria **reacia a la tecnología**. Para ella lo
más importante es **mirar al paciente, no llenar casillas**. Si el sistema se
siente más lento que su cuaderno de papel, fracasó. Estas reglas son inviolables:

- Crear un paciente nuevo = **2 campos** (nombre del paciente + teléfono del tutor).
- Registrar una atención básica = **menos de 60 segundos**.
- Encontrar un paciente = **menos de 5 segundos**.
- **Autoguardado siempre.** Nunca un botón "Guardar" obligatorio. Nunca se pierde nada.
- Se puede **escribir incompleto y ordenar después**. Nada bloquea el flujo.
- **Dictado por voz** en las notas clínicas (Web Speech API, es-CL).
- Botones grandes, texto grande, una acción primaria por pantalla.
- Mobile/tablet first; mismos datos en tablet (box) y PC (recepción).
- Es **un solo cliente** (single-tenant), sin permisos complejos ni multi-sucursal.

Si una funcionalidad agrega fricción al flujo diario o hace que esto parezca un ERP,
no va. Ante la duda, propón dejarla fuera.

## Stack

Next.js (App Router) + TypeScript, Tailwind CSS, Supabase (Postgres + Auth +
Storage), Drizzle ORM, dictado con Web Speech API, documentos vía plantillas HTML +
"imprimir/guardar PDF". Si propones algo distinto, justifícalo contra las reglas de
arriba antes de cambiarlo.

## Alcance ahora: solo Fase 1 (ver `ROADMAP.md`)

La libreta digital: autenticación mínima, tutores/pacientes, nueva atención rápida
(plantillas + dictado + autoguardado), buscador, ficha + historial cronológico,
recordatorios automáticos y pagos pendientes con recordatorio de pago, dashboard
del día. **No construyas Fase 2 ni Fase 3 todavía** (documentos, endócrinos, etc.).

## Lo que quiero de ti AHORA (no escribas código todavía)

1. Un **plan de implementación** de la Fase 1, dividido en pasos pequeños y
   verificables, en el orden en que los construirías.
2. La **estructura de carpetas y archivos** propuesta del proyecto.
3. El **esquema de base de datos** concreto para Fase 1 (tablas, columnas, tipos,
   índices) basado en `docs/MODELO_DATOS.md`, con las migraciones que crearías.
4. Las **dependencias** que instalarías y por qué.
5. Cualquier **decisión o duda** que necesites que yo confirme (ej. detalles de
   Supabase, manejo de autoguardado/offline, librería de PDF).

Preséntame eso y **espera mi confirmación**. No generes código de la aplicación
hasta que apruebe el plan.

## Cuando ya construyas (después de mi OK)

Prioriza, en este orden: simplicidad, velocidad, autoguardado, diseño
mobile/tablet, botones grandes, campos mínimos, historial cronológico, buscador
rápido, recordatorios simples. Construye y verifica paso a paso, mostrándome
avances pequeños y funcionando, no todo de una vez.
