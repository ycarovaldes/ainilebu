"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createAtencion, updateAtencion, cerrarAtencion } from "@/lib/actions/atenciones";
import { searchPacientesAction } from "@/lib/actions/pacientes";
import { useVoiceDictation } from "@/hooks/useVoiceDictation";
import type { PacienteConTutor } from "@/lib/db/queries";
import {
  Mic, MicOff, Search, CheckCircle, AlertCircle,
  Loader2, Stethoscope, Syringe, Bug, Activity,
  Zap, Scissors, Pill, RotateCcw, ChevronDown, ChevronUp, X
} from "lucide-react";

// ─── Plantillas ───────────────────────────────────────────────────────────────

type Plantilla = {
  id: string;
  label: string;
  icon: React.ReactNode;
  motivo: string;
  tratamiento?: string;
};

const PLANTILLAS: Plantilla[] = [
  { id: "consulta_general", label: "Consulta", icon: <Stethoscope size={16} />, motivo: "Consulta general" },
  { id: "control",          label: "Control",  icon: <Activity size={16} />,    motivo: "Control" },
  { id: "vacuna",           label: "Vacuna",   icon: <Syringe size={16} />,     motivo: "Vacunación", tratamiento: "Vacuna aplicada sin reacciones adversas." },
  { id: "desparasitacion",  label: "Desparasitación", icon: <Bug size={16} />,  motivo: "Desparasitación", tratamiento: "Antiparasitario administrado." },
  { id: "urgencia",         label: "Urgencia", icon: <Zap size={16} />,         motivo: "Urgencia / Emergencia" },
  { id: "cirugia",          label: "Cirugía",  icon: <Scissors size={16} />,    motivo: "Cirugía / Procedimiento" },
  { id: "medicacion",       label: "Medicación", icon: <Pill size={16} />,      motivo: "Medicación aplicada" },
  { id: "seguimiento",      label: "Seguimiento", icon: <RotateCcw size={16} />, motivo: "Seguimiento telefónico" },
];

// ─── Estado del formulario ────────────────────────────────────────────────────

type FormState = {
  paciente_id: string;
  plantilla: string;
  peso: string;
  motivo: string;
  nota_clinica: string;
  diagnostico_presuntivo: string;
  tratamiento: string;
  medicamentos: string;
  vacuna: string;
  proximo_control: string;
  pago_descripcion: string;
  pago_monto: string;
  pago_estado: string;
  estado: string;
};

const FORM_VACÍO: FormState = {
  paciente_id: "",
  plantilla: "consulta_general",
  peso: "",
  motivo: "Consulta general",
  nota_clinica: "",
  diagnostico_presuntivo: "",
  tratamiento: "",
  medicamentos: "",
  vacuna: "",
  proximo_control: "",
  pago_descripcion: "",
  pago_monto: "",
  pago_estado: "pendiente",
  estado: "abierta",
};

// ─── Componente principal ─────────────────────────────────────────────────────

export function FormAtencion({
  pacienteInicial,
}: {
  pacienteInicial?: PacienteConTutor;
}) {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    ...FORM_VACÍO,
    paciente_id: pacienteInicial?.id ?? "",
  });
  const [paciente, setPaciente] = useState<PacienteConTutor | null>(pacienteInicial ?? null);
  const [atencionId, setAtencionId] = useState<string | null>(null);
  const [guardando, setGuardando] = useState<"idle" | "guardando" | "guardado" | "error">("idle");
  const [mostrarOpcionales, setMostrarOpcionales] = useState(false);
  const [cerrando, setCerrando] = useState(false);
  const [cerrada, setCerrada] = useState(false);

  // Búsqueda de paciente
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState<PacienteConTutor[]>([]);
  const [buscando, setBuscando] = useState(false);
  const busquedaTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Voz
  const { isListening, error: errorVoz, toggleListening } = useVoiceDictation(
    (transcript) =>
      setForm((prev) => {
        const updated = {
          ...prev,
          nota_clinica: prev.nota_clinica
            ? prev.nota_clinica + " " + transcript
            : transcript,
        };
        triggerAutosave(updated);
        return updated;
      })
  );

  // Autoguardado
  const autosaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const atencionIdRef = useRef<string | null>(null);
  atencionIdRef.current = atencionId;

  const performSave = useCallback(
    async (data: FormState) => {
      if (!data.paciente_id) return;
      setGuardando("guardando");
      try {
        if (atencionIdRef.current) {
          await updateAtencion(atencionIdRef.current, data);
        } else {
          const id = await createAtencion(data);
          setAtencionId(id);
          atencionIdRef.current = id;
          localStorage.setItem(
            "draft_atencion",
            JSON.stringify({ ...data, atencion_id: id })
          );
        }
        setGuardando("guardado");
        setTimeout(() => setGuardando("idle"), 2000);
      } catch {
        setGuardando("error");
      }
    },
    []
  );

  const triggerAutosave = useCallback(
    (data: FormState) => {
      clearTimeout(autosaveTimer.current);
      autosaveTimer.current = setTimeout(() => performSave(data), 800);
    },
    [performSave]
  );

  // Restaurar borrador de localStorage
  useEffect(() => {
    if (pacienteInicial) return;
    const raw = localStorage.getItem("draft_atencion");
    if (!raw) return;
    try {
      const draft = JSON.parse(raw);
      if (draft.atencion_id) {
        setAtencionId(draft.atencion_id);
        setForm({ ...FORM_VACÍO, ...draft });
      }
    } catch {}
  }, [pacienteInicial]);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  function handleField(field: keyof FormState, value: string) {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      triggerAutosave(updated);
      return updated;
    });
  }

  function handlePlantilla(p: Plantilla) {
    setForm((prev) => {
      const updated = {
        ...prev,
        plantilla: p.id,
        motivo: p.motivo,
        tratamiento: p.tratamiento ?? prev.tratamiento,
        vacuna: p.id === "vacuna" ? prev.vacuna : prev.vacuna,
      };
      triggerAutosave(updated);
      return updated;
    });
  }

  function handleBusqueda(q: string) {
    setBusqueda(q);
    clearTimeout(busquedaTimer.current);
    if (!q.trim()) { setResultados([]); return; }
    setBuscando(true);
    busquedaTimer.current = setTimeout(async () => {
      const res = await searchPacientesAction(q);
      setResultados(res);
      setBuscando(false);
    }, 200);
  }

  function seleccionarPaciente(p: PacienteConTutor) {
    setPaciente(p);
    setResultados([]);
    setBusqueda("");
    const updated = { ...form, paciente_id: p.id };
    setForm(updated);
    triggerAutosave(updated);
  }

  async function handleCerrar() {
    if (!atencionId || !form.paciente_id) return;
    setCerrando(true);
    try {
      await cerrarAtencion(atencionId, form.paciente_id, {
        proximo_control: form.proximo_control || undefined,
        pago_descripcion: form.pago_descripcion || undefined,
        pago_monto: form.pago_monto || undefined,
        pago_estado: form.pago_monto ? form.pago_estado : undefined,
      });
      localStorage.removeItem("draft_atencion");
      setCerrada(true);
      router.push(`/pacientes/${form.paciente_id}`);
    } catch {
      setCerrando(false);
    }
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  if (cerrada) {
    return (
      <div style={{ textAlign: "center", padding: "60px 24px" }}>
        <CheckCircle size={48} color="var(--color-verde)" style={{ margin: "0 auto 16px" }} />
        <p style={{ fontSize: 18, fontWeight: 700, color: "var(--color-texto)" }}>Atención registrada</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 20px 80px" }}>

      {/* Indicador de autoguardado */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16, height: 22 }}>
        {guardando === "guardando" && (
          <span style={{ fontSize: 12, color: "var(--color-texto-tenue)", display: "flex", alignItems: "center", gap: 5 }}>
            <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> Guardando…
          </span>
        )}
        {guardando === "guardado" && (
          <span style={{ fontSize: 12, color: "var(--color-verde)", display: "flex", alignItems: "center", gap: 5 }}>
            <CheckCircle size={12} /> Guardado
          </span>
        )}
        {guardando === "error" && (
          <span style={{ fontSize: 12, color: "var(--color-alerta)", display: "flex", alignItems: "center", gap: 5 }}>
            <AlertCircle size={12} /> Error al guardar
          </span>
        )}
      </div>

      {/* Selección de paciente */}
      {!paciente ? (
        <div style={{ background: "white", borderRadius: 16, padding: 20, border: "1.5px solid var(--color-borde)", marginBottom: 16 }}>
          <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: "var(--color-texto-suave)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Paciente
          </p>
          <div style={{ position: "relative" }}>
            <Search size={16} color="var(--color-texto-tenue)"
              style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              autoFocus
              placeholder="Buscar paciente por nombre o teléfono…"
              value={busqueda}
              onChange={(e) => handleBusqueda(e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--color-verde-claro)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--color-borde)")}
            />
          </div>
          {resultados.length > 0 && (
            <div style={{ marginTop: 8, borderRadius: 12, border: "1px solid var(--color-borde)", overflow: "hidden" }}>
              {resultados.slice(0, 6).map((p) => (
                <button
                  key={p.id}
                  onClick={() => seleccionarPaciente(p)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 14px", background: "white", border: "none",
                    borderBottom: "1px solid var(--color-borde)", cursor: "pointer",
                    textAlign: "left", fontFamily: "var(--font-ui)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-fondo)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                >
                  <span style={{ fontSize: 20 }}>{p.especie === "felino" ? "🐱" : "🐶"}</span>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "var(--color-texto)" }}>{p.nombre}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "var(--color-texto-suave)" }}>{p.tutor.nombre} · {p.tutor.telefono}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
          {busqueda && resultados.length === 0 && !buscando && (
            <div style={{ marginTop: 10, textAlign: "center" }}>
              <Link href="/pacientes/nuevo" style={{ fontSize: 13, fontWeight: 600, color: "var(--color-verde)", textDecoration: "none" }}>
                + Crear paciente nuevo
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div style={{
          background: "white", borderRadius: 16, padding: "14px 18px",
          border: "1.5px solid var(--color-verde-claro)", marginBottom: 16,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <span style={{ fontSize: 24 }}>{paciente.especie === "felino" ? "🐱" : "🐶"}</span>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 16, color: "var(--color-texto)" }}>{paciente.nombre}</p>
            <p style={{ margin: 0, fontSize: 12, color: "var(--color-texto-suave)" }}>
              {paciente.tutor.nombre && `${paciente.tutor.nombre} · `}{paciente.tutor.telefono}
              {paciente.alertas && (
                <span style={{ marginLeft: 8, color: "var(--color-alerta)", fontWeight: 600 }}>
                  ⚠ {paciente.alertas}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => { setPaciente(null); setForm({ ...form, paciente_id: "" }); }}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-texto-tenue)", padding: 4 }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Chips de plantilla */}
      <div style={{ marginBottom: 16 }}>
        <p style={labelStyle}>Tipo de atención</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {PLANTILLAS.map((p) => {
            const active = form.plantilla === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handlePlantilla(p)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "9px 14px", borderRadius: 10, border: "1.5px solid",
                  borderColor: active ? "var(--color-verde)" : "var(--color-borde)",
                  background: active ? "var(--color-verde)" : "white",
                  color: active ? "white" : "var(--color-texto-suave)",
                  fontSize: 13, fontWeight: active ? 700 : 500,
                  fontFamily: "var(--font-ui)", cursor: "pointer",
                  transition: "all 0.12s",
                }}
              >
                {p.icon} {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Campos principales */}
      <div style={{ background: "white", borderRadius: 16, border: "1px solid var(--color-borde)", overflow: "hidden", marginBottom: 12 }}>

        {/* Peso */}
        <div style={campoStyle}>
          <label style={labelStyle}>Peso (kg)</label>
          <input
            type="number" step="0.1" min="0" max="200"
            placeholder="ej. 12.5"
            value={form.peso}
            onChange={(e) => handleField("peso", e.target.value)}
            style={{ ...inputStyle, width: 120 }}
            onFocus={(e) => (e.target.style.borderColor = "var(--color-verde-claro)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--color-borde)")}
          />
        </div>

        <div style={separador} />

        {/* Motivo */}
        <div style={campoStyle}>
          <label style={labelStyle}>Motivo</label>
          <input
            placeholder="Motivo de consulta"
            value={form.motivo}
            onChange={(e) => handleField("motivo", e.target.value)}
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "var(--color-verde-claro)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--color-borde)")}
          />
        </div>

        <div style={separador} />

        {/* Nota clínica + voz */}
        <div style={campoStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <label style={labelStyle}>Nota clínica</label>
            <button
              onClick={toggleListening}
              title={isListening ? "Detener dictado" : "Dictar nota por voz"}
              style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "6px 12px", borderRadius: 8, border: "1.5px solid",
                borderColor: isListening ? "var(--color-alerta)" : "var(--color-verde)",
                background: isListening ? "var(--color-alerta-suave)" : "var(--color-verde-suave)",
                color: isListening ? "var(--color-alerta)" : "var(--color-verde)",
                fontSize: 12, fontWeight: 700, cursor: "pointer",
                fontFamily: "var(--font-ui)", transition: "all 0.15s",
                animation: isListening ? "pulse 1.5s ease-in-out infinite" : "none",
              }}
            >
              {isListening ? <MicOff size={14} /> : <Mic size={14} />}
              {isListening ? "Detener" : "Dictar"}
            </button>
          </div>
          {errorVoz && (
            <p style={{ fontSize: 12, color: "var(--color-alerta)", margin: "0 0 6px" }}>{errorVoz}</p>
          )}
          <textarea
            placeholder="Descripción clínica libre. Puedes dictar por voz o escribir directamente…"
            value={form.nota_clinica}
            onChange={(e) => handleField("nota_clinica", e.target.value)}
            rows={5}
            style={{
              ...inputStyle,
              resize: "vertical",
              minHeight: 120,
              lineHeight: 1.6,
              borderColor: isListening ? "var(--color-alerta)" : "var(--color-borde)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--color-verde-claro)")}
            onBlur={(e) => (e.target.style.borderColor = isListening ? "var(--color-alerta)" : "var(--color-borde)")}
          />
        </div>

        <div style={separador} />

        {/* Diagnóstico */}
        <div style={campoStyle}>
          <label style={labelStyle}>Diagnóstico presuntivo</label>
          <input
            placeholder="Diagnóstico"
            value={form.diagnostico_presuntivo}
            onChange={(e) => handleField("diagnostico_presuntivo", e.target.value)}
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "var(--color-verde-claro)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--color-borde)")}
          />
        </div>

        <div style={separador} />

        {/* Tratamiento */}
        <div style={campoStyle}>
          <label style={labelStyle}>Tratamiento</label>
          <textarea
            placeholder="Tratamiento realizado"
            value={form.tratamiento}
            onChange={(e) => handleField("tratamiento", e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
            onFocus={(e) => (e.target.style.borderColor = "var(--color-verde-claro)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--color-borde)")}
          />
        </div>
      </div>

      {/* Opcionales (próximo control, vacuna, medicamentos, pago) */}
      <button
        onClick={() => setMostrarOpcionales((v) => !v)}
        style={{
          width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "white", border: "1px solid var(--color-borde)", borderRadius: 14,
          padding: "13px 18px", cursor: "pointer", fontFamily: "var(--font-ui)",
          fontSize: 14, fontWeight: 600, color: "var(--color-texto-suave)",
          marginBottom: mostrarOpcionales ? 0 : 0,
        }}
      >
        Próximo control, medicamentos y pago
        {mostrarOpcionales ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {mostrarOpcionales && (
        <div style={{ background: "white", border: "1px solid var(--color-borde)", borderTop: "none", borderRadius: "0 0 14px 14px", overflow: "hidden", marginBottom: 12 }}>

          {/* Próximo control */}
          <div style={campoStyle}>
            <label style={labelStyle}>Próximo control</label>
            <p style={{ margin: "0 0 6px", fontSize: 12, color: "var(--color-texto-tenue)" }}>
              Si completas esta fecha, se crea un recordatorio automático.
            </p>
            <input
              type="date"
              value={form.proximo_control}
              onChange={(e) => handleField("proximo_control", e.target.value)}
              style={{ ...inputStyle, width: "auto" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--color-verde-claro)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--color-borde)")}
            />
          </div>

          <div style={separador} />

          {/* Vacuna / Medicamentos */}
          {(form.plantilla === "vacuna" || form.plantilla === "desparasitacion" || form.plantilla === "medicacion") && (
            <>
              <div style={campoStyle}>
                <label style={labelStyle}>{form.plantilla === "vacuna" ? "Vacuna aplicada" : "Medicamentos"}</label>
                <input
                  placeholder={form.plantilla === "vacuna" ? "Ej. Polivalente + antirrábica" : "Ej. Amoxicilina 250mg c/12h x 7 días"}
                  value={form.plantilla === "vacuna" ? form.vacuna : form.medicamentos}
                  onChange={(e) => handleField(form.plantilla === "vacuna" ? "vacuna" : "medicamentos", e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "var(--color-verde-claro)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--color-borde)")}
                />
              </div>
              <div style={separador} />
            </>
          )}

          {/* Pago */}
          <div style={campoStyle}>
            <label style={labelStyle}>Pago del servicio</label>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input
                placeholder="Descripción (ej. Consulta + exámenes)"
                value={form.pago_descripcion}
                onChange={(e) => handleField("pago_descripcion", e.target.value)}
                style={{ ...inputStyle, flex: 2, minWidth: 160 }}
                onFocus={(e) => (e.target.style.borderColor = "var(--color-verde-claro)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--color-borde)")}
              />
              <input
                type="number" min="0" placeholder="Monto $"
                value={form.pago_monto}
                onChange={(e) => handleField("pago_monto", e.target.value)}
                style={{ ...inputStyle, width: 110 }}
                onFocus={(e) => (e.target.style.borderColor = "var(--color-verde-claro)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--color-borde)")}
              />
              <select
                value={form.pago_estado}
                onChange={(e) => handleField("pago_estado", e.target.value)}
                style={{ ...inputStyle, width: "auto" }}
              >
                <option value="pagado">Pagado</option>
                <option value="parcial">Abono parcial</option>
                <option value="pendiente">Pendiente</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          onClick={handleCerrar}
          disabled={!atencionId || cerrando}
          style={{
            flex: 1, minWidth: 160, padding: "14px 20px",
            background: atencionId ? "var(--color-verde)" : "var(--color-borde)",
            color: atencionId ? "white" : "var(--color-texto-tenue)",
            border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700,
            fontFamily: "var(--font-ui)", cursor: atencionId ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "background 0.15s",
          }}
        >
          {cerrando
            ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Cerrando…</>
            : <><CheckCircle size={16} /> Cerrar atención</>
          }
        </button>
        <a
          href="/dashboard"
          style={{
            padding: "14px 20px", background: "white", color: "var(--color-texto-suave)",
            border: "1.5px solid var(--color-borde)", borderRadius: 14,
            fontSize: 14, fontWeight: 600, textDecoration: "none",
            display: "inline-flex", alignItems: "center",
          }}
        >
          Guardar borrador
        </a>
      </div>

      {!atencionId && form.paciente_id && (
        <p style={{ marginTop: 10, fontSize: 12, color: "var(--color-texto-tenue)", textAlign: "center" }}>
          El autoguardado se activará cuando comiences a escribir.
        </p>
      )}
      {!form.paciente_id && (
        <p style={{ marginTop: 10, fontSize: 12, color: "var(--color-texto-tenue)", textAlign: "center" }}>
          Selecciona un paciente para activar el autoguardado.
        </p>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.6; } }
      `}</style>
    </div>
  );
}

// ─── Estilos reutilizables ────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  paddingLeft: "44px",
  fontSize: 15,
  fontFamily: "var(--font-ui)",
  background: "var(--color-fondo)",
  border: "1.5px solid var(--color-borde)",
  borderRadius: 10,
  outline: "none",
  color: "var(--color-texto)",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  color: "var(--color-texto-suave)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: 6,
};

const campoStyle: React.CSSProperties = {
  padding: "16px 20px",
};

const separador: React.CSSProperties = {
  height: 1,
  background: "var(--color-borde)",
  margin: "0",
};
