// app/components/BlueyAnimator.jsx
"use client";

import { useEffect, useRef, useState } from "react";

/* Bluey-ish palette */
const BLUEY = {
  sky: "#79C3F5",
  darkBlue: "#2E6BAA",
  bingoOrange: "#F4A460",
  cream: "#FFEED8",
  grass: "#8FD18B",
  navy: "#103A5C",
  pale: "#F4FBFF",
};

const LS_HISTORY_KEY = "bluey_animator_history_v1";

/* Presets */
const PRESETS = [
  // Character vibes
  { key: "bluey_style",  label: "Bluey-Inspired", op: "bluey_style",
    prompt: "Clean thick outlines, rounded shapes, flat shading, friendly sky-blue palette.",
    preview: "/blueypresets/bluey_style.png", emoji: "🐾" },
  { key: "bluey_bluey",  label: "Bluey Vibe",     op: "bluey_bluey",
    prompt: "Playful, sky & dark blue tones, rounded muzzle, flat shading.",
    preview: "/blueypresets/bluey_bluey.png", emoji: "🔵" },
  { key: "bluey_bingo",  label: "Bingo Vibe",     op: "bluey_bingo",
    prompt: "Warm orange/peach with cream accents, curious eyes, rounded shapes.",
    preview: "/blueypresets/bluey_bingo.png", emoji: "🧡" },

  // Environments
  { key: "bluey_lounge",   label: "Lounge",     op: "bluey_lounge",
    prompt: "Pastel walls, timber floor, simple couch, plants; soft flat colors.",
    preview: "/blueypresets/lounge.png", emoji: "🛋️" },
  { key: "bluey_playroom", label: "Playroom",   op: "bluey_playroom",
    prompt: "Toy baskets, colorful rugs, bookshelf; gentle flat shading.",
    preview: "/blueypresets/playroom.png", emoji: "🧸" },
  { key: "bluey_backyard", label: "Backyard",   op: "bluey_backyard",
    prompt: "Soft green lawn, fig-tree feel, timber fence, blue sky.",
    preview: "/blueypresets/backyard.png", emoji: "🌳" },
  { key: "bluey_veranda",  label: "Veranda",    op: "bluey_veranda",
    prompt: "Timber posts, steps, potted plants; warm afternoon light.",
    preview: "/blueypresets/veranda.png", emoji: "🏠" },
  { key: "bluey_park",     label: "Park",       op: "bluey_park",
    prompt: "Play equipment, soft hills, scattered trees; bright sky.",
    preview: "/blueypresets/park.png", emoji: "🎠" },
  { key: "bluey_beach",    label: "Beach",      op: "bluey_beach",
    prompt: "Pale sand, turquoise water, simple clouds; clean outlines.",
    preview: "/blueypresets/beach.png", emoji: "🏖️" },
  { key: "bluey_school",   label: "School",     op: "bluey_school",
    prompt: "Low fence, play area, colorful bunting; cheerful flat palette.",
    preview: "/blueypresets/school.png", emoji: "🏫" },
  { key: "bluey_markets",  label: "Markets",    op: "bluey_markets",
    prompt: "Simple stalls, bunting, crates; bright friendly colors.",
    preview: "/blueypresets/markets.png", emoji: "🧺" },

  // Handy e-commerce ops
  { key: "edit_white_bg", label: "Pure White BG", op: "edit_white_bg",
    prompt: "Pure white background (#FFFFFF); soft natural shadow; centered; square-friendly.",
    preview: "/blueypresets/white.png", emoji: "⬜" },
  { key: "remove_bg",     label: "Transparent",   op: "remove_bg",
    prompt: "Remove background cleanly; preserve edges/fur; PNG with alpha.",
    preview: "/blueypresets/transparent.png", emoji: "🪄" },
  { key: "square_1080",   label: "Square 1080",   op: "square_1080",
    prompt: "Square 1080x1080; centered subject; safe margins; crisp finish.",
    preview: "/blueypresets/square.png", emoji: "🔲" },
  { key: "photo_studio",  label: "Studio Polish", op: "photo_studio",
    prompt: "Soft three-point light; minimal noise; subtle ground shadow.",
    preview: "/blueypresets/studio.png", emoji: "💡" },
];

export default function BlueyAnimator() {
  const [file, setFile] = useState(null);
  const [idx, setIdx] = useState(0);
  const active = PRESETS[idx];

  const [operation, setOperation] = useState(active.op);
  const [prompt, setPrompt] = useState(active.prompt);

  const [loading, setLoading] = useState(false);
  const [resultB64, setResultB64] = useState(null);
  const [error, setError] = useState(null);

  // webcam
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [camReady, setCamReady] = useState(false);

  // NEW: full-screen camera overlay
  const [camFullscreen, setCamFullscreen] = useState(false);

  // history
  const [history, setHistory] = useState([]);

  /* init history */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_HISTORY_KEY);
      setHistory(raw ? JSON.parse(raw) : []);
    } catch {}
  }, []);

  /* sync op/prompt when preset changes */
  useEffect(() => {
    setOperation(active.op);
    setPrompt(active.prompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  /* webcam binding */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (stream) {
      v.srcObject = stream;
      v.onloadedmetadata = () => {
        v.play().then(() => setCamReady(true)).catch(() => setCamReady(true));
      };
    } else {
      v.srcObject = null;
    }
    return () => { if (v) v.srcObject = null; };
  }, [stream]);

  // Prevent body scroll when full-screen overlay open
  useEffect(() => {
    if (camFullscreen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [camFullscreen]);

  const startCamera = async () => {
    setError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "user" },   // switch to "environment" if you prefer rear camera
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      setStream(s);
    } catch {
      setError("Camera access denied or unavailable.");
    }
  };
  const stopCamera = () => {
    try { stream?.getTracks()?.forEach((t) => t.stop()); } catch {}
    setStream(null); setCamReady(false);
  };
  const openFullscreenCamera = async () => {
    if (!stream) await startCamera();
    setCamFullscreen(true);
  };
  const closeFullscreenCamera = () => setCamFullscreen(false);

  const capturePhoto = async () => {
    const v = videoRef.current, c = canvasRef.current;
    if (!v || !c) return;
    const w = v.videoWidth || 1080, h = v.videoHeight || 1080;
    c.width = w; c.height = h;
    c.getContext("2d").drawImage(v, 0, 0, w, h);
    const blob = await new Promise((r) => c.toBlob(r, "image/png"));
    if (!blob) return;
    setFile(new File([blob], "webcam-capture.png", { type: "image/png" }));
  };
  const capturePhotoAndClose = async () => {
    await capturePhoto();
    setCamFullscreen(false);
  };

  const pushHistory = (entry) => {
    try {
      const next = [entry, ...history].slice(0, 28);
      setHistory(next);
      localStorage.setItem(LS_HISTORY_KEY, JSON.stringify(next));
    } catch {}
  };
  const clearHistory = () => { setHistory([]); localStorage.removeItem(LS_HISTORY_KEY); };
  const reapplyHistory = (h) => {
    const i = PRESETS.findIndex((p) => p.key === h.presetKey);
    setIdx(i >= 0 ? i : 0);
    setOperation(h.operation);
    setPrompt(h.prompt);
    setResultB64(h.imageBase64);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResultB64(null);

    const form = new FormData();
    form.append("operation", operation);
    form.append("prompt", prompt);
    if (file) form.append("image", file);

    try {
      const res = await fetch("/api/bluey", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setResultB64(data.imageBase64);
      pushHistory({
        id: `${Date.now()}`,
        ts: new Date().toISOString(),
        presetKey: active.key,
        label: active.label,
        operation,
        prompt,
        imageBase64: data.imageBase64,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Tailwind helpers
  const btnBase = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  const btnPrimary = `${btnBase} text-white`;
  const btnMuted = `${btnBase}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: BLUEY.darkBlue }}>
            Bluey Animator
          </h2>
          <p className="mt-1 text-sm" style={{ color: BLUEY.navy }}>
            Choose a Bluey/Bingo-inspired preset, capture or upload, tweak the prompt, and generate. History saves locally.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs"
             style={{ border: `1px solid ${BLUEY.darkBlue}22`, background: BLUEY.pale, color: BLUEY.darkBlue }}>
          <span className="h-2 w-2 rounded-full" style={{ background: BLUEY.grass }} />
          Ready
        </div>
      </div>

      {/* Card */}
      <div className="rounded-2xl shadow-sm backdrop-blur"
           style={{ border: `1px solid ${BLUEY.darkBlue}22`, background: "#F7FCFF" }}>
        <div className="rounded-t-2xl p-1"
             style={{ background: `linear-gradient(90deg, ${BLUEY.sky}, ${BLUEY.cream}, ${BLUEY.bingoOrange})` }} />

        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">
          {/* LEFT: Webcam + Upload */}
          <section className="space-y-4">
            {/* Webcam */}
            <div className="rounded-xl p-4 shadow-sm"
                 style={{ border: `1px solid ${BLUEY.darkBlue}22`, background: "#FFFFFF" }}>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {!stream ? (
                  <button onClick={startCamera} className={btnPrimary} style={{ background: BLUEY.darkBlue }}>
                    Start Webcam
                  </button>
                ) : (
                  <button onClick={stopCamera} className={btnMuted}
                          style={{ background: "#EEF7FF", color: BLUEY.darkBlue, border: `1px solid ${BLUEY.darkBlue}22` }}>
                    Stop Webcam
                  </button>
                )}
                <button onClick={capturePhoto} disabled={!camReady}
                        className={`${btnMuted} disabled:opacity-50`}
                        style={{ background: "#EEF7FF", color: BLUEY.darkBlue, border: `1px solid ${BLUEY.darkBlue}22` }}>
                  Capture Photo
                </button>

                {/* NEW: Full-screen camera trigger (excellent on mobile) */}
                <button onClick={openFullscreenCamera} className={btnPrimary} style={{ background: "#111827" }}>
                  Full-screen Camera
                </button>

                <span className="text-xs" style={{ color: BLUEY.darkBlue }}>
                  {camReady ? "Camera ready" : stream ? "Loading camera..." : "Camera off"}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="overflow-hidden rounded-lg"
                     style={{ border: `1px solid ${BLUEY.darkBlue}22`, background: BLUEY.navy }}>
                  {/* Keep inline preview contained */}
                  <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                    <video ref={videoRef} playsInline autoPlay muted className="absolute inset-0 h-full w-full object-contain" />
                  </div>
                </div>
                <div className="rounded-lg p-2 text-center"
                     style={{ border: `2px dashed ${BLUEY.darkBlue}44`, background: "#F0F7FF" }}>
                  <p className="mb-2 text-xs font-medium" style={{ color: BLUEY.darkBlue }}>Selected / Captured</p>
                  {file ? (
                    <img src={URL.createObjectURL(file)} alt="Selected" className="mx-auto rounded object-contain w-full max-h-[45vh]" />
                  ) : (
                    <div className="text-xs" style={{ color: BLUEY.darkBlue }}>No image selected yet.</div>
                  )}
                </div>
              </div>

              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Drag & drop */}
            <div className="group relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl p-6 text-center transition"
                 style={{ border: `2px dashed ${BLUEY.darkBlue}44`, background: "#F0F7FF" }}
                 onDragOver={(e) => { e.preventDefault(); }}
                 onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) setFile(f); }}
                 onClick={() => document.getElementById("file-input-bluey")?.click()}>
              <div className="rounded-full p-3 shadow-sm" style={{ background: "#E8F4FF", color: BLUEY.darkBlue }}>
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M11 16h2V9l3 3l1.5-1.5L12 4L6.5 10.5L8 12l3-3v7Zm-6 4h14v-2H5v2Z"/></svg>
              </div>
              <p className="text-sm font-medium" style={{ color: BLUEY.darkBlue }}>Drag & drop an image</p>
              <p className="text-xs" style={{ color: BLUEY.darkBlue }}>PNG, JPG up to ~10MB</p>
              <input id="file-input-bluey" type="file" accept="image/*" className="sr-only"
                     onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </div>
          </section>

          {/* RIGHT: Circle presets + prompt + result */}
          <section className="space-y-4">
            {/* Circle preset picker */}
            <div className="rounded-xl p-4 shadow-sm"
                 style={{ border: `1px solid ${BLUEY.darkBlue}22`, background: "#FFFFFF" }}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: BLUEY.darkBlue }}>Presets</span>
                <span className="truncate rounded-full px-2 py-1 text-xs"
                      style={{ border: `1px solid ${BLUEY.darkBlue}22`, background: "#EEF7FF", color: BLUEY.darkBlue }}>
                  {active.label}
                </span>
              </div>

              <div className="relative">
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {PRESETS.map((p, i) => {
                    const selected = i === idx;
                    return (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => setIdx(i)}
                        className="group flex w-20 min-w-20 flex-col items-center gap-2 focus:outline-none"
                        title={p.label}
                      >
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border shadow-sm"
                             style={{
                               borderColor: selected ? BLUEY.darkBlue : `${BLUEY.darkBlue}44`,
                               boxShadow: selected ? `0 0 0 3px ${BLUEY.sky}55` : undefined,
                               background: "#F7FBFF",
                             }}>
                          {p.preview ? (
                            <img src={p.preview} alt={p.label} className="h-full w-full object-cover" draggable={false} />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-2xl"><span>{p.emoji || "✨"}</span></div>
                          )}
                        </div>
                        <div className="w-20 truncate text-center text-[11px] font-medium"
                             style={{ color: selected ? BLUEY.darkBlue : BLUEY.darkBlue }}>
                          {p.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Prompt editor */}
              <div className="mt-4">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide" style={{ color: BLUEY.darkBlue }}>
                  Extra prompt (optional)
                </label>
                <input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., sunny backyard, gentle cartoony clouds"
                  className="w-full rounded-xl border px-3 py-2 text-sm shadow-sm outline-none ring-0 transition"
                  style={{ borderColor: `${BLUEY.darkBlue}44`, background: "#F7FBFF", color: BLUEY.navy }}
                />
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button type="button" onClick={() => setFile(null)} className={btnMuted}
                        style={{ background: "#EEF7FF", color: BLUEY.darkBlue, border: `1px solid ${BLUEY.darkBlue}22` }}>
                  Reset Image
                </button>
                <button type="submit" onClick={handleSubmit} disabled={loading}
                        className={`${btnPrimary} disabled:opacity-50`} style={{ background: BLUEY.darkBlue }}>
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Processing…
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">Generate / Edit</span>
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-3 rounded-lg px-3 py-2 text-sm"
                     style={{ border: `1px solid ${BLUEY.darkBlue}22`, background: "#FFE7E7", color: "#7a1f1f" }}>
                  {error}
                </div>
              )}
            </div>

            {/* Result */}
            {resultB64 && (
              <div className="overflow-hidden rounded-xl shadow-sm"
                   style={{ border: `1px solid ${BLUEY.darkBlue}22`, background: "#FFFFFF" }}>
                <div className="flex items-center justify-between px-4 py-2 text-sm"
                     style={{ borderBottom: `1px solid ${BLUEY.darkBlue}22`, background: "#EEF7FF" }}>
                  <span className="font-medium" style={{ color: BLUEY.darkBlue }}>Result</span>
                  <a className="inline-flex items-center gap-1 hover:underline" style={{ color: BLUEY.sky }}
                     href={`data:image/png;base64,${resultB64}`} download="bluey-animator-result.png">
                    Download PNG
                    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M5 20h14v-2H5v2Zm7-3l5-5h-3V4h-4v8H7l5 5Z"/></svg>
                  </a>
                </div>
                <div className="p-4">
                  <img src={`data:image/png;base64,${resultB64}`} alt="Result"
                       className="mx-auto rounded-lg w-full h-auto object-contain" />
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* History */}
      <div className="mt-8">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-bold" style={{ color: BLUEY.darkBlue }}>History</h3>
          {history.length > 0 && (
            <button onClick={clearHistory} className={btnMuted}
                    style={{ background: "#EEF7FF", color: BLUEY.darkBlue, border: `1px solid ${BLUEY.darkBlue}22` }}>
              Clear
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p className="text-sm" style={{ color: BLUEY.darkBlue }}>
            No history yet. Generate an image and it’ll be saved here.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {history.map((h) => (
              <div key={h.id} className="overflow-hidden rounded-xl"
                   style={{ border: `1px solid ${BLUEY.darkBlue}22`, background: "#FFFFFF" }}>
                <div className="flex items-center justify-between px-3 py-1.5 text-[11px]"
                     style={{ borderBottom: `1px solid ${BLUEY.darkBlue}22`, background: "#EEF7FF", color: BLUEY.darkBlue }}>
                  <span className="truncate">{h.label}</span>
                  <span className="rounded-full px-2 py-0.5" style={{ background: "#D7FFF9", color: "#14665e" }}>
                    {new Date(h.ts).toLocaleTimeString()}
                  </span>
                </div>
                <div className="p-2">
                  <img src={`data:image/png;base64,${h.imageBase64}`} alt={h.label}
                       className="rounded w-full h-auto object-contain" />
                </div>
                <div className="flex items-center justify-between gap-2 px-3 pb-3">
                  <button onClick={() => reapplyHistory(h)} className="text-xs font-medium underline" style={{ color: BLUEY.darkBlue }}>
                    Reapply
                  </button>
                  <span className="truncate text-[10px]" style={{ color: BLUEY.darkBlue }}>{h.operation}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-xs" style={{ color: BLUEY.darkBlue }}>
        Tip: “Bluey Vibe” + “Beach” gives cheerful summer postcard results.
      </p>

      {/* ===== FULL-SCREEN CAMERA OVERLAY (mobile-first) ===== */}
      {camFullscreen && (
        <div className="fixed inset-0 z-[100] bg-black/95 text-white">
          {/* Safe-area padding on iOS */}
          <div className="absolute inset-0 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
            {/* Top bar */}
            <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-4 py-3">
              <button
                onClick={closeFullscreenCamera}
                className="rounded-lg bg-white/10 px-3 py-1.5 text-sm"
              >
                Close
              </button>
              <span className="text-xs opacity-80">{camReady ? "Ready" : "Starting…"}</span>
            </div>

            {/* Camera feed */}
            <div className="flex h-[100dvh] w-screen items-center justify-center">
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className="h-[100dvh] w-screen object-cover"
              />
            </div>

            {/* Bottom controls */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 px-6 pb-[calc(16px+env(safe-area-inset-bottom))]">
              <div className="pointer-events-auto flex items-center gap-3">
                <button
                  onClick={capturePhotoAndClose}
                  disabled={!camReady}
                  className="h-16 w-16 rounded-full border-4 border-white/70 bg-white/90 active:scale-95 disabled:opacity-50"
                  title="Capture"
                />
              </div>
              <div className="pointer-events-auto">
                <button
                  onClick={() => setCamReady((r) => r)} // placeholder for tips/pause
                  className="rounded-lg bg-white/10 px-3 py-1.5 text-xs"
                >
                  Tip: Fill the frame, use good light
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
