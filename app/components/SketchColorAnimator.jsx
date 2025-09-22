

// // app/components/SketchColorAnimator.jsx
// "use client";

// import { useEffect, useRef, useState } from "react";

// const PALETTE = {
//   paper: "#FFF9F1",
//   ink: "#2F2A25",
//   accent: "#4C7CF0",
//   soft: "#F0F4FF",
//   warn: "#C72C41",
// };

// /* ====== Quota-safe history config & helpers ====== */
// const LS_HISTORY_KEY = "sketch_color_animator_history_v2";
// const MAX_HISTORY_ITEMS = 12;
// const MAX_LOCALSTORAGE_BYTES = 4_500_000; // ~4.5MB

// function approxBytes(str) {
//   return str ? str.length * 2 : 0;
// }

// function safeSetItem(key, value, evictCb) {
//   for (let i = 0; i < 5; i++) {
//     try {
//       localStorage.setItem(key, value);
//       return true;
//     } catch (err) {
//       const quota =
//         err?.name === "QuotaExceededError" ||
//         err?.name === "NS_ERROR_DOM_QUOTA_REACHED";
//       if (quota) {
//         if (!evictCb || !evictCb()) return false;
//       } else {
//         return false;
//       }
//     }
//   }
//   return false;
// }

// // Tiny JPEG thumb from a base64 PNG
// async function makeThumbJPEG(base64, { maxW = 200, quality = 0.6 } = {}) {
//   if (!base64) return null;
//   const img = new Image();
//   img.crossOrigin = "anonymous";
//   img.src = `data:image/png;base64,${base64}`;
//   await new Promise((res, rej) => {
//     img.onload = res;
//     img.onerror = () => rej(new Error("Failed to load image for thumbnail"));
//   });

//   const scale = Math.min(1, maxW / (img.width || maxW));
//   const w = Math.max(1, Math.round((img.width || maxW) * scale));
//   const h = Math.max(1, Math.round((img.height || maxW) * scale));

//   const canvas = document.createElement("canvas");
//   canvas.width = w; canvas.height = h;
//   const ctx = canvas.getContext("2d");
//   ctx.drawImage(img, 0, 0, w, h);
//   return canvas.toDataURL("image/jpeg", quality);
// }

// /* ====== Styles / presets ====== */
// const PRESETS = [
//   { key: "ink_cleanup", label: "Ink Cleanup", style: "ink_cleanup", tip: "Boost lines, clean paper", emoji: "🖊️", preview: "/presets2/ink.png" },
//   { key: "watercolor_soft", label: "Watercolor (Soft)", style: "watercolor_soft", tip: "Soft washes", emoji: "🎨", preview: "/presets2/watercolor.png" },
//   { key: "watercolor_vibrant", label: "Watercolor (Vibrant)", style: "watercolor_vibrant", tip: "Bright fully colored", emoji: "🌈", preview: "/presets2/watercolor_vibrant.png" },
//   { key: "gouache_dense", label: "Gouache (Dense)", style: "gouache_dense", tip: "Opaque matte paint", emoji: "🖌️", preview: "/presets2/gouache.png" },
//   { key: "colored_pencil", label: "Colored Pencil", style: "colored_pencil", tip: "Grain + layered color", emoji: "✏️", preview: "/presets2/pencil.png" },
//   { key: "oil_pastel", label: "Oil Pastel", style: "oil_pastel", tip: "Creamy blended color", emoji: "🟧", preview: "/presets2/pastel_oil.png" },
//   { key: "crayon_childlike", label: "Crayon (Childlike)", style: "crayon_childlike", tip: "Waxy playful color", emoji: "🖍️", preview: "/presets2/crayon.png" },
//   { key: "gel_pen_neon", label: "Gel Pens (Neon)", style: "gel_pen_neon", tip: "Neon highlights", emoji: "💡", preview: "/presets2/neon.png" },
//   { key: "manga_tones", label: "Manga + Tones", style: "manga_tones", tip: "Inks + screentones", emoji: "🖤", preview: "/presets2/manga.png" },
//   { key: "sepia_wash", label: "Sepia Wash", style: "sepia_wash", tip: "Vintage warmth", emoji: "📜", preview: "/presets2/sepia.png" },
//   { key: "graphite_tint", label: "Graphite + Tint", style: "graphite_tint", tip: "Soft tinted pencil", emoji: "🪶", preview: "/presets2/graphite.png" },
//   { key: "cel_shaded", label: "Cel-Shaded", style: "cel_shaded", tip: "Toon flats + shadow", emoji: "🧩", preview: "/presets2/cel.png" },
//   { key: "comic_halftone", label: "Comic Dots", style: "comic_halftone", tip: "Retro print dots", emoji: "🗞️", preview: "/presets2/halftone.png" },
//   { key: "bluey_soft", label: "Bluey-Soft", style: "bluey_soft", tip: "Friendly flats", emoji: "🔵", preview: "/presets2/bluey.png" },
// ];

// /* ====== Color Accents (tap to add/remove; appended to prompt) ====== */
// const COLOR_ACCENTS = [
//   "primary brights (red/blue/yellow)",
//   "pastel candy palette",
//   "earthy muted tones",
//   "neon accents",
//   "sunset warm gradients",
//   "cool ocean blues/teals",
//   "autumn oranges & browns",
//   "spring florals (pinks/lilacs)",
//   "retro 90s brights",
//   "black & gold highlights",
// ];

// export default function SketchColorAnimator() {
//   const [file, setFile] = useState(null);
//   const [paletteFile, setPaletteFile] = useState(null);
//   const [idx, setIdx] = useState(0);
//   const active = PRESETS[idx];

//   const [prompt, setPrompt] = useState("Keep the line work; fully color the page with clean fills and natural shading.");
//   const [chosenAccents, setChosenAccents] = useState([]);
//   const [animate, setAnimate] = useState(false);
//   const [frames, setFrames] = useState(6); // 1–12
//   const [fps, setFps] = useState(6);       // 1–12

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [resultB64, setResultB64] = useState(null);
//   const [resultFrames, setResultFrames] = useState([]);

//   // webcam
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [stream, setStream] = useState(null);
//   const [camReady, setCamReady] = useState(false);

//   // animation player
//   const [playing, setPlaying] = useState(true);
//   const frameIdxRef = useRef(0);
//   const timerRef = useRef(null);

//   // history (thumb-only)
//   const [history, setHistory] = useState([]);

//   /* Load history safely (thumb-only) */
//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem(LS_HISTORY_KEY);
//       const parsed = raw ? JSON.parse(raw) : [];
//       const trimmed = (Array.isArray(parsed) ? parsed : [])
//         .filter((h) => h && typeof h === "object" && typeof h.thumb === "string" && h.thumb.startsWith("data:image/"))
//         .slice(0, MAX_HISTORY_ITEMS);
//       setHistory(trimmed);
//     } catch {
//       setHistory([]);
//     }
//   }, []);

//   /* Webcam binding */
//   useEffect(() => {
//     const v = videoRef.current;
//     if (!v) return;
//     if (stream) {
//       v.srcObject = stream;
//       v.onloadedmetadata = () => {
//         v.play().then(() => setCamReady(true)).catch(() => setCamReady(true));
//       };
//     } else {
//       v.srcObject = null;
//     }
//     return () => { if (v) v.srcObject = null; };
//   }, [stream]);

//   /* Animation timer */
//   useEffect(() => {
//     clearTimer();
//     if (!resultFrames.length || !playing) return;
//     const interval = Math.max(1, Math.min(12, fps));
//     timerRef.current = setInterval(() => {
//       frameIdxRef.current = (frameIdxRef.current + 1) % resultFrames.length;
//       setResultFrames((arr) => [...arr]); // trigger re-render
//     }, Math.round(1000 / interval));
//     return clearTimer;
//   }, [resultFrames, fps, playing]);

//   function clearTimer() {
//     if (timerRef.current) {
//       clearInterval(timerRef.current);
//       timerRef.current = null;
//     }
//   }

//   // Webcam helpers
//   const startCamera = async () => {
//     setError(null);
//     try {
//       const s = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: { ideal: "environment" } },
//         audio: false,
//       });
//       setStream(s);
//     } catch {
//       setError("Camera access denied or unavailable.");
//     }
//   };
//   const stopCamera = () => {
//     try { stream?.getTracks()?.forEach((t) => t.stop()); } catch {}
//     setStream(null); setCamReady(false);
//   };
//   const capturePhoto = async () => {
//     const v = videoRef.current, c = canvasRef.current;
//     if (!v || !c) return;
//     const w = v.videoWidth || 1080, h = v.videoHeight || 1080;
//     c.width = w; c.height = h;
//     c.getContext("2d").drawImage(v, 0, 0, w, h);
//     const blob = await new Promise((r) => c.toBlob(r, "image/png"));
//     if (!blob) return;
//     setFile(new File([blob], "sketch-capture.png", { type: "image/png" }));
//   };

//   // Color accents chip toggle
//   const toggleAccent = (a) => {
//     setChosenAccents((prev) =>
//       prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
//     );
//   };

//   // Save to thumb-only history with quota handling
//   async function saveHistory({ base64FirstFrame }) {
//     let thumb = null;
//     try {
//       thumb = await makeThumbJPEG(base64FirstFrame, { maxW: 200, quality: 0.6 });
//     } catch {}

//     let next = [
//       {
//         id: `${Date.now()}`,
//         ts: new Date().toISOString(),
//         label: active.label + (animate ? " (Anim)" : ""),
//         style: active.style,
//         prompt,
//         accents: chosenAccents,
//         animate,
//         frames: animate ? frames : 1,
//         thumb,
//       },
//       ...history,
//     ].slice(0, MAX_HISTORY_ITEMS);

//     const serialize = () => JSON.stringify(next);
//     const evictOne = () => {
//       if (next.length <= 1) return false;
//       next = next.slice(0, next.length - 1);
//       return true;
//     };

//     let payload = serialize();
//     while (approxBytes(payload) > MAX_LOCALSTORAGE_BYTES && evictOne()) {
//       payload = serialize();
//     }

//     const ok = safeSetItem(LS_HISTORY_KEY, payload, evictOne);
//     if (!ok) {
//       try { sessionStorage.setItem(LS_HISTORY_KEY, payload); } catch {}
//     }
//     setHistory(next);
//   }

//   // Submit to API
//   async function handleProcess(e) {
//     e?.preventDefault?.();
//     if (!file) { setError("Please upload or capture a sketch page."); return; }
//     setLoading(true); setError(null); setResultB64(null); setResultFrames([]); frameIdxRef.current = 0;

//     const form = new FormData();
//     form.append("style", active.style);
//     form.append("prompt", prompt);
//     form.append("color_accents", chosenAccents.join(", "));
//     form.append("animate", String(animate));
//     form.append("frames", String(animate ? frames : 1));
//     form.append("image", file);
//     if (paletteFile) form.append("palette", paletteFile);

//     try {
//       const res = await fetch("/api/sketch", { method: "POST", body: form });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Request failed");

//       if (animate) {
//         const arr = data.framesBase64 || [];
//         setResultFrames(arr);
//         setPlaying(true);
//         await saveHistory({ base64FirstFrame: arr[0] || null });
//       } else {
//         setResultB64(data.imageBase64);
//         await saveHistory({ base64FirstFrame: data.imageBase64 });
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const reapplyHistory = (h) => {
//     const i = PRESETS.findIndex((p) => p.style === h.style);
//     setIdx(i >= 0 ? i : 0);
//     setPrompt(h.prompt || "");
//     setChosenAccents(Array.isArray(h.accents) ? h.accents : []);
//     setAnimate(!!h.animate);
//     setFrames(h.frames || 1);
//     setResultB64(null);
//     setResultFrames([]);
//   };

//   const clearHistory = () => {
//     setHistory([]);
//     localStorage.removeItem(LS_HISTORY_KEY);
//     try { sessionStorage.removeItem(LS_HISTORY_KEY); } catch {}
//   };

//   // UI helpers
//   const btn =
//     "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

//   return (
//     <div className="mx-auto w-full max-w-[1152px] px-3 sm:px-4 lg:px-6 py-8 sm:py-10">
//       <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
//         <div>
//           <h2 className="text-[1.25rem] sm:text-2xl font-extrabold tracking-tight" style={{ color: PALETTE.ink }}>
//             Sketch Color &amp; Flipbook
//           </h2>
//           <p className="mt-1 text-sm sm:text-[0.95rem] leading-relaxed" style={{ color: "#6b625c" }}>
//             Upload/capture your sketch → choose a style → add color accents or a palette image → (optional) animate.
//           </p>
//         </div>
//         <div
//           className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs"
//           style={{ border: `1px solid #00000012`, background: PALETTE.paper, color: PALETTE.ink }}
//         >
//           <span className="h-2 w-2 rounded-full" style={{ background: PALETTE.accent }} />
//           Ready
//         </div>
//       </header>

//       <div className="rounded-2xl shadow-sm backdrop-blur" style={{ border: `1px solid #00000012`, background: "#FFFCF7" }}>
//         <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 lg:grid-cols-2">
//           {/* LEFT: Webcam + Uploads */}
//           <section className="space-y-4">
//             <div className="rounded-xl p-4 shadow-sm" style={{ border: `1px solid #00000012`, background: "#FFFFFF" }}>
//               <div className="mb-3 flex flex-wrap items-center gap-2">
//                 {!stream ? (
//                   <button onClick={startCamera} className={btn} style={{ background: PALETTE.accent, color: "white" }}>
//                     Start Webcam
//                   </button>
//                 ) : (
//                   <button onClick={stopCamera} className={btn} style={{ background: PALETTE.soft, color: PALETTE.ink, border: `1px solid #00000012` }}>
//                     Stop Webcam
//                   </button>
//                 )}
//                 <button
//                   onClick={capturePhoto}
//                   disabled={!camReady}
//                   className={`${btn} disabled:opacity-50`}
//                   style={{ background: PALETTE.soft, color: PALETTE.ink, border: `1px solid #00000012` }}
//                 >
//                   Capture Photo
//                 </button>
//                 <span className="text-xs" style={{ color: "#6b625c" }}>
//                   {camReady ? "Camera ready" : stream ? "Loading camera..." : "Camera off"}
//                 </span>
//               </div>

//               <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//                 {/* Webcam box keeps aspect ratio on all screens */}
//                 <div className="overflow-hidden rounded-lg" style={{ border: `1px solid #00000012`, background: "#1a1a1a" }}>
//                   <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
//                     <video
//                       ref={videoRef}
//                       playsInline
//                       muted
//                       className="absolute inset-0 h-full w-full object-contain"
//                     />
//                   </div>
//                 </div>

//                 {/* Selected sketch preview */}
//                 <div className="rounded-lg p-2 text-center" style={{ border: `2px dashed #00000022`, background: "#FFF6E8" }}>
//                   <p className="mb-2 text-xs font-medium" style={{ color: "#2F2A25" }}>Selected Sketch</p>
//                   {file ? (
//                     <img
//                       src={URL.createObjectURL(file)}
//                       alt="Selected"
//                       loading="lazy"
//                       decoding="async"
//                       className="mx-auto max-h-[45vh] w-full rounded object-contain"
//                       style={{ height: "auto" }}
//                     />
//                   ) : (
//                     <div className="text-xs" style={{ color: "#8b8078" }}>No image selected yet.</div>
//                   )}
//                   <div className="mt-2">
//                     <input
//                       id="file-input-sketch"
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => setFile(e.target.files?.[0] ?? null)}
//                       className="max-w-full"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Reference palette upload */}
//               <div className="mt-4 rounded-lg p-3" style={{ border: `1px dashed #00000022`, background: "#FFF6E8" }}>
//                 <p className="text-xs font-medium" style={{ color: "#2F2A25" }}>
//                   Optional: Upload a <span className="font-semibold">reference color</span> image (we’ll sample its palette)
//                 </p>
//                 <div className="mt-2 flex flex-wrap items-center gap-3">
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => setPaletteFile(e.target.files?.[0] ?? null)}
//                     className="max-w-full"
//                   />
//                   {paletteFile && (
//                     <img
//                       src={URL.createObjectURL(paletteFile)}
//                       alt="Palette preview"
//                       loading="lazy"
//                       decoding="async"
//                       className="h-12 w-12 rounded object-cover"
//                     />
//                   )}
//                 </div>
//                 <p className="mt-1 text-[11px]" style={{ color: "#6b625c" }}>
//                   Tip: a small swatch image or reference artwork works great. We only use it to pick colors.
//                 </p>
//               </div>

//               <canvas ref={canvasRef} className="hidden" />
//             </div>

//             {/* Drag & drop (sketch) */}
//             <div
//               className="group relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl p-6 text-center transition"
//               style={{ border: `2px dashed #00000022`, background: "#FFF6E8" }}
//               onDragOver={(e) => e.preventDefault()}
//               onDrop={(e) => {
//                 e.preventDefault();
//                 const f = e.dataTransfer.files?.[0];
//                 if (f) setFile(f);
//               }}
//               onClick={() => document.getElementById("file-input-sketch")?.click()}
//             >
//               <div className="rounded-full p-3 shadow-sm" style={{ background: "#FFF0DE", color: PALETTE.ink }}>
//                 <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M11 16h2V9l3 3l1.5-1.5L12 4L6.5 10.5L8 12l3-3v7Zm-6 4h14v-2H5v2Z"/></svg>
//               </div>
//               <p className="text-sm sm:text-base font-medium" style={{ color: PALETTE.ink }}>Drag &amp; drop your sketch</p>
//               <p className="text-xs" style={{ color: "#8b8078" }}>PNG, JPG up to ~10MB</p>
//             </div>
//           </section>

//           {/* RIGHT: Presets + Color Accents + Controls + Result */}
//           <section className="space-y-4">
//             {/* Circle presets */}
//             <div className="rounded-xl p-4 shadow-sm" style={{ border: `1px solid #00000012`, background: "#FFFFFF" }}>
//               <div className="mb-2 flex items-center justify-between gap-2">
//                 <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: PALETTE.ink }}>Style Presets</span>
//                 <span className="truncate rounded-full px-2 py-1 text-xs" style={{ border: `1px solid #00000012`, background: "#FFF1DD", color: PALETTE.ink }}>
//                   {PRESETS[idx].label}
//                 </span>
//               </div>

//               {/* Mobile-friendly horizontal scroller with snap */}
//               <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [-webkit-overflow-scrolling:touch] scroll-pl-3 sm:scroll-pl-0">
//                 {PRESETS.map((p, i) => {
//                   const selected = i === idx;
//                   return (
//                     <button
//                       key={p.key}
//                       type="button"
//                       onClick={() => setIdx(i)}
//                       className="group flex w-20 min-w-20 flex-col items-center gap-2 focus:outline-none snap-start"
//                       title={`${p.label} — ${p.tip}`}
//                     >
//                       <div
//                         className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border shadow-sm"
//                         style={{
//                           borderColor: selected ? PALETTE.accent : "#00000022",
//                           boxShadow: selected ? `0 0 0 3px ${PALETTE.accent}33` : undefined,
//                           background: "#FFFDF8",
//                         }}
//                       >
//                         {p.preview ? (
//                           <img
//                             src={p.preview}
//                             alt={p.label}
//                             loading="lazy"
//                             decoding="async"
//                             className="h-full w-full object-cover"
//                             draggable={false}
//                           />
//                         ) : (
//                           <div className="flex h-full w-full items-center justify-center text-2xl">
//                             <span>{p.emoji || "✨"}</span>
//                           </div>
//                         )}
//                       </div>
//                       <div className="w-20 truncate text-center text-[11px] font-medium" style={{ color: selected ? PALETTE.accent : PALETTE.ink }}>
//                         {p.label}
//                       </div>
//                     </button>
//                   );
//                 })}
//               </div>

//               {/* Color accents chips */}
//               <div className="mt-4">
//                 <label className="mb-2 block text-xs font-semibold uppercase tracking-wide" style={{ color: PALETTE.ink }}>
//                   Color Accents (optional)
//                 </label>
//                 <div className="flex flex-wrap gap-2">
//                   {COLOR_ACCENTS.map((a) => {
//                     const on = chosenAccents.includes(a);
//                     return (
//                       <button
//                         key={a}
//                         type="button"
//                         onClick={() => toggleAccent(a)}
//                         className={`rounded-full px-3 py-1 text-xs border ${on ? "text-white" : ""}`}
//                         style={{
//                           background: on ? PALETTE.accent : "#FFFCF7",
//                           color: on ? "white" : "#2F2A25",
//                           borderColor: on ? "transparent" : "#00000022",
//                         }}
//                         title={a}
//                       >
//                         {a}
//                       </button>
//                     );
//                   })}
//                 </div>
//                 {chosenAccents.length > 0 && (
//                   <p className="mt-2 text-[11px]" style={{ color: "#6b625c" }}>
//                     Using: {chosenAccents.join(" · ")}
//                   </p>
//                 )}
//               </div>

//               {/* Prompt + Animate */}
//               <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
//                 <div className="sm:col-span-2">
//                   <label className="mb-1 block text-xs font-semibold uppercase tracking-wide" style={{ color: PALETTE.ink }}>
//                     Extra prompt (optional)
//                   </label>
//                   <input
//                     value={prompt}
//                     onChange={(e) => setPrompt(e.target.value)}
//                     placeholder="e.g., clean fills, gentle rim light, subtle paper grain"
//                     className="w-full rounded-xl border px-3 py-2 text-sm shadow-sm outline-none"
//                     style={{ borderColor: "#00000022", background: "#FFFCF7", color: PALETTE.ink }}
//                   />
//                 </div>

//                 <label className="flex items-center gap-2 text-sm" style={{ color: PALETTE.ink }}>
//                   <input type="checkbox" checked={animate} onChange={(e) => setAnimate(e.target.checked)} />
//                   Animate
//                 </label>

//                 <div className="flex items-center gap-2">
//                   <span className="text-xs" style={{ color: "#6b625c" }}>Frames</span>
//                   <input
//                     type="range"
//                     min={1}
//                     max={12}
//                     step={1}
//                     value={frames}
//                     onChange={(e) => setFrames(Number(e.target.value))}
//                     disabled={!animate}
//                     className="h-10 w-full"
//                   />
//                   <span className="text-xs" style={{ width: 22, textAlign: "right", color: animate ? "#6b625c" : "#b9b2ac" }}>
//                     {frames}
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-2 sm:col-span-2">
//                   <span className="text-xs" style={{ color: "#6b625c" }}>FPS</span>
//                   <input
//                     type="range"
//                     min={1}
//                     max={12}
//                     step={1}
//                     value={fps}
//                     onChange={(e) => setFps(Number(e.target.value))}
//                     disabled={!animate}
//                     className="h-10 w-full"
//                   />
//                   <span className="text-xs" style={{ width: 22, textAlign: "right", color: animate ? "#6b625c" : "#b9b2ac" }}>
//                     {fps}
//                   </span>
//                 </div>
//               </div>

//               <div className="mt-4 flex flex-wrap items-center gap-2">
//                 <button
//                   type="button"
//                   onClick={() => { setFile(null); setPaletteFile(null); setResultB64(null); setResultFrames([]); }}
//                   className={btn}
//                   style={{ background: PALETTE.soft, color: PALETTE.ink, border: `1px solid #00000012` }}
//                 >
//                   Reset
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleProcess}
//                   disabled={loading}
//                   className={btn}
//                   style={{ background: PALETTE.accent, color: "white" }}
//                 >
//                   {loading ? (
//                     <span className="inline-flex items-center gap-2">
//                       <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
//                       Processing…
//                     </span>
//                   ) : (
//                     "Colorize / Animate"
//                   )}
//                 </button>
//                 {animate && resultFrames.length > 0 && (
//                   <button
//                     type="button"
//                     onClick={() => setPlaying((p) => !p)}
//                     className={btn}
//                     style={{ background: "#FFEED6", color: PALETTE.ink, border: `1px solid #00000012` }}
//                   >
//                     {playing ? "Pause" : "Play"}
//                   </button>
//                 )}
//               </div>

//               {error && (
//                 <div className="mt-3 rounded-lg px-3 py-2 text-sm" style={{ border: `1px solid ${PALETTE.warn}33`, background: "#FFE8EC", color: PALETTE.warn }}>
//                   {error}
//                 </div>
//               )}
//             </div>

//             {/* Result */}
//             {(resultB64 || resultFrames.length > 0) && (
//               <div className="overflow-hidden rounded-xl shadow-sm" style={{ border: `1px solid #00000012`, background: "#FFFFFF" }}>
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-2 text-sm" style={{ borderBottom: `1px solid #00000012`, background: "#FFF1DD" }}>
//                   <span className="font-medium" style={{ color: PALETTE.ink }}>
//                     {animate ? "Flipbook" : "Result"}
//                   </span>
//                   {!animate && resultB64 && (
//                     <a
//                       className="inline-flex items-center gap-1 hover:underline"
//                       style={{ color: PALETTE.accent }}
//                       href={`data:image/png;base64,${resultB64}`}
//                       download="sketch-colored.png"
//                     >
//                       Download PNG
//                       <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M5 20h14v-2H5v2Zm7-3l5-5h-3V4h-4v8H7l5 5Z"/></svg>
//                     </a>
//                   )}
//                 </div>
//                 <div className="p-4">
//                   {!animate && resultB64 && (
//                     <div className="relative mx-auto w-full" style={{ maxWidth: 1200 }}>
//                       <img
//                         src={`data:image/png;base64,${resultB64}`}
//                         alt="Result"
//                         loading="lazy"
//                         decoding="async"
//                         className="mx-auto h-auto w-full max-h-[70vh] rounded-lg object-contain"
//                         style={{ aspectRatio: "auto" }}
//                       />
//                     </div>
//                   )}

//                   {animate && resultFrames.length > 0 && (
//                     <>
//                       <div className="relative mx-auto w-full" style={{ maxWidth: 1200 }}>
//                         <img
//                           src={`data:image/png;base64,${resultFrames[frameIdxRef.current % resultFrames.length]}`}
//                           alt="Animation frame"
//                           loading="eager"
//                           className="mx-auto h-auto w-full max-h-[70vh] rounded-lg object-contain"
//                         />
//                       </div>
//                       <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
//                         {resultFrames.map((f, i) => (
//                           <img
//                             key={i}
//                             src={`data:image/png;base64,${f}`}
//                             alt={`frame ${i + 1}`}
//                             loading="lazy"
//                             decoding="async"
//                             className={`h-16 w-full rounded border object-contain ${i === (frameIdxRef.current % resultFrames.length) ? "border-blue-500" : "border-transparent"}`}
//                           />
//                         ))}
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </div>
//             )}
//           </section>
//         </div>
//       </div>

//       {/* History (thumb-only) */}
//       <div className="mt-8">
//         <div className="mb-2 flex items-center justify-between">
//           <h3 className="text-lg font-bold" style={{ color: PALETTE.ink }}>History</h3>
//           {history.length > 0 && (
//             <button onClick={clearHistory} className={btn} style={{ background: PALETTE.soft, color: PALETTE.ink, border: `1px solid #00000012` }}>
//               Clear
//             </button>
//           )}
//         </div>

//         {history.length === 0 ? (
//           <p className="text-sm" style={{ color: "#6b625c" }}>
//             No history yet. Generate a result and it’ll be saved here.
//           </p>
//         ) : (
//           <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
//             {history.map((h) => (
//               <div key={h.id} className="overflow-hidden rounded-xl" style={{ border: `1px solid #00000012`, background: "#FFFFFF" }}>
//                 <div className="flex items-center justify-between px-3 py-1.5 text-[11px]" style={{ borderBottom: `1px solid #00000012`, background: "#FFF1DD", color: PALETTE.ink }}>
//                   <span className="truncate">{h.label}</span>
//                   <span className="rounded-full px-2 py-0.5" style={{ background: "#EAF1FF", color: "#1e55b8" }}>
//                     {new Date(h.ts).toLocaleTimeString()}
//                   </span>
//                 </div>
//                 <div className="p-2">
//                   {h.thumb ? (
//                     <img
//                       src={h.thumb}
//                       alt={h.label}
//                       loading="lazy"
//                       decoding="async"
//                       className="h-auto w-full rounded object-contain"
//                     />
//                   ) : (
//                     <div className="h-24 rounded bg-gray-100" />
//                   )}
//                 </div>
//                 <div className="flex items-center justify-between gap-2 px-3 pb-3">
//                   <button onClick={() => reapplyHistory(h)} className="text-xs font-medium underline" style={{ color: PALETTE.accent }}>
//                     Reapply
//                   </button>
//                   <span className="truncate text-[10px]" style={{ color: "#6b625c" }}>
//                     {h.style}{h.animate ? ` • ${h.frames}f` : ""}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// app/components/SketchColorAnimator.jsx
"use client";

import { useEffect, useRef, useState } from "react";

const PALETTE = {
  paper: "#FFF9F1",
  ink: "#2F2A25",
  accent: "#4C7CF0",
  soft: "#F0F4FF",
  warn: "#C72C41",
};

/* ====== Quota-safe history config & helpers ====== */
const LS_HISTORY_KEY = "sketch_color_animator_history_v2";
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
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", quality);
}

/* ====== Styles / presets ====== */
const PRESETS = [
  { key: "ink_cleanup", label: "Ink Cleanup", style: "ink_cleanup", tip: "Boost lines, clean paper", emoji: "🖊️", preview: "/presets2/ink.png" },
  { key: "watercolor_soft", label: "Watercolor (Soft)", style: "watercolor_soft", tip: "Soft washes", emoji: "🎨", preview: "/presets2/watercolor.png" },
  { key: "watercolor_vibrant", label: "Watercolor (Vibrant)", style: "watercolor_vibrant", tip: "Bright fully colored", emoji: "🌈", preview: "/presets2/watercolor_vibrant.png" },
  { key: "gouache_dense", label: "Gouache (Dense)", style: "gouache_dense", tip: "Opaque matte paint", emoji: "🖌️", preview: "/presets2/gouache.png" },
  { key: "colored_pencil", label: "Colored Pencil", style: "colored_pencil", tip: "Grain + layered color", emoji: "✏️", preview: "/presets2/pencil.png" },
  { key: "oil_pastel", label: "Oil Pastel", style: "oil_pastel", tip: "Creamy blended color", emoji: "🟧", preview: "/presets2/pastel_oil.png" },
  { key: "crayon_childlike", label: "Crayon (Childlike)", style: "crayon_childlike", tip: "Waxy playful color", emoji: "🖍️", preview: "/presets2/crayon.png" },
  { key: "gel_pen_neon", label: "Gel Pens (Neon)", style: "gel_pen_neon", tip: "Neon highlights", emoji: "💡", preview: "/presets2/neon.png" },
  { key: "manga_tones", label: "Manga + Tones", style: "manga_tones", tip: "Inks + screentones", emoji: "🖤", preview: "/presets2/manga.png" },
  { key: "sepia_wash", label: "Sepia Wash", style: "sepia_wash", tip: "Vintage warmth", emoji: "📜", preview: "/presets2/sepia.png" },
  { key: "graphite_tint", label: "Graphite + Tint", style: "graphite_tint", tip: "Soft tinted pencil", emoji: "🪶", preview: "/presets2/graphite.png" },
  { key: "cel_shaded", label: "Cel-Shaded", style: "cel_shaded", tip: "Toon flats + shadow", emoji: "🧩", preview: "/presets2/cel.png" },
  { key: "comic_halftone", label: "Comic Dots", style: "comic_halftone", tip: "Retro print dots", emoji: "🗞️", preview: "/presets2/halftone.png" },
  { key: "bluey_soft", label: "Bluey-Soft", style: "bluey_soft", tip: "Friendly flats", emoji: "🔵", preview: "/presets2/bluey.png" },
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

export default function SketchColorAnimator() {
  const [file, setFile] = useState(null);
  const [paletteFile, setPaletteFile] = useState(null);
  const [idx, setIdx] = useState(0);
  const active = PRESETS[idx];

  const [prompt, setPrompt] = useState("Keep the line work; fully color the page with clean fills and natural shading.");
  const [chosenAccents, setChosenAccents] = useState([]);
  const [animate, setAnimate] = useState(false);
  const [frames, setFrames] = useState(6); // 1–12
  const [fps, setFps] = useState(6);       // 1–12

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [resultB64, setResultB64] = useState(null);
  const [resultFrames, setResultFrames] = useState([]);

  // webcam
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [camReady, setCamReady] = useState(false);

  // NEW: full-screen camera overlay state
  const [camFullscreen, setCamFullscreen] = useState(false);

  // animation player
  const [playing, setPlaying] = useState(true);
  const frameIdxRef = useRef(0);
  const timerRef = useRef(null);

  // history (thumb-only)
  const [history, setHistory] = useState([]);

  /* Load history safely (thumb-only) */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_HISTORY_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const trimmed = (Array.isArray(parsed) ? parsed : [])
        .filter((h) => h && typeof h === "object" && typeof h.thumb === "string" && h.thumb.startsWith("data:image/"))
        .slice(0, MAX_HISTORY_ITEMS);
      setHistory(trimmed);
    } catch {
      setHistory([]);
    }
  }, []);

  /* Webcam binding */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (stream) {
      v.srcObject = stream;
      v.onloadedmetadata = () => {
        // attempt autoplay on mobile
        v.play().then(() => setCamReady(true)).catch(() => setCamReady(true));
      };
    } else {
      v.srcObject = null;
    }
    return () => { if (v) v.srcObject = null; };
  }, [stream]);

  /* Timer for animation */
  useEffect(() => {
    clearTimer();
    if (!resultFrames.length || !playing) return;
    const interval = Math.max(1, Math.min(12, fps));
    timerRef.current = setInterval(() => {
      frameIdxRef.current = (frameIdxRef.current + 1) % resultFrames.length;
      setResultFrames((arr) => [...arr]); // trigger re-render
    }, Math.round(1000 / interval));
    return clearTimer;
  }, [resultFrames, fps, playing]);

  function clearTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  // Prevent body scroll when full-screen overlay open
  useEffect(() => {
    if (camFullscreen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
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
    } catch {
      setError("Camera access denied or unavailable.");
    }
  };

  const stopCamera = () => {
    try { stream?.getTracks()?.forEach((t) => t.stop()); } catch {}
    setStream(null); setCamReady(false);
  };

  const openFullscreenCamera = async () => {
    if (!stream) {
      await startCamera();
    }
    setCamFullscreen(true);
  };

  const closeFullscreenCamera = () => {
    setCamFullscreen(false);
  };

  const capturePhoto = async () => {
    const v = videoRef.current, c = canvasRef.current;
    if (!v || !c) return;
    const w = v.videoWidth || 1080, h = v.videoHeight || 1080;
    c.width = w; c.height = h;
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
  async function saveHistory({ base64FirstFrame }) {
    let thumb = null;
    try {
      thumb = await makeThumbJPEG(base64FirstFrame, { maxW: 200, quality: 0.6 });
    } catch {}

    let next = [
      {
        id: `${Date.now()}`,
        ts: new Date().toISOString(),
        label: active.label + (animate ? " (Anim)" : ""),
        style: active.style,
        prompt,
        accents: chosenAccents,
        animate,
        frames: animate ? frames : 1,
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
      try { sessionStorage.setItem(LS_HISTORY_KEY, payload); } catch {}
    }
    setHistory(next);
  }

  // Submit to API
  async function handleProcess(e) {
    e?.preventDefault?.();
    if (!file) { setError("Please upload or capture a sketch page."); return; }
    setLoading(true); setError(null); setResultB64(null); setResultFrames([]); frameIdxRef.current = 0;

    const form = new FormData();
    form.append("style", active.style);
    form.append("prompt", prompt);
    form.append("color_accents", chosenAccents.join(", "));
    form.append("animate", String(animate));
    form.append("frames", String(animate ? frames : 1));
    form.append("image", file);
    if (paletteFile) form.append("palette", paletteFile);

    try {
      const res = await fetch("/api/sketch", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

      if (animate) {
        const arr = data.framesBase64 || [];
        setResultFrames(arr);
        setPlaying(true);
        await saveHistory({ base64FirstFrame: arr[0] || null });
      } else {
        setResultB64(data.imageBase64);
        await saveHistory({ base64FirstFrame: data.imageBase64 });
      }
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
    setAnimate(!!h.animate);
    setFrames(h.frames || 1);
    setResultB64(null);
    setResultFrames([]);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(LS_HISTORY_KEY);
    try { sessionStorage.removeItem(LS_HISTORY_KEY); } catch {}
  };

  // UI helpers
  const btn =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

  return (
    <div className="mx-auto w-full max-w-[1152px] px-3 sm:px-4 lg:px-6 py-8 sm:py-10">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-[1.25rem] sm:text-2xl font-extrabold tracking-tight" style={{ color: PALETTE.ink }}>
            Sketch Color &amp; Flipbook
          </h2>
          <p className="mt-1 text-sm sm:text-[0.95rem] leading-relaxed" style={{ color: "#6b625c" }}>
            Upload/capture your sketch → choose a style → add color accents or a palette image → (optional) animate.
          </p>
        </div>
        <div
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs"
          style={{ border: `1px solid #00000012`, background: PALETTE.paper, color: PALETTE.ink }}
        >
          <span className="h-2 w-2 rounded-full" style={{ background: PALETTE.accent }} />
          Ready
        </div>
      </header>

      <div className="rounded-2xl shadow-sm backdrop-blur" style={{ border: `1px solid #00000012`, background: "#FFFCF7" }}>
        <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 lg:grid-cols-2">
          {/* LEFT: Webcam + Uploads */}
          <section className="space-y-4">
            <div className="rounded-xl p-4 shadow-sm" style={{ border: `1px solid #00000012`, background: "#FFFFFF" }}>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {!stream ? (
                  <button onClick={startCamera} className={btn} style={{ background: PALETTE.accent, color: "white" }}>
                    Start Webcam
                  </button>
                ) : (
                  <button onClick={stopCamera} className={btn} style={{ background: PALETTE.soft, color: PALETTE.ink, border: `1px solid #00000012` }}>
                    Stop Webcam
                  </button>
                )}
                <button
                  onClick={capturePhoto}
                  disabled={!camReady}
                  className={`${btn} disabled:opacity-50`}
                  style={{ background: PALETTE.soft, color: PALETTE.ink, border: `1px solid #00000012` }}
                >
                  Capture Photo
                </button>

                {/* NEW: Full-screen camera trigger (great for mobile) */}
                <button
                  onClick={openFullscreenCamera}
                  className={btn}
                  style={{ background: "#111827", color: "white" }}
                >
                  Full-screen Camera
                </button>

                <span className="text-xs" style={{ color: "#6b625c" }}>
                  {camReady ? "Camera ready" : stream ? "Loading camera..." : "Camera off"}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Webcam box keeps aspect ratio on all screens */}
                <div className="overflow-hidden rounded-lg" style={{ border: `1px solid #00000012`, background: "#1a1a1a" }}>
                  <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                    <video
                      ref={videoRef}
                      playsInline
                      autoPlay
                      muted
                      className="absolute inset-0 h-full w-full object-contain"
                    />
                  </div>
                </div>

                {/* Selected sketch preview */}
                <div className="rounded-lg p-2 text-center" style={{ border: `2px dashed #00000022`, background: "#FFF6E8" }}>
                  <p className="mb-2 text-xs font-medium" style={{ color: "#2F2A25" }}>Selected Sketch</p>
                  {file ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Selected"
                      loading="lazy"
                      decoding="async"
                      className="mx-auto max-h-[45vh] w-full rounded object-contain"
                      style={{ height: "auto" }}
                    />
                  ) : (
                    <div className="text-xs" style={{ color: "#8b8078" }}>No image selected yet.</div>
                  )}
                  <div className="mt-2">
                    <input
                      id="file-input-sketch"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      className="max-w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Reference palette upload */}
              <div className="mt-4 rounded-lg p-3" style={{ border: `1px dashed #00000022`, background: "#FFF6E8" }}>
                <p className="text-xs font-medium" style={{ color: "#2F2A25" }}>
                  Optional: Upload a <span className="font-semibold">reference color</span> image (we’ll sample its palette)
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPaletteFile(e.target.files?.[0] ?? null)}
                    className="max-w-full"
                  />
                  {paletteFile && (
                    <img
                      src={URL.createObjectURL(paletteFile)}
                      alt="Palette preview"
                      loading="lazy"
                      decoding="async"
                      className="h-12 w-12 rounded object-cover"
                    />
                  )}
                </div>
                <p className="mt-1 text-[11px]" style={{ color: "#6b625c" }}>
                  Tip: a small swatch image or reference artwork works great. We only use it to pick colors.
                </p>
              </div>

              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Drag & drop (sketch) */}
            <div
              className="group relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl p-6 text-center transition"
              style={{ border: `2px dashed #00000022`, background: "#FFF6E8" }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) setFile(f);
              }}
              onClick={() => document.getElementById("file-input-sketch")?.click()}
            >
              <div className="rounded-full p-3 shadow-sm" style={{ background: "#FFF0DE", color: PALETTE.ink }}>
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M11 16h2V9l3 3l1.5-1.5L12 4L6.5 10.5L8 12l3-3v7Zm-6 4h14v-2H5v2Z"/></svg>
              </div>
              <p className="text-sm sm:text-base font-medium" style={{ color: PALETTE.ink }}>Drag &amp; drop your sketch</p>
              <p className="text-xs" style={{ color: "#8b8078" }}>PNG, JPG up to ~10MB</p>
            </div>
          </section>

          {/* RIGHT: Presets + Color Accents + Controls + Result */}
          <section className="space-y-4">
            {/* Circle presets */}
            <div className="rounded-xl p-4 shadow-sm" style={{ border: `1px solid #00000012`, background: "#FFFFFF" }}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: PALETTE.ink }}>Style Presets</span>
                <span className="truncate rounded-full px-2 py-1 text-xs" style={{ border: `1px solid #00000012`, background: "#FFF1DD", color: PALETTE.ink }}>
                  {PRESETS[idx].label}
                </span>
              </div>

              {/* Mobile-friendly horizontal scroller with snap */}
              <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [-webkit-overflow-scrolling:touch] scroll-pl-3 sm:scroll-pl-0">
                {PRESETS.map((p, i) => {
                  const selected = i === idx;
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setIdx(i)}
                      className="group flex w-20 min-w-20 flex-col items-center gap-2 focus:outline-none snap-start"
                      title={`${p.label} — ${p.tip}`}
                    >
                      <div
                        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border shadow-sm"
                        style={{
                          borderColor: selected ? PALETTE.accent : "#00000022",
                          boxShadow: selected ? `0 0 0 3px ${PALETTE.accent}33` : undefined,
                          background: "#FFFDF8",
                        }}
                      >
                        {p.preview ? (
                          <img
                            src={p.preview}
                            alt={p.label}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                            draggable={false}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-2xl">
                            <span>{p.emoji || "✨"}</span>
                          </div>
                        )}
                      </div>
                      <div className="w-20 truncate text-center text-[11px] font-medium" style={{ color: selected ? PALETTE.accent : PALETTE.ink }}>
                        {p.label}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Color accents chips */}
              <div className="mt-4">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide" style={{ color: PALETTE.ink }}>
                  Color Accents (optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_ACCENTS.map((a) => {
                    const on = chosenAccents.includes(a);
                    return (
                      <button
                        key={a}
                        type="button"
                        onClick={() => toggleAccent(a)}
                        className={`rounded-full px-3 py-1 text-xs border ${on ? "text-white" : ""}`}
                        style={{
                          background: on ? PALETTE.accent : "#FFFCF7",
                          color: on ? "white" : "#2F2A25",
                          borderColor: on ? "transparent" : "#00000022",
                        }}
                        title={a}
                      >
                        {a}
                      </button>
                    );
                  })}
                </div>
                {chosenAccents.length > 0 && (
                  <p className="mt-2 text-[11px]" style={{ color: "#6b625c" }}>
                    Using: {chosenAccents.join(" · ")}
                  </p>
                )}
              </div>

              {/* Prompt + Animate */}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide" style={{ color: PALETTE.ink }}>
                    Extra prompt (optional)
                  </label>
                  <input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., clean fills, gentle rim light, subtle paper grain"
                    className="w-full rounded-xl border px-3 py-2 text-sm shadow-sm outline-none"
                    style={{ borderColor: "#00000022", background: "#FFFCF7", color: PALETTE.ink }}
                  />
                </div>

                <label className="flex items-center gap-2 text-sm" style={{ color: PALETTE.ink }}>
                  <input type="checkbox" checked={animate} onChange={(e) => setAnimate(e.target.checked)} />
                  Animate
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: "#6b625c" }}>Frames</span>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    step={1}
                    value={frames}
                    onChange={(e) => setFrames(Number(e.target.value))}
                    disabled={!animate}
                    className="h-10 w-full"
                  />
                  <span className="text-xs" style={{ width: 22, textAlign: "right", color: animate ? "#6b625c" : "#b9b2ac" }}>
                    {frames}
                  </span>
                </div>

                <div className="flex items-center gap-2 sm:col-span-2">
                  <span className="text-xs" style={{ color: "#6b625c" }}>FPS</span>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    step={1}
                    value={fps}
                    onChange={(e) => setFps(Number(e.target.value))}
                    disabled={!animate}
                    className="h-10 w-full"
                  />
                  <span className="text-xs" style={{ width: 22, textAlign: "right", color: animate ? "#6b625c" : "#b9b2ac" }}>
                    {fps}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => { setFile(null); setPaletteFile(null); setResultB64(null); setResultFrames([]); }}
                  className={btn}
                  style={{ background: PALETTE.soft, color: PALETTE.ink, border: `1px solid #00000012` }}
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleProcess}
                  disabled={loading}
                  className={btn}
                  style={{ background: PALETTE.accent, color: "white" }}
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Processing…
                    </span>
                  ) : (
                    "Colorize / Animate"
                  )}
                </button>
                {animate && resultFrames.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setPlaying((p) => !p)}
                    className={btn}
                    style={{ background: "#FFEED6", color: PALETTE.ink, border: `1px solid #00000012` }}
                  >
                    {playing ? "Pause" : "Play"}
                  </button>
                )}
              </div>

              {error && (
                <div className="mt-3 rounded-lg px-3 py-2 text-sm" style={{ border: `1px solid ${PALETTE.warn}33`, background: "#FFE8EC", color: PALETTE.warn }}>
                  {error}
                </div>
              )}
            </div>

            {/* Result */}
            {(resultB64 || resultFrames.length > 0) && (
              <div className="overflow-hidden rounded-xl shadow-sm" style={{ border: `1px solid #00000012`, background: "#FFFFFF" }}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-2 text-sm" style={{ borderBottom: `1px solid #00000012`, background: "#FFF1DD" }}>
                  <span className="font-medium" style={{ color: PALETTE.ink }}>
                    {animate ? "Flipbook" : "Result"}
                  </span>
                  {!animate && resultB64 && (
                    <a
                      className="inline-flex items-center gap-1 hover:underline"
                      style={{ color: PALETTE.accent }}
                      href={`data:image/png;base64,${resultB64}`}
                      download="sketch-colored.png"
                    >
                      Download PNG
                      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M5 20h14v-2H5v2Zm7-3l5-5h-3V4h-4v8H7l5 5Z"/></svg>
                    </a>
                  )}
                </div>
                <div className="p-4">
                  {!animate && resultB64 && (
                    <div className="relative mx-auto w-full" style={{ maxWidth: 1200 }}>
                      <img
                        src={`data:image/png;base64,${resultB64}`}
                        alt="Result"
                        loading="lazy"
                        decoding="async"
                        className="mx-auto h-auto w-full max-h-[70vh] rounded-lg object-contain"
                        style={{ aspectRatio: "auto" }}
                      />
                    </div>
                  )}

                  {animate && resultFrames.length > 0 && (
                    <>
                      <div className="relative mx-auto w-full" style={{ maxWidth: 1200 }}>
                        <img
                          src={`data:image/png;base64,${resultFrames[frameIdxRef.current % resultFrames.length]}`}
                          alt="Animation frame"
                          loading="eager"
                          className="mx-auto h-auto w-full max-h-[70vh] rounded-lg object-contain"
                        />
                      </div>
                      <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                        {resultFrames.map((f, i) => (
                          <img
                            key={i}
                            src={`data:image/png;base64,${f}`}
                            alt={`frame ${i + 1}`}
                            loading="lazy"
                            decoding="async"
                            className={`h-16 w-full rounded border object-contain ${i === (frameIdxRef.current % resultFrames.length) ? "border-blue-500" : "border-transparent"}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* History (thumb-only) */}
      <div className="mt-8">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-bold" style={{ color: PALETTE.ink }}>History</h3>
          {history.length > 0 && (
            <button onClick={clearHistory} className={btn} style={{ background: PALETTE.soft, color: PALETTE.ink, border: `1px solid #00000012` }}>
              Clear
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p className="text-sm" style={{ color: "#6b625c" }}>
            No history yet. Generate a result and it’ll be saved here.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {history.map((h) => (
              <div key={h.id} className="overflow-hidden rounded-xl" style={{ border: `1px solid #00000012`, background: "#FFFFFF" }}>
                <div className="flex items-center justify-between px-3 py-1.5 text-[11px]" style={{ borderBottom: `1px solid #00000012`, background: "#FFF1DD", color: PALETTE.ink }}>
                  <span className="truncate">{h.label}</span>
                  <span className="rounded-full px-2 py-0.5" style={{ background: "#EAF1FF", color: "#1e55b8" }}>
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
                      className="h-auto w-full rounded object-contain"
                    />
                  ) : (
                    <div className="h-24 rounded bg-gray-100" />
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 px-3 pb-3">
                  <button onClick={() => reapplyHistory(h)} className="text-xs font-medium underline" style={{ color: PALETTE.accent }}>
                    Reapply
                  </button>
                  <span className="truncate text-[10px]" style={{ color: "#6b625c" }}>
                    {h.style}{h.animate ? ` • ${h.frames}f` : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
                  onClick={() => setCamReady((r) => r)} // noop so we can keep a secondary control; replace with pause/play if desired
                  className="rounded-lg bg-white/10 px-3 py-1.5 text-xs"
                >
                  Tip: center the page, good light
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

