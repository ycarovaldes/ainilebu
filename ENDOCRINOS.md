# ENDÓCRINOS (Fase 2)

Los pacientes endócrinos (diabetes, Cushing, hipotiroidismo, hipertiroidismo
felino, Addison) requieren un seguimiento más detallado que una consulta normal:
parámetros de laboratorio en el tiempo y ajuste de dosis. Este módulo es una
**vista enriquecida** del paciente, no un sistema aparte.

## Cómo se activa

- En la ficha del paciente hay un switch **"Paciente endócrino"** (`es_endocrino`).
- Al activarlo se crea/abre su `ficha_endocrina` y aparece la sección de
  **controles endócrinos** en su ficha.
- Nada de esto cambia el flujo de la atención rápida normal: la libreta sigue igual.

## Ficha endócrina (`fichas_endocrinas`)

- Enfermedad: diabetes · cushing · hipotiroidismo · hipertiroidismo · addison · otro.
- Fecha de diagnóstico.
- Notas de manejo (texto libre).

## Controles endócrinos (`controles_endocrinos`)

Línea de tiempo cronológica. Cada control: fecha, peso, **parámetros** (jsonb según
enfermedad), **dosis actual**, **ajuste** respecto al control anterior, nota.

### Parámetros sugeridos por enfermedad

> Son sugerencias para pre-armar el formulario; todo editable y opcional.

- **Diabetes:** glicemia (puntual o curva), fructosamina, dosis de insulina (UI) y
  tipo, PU/PD (sí/no), apetito, peso.
- **Cushing:** cortisol pre/post ACTH, dosis de trilostano, ALT, FA, signos
  (PU/PD, jadeo, alopecia).
- **Hipotiroidismo:** T4 total, T4 libre, TSH, dosis de levotiroxina, peso, calidad
  del pelaje.
- **Hipertiroidismo (felino):** T4 total, dosis de metimazol, FC, peso, apetito.
- **Addison:** sodio, potasio, relación Na/K, dosis de fludrocortisona/DOCP y
  prednisolona.

## Vistas útiles (mantener simple)

- **Tabla cronológica** de controles (lo esencial del MVP de este módulo).
- **Curva de glicemia** del día (gráfico simple) para pacientes diabéticos, si los
  datos vienen como curva. Opcional; no bloquear si no hay.
- Tendencia de un parámetro clave en el tiempo (ej. fructosamina, T4) — opcional.

## Relación con documentos

Desde la ficha endócrina se puede generar una **epicrisis** o un **informe** con el
historial de controles incluido (ver `DOCUMENTOS.md`).
