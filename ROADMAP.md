# ROADMAP

Construir en este orden. No adelantarse: cada fase debe sentirse terminada y útil
por sí sola antes de pasar a la siguiente.

## Fase 1 — La libreta (resuelve "eliminar el cuaderno" + recordatorios de pago)

Objetivo: que la veterinaria pueda dejar el papel desde el día uno.

- Autenticación mínima (Supabase Auth), roles `veterinaria` / `recepcion`.
- Tutores y pacientes (crear paciente con 2 campos).
- **Nueva atención rápida** con plantillas, dictado por voz y **autoguardado**.
- Buscador de pacientes (< 5 s).
- Ficha del paciente + **historial cronológico**.
- **Recordatorios** (control, vacuna, seguimiento) automáticos desde "próximo control".
- **Pagos pendientes** (servicio con pago aplazado, abonos, recordatorio de pago).
- Dashboard del día.
- Responsive tablet/PC + tolerancia básica a internet inestable (borrador local).

Criterios de cierre de fase: registrar una consulta < 60 s, encontrar paciente < 5 s,
crear paciente con 2 campos, nada se pierde, se siente más rápido que el papel.

## Fase 2 — Lo especializado (resuelve endócrinos + documentos)

- **Generador de documentos:** epicrisis, certificado de viaje, presupuesto,
  informe de cirugía, consentimiento informado, autorización de eutanasia
  (ver `DOCUMENTOS.md`). Salida vía imprimir/guardar PDF.
- **Constantes fisiológicas** (ingreso/egreso) para alimentar la epicrisis.
- **Módulo endócrino:** ficha endócrina + controles cronológicos (ver `ENDOCRINOS.md`).

## Fase 3 — Mejoras (solo si se piden y aportan al flujo diario)

- Agenda/citas simple.
- Exportes y métricas básicas (cuántas atenciones, pagos del mes).
- PDF server-side consistente + guardado en Storage.
- Mejoras offline más completas.
- Notificaciones (WhatsApp/SMS) de recordatorios — evaluar costo/beneficio.

---

## Lo que NO construimos todavía (anti-requisitos)

Mantener fuera del MVP. Si surge la tentación, anotarlo aquí y seguir.

- Facturación/contabilidad completa (solo recordatorio de pago simple).
- Inventario avanzado.
- Gestión contable.
- Múltiples sucursales.
- Reportes complejos / BI.
- Módulos de marketing.
- Hospitalización avanzada (módulo completo). Sí tenemos campos de constantes
  para la epicrisis, pero no un sistema de hospitalización.
- Permisos complejos / multi-rol granular.
- Integraciones innecesarias.
- App móvil nativa (usamos web responsive).
- Portal para tutores.
- Demasiados formularios obligatorios.
- Firma electrónica avanzada/certificada (para consentimientos basta firma simple
  en pantalla o impresión).

> Regla de oro: si una funcionalidad agrega fricción al flujo diario o hace que el
> sistema parezca un ERP, no va. Ante la duda, dejarla fuera y validar con la usuaria.
