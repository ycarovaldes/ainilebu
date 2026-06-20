# CLAUDE.md — Contexto del proyecto

> Este archivo lo lee Claude Code automáticamente. Es la fuente de verdad sobre
> qué estamos construyendo, cómo y bajo qué reglas. Mantenlo corto y vigente.

## Qué es esto

**Libreta Ainilebu** — un SaaS minimalista para la **Clínica Veterinaria Ainilebu**.

La idea en una frase:
> *"Una libreta veterinaria digital: ordenada, buscable y con recordatorios."*

Lo que NO es:
> *"Un sistema veterinario completo, pesado y difícil de usar (un ERP)."*

## Problemas que resuelve (en orden de prioridad)

1. **Eliminar el cuaderno y lápiz** donde hoy se inscriben los pacientes.
2. **Recordatorios de pago** (los servicios se cobran a veces con pago aplazado).
3. **Pacientes endócrinos** con ficha detallada + **generación de documentos**
   (epicrisis, certificado de viaje, presupuesto, informe de cirugía,
   consentimiento informado, autorización de eutanasia).

## La usuaria principal

La veterinaria **no es amistosa con la tecnología**. Para ella lo más importante
es **mirar al paciente**, no llenar casillas. El sistema debe sentirse más rápido
que el papel o no sirve.

Reglas que nacen de esto y que NO se negocian:
- Crear un paciente nuevo debe poder hacerse con **2 campos** (nombre + teléfono).
- Registrar una atención básica: **menos de 60 segundos**.
- Encontrar un paciente: **menos de 5 segundos**.
- **Autoguardado siempre.** Nunca un botón "Guardar" obligatorio, nunca se pierde nada.
- Se puede **escribir incompleto y ordenar después**. Nada bloquea el flujo.
- **Dictado por voz** para las notas clínicas (es-CL).
- Botones grandes, texto grande, pocos elementos por pantalla.

## Stack recomendado

- **Next.js (App Router) + TypeScript** → desplegar en Vercel.
- **Tailwind CSS** para estilos. Componentes propios simples; shadcn/ui opcional.
- **Supabase** (Postgres + Auth + Storage) → multi-dispositivo, hosteado,
  almacenamiento de PDFs generados.
- **Drizzle ORM** (o Prisma) para acceso a datos tipado.
- **Dictado por voz:** Web Speech API nativa del navegador (es-CL), gratis.
- **Generación de documentos:** plantillas HTML con CSS de impresión + "Imprimir a PDF"
  como MVP; `@react-pdf/renderer` como mejora posterior si se necesita más control.
- **Autoguardado:** guardado con *debounce* a Supabase + borrador en `localStorage`
  como respaldo offline (la clínica puede tener internet inestable).

> Es una recomendación. Si propones un cambio de stack, justifícalo contra los
> principios de arriba antes de cambiarlo.

## Reglas de arquitectura

- **Un solo cliente (single-tenant):** es solo Ainilebu. Nada de multi-sucursal.
- **Roles mínimos:** `veterinaria`, `recepcion`. Sin permisos complejos.
- **Mobile/tablet first.** Se usa en tablet en el box y en notebook/PC en recepción,
  con los mismos datos.
- **Optimista y tolerante a fallos:** la UI no espera al servidor para sentirse rápida.
- Idioma de la interfaz: **español (Chile)**. Términos clínicos en español.

## Estructura de la documentación

Lee estos archivos según la tarea (están en `/docs`):

| Archivo | Para qué |
|---|---|
| `docs/PRODUCTO.md` | Visión, principios, criterios de éxito, estrategia de adopción |
| `docs/PANTALLAS.md` | Pantallas del MVP, campos y componentes de UI |
| `docs/MODELO_DATOS.md` | Entidades, esquema de base de datos |
| `docs/DOCUMENTOS.md` | Generación de epicrisis, certificados, etc. |
| `docs/ENDOCRINOS.md` | Módulo de pacientes endócrinos |
| `docs/ROADMAP.md` | Fases y lista de lo que NO se construye todavía |

## Flujo de trabajo contigo (Claude Code)

1. **No escribas código hasta tener un plan aprobado.** Primero propone:
   plan de implementación, estructura de carpetas y esquema de datos. **Espera confirmación.**
2. Construye por **Fase 1 primero** (ver `docs/ROADMAP.md`). No te adelantes a fases futuras.
3. Cada cambio debe respetar los principios de este archivo. Si una funcionalidad
   añade fricción al flujo diario, propón dejarla fuera.

## Comandos (rellenar al inicializar el proyecto)

```bash
# Instalar dependencias
# npm install

# Desarrollo
# npm run dev

# Migraciones de base de datos
# (Drizzle/Prisma — definir al scaffolding)

# Lint / typecheck
# npm run lint
# npm run typecheck
```
