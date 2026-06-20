"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPacienteConTutor, findTutorByTelefono } from "@/lib/actions/pacientes";
import { ChevronDown, ChevronUp, Loader2, CheckCircle } from "lucide-react";

const input: React.CSSProperties = {
  width: "100%",
  padding: "13px 14px",
  fontSize: 15,
  fontFamily: "var(--font-ui)",
  background: "white",
  border: "1.5px solid var(--color-borde)",
  borderRadius: 12,
  outline: "none",
  color: "var(--color-texto)",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

const label: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  color: "var(--color-texto-suave)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: 6,
};

export function FormPaciente({ telefonoInicial = "" }: { telefonoInicial?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mostrarMas, setMostrarMas] = useState(false);
  const [tutorExistente, setTutorExistente] = useState<{ nombre: string | null; telefono: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    nombre: "",
    tutor_telefono: telefonoInicial,
    tutor_nombre: "",
    especie: "",
    raza: "",
    sexo: "",
    edad_texto: "",
    peso_referencia: "",
    alertas: "",
    es_endocrino: false,
    tutor_rut: "",
    tutor_correo: "",
  });

  function handleField(k: keyof typeof form, v: string | boolean) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  async function handleTelefonoBlur() {
    if (!form.tutor_telefono.trim()) return;
    const tutor = await findTutorByTelefono(form.tutor_telefono);
    if (tutor) {
      setTutorExistente(tutor);
      if (tutor.nombre) setForm((p) => ({ ...p, tutor_nombre: tutor.nombre! }));
    } else {
      setTutorExistente(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim()) { setError("El nombre del paciente es obligatorio."); return; }
    if (!form.tutor_telefono.trim()) { setError("El teléfono del tutor es obligatorio."); return; }
    setError(null);
    setLoading(true);
    try {
      const id = await createPacienteConTutor({
        nombre: form.nombre,
        tutor_telefono: form.tutor_telefono,
        tutor_nombre: form.tutor_nombre || undefined,
        tutor_rut: form.tutor_rut || undefined,
        tutor_correo: form.tutor_correo || undefined,
        especie: form.especie || undefined,
        raza: form.raza || undefined,
        sexo: form.sexo || undefined,
        edad_texto: form.edad_texto || undefined,
        peso_referencia: form.peso_referencia || undefined,
        alertas: form.alertas || undefined,
        es_endocrino: form.es_endocrino,
      });
      router.push(`/pacientes/${id}`);
    } catch {
      setError("Error al crear el paciente. Intenta de nuevo.");
      setLoading(false);
    }
  }

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = "var(--color-verde-claro)");
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = "var(--color-borde)");

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Campos obligatorios */}
      <div style={{ background: "white", borderRadius: 18, border: "1px solid var(--color-borde)", overflow: "hidden" }}>
        <div style={{ padding: "18px 20px" }}>
          <label style={label}>Nombre del paciente *</label>
          <input
            autoFocus
            required
            placeholder="Ej. Tofu"
            value={form.nombre}
            onChange={(e) => handleField("nombre", e.target.value)}
            style={input}
            onFocus={focusStyle}
            onBlur={blurStyle}
          />
        </div>

        <div style={{ height: 1, background: "var(--color-borde)" }} />

        <div style={{ padding: "18px 20px" }}>
          <label style={label}>Teléfono del tutor *</label>
          <input
            required
            type="tel"
            placeholder="+56 9 1234 5678"
            value={form.tutor_telefono}
            onChange={(e) => handleField("tutor_telefono", e.target.value)}
            onBlur={handleTelefonoBlur}
            style={input}
            onFocus={focusStyle}
          />
          {tutorExistente && (
            <p style={{ marginTop: 6, fontSize: 12, color: "var(--color-verde)", fontWeight: 600 }}>
              <CheckCircle size={12} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
              Tutor existente: {tutorExistente.nombre ?? tutorExistente.telefono}
            </p>
          )}
        </div>
      </div>

      {/* Campos opcionales expandibles */}
      <button
        type="button"
        onClick={() => setMostrarMas((v) => !v)}
        style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "white", border: "1px solid var(--color-borde)", borderRadius: 14,
          padding: "13px 18px", cursor: "pointer", fontFamily: "var(--font-ui)",
          fontSize: 14, fontWeight: 600, color: "var(--color-texto-suave)", width: "100%",
        }}
      >
        Datos adicionales (opcional)
        {mostrarMas ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {mostrarMas && (
        <div style={{ background: "white", borderRadius: 16, border: "1px solid var(--color-borde)", overflow: "hidden" }}>
          {[
            { k: "tutor_nombre" as const, l: "Nombre del tutor", ph: "Ej. María González" },
            { k: "tutor_rut" as const, l: "RUT del tutor", ph: "12.345.678-9" },
            { k: "tutor_correo" as const, l: "Correo del tutor", ph: "correo@ejemplo.cl" },
          ].map(({ k, l, ph }, i) => (
            <div key={k}>
              {i > 0 && <div style={{ height: 1, background: "var(--color-borde)" }} />}
              <div style={{ padding: "14px 20px" }}>
                <label style={label}>{l}</label>
                <input placeholder={ph} value={form[k] as string} onChange={(e) => handleField(k, e.target.value)} style={input} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
            </div>
          ))}

          <div style={{ height: 1, background: "var(--color-borde)" }} />
          <div style={{ padding: "14px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={label}>Especie</label>
              <select value={form.especie} onChange={(e) => handleField("especie", e.target.value)} style={input} onFocus={focusStyle} onBlur={blurStyle}>
                <option value="">—</option>
                <option value="canino">Canino</option>
                <option value="felino">Felino</option>
                <option value="ave">Ave</option>
                <option value="exótico">Exótico</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div>
              <label style={label}>Sexo</label>
              <select value={form.sexo} onChange={(e) => handleField("sexo", e.target.value)} style={input} onFocus={focusStyle} onBlur={blurStyle}>
                <option value="">—</option>
                <option value="macho">Macho</option>
                <option value="hembra">Hembra</option>
              </select>
            </div>
          </div>

          <div style={{ height: 1, background: "var(--color-borde)" }} />
          <div style={{ padding: "14px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={label}>Raza</label>
              <input placeholder="Ej. Labrador" value={form.raza} onChange={(e) => handleField("raza", e.target.value)} style={input} onFocus={focusStyle} onBlur={blurStyle} />
            </div>
            <div>
              <label style={label}>Edad</label>
              <input placeholder="Ej. 3 años" value={form.edad_texto} onChange={(e) => handleField("edad_texto", e.target.value)} style={input} onFocus={focusStyle} onBlur={blurStyle} />
            </div>
          </div>

          <div style={{ height: 1, background: "var(--color-borde)" }} />
          <div style={{ padding: "14px 20px" }}>
            <label style={label}>Peso de referencia (kg)</label>
            <input type="number" step="0.1" placeholder="Ej. 12.5" value={form.peso_referencia} onChange={(e) => handleField("peso_referencia", e.target.value)} style={{ ...input, width: 130 }} onFocus={focusStyle} onBlur={blurStyle} />
          </div>

          <div style={{ height: 1, background: "var(--color-borde)" }} />
          <div style={{ padding: "14px 20px" }}>
            <label style={label}>Alertas clínicas</label>
            <input placeholder="Ej. Agresivo, alérgico a amoxicilina…" value={form.alertas} onChange={(e) => handleField("alertas", e.target.value)} style={input} onFocus={focusStyle} onBlur={blurStyle} />
          </div>

          <div style={{ height: 1, background: "var(--color-borde)" }} />
          <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
            <input
              type="checkbox"
              id="es_endocrino"
              checked={form.es_endocrino}
              onChange={(e) => handleField("es_endocrino", e.target.checked)}
              style={{ width: 18, height: 18, accentColor: "var(--color-verde)", cursor: "pointer" }}
            />
            <label htmlFor="es_endocrino" style={{ fontSize: 14, fontWeight: 500, cursor: "pointer", color: "var(--color-texto)" }}>
              Paciente endócrino (diabetes, Cushing, hipotiroidismo…)
            </label>
          </div>
        </div>
      )}

      {error && (
        <p style={{ fontSize: 13, color: "var(--color-alerta)", fontWeight: 600, margin: 0 }}>{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "15px 24px",
          background: "var(--color-verde)",
          color: "white",
          border: "none",
          borderRadius: 14,
          fontSize: 16,
          fontWeight: 700,
          fontFamily: "var(--font-ui)",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          transition: "background 0.15s",
        }}
      >
        {loading ? <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Creando…</> : "Crear paciente"}
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}
