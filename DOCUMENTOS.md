# DOCUMENTOS (Fase 2)

Generación de documentos clínicos a partir de los datos del paciente y la atención.
La mayoría de los campos se **autocompletan** desde la ficha/atención; la veterinaria
solo ajusta o rellena lo específico del documento.

## Enfoque técnico

- Cada tipo de documento es una **plantilla** (HTML + CSS de impresión).
- Se rellena con datos del paciente + atención + campos propios del documento.
- MVP de salida: **"Imprimir / Guardar como PDF"** del navegador (CSS `@media print`).
  Cero infraestructura, funciona en tablet y PC.
- Mejora posterior: `@react-pdf/renderer` o render server-side para PDF consistente
  y guardado en Supabase Storage (`documentos.pdf_path`).
- Se guarda un **snapshot** de los datos usados en `documentos.datos` (jsonb), para
  que el documento no cambie si luego se edita la ficha.

## Encabezado común a todos los documentos

- Logo y nombre: **Clínica Veterinaria Ainilebu**.
- Fecha de emisión.
- Datos del paciente: nombre, especie, raza, sexo, edad, peso, N° ficha.
- Datos del tutor: nombre, RUT, teléfono, correo.
- Firma del médico veterinario (nombre + RUT profesional) y espacio de firma.

---

## Tipos de documento

### 1. Epicrisis (resumen de alta hospitalaria)
Es el documento más completo. Basado en el ejemplo real adjunto al proyecto, los
campos son:

**Datos del paciente:** nombre, especie, raza, sexo, edad, peso, N° ficha.
**Datos del tutor:** nombre, RUT, teléfono, correo.
**Motivo de ingreso.**
**Constantes fisiológicas** — tabla con filas *Ingreso* y *Egreso*, columnas:
Peso · FC · FR · T° · Mucosas · PAS · PAD · PAM · %DSH.
(Se toman de la tabla `constantes`.)
**Anamnesis** (texto libre).
**Examen clínico inicial** (texto libre).
**Prediagnóstico** (texto libre).
**Pronóstico** (texto corto: reservado / favorable / grave / …).
**Cirugías** (texto: realizadas o "a evaluación").
**Tratamiento intrahospitalario** (texto libre — lista de fármacos y manejo).
**Evolución** (texto libre).
**Observaciones** (texto libre — indicaciones, derivaciones, controles).

> Glosario para la UI (ayuda contextual): FC = frecuencia cardíaca,
> FR = frecuencia respiratoria, T° = temperatura, PAS/PAD/PAM = presión arterial
> sistólica/diastólica/media, %DSH = % deshidratación, RP = mucosas rosado pálido,
> MAD = miembro anterior derecho, TEC = traumatismo encéfalo-craneano.

### 2. Certificado de viaje
Datos del paciente y tutor + destino, fecha de viaje, declaración de estado de
salud apto para viajar, vacunas vigentes (especialmente antirrábica con fecha),
desparasitación, observaciones, firma y RUT del veterinario.

### 3. Presupuesto
Datos del paciente y tutor + lista de ítems (descripción, cantidad, valor unitario,
subtotal), total, validez del presupuesto, observaciones. Puede generar un registro
en `pagos` si se aprueba.

### 4. Informe de cirugía
Datos del paciente y tutor + diagnóstico, procedimiento realizado, hallazgos,
anestesia/protocolo, complicaciones, indicaciones post-operatorias, controles,
firma del cirujano.

### 5. Consentimiento informado
Datos del paciente y tutor + procedimiento propuesto, riesgos explicados,
alternativas, declaración de autorización del tutor, espacio de firma del tutor y
del veterinario, fecha.

### 6. Autorización de eutanasia
Datos del paciente y tutor + motivo clínico, declaración de voluntad del tutor
autorizando el procedimiento, identificación del tutor (nombre + RUT), espacio de
firma del tutor y del veterinario, fecha. (Documento sensible: redacción formal y
campos de identificación claros; idealmente firma manuscrita impresa.)

---

## Comportamiento en la UI

- Desde la **ficha del paciente** o desde una **atención** → botón "Generar documento"
  → elegir tipo → se abre el formulario con campos **ya autocompletados**.
- La veterinaria edita lo mínimo y pulsa "Generar PDF" (imprimir/guardar).
- El documento queda listado en la ficha del paciente (sección Documentos).
- Mantener plantillas legibles y formales; nada de campos obligatorios que bloqueen.
