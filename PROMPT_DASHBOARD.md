# PROMPT: Construir el Dashboard inicial de Ainilebu

> Pega esto en una sesión de Claude Code dentro del directorio del proyecto Ainilebu.
> Lee `CLAUDE.md` y los archivos de `docs/` primero; este prompt los complementa con
> la identidad visual concreta que debes replicar.

---

## Contexto visual de referencia

Existe otro proyecto (Ring Pet) con una interfaz que queremos replicar como base visual.
Extrae los patrones de diseño de los siguientes fragmentos de código — **no tienes acceso
al proyecto Ring Pet, pero los patrones están documentados aquí abajo**.

### Paleta y tokens de diseño

```css
/* globals.css — pegar en src/app/globals.css de Ainilebu */

/* Remap teal-* al verde teal bosque de la marca */
@theme {
  --color-teal-50: #ecf5f3;
  --color-teal-100: #d2e8e4;
  --color-teal-200: #a6d2cb;
  --color-teal-300: #71b7ad;
  --color-teal-400: #3e988c;
  --color-teal-500: #1c8175;
  --color-teal-600: #0e7c72;
  --color-teal-700: #0b6259;
  --color-teal-800: #0d4e47;
  --color-teal-900: #0f403b;
  --color-teal-950: #052724;
}

:root {
  /* Editorial premium — crema cálido, teal bosque */
  --background: #faf7f2;
  --foreground: #23201c;
  --card: #fffdfa;
  --card-foreground: #23201c;
  --popover: #fffdfa;
  --popover-foreground: #23201c;
  --primary: #0e7c72;
  --primary-foreground: #fbfaf6;
  --secondary: #f3e7de;
  --secondary-foreground: #5a3d2e;
  --muted: #f1ece3;
  --muted-foreground: #6b6258;
  --accent: #f6e3d6;
  --accent-foreground: #5a3d2e;
  --destructive: #d85a45;
  --border: #e7dfd3;
  --input: #e7dfd3;
  --ring: #0e7c72;
  --radius: 1.05rem;
  --sidebar: #fffdfa;
  --sidebar-foreground: #23201c;
  --sidebar-primary: #0e7c72;
  --sidebar-primary-foreground: #fbfaf6;
  --sidebar-accent: #f1ece3;
  --sidebar-accent-foreground: #2a2620;
  --sidebar-border: #e7dfd3;
  --sidebar-ring: #0e7c72;
}
```

### Fuentes

Instalar con `next/font/google`:
- **Body**: `Plus_Jakarta_Sans` — variable `--font-jakarta`, clase `font-sans`
- **Headings**: `Fraunces` (subsets: `latin`, display: `swap`) — variable `--font-fraunces`, clase `font-heading`

En `src/app/layout.tsx`:
```tsx
import { Plus_Jakarta_Sans, Fraunces } from 'next/font/google'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

// className en <html>: `${jakarta.variable} ${fraunces.variable} font-sans`
```

### Clase de superficie de fondo

```css
/* Agregar en globals.css */
@layer components {
  .app-surface {
    background-color: #faf7f2;
    background-image:
      radial-gradient(ellipse 70% 55% at 82% -8%, rgba(14, 124, 114, 0.07), transparent 60%),
      radial-gradient(ellipse 55% 50% at -5% 0%, rgba(224, 138, 91, 0.07), transparent 55%);
  }
}
```

---

## Patrón de componentes a replicar

### Layout principal

```
src/app/dashboard/layout.tsx
  └── <div className="flex min-h-screen app-surface">
        <Sidebar />            {/* w-64, fixed, left-0, top-0, z-30 */}
        <main className="flex-1 ml-64 min-h-screen flex flex-col">
          {children}
        </main>
      </div>
```

### Sidebar (estructura)

```
aside.w-64.bg-sidebar.border-r.border-sidebar-border.flex.flex-col.min-h-screen.fixed.left-0.top-0.z-30
  ├── Logo section (px-5 py-4, border-b)
  │     ├── Ícono: w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700
  │     │         con overlay ring-2 ring-white/30 + ícono Stethoscope blanco
  │     └── Texto: "Ainilebu" (font-heading font-semibold) + "Libreta veterinaria" (xs muted)
  ├── Nav items (px-3 py-3, space-y-0.5)
  │     Ítem activo:  bg-teal-50 text-teal-700 + indicador left (w-1 h-5 rounded-full bg-teal-600)
  │     Ítem inactivo: text-gray-600 hover:bg-muted hover:text-gray-900
  │     Cada ítem: flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
  └── Footer (px-3 py-4 border-t)
        └── Chip de estado: rounded-2xl bg-gradient-to-br from-teal-50 to-orange-50
                           border border-teal-100/60 + nombre de la clínica + pulse dot
```

**Ítems de navegación para Ainilebu:**

| Ruta | Label | Ícono Lucide |
|---|---|---|
| `/dashboard` | Hoy | `LayoutDashboard` |
| `/dashboard/pacientes` | Pacientes | `PawPrint` |
| `/dashboard/atenciones/nueva` | Nueva atención | `Plus` |
| `/dashboard/recordatorios` | Recordatorios | `Bell` |
| `/dashboard/pagos` | Pagos pendientes | `CreditCard` |

### Card base

```tsx
// Patrón reutilizable para todas las tarjetas
<div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
  {/* Blob de color en esquina */}
  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl bg-gradient-to-br from-teal-400/15 to-transparent" />
  {/* contenido */}
</div>
```

### Hero card del dashboard

```tsx
// Saludo + fecha + CTA principal
<div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-teal-600 via-teal-600 to-teal-700 px-6 py-5 text-white shadow-lg">
  <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
  <div className="absolute right-24 top-8 h-28 w-28 rounded-full bg-orange-300/20 blur-2xl" />
  <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
    <div>
      <div className="flex items-center gap-2 text-teal-50/90 text-xs">
        <Sparkles className="w-3.5 h-3.5" />
        {/* Día de la semana + fecha larga en español */}
      </div>
      <h1 className="mt-1 text-2xl font-bold tracking-tight">{saludo}, Ainilebu</h1>
      <p className="mt-1 text-teal-50/90 text-sm">
        {/* Resumen del día: X atenciones, Y recordatorios */}
      </p>
    </div>
    <div className="flex flex-wrap gap-2">
      {/* Botón primario: bg-white text-teal-700 rounded-xl px-3.5 py-2 text-sm font-semibold */}
      {/* Botón secundario: bg-white/15 ring-1 ring-white/30 rounded-xl */}
    </div>
  </div>
</div>
```

---

## Qué construir: Dashboard del día

Lee `docs/PANTALLAS.md` sección "1. Dashboard del día". El dashboard tiene estas secciones:

### Sección 1 — Hero (saludo + fecha + CTAs)
- Saludo dinámico: "Buenos días / Buenas tardes / Buenas noches"
- Fecha completa en español (ej. "Viernes 20 de junio")
- Párrafo de resumen: "Hoy tienes X atenciones · Y recordatorios · Z pagos pendientes"
- **Botón principal** (blanco sobre teal): "Nueva atención rápida" → `/dashboard/atenciones/nueva`
- **Botón secundario** (transparente): "Buscar paciente" → foca el buscador o `/dashboard/pacientes`

### Sección 2 — Barra de búsqueda global (siempre visible)
- Input ancho (w-full max-w-lg), placeholder "Buscar paciente o tutor…"
- Ícono Search a la izquierda
- Borde redondeado (rounded-2xl), bg-card, sombra sutil
- Al escribir, hace búsqueda en tiempo real (debounce 150 ms)
- Resultado: nombre del paciente, especie, nombre del tutor, teléfono, badges de estado

### Sección 3 — Atenciones de hoy
- Lista cronológica de atenciones del día
- Las abiertas/borrador van **arriba**, las cerradas debajo
- Cada ítem (tarjeta compacta):
  - Hora de registro
  - Nombre del paciente + especie
  - Tipo de plantilla (chip de color): Consulta, Vacuna, Control, Urgencia, etc.
  - Estado con color: `abierta` (amber), `cerrada` (green), `borrador` (gray)
  - Toque/clic → abre la atención completa
- Si no hay atenciones: empty state con ícono y botón "Registrar primera atención de hoy"

**Colores de estado (badges):**
```
abierta/borrador  → bg-amber-50  text-amber-700  border-amber-200
cerrada           → bg-green-50  text-green-700  border-green-200
urgencia          → bg-rose-50   text-rose-700   border-rose-200
```

### Sección 4 — Recordatorios para hoy
- Lista de recordatorios con fecha = hoy (controles, vacunas, seguimientos)
- Cada ítem: nombre del paciente, tipo de recordatorio (chip), teléfono del tutor
- Acciones rápidas: icono WhatsApp (tel:), icono llamada
- Si hay vencidos (fecha < hoy): mostrarlos arriba con badge rojo "Vencido"
- Máximo 5 visibles; link "Ver todos" al módulo de recordatorios

### Sección 5 — Pagos pendientes (resumen)
- Tarjeta de resumen: total adeudado (monto CLP grande) + cantidad de servicios pendientes
- Lista compacta: paciente, descripción, monto, fecha comprometida
- Botón "Ver todos los pagos" → `/dashboard/pagos`

---

## Estructura de layout del dashboard

```
p-6 space-y-6
  ├── Hero card (rounded-3xl gradient teal)
  ├── Barra de búsqueda (Card simple, sin borde llamativo)
  ├── Grid 2 columnas (lg:grid-cols-3 gap-6):
  │     ├── Atenciones de hoy    (lg:col-span-2, Card)
  │     └── Recordatorios de hoy (Card con border-l-4 border-l-teal-400)
  └── Resumen pagos pendientes (Card full-width o col-span-1)
```

---

## Datos para la demo (mock / seed)

Hasta que haya Supabase conectado, el dashboard debe funcionar con datos mock locales.
Crea `src/lib/mock-data.ts` con:

```ts
// Tipos mínimos
type EstadoAtencion = 'abierta' | 'cerrada' | 'borrador'
type TipoAtencion = 'consulta_general' | 'vacuna' | 'control' | 'urgencia' | 'desparasitacion' | 'cirugia'
type TipoRecordatorio = 'control' | 'vacuna' | 'seguimiento' | 'pago'

// Atenciones de hoy (5-8 registros con distintos estados y tipos)
// Recordatorios (3-5: mezcla de hoy, vencidos y próximos)
// Pagos pendientes (3-4 con montos en CLP, p.ej. 25000, 48000)
// Totales calculados a partir de los datos de arriba
```

Los datos de seed deben usar **fechas relativas al día actual** (no fechas fijas),
para que siempre aparezcan como "hoy" al abrir la app.

---

## Dependencias adicionales a instalar

```bash
npm install date-fns          # formateo de fechas en español
npm install lucide-react      # íconos (probablemente ya instalado)
```

shadcn/ui ya debe estar inicializado (`npx shadcn@latest init`).
Componentes de shadcn a agregar: `card`, `badge`, `button`, `input`, `separator`, `skeleton`.

---

## Reglas de implementación (del CLAUDE.md, no negocia)

1. **Primero propón el plan y la estructura de archivos. Espera confirmación antes de escribir código.**
2. Dashboard con datos mock estático primero; la conexión a Supabase viene después.
3. Todo en español (Chile). Fechas en formato `dd 'de' MMMM` con `date-fns` y locale `es`.
4. Tipografía: `text-sm` o mayor. Áreas táctiles ≥ 44px. Un elemento primario por pantalla.
5. El botón "Nueva atención rápida" debe ser el más visible de la página.
6. Mobile/tablet first. El layout de columnas solo activa en `lg:`.
7. No agregues módulos de Fase 2 (documentos, endócrinos) ni Fase 3 todavía.

---

## Entregable esperado de esta sesión

Al terminar esta tarea, debo poder abrir `http://localhost:3000/dashboard` y ver:

- [ ] Sidebar con logo Ainilebu, nav funcional y chip de estado de la clínica
- [ ] Hero card con saludo dinámico, fecha y botones de acción
- [ ] Barra de búsqueda visible (puede ser solo UI por ahora)
- [ ] Lista de atenciones de hoy con datos mock (al menos 3 items, distintos estados)
- [ ] Recordatorios del día (al menos 2 items)
- [ ] Resumen de pagos pendientes (monto total + lista compacta)
- [ ] Paleta de colores correcta: crema cálido (#faf7f2), verde teal (#0e7c72)
- [ ] Fuentes Plus Jakarta Sans y Fraunces cargadas

El resultado debe verse como una versión simplificada de Ring Pet (editorial, cálida, teal),
adaptada a una libreta veterinaria de una sola clínica.
