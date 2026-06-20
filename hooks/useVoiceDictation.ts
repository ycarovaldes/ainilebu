"use client";

import { useState, useRef, useCallback } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecognition = any;

export function useVoiceDictation(onResult: (transcript: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<AnyRecognition>(null);

  const startListening = useCallback(() => {
    setError(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = typeof window !== "undefined" ? (window as any) : null;
    const SpeechRecognitionAPI = w && (w.SpeechRecognition || w.webkitSpeechRecognition) || null;

    if (!SpeechRecognitionAPI) {
      setError("Tu navegador no soporta dictado por voz. Usa Chrome.");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "es-CL";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (e: any) => {
      if (e.error !== "aborted") setError(`Error al dictar: ${e.error}`);
      setIsListening(false);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => {
      const transcript = Array.from(e.results as ArrayLike<{ 0: { transcript: string } }>)
        .slice(e.resultIndex)
        .map((r) => r[0].transcript)
        .join(" ");
      onResult(transcript.trim());
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [onResult]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  return { isListening, error, startListening, stopListening, toggleListening };
}
