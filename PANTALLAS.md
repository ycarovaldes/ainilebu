# PANTALLAS

Las pantallas del MVP y sus campos. Todo campo es **opcional** salvo donde diga
"obligatorio". El principio rector: lo mínimo visible, lo demás detrás de un toque.

## Mapa de pantallas

1. Dashboard del día
2. Buscador de pacientes
3. Ficha del paciente
4. Nueva atención rápida
5. Historial del paciente
6. Recordatorios y pagos pendientes
7. (Fase 2) Sección endócrinos → ver `ENDOCRINOS.md`
8. (Fase 2) Generador de documentos → ver `DOCUMENTOS.md`

---

## 1. Dashboard del día

**Para qué:** lo primero que ve al abrir. Reemplaza el "qué hice hoy" del cuaderno.

Contenido:
- Botón grande **"Nueva atención rápida"** (acción principal, siempre visible).
- Buscador de pacientes (barra superior, siempre accesible).
- **Atenciones de hoy** (lista cronológica, las abiertas/borrador arriba).
- **Recordatorios para hoy** (controles, vacunas, seguimientos).
- **Pagos pendientes** (resumen con monto total adeudado y cantidad).

Componentes: barra de búsqueda fija, botón de acción grande, tarjetas/listas
simples con nombre del paciente + dato clave + estado (color).

---

## 2. Buscador de pacientes

**Para qué:** encontrar un paciente en < 5 s.

- Un solo campo de texto, autofoco. Busca por **nombre del paciente o del tutor**
  (y por teléfono / N° de ficha).
- Resultados en vivo mientras escribe (debounce ~150 ms).
- Cada resultado: nombre del paciente, especie, tutor, teléfono, y badges
  (🩺 endócrino, 💲 pago pendiente).
- Toque en un resultado → abre la **Ficha del paciente**.
- Si no hay resultados → botón grande **"Crear paciente nuevo"**.

---

## 3. Ficha del paciente

**Para qué:** ver al paciente de un vistazo + acceder a su historial.

Encabezado (compacto):
- Nombre, especie, raza, sexo, edad/fecha de nacimiento, peso de referencia.
- N° de ficha.
- Tutor: nombre + teléfono (con accesos directos llamar/WhatsApp).
- Badges: endócrino, pagos pendientes, alertas (ej. "agresivo", "alérgico").
- Botón grande **"Nueva atención rápida"**.

Cuerpo:
- **Historial** cronológico (ver pantalla 5) embebido o como pestaña.
- Acceso a recordatorios del paciente y a pagos del paciente.
- (Fase 2) Acceso a ficha endócrina y a documentos generados.

### Crear / editar paciente

- **Obligatorios:** nombre del paciente, teléfono del tutor.
- Opcionales: especie, raza, sexo, fecha de nacimiento/edad, color/seña,
  peso de referencia, nombre del tutor, RUT, correo, alertas, marcar como endócrino.
- Si el tutor ya existe (por teléfono), ofrecer reutilizarlo.

---

## 4. Nueva atención rápida

**Para qué:** el corazón del producto. Registrar en < 60 s con autoguardado.

Flujo:
1. Selección de **paciente** (viene preseleccionado si se entró desde su ficha;
   si no, buscador inline).
2. Selección de **plantilla** (chips grandes): Consulta general, Vacuna,
   Desparasitación, Control, Urgencia, Cirugía/procedimiento, Medicación aplicada,
   Seguimiento telefónico. La plantilla pre-rellena campos y textos sugeridos.
3. Formulario, todo editable, casi todo opcional:

| Campo | Tipo | Notas |
|---|---|---|
| Paciente | referencia | obligatorio |
| Fecha | automática | editable si hace falta |
| Peso | número (kg) | teclado numérico grande |
| Motivo de consulta | texto corto | sugerido por plantilla |
| Nota clínica | texto libre largo | **con dictado por voz** |
| Diagnóstico presuntivo | texto corto | opcional |
| Tratamiento realizado | texto libre | sugerido por plantilla |
| Medicamentos aplicados | texto / lista | opcional |
| Vacuna | texto / selección | opcional |
| Próximo control | fecha | si se llena → genera recordatorio |
| Pago | mini-bloque | monto + estado (pagado/pendiente/parcial) |
| Estado | abierta / cerrada / pendiente | por defecto "abierta" (borrador) |

Comportamiento:
- **Autoguardado** con debounce (~800 ms) + indicador discreto "Guardado".
- Si hay "Próximo control" → al guardar, crear recordatorio automáticamente.
- Si el pago queda "pendiente" o "parcial" → crear recordatorio de pago.
- Puede salir en cualquier momento sin perder nada (queda como borrador/abierta).
- Botón grande del micrófono junto a Nota clínica → dictado es-CL.

Componentes: chips de plantilla, inputs grandes, botón de micrófono, switch de
estado, indicador de autoguardado, teclado numérico para peso/monto.

---

## 5. Historial del paciente

**Para qué:** ver qué se le ha hecho al paciente, en orden cronológico.

- Lista de atenciones, **más reciente arriba**.
- Cada ítem (colapsado): fecha, plantilla/tipo, motivo, peso, estado.
- Toque → expande la atención completa o la abre para continuar/editar.
- Filtro simple opcional (por tipo o por rango de fechas). Mantener mínimo.

---

## 6. Recordatorios y pagos pendientes

**Para qué:** que nada se olvide, especialmente los pagos aplazados.

Dos vistas (o pestañas):
- **Recordatorios:** controles, vacunas, seguimientos. Agrupados por
  vencidos / hoy / próximos. Cada uno: paciente, tipo, fecha objetivo, nota.
  Acciones: marcar hecho, posponer, abrir ficha, llamar/WhatsApp al tutor.
- **Pagos pendientes:** lista de servicios con saldo. Cada uno: paciente, tutor,
  descripción, monto total, monto pagado, saldo, fecha de servicio, fecha
  comprometida. Acciones: registrar pago/abono, marcar pagado, contactar tutor.
  Resumen arriba: total adeudado.

---

## Componentes de UI compartidos

- **Barra de búsqueda global** (siempre arriba).
- **Botón de acción primaria grande** ("Nueva atención rápida").
- **Chips de plantilla.**
- **Input de texto con dictado por voz.**
- **Indicador de autoguardado.**
- **Badges de estado** (endócrino, pago pendiente, alerta) con color.
- **Tarjeta de paciente** (reutilizable en buscador, dashboard, listas).
- **Mini-bloque de pago** (monto + estado).
- **Botones de contacto** (llamar / WhatsApp) usando el teléfono del tutor.

Lineamientos: tipografía grande, alto contraste, áreas táctiles ≥ 44px, una acción
primaria clara por pantalla, evitar menús anidados.
