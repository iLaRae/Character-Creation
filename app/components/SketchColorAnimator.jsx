// app/components/SketchColorAnimator.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/* ====== Quota-safe history config & helpers ====== */
const LS_HISTORY_KEY = "sketch_color_animator_history_v6_disney_overlay";
const MAX_HISTORY_ITEMS = 12;
const MAX_LOCALSTORAGE_BYTES = 4_500_000; // ~4.5MB

function approxBytes(str) {
  return str ? str.length * 2 : 0;
}

function safeSetItem(key, value, evictCb) {
  for (let i = 0; i < 5; i++) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (err) {
      const quota =
        err?.name === "QuotaExceededError" ||
        err?.name === "NS_ERROR_DOM_QUOTA_REACHED";
      if (quota) {
        if (!evictCb || !evictCb()) return false;
      } else {
        return false;
      }
    }
  }
  return false;
}

// Tiny JPEG thumb from a base64 PNG
async function makeThumbJPEG(base64, { maxW = 200, quality = 0.6 } = {}) {
  if (!base64) return null;
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = `data:image/png;base64,${base64}`;
  await new Promise((res, rej) => {
    img.onload = res;
    img.onerror = () => rej(new Error("Failed to load image for thumbnail"));
  });

  const scale = Math.min(1, maxW / (img.width || maxW));
  const w = Math.max(1, Math.round((img.width || maxW) * scale));
  const h = Math.max(1, Math.round((img.height || maxW) * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", quality);
}

/* ====== Presets ====== */
const PRESETS = [
  {
    key: "colored_pencil",
    label: "Color Pencil",
    style: "colored_pencil",
    tip: "Textured pencil grain + layered color",
    emoji: "✏️",
    preview: "/presets2/pencil.png",
  },
  {
    key: "ink_cleanup",
    label: "Ink",
    style: "ink_cleanup",
    tip: "Crisp lines + clean paper",
    emoji: "🖊️",
    preview: "/presets2/ink.png",
  },
  {
    key: "posca_pens",
    label: "Posca Pens",
    style: "posca_pens",
    tip: "Bold paint-marker fills + clean edges + bright pops",
    emoji: "🖊️",
    preview: "/presets2/posca_pens.png",
  },
  {
    key: "posca",
    label: "Posca",
    style: "posca",
    tip: "Opaque marker paint + bright highlights",
    emoji: "🟦",
    preview: "/presets2/posca.png",
  },

  // watercolor / paint
  {
    key: "watercolor_soft",
    label: "Watercolor Soft",
    style: "watercolor_soft",
    tip: "Soft washes + gentle bleeding edges",
    emoji: "🎨",
    preview: "/presets2/watercolor.png",
  },
  {
    key: "watercolor_vibrant",
    label: "Watercolor Vibrant",
    style: "watercolor_vibrant",
    tip: "Brighter washes + punchy color",
    emoji: "🌈",
    preview: "/presets2/watercolor_vibrant.png",
  },
  {
    key: "gouache_dense",
    label: "Gouache",
    style: "gouache_dense",
    tip: "Opaque matte paint + clean shapes",
    emoji: "🖌️",
    preview: "/presets2/gouache.png",
  },
  {
    key: "oil_pastel",
    label: "Oil Pastel",
    style: "oil_pastel",
    tip: "Creamy blended strokes + thick texture",
    emoji: "🟧",
    preview: "/presets2/pastel_oil.png",
  },
  {
    key: "marker_render",
    label: "Marker Render",
    style: "marker_render",
    tip: "Alcohol marker look + soft gradients",
    emoji: "🖍️",
    preview: "/presets2/marker.png",
  },

  // comics / toon
  {
    key: "cel_shaded",
    label: "Cel Shaded",
    style: "cel_shaded",
    tip: "Toon flats + crisp shadows",
    emoji: "🧩",
    preview: "/presets2/cel.png",
  },
  {
    key: "comic_halftone",
    label: "Comic Dots",
    style: "comic_halftone",
    tip: "Retro print dots + bold contrast",
    emoji: "🗞️",
    preview: "/presets2/halftone.png",
  },
  {
    key: "manga_tones",
    label: "Manga Tones",
    style: "manga_tones",
    tip: "Ink lines + screentone shading",
    emoji: "🖤",
    preview: "/presets2/manga.png",
  },

  // classic / sketchy / fun
  {
    key: "graphite_tint",
    label: "Graphite + Tint",
    style: "graphite_tint",
    tip: "Soft graphite + light color tint",
    emoji: "🪶",
    preview: "/presets2/graphite.png",
  },
  {
    key: "sepia_wash",
    label: "Sepia Wash",
    style: "sepia_wash",
    tip: "Vintage warmth + paper texture",
    emoji: "📜",
    preview: "/presets2/sepia.png",
  },
  {
    key: "crayon_childlike",
    label: "Crayon",
    style: "crayon_childlike",
    tip: "Waxy playful strokes",
    emoji: "🖍️",
    preview: "/presets2/crayon.png",
  },
  {
    key: "gel_pen_neon",
    label: "Neon Gel Pens",
    style: "gel_pen_neon",
    tip: "Neon highlights + glossy ink",
    emoji: "💡",
    preview: "/presets2/neon.png",
  },
];

/* ====== Color Accents ====== */
const COLOR_ACCENTS = [
  "primary brights (red/blue/yellow)",
  "pastel candy palette",
  "earthy muted tones",
  "neon accents",
  "sunset warm gradients",
  "cool ocean blues/teals",
  "autumn oranges & browns",
  "spring florals (pinks/lilacs)",
  "retro 90s brights",
  "black & gold highlights",
];

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

function IconSparkle({ className = "" }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
    >
      <path
        d="M12 2l1.2 5.2L18 8.5l-4.8 1.3L12 15l-1.2-5.2L6 8.5l4.8-1.3L12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M19 13l.6 2.4L22 16l-2.4.6L19 19l-.6-2.4L16 16l2.4-.6L19 13Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProcessingOverlay({ show, label = "Sprinkling pixie dust…" }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[200]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#040816]/70 backdrop-blur-sm" />

      {/* Soft glow blobs */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-sky-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-[-120px] h-[520px] w-[520px] rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-[-140px] h-[520px] w-[520px] rounded-full bg-indigo-500/20 blur-3xl" />

      {/* Center card */}
      <div className="relative flex h-full w-full items-center justify-center px-6">
        <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.85)] backdrop-blur">
          <div className="p-6">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/15 bg-white/10">
              {/* Spinner */}
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            </div>

            <div className="mt-4 text-center">
              <div className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/85">
                <IconSparkle className="text-sky-200" />
                Magic in progress
              </div>
              <p className="mt-3 text-base font-extrabold tracking-tight text-white">
                {label}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-white/70">
                Please keep this tab open while we colorize your sketch.
              </p>
            </div>

            {/* Tiny “loading bar” shimmer */}
            <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-1/2 animate-[shimmer_1.1s_infinite] rounded-full bg-gradient-to-r from-transparent via-white/35 to-transparent" />
            </div>

            <style jsx>{`
              @keyframes shimmer {
                0% {
                  transform: translateX(-100%);
                }
                100% {
                  transform: translateX(220%);
                }
              }
            `}</style>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SketchColorAnimator() {
  const [file, setFile] = useState(null);
  const [paletteFile, setPaletteFile] = useState(null);

  const [idx, setIdx] = useState(0);
  const active = PRESETS[idx];

  const [prompt, setPrompt] = useState(
    "Keep the line work; fully color the page with clean fills and natural shading."
  );
  const [chosenAccents, setChosenAccents] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [resultB64, setResultB64] = useState(null);

  // webcam
  const inlineVideoRef = useRef(null);
  const fsVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [camReady, setCamReady] = useState(false);

  // full-screen camera overlay state
  const [camFullscreen, setCamFullscreen] = useState(false);

  // history (thumb-only)
  const [history, setHistory] = useState([]);

  // object URLs (avoid leaking)
  const filePreviewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  const palettePreviewUrl = useMemo(() => {
    if (!paletteFile) return null;
    return URL.createObjectURL(paletteFile);
  }, [paletteFile]);

  useEffect(() => {
    return () => {
      try {
        if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
      } catch {}
    };
  }, [filePreviewUrl]);

  useEffect(() => {
    return () => {
      try {
        if (palettePreviewUrl) URL.revokeObjectURL(palettePreviewUrl);
      } catch {}
    };
  }, [palettePreviewUrl]);

  /* Load history safely (thumb-only) */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_HISTORY_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const trimmed = (Array.isArray(parsed) ? parsed : [])
        .filter(
          (h) =>
            h &&
            typeof h === "object" &&
            typeof h.thumb === "string" &&
            h.thumb.startsWith("data:image/")
        )
        .slice(0, MAX_HISTORY_ITEMS);
      setHistory(trimmed);
    } catch {
      setHistory([]);
    }
  }, []);

  /* Bind stream to BOTH inline + fullscreen video nodes */
  useEffect(() => {
    const vids = [inlineVideoRef.current, fsVideoRef.current].filter(Boolean);
    if (!vids.length) return;

    vids.forEach((v) => {
      if (!v) return;
      if (stream) {
        v.srcObject = stream;
        v.onloadedmetadata = () => {
          v.play()
            .then(() => setCamReady(true))
            .catch(() => setCamReady(true));
        };
      } else {
        v.srcObject = null;
      }
    });

    return () => {
      vids.forEach((v) => {
        if (v) v.srcObject = null;
      });
    };
  }, [stream, camFullscreen]);

  // Prevent body scroll when full-screen overlay open
  useEffect(() => {
    if (!camFullscreen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [camFullscreen]);

  // Webcam helpers
  const startCamera = async () => {
    setError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      setStream(s);
      setCamFullscreen(true); // start = full screen
    } catch {
      setError("Camera access denied or unavailable.");
    }
  };

  const stopCamera = () => {
    try {
      stream?.getTracks()?.forEach((t) => t.stop());
    } catch {}
    setStream(null);
    setCamReady(false);
  };

  const closeFullscreenCamera = () => setCamFullscreen(false);

  const capturePhoto = async () => {
    const v = fsVideoRef.current || inlineVideoRef.current;
    const c = canvasRef.current;
    if (!v || !c) return;

    const w = v.videoWidth || 1080;
    const h = v.videoHeight || 1080;
    c.width = w;
    c.height = h;
    c.getContext("2d").drawImage(v, 0, 0, w, h);

    const blob = await new Promise((r) => c.toBlob(r, "image/png"));
    if (!blob) return;
    setFile(new File([blob], "sketch-capture.png", { type: "image/png" }));
  };

  const capturePhotoAndClose = async () => {
    await capturePhoto();
    setCamFullscreen(false);
  };

  // Color accents chip toggle
  const toggleAccent = (a) => {
    setChosenAccents((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  // Save to thumb-only history with quota handling
  async function saveHistory({ base64Image }) {
    let thumb = null;
    try {
      thumb = await makeThumbJPEG(base64Image, { maxW: 200, quality: 0.6 });
    } catch {}

    let next = [
      {
        id: `${Date.now()}`,
        ts: new Date().toISOString(),
        label: active.label,
        style: active.style,
        prompt,
        accents: chosenAccents,
        thumb,
      },
      ...history,
    ].slice(0, MAX_HISTORY_ITEMS);

    const serialize = () => JSON.stringify(next);
    const evictOne = () => {
      if (next.length <= 1) return false;
      next = next.slice(0, next.length - 1);
      return true;
    };

    let payload = serialize();
    while (approxBytes(payload) > MAX_LOCALSTORAGE_BYTES && evictOne()) {
      payload = serialize();
    }

    const ok = safeSetItem(LS_HISTORY_KEY, payload, evictOne);
    if (!ok) {
      try {
        sessionStorage.setItem(LS_HISTORY_KEY, payload);
      } catch {}
    }
    setHistory(next);
  }

  // Submit to API (NO animation)
  async function handleProcess(e) {
    e?.preventDefault?.();
    if (!file) {
      setError("Please upload or capture a sketch page.");
      return;
    }
    setLoading(true);
    setError(null);
    setResultB64(null);

    const form = new FormData();
    form.append("style", active.style);
    form.append("prompt", prompt);
    form.append("color_accents", chosenAccents.join(", "));
    form.append("animate", "false");
    form.append("frames", "1");
    form.append("image", file);
    if (paletteFile) form.append("palette", paletteFile);

    try {
      const res = await fetch("/api/sketch", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

      setResultB64(data.imageBase64);
      await saveHistory({ base64Image: data.imageBase64 });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const reapplyHistory = (h) => {
    const i = PRESETS.findIndex((p) => p.style === h.style);
    setIdx(i >= 0 ? i : 0);
    setPrompt(h.prompt || "");
    setChosenAccents(Array.isArray(h.accents) ? h.accents : []);
    setResultB64(null);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(LS_HISTORY_KEY);
    try {
      sessionStorage.removeItem(LS_HISTORY_KEY);
    } catch {}
  };

  const pillBtnBase =
    "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:opacity-50 disabled:cursor-not-allowed";
  const card =
    "rounded-3xl border border-white/15 bg-white/10 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.55)] backdrop-blur";
  const panel =
    "rounded-3xl border border-white/15 bg-white/12 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.55)] backdrop-blur";
  const inputBase =
    "w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/60 outline-none focus:border-white/35 focus:ring-2 focus:ring-sky-300/40";

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#07102b] via-[#0a1b44] to-[#06081a] text-white">
      {/* ✨ Processing overlay */}
      <ProcessingOverlay show={loading} />

      {/* soft glow blobs */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-sky-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-[-120px] h-[520px] w-[520px] rounded-full bg-fuchsia-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-[-140px] h-[520px] w-[520px] rounded-full bg-indigo-500/15 blur-3xl" />

      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold">
              <IconSparkle className="text-sky-200" />
              Magic Sketch Studio
            </div>

            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight">
              Sketch Colorizer
            </h2>
            <p className="mt-2 text-sm sm:text-[0.95rem] leading-relaxed text-white/80">
              Capture (full-screen camera) or upload → choose a style → add
              accents/palette → colorize.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_0_4px_rgba(110,231,183,0.18)]" />
            Ready
          </div>
        </header>

        {/* Main shell */}
        <div className={classNames(panel, "p-4 sm:p-6")}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* LEFT */}
            <section className="space-y-4">
              {/* Uploads */}
              <div className={classNames(card, "p-4 sm:p-5")}>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={startCamera}
                    className={classNames(
                      pillBtnBase,
                      "bg-gradient-to-r from-sky-400 to-indigo-400 text-[#061028] shadow-[0_12px_28px_-18px_rgba(56,189,248,0.8)]"
                    )}
                  >
                    <IconSparkle className="text-[#061028]" />
                    Start Camera (Full-screen)
                  </button>

                  {stream && (
                    <button
                      onClick={stopCamera}
                      className={classNames(
                        pillBtnBase,
                        "bg-white/10 border border-white/15 text-white"
                      )}
                    >
                      Stop Camera
                    </button>
                  )}

                  <span className="ml-1 text-xs text-white/70">
                    {camReady ? "Camera ready" : stream ? "Starting…" : "Camera off"}
                  </span>
                </div>

                {/* selected sketch */}
                <div className="mt-4 rounded-3xl border border-dashed border-white/25 bg-white/8 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-white/85">
                      Selected Sketch
                    </p>
                    <span className="text-[11px] text-white/55">
                      {file ? file.name : "none"}
                    </span>
                  </div>

                  <div className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                    {filePreviewUrl ? (
                      <img
                        src={filePreviewUrl}
                        alt="Selected"
                        loading="lazy"
                        decoding="async"
                        className="h-[260px] w-full object-contain sm:h-[320px]"
                      />
                    ) : (
                      <div className="flex h-[260px] items-center justify-center text-xs text-white/60 sm:h-[320px]">
                        No image selected yet.
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <label
                      htmlFor="file-input-sketch"
                      className={classNames(
                        pillBtnBase,
                        "w-full bg-white/10 border border-white/15 text-white"
                      )}
                    >
                      Upload Image
                    </label>
                    <input
                      id="file-input-sketch"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      className="sr-only"
                    />
                    <p className="mt-2 text-[11px] text-white/60">
                      PNG/JPG • up to ~10MB
                    </p>
                  </div>
                </div>

                {/* palette upload */}
                <div className="mt-4 rounded-3xl border border-dashed border-white/25 bg-white/8 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-white/85">
                        Optional: Reference color image
                      </p>
                      <p className="mt-1 text-[11px] text-white/65">
                        We sample its palette for a more “storybook” color vibe.
                      </p>
                    </div>

                    {palettePreviewUrl && (
                      <img
                        src={palettePreviewUrl}
                        alt="Palette preview"
                        loading="lazy"
                        decoding="async"
                        className="h-12 w-12 shrink-0 rounded-2xl border border-white/15 object-cover"
                      />
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <label
                      htmlFor="file-input-palette"
                      className={classNames(
                        pillBtnBase,
                        "bg-white/10 border border-white/15 text-white"
                      )}
                    >
                      Choose Palette
                    </label>
                    <input
                      id="file-input-palette"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setPaletteFile(e.target.files?.[0] ?? null)
                      }
                      className="sr-only"
                    />
                    {paletteFile && (
                      <button
                        type="button"
                        onClick={() => setPaletteFile(null)}
                        className={classNames(
                          pillBtnBase,
                          "bg-white/10 border border-white/15 text-white"
                        )}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                <canvas ref={canvasRef} className="hidden" />
              </div>

              {/* Drag & drop */}
              <div
                className="group relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[28px] border border-dashed border-white/25 bg-white/8 p-7 text-center transition hover:bg-white/10"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer.files?.[0];
                  if (f) setFile(f);
                }}
                onClick={() =>
                  document.getElementById("file-input-sketch")?.click()
                }
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/15 bg-white/10 group-hover:bg-white/12">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    fill="currentColor"
                    className="text-sky-200"
                  >
                    <path d="M11 16h2V9l3 3l1.5-1.5L12 4L6.5 10.5L8 12l3-3v7Zm-6 4h14v-2H5v2Z" />
                  </svg>
                </div>
                <p className="text-sm sm:text-base font-semibold text-white/90">
                  Drag &amp; drop your sketch
                </p>
                <p className="text-xs text-white/65">
                  Or tap to upload • works great on mobile
                </p>
              </div>
            </section>

            {/* RIGHT */}
            <section className="space-y-4">
              {/* Presets + Accents + Controls */}
              <div className={classNames(card, "p-4 sm:p-5")}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                    Style Presets
                  </span>
                  <span className="truncate rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/85">
                    {active?.label}
                  </span>
                </div>

                {/* preset scroller */}
                <div className="mt-3 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-pl-4 [-webkit-overflow-scrolling:touch]">
                  {PRESETS.map((p, i) => {
                    const selected = i === idx;
                    return (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => setIdx(i)}
                        className="group flex w-28 min-w-28 snap-start flex-col items-center gap-2 focus:outline-none"
                        title={`${p.label} — ${p.tip}`}
                      >
                        <div
                          className={classNames(
                            "relative h-20 w-20 overflow-hidden rounded-full border bg-white/10 shadow-[0_14px_30px_-22px_rgba(0,0,0,0.6)]",
                            selected ? "border-sky-300/70" : "border-white/15"
                          )}
                        >
                          <div
                            className={classNames(
                              "pointer-events-none absolute inset-0 rounded-full",
                              selected ? "ring-4 ring-sky-300/30" : "ring-0"
                            )}
                          />

                          {p.preview ? (
                            <img
                              src={p.preview}
                              alt={p.label}
                              loading="lazy"
                              decoding="async"
                              draggable={false}
                              className={classNames(
                                "h-full w-full object-cover transition",
                                selected
                                  ? "scale-[1.02]"
                                  : "group-hover:scale-[1.02]"
                              )}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : null}

                          <div className="absolute inset-0 grid place-items-center text-2xl">
                            <span>{p.emoji || "✨"}</span>
                          </div>
                        </div>

                        <div
                          className={classNames(
                            "w-28 truncate text-center text-[11px] font-semibold",
                            selected ? "text-sky-200" : "text-white/80"
                          )}
                        >
                          {p.label}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* accents */}
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/80">
                      Color Accents
                    </label>
                    <span className="text-[11px] text-white/60">(optional)</span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {COLOR_ACCENTS.map((a) => {
                      const on = chosenAccents.includes(a);
                      return (
                        <button
                          key={a}
                          type="button"
                          onClick={() => toggleAccent(a)}
                          className={classNames(
                            "rounded-full px-3 py-1.5 text-xs font-semibold transition border",
                            on
                              ? "border-transparent bg-gradient-to-r from-sky-400 to-indigo-400 text-[#061028]"
                              : "border-white/15 bg-white/10 text-white/85 hover:bg-white/12"
                          )}
                          title={a}
                        >
                          {a}
                        </button>
                      );
                    })}
                  </div>

                  {chosenAccents.length > 0 && (
                    <p className="mt-2 text-[11px] text-white/65">
                      Using: {chosenAccents.join(" · ")}
                    </p>
                  )}
                </div>

                {/* prompt */}
                <div className="mt-4">
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-white/80">
                    Extra prompt
                  </label>
                  <input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., soft light, vibrant paint, subtle paper grain"
                    className={inputBase}
                  />
                </div>

                {/* actions */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setPaletteFile(null);
                      setResultB64(null);
                    }}
                    className={classNames(
                      pillBtnBase,
                      "bg-white/10 border border-white/15 text-white"
                    )}
                  >
                    Reset
                  </button>

                  <button
                    type="button"
                    onClick={handleProcess}
                    disabled={loading}
                    className={classNames(
                      pillBtnBase,
                      "bg-gradient-to-r from-sky-400 to-indigo-400 text-[#061028]"
                    )}
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#061028]/30 border-t-[#061028]" />
                        Processing…
                      </span>
                    ) : (
                      <>
                        <IconSparkle className="text-[#061028]" />
                        Colorize
                      </>
                    )}
                  </button>
                </div>

                {error && (
                  <div className="mt-3 rounded-3xl border border-rose-300/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                    {error}
                  </div>
                )}
              </div>

              {/* Result */}
              {resultB64 && (
                <div className={classNames(card, "overflow-hidden")}>
                  <div className="flex flex-col gap-2 border-b border-white/15 bg-white/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm font-bold text-white/90">
                      Result
                    </span>

                    <a
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 hover:bg-white/12"
                      href={`data:image/png;base64,${resultB64}`}
                      download="sketch-colored.png"
                    >
                      Download PNG
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        fill="currentColor"
                        className="text-sky-200"
                      >
                        <path d="M5 20h14v-2H5v2Zm7-3l5-5h-3V4h-4v8H7l5 5Z" />
                      </svg>
                    </a>
                  </div>

                  <div className="p-4">
                    <div className="mx-auto w-full max-w-[1200px] overflow-hidden rounded-3xl border border-white/15 bg-black/20">
                      <img
                        src={`data:image/png;base64,${resultB64}`}
                        alt="Result"
                        loading="lazy"
                        decoding="async"
                        className="mx-auto h-auto w-full max-h-[70vh] object-contain"
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* History */}
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-white/90">History</h3>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className={classNames(
                  pillBtnBase,
                  "bg-white/10 border border-white/15 text-white"
                )}
              >
                Clear
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <p className="text-sm text-white/70">
              No history yet. Generate a result and it’ll show up here.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {history.map((h) => (
                <div
                  key={h.id}
                  className="overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.55)] backdrop-blur"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-white/15 bg-white/10 px-3 py-2">
                    <span className="truncate text-[11px] font-bold text-white/85">
                      {h.label}
                    </span>
                    <span className="shrink-0 rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/75">
                      {new Date(h.ts).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="p-2">
                    {h.thumb ? (
                      <img
                        src={h.thumb}
                        alt={h.label}
                        loading="lazy"
                        decoding="async"
                        className="h-auto w-full rounded-2xl border border-white/10 object-contain bg-black/20"
                      />
                    ) : (
                      <div className="h-24 rounded-2xl bg-black/20" />
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 px-3 pb-3">
                    <button
                      onClick={() => reapplyHistory(h)}
                      className="text-xs font-extrabold text-sky-200 hover:underline"
                    >
                      Reapply
                    </button>
                    <span className="truncate text-[10px] text-white/65">
                      {h.style}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== FULL-SCREEN CAMERA OVERLAY ===== */}
        {camFullscreen && (
          <div className="fixed inset-0 z-[100] bg-black/95 text-white">
            <div className="absolute inset-0 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
              {/* Top bar */}
              <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-4 py-3">
                <button
                  onClick={closeFullscreenCamera}
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold"
                >
                  Close
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white/70">
                    {camReady ? "Ready" : "Starting…"}
                  </span>
                  <button
                    onClick={stopCamera}
                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold"
                  >
                    Stop
                  </button>
                </div>
              </div>

              {/* Camera feed */}
              <div className="flex h-[100dvh] w-screen items-center justify-center">
                <video
                  ref={fsVideoRef}
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
                    className="grid h-16 w-16 place-items-center rounded-full border-4 border-white/70 bg-white/90 active:scale-95 disabled:opacity-50"
                    title="Capture"
                  >
                    <span className="h-2 w-2 rounded-full bg-black/30" />
                  </button>
                </div>

                <div className="pointer-events-auto">
                  <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white/80">
                    Tip: center the page • steady hands • good light ✨
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* hidden binders */}
        <video ref={inlineVideoRef} className="hidden" playsInline muted />
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
