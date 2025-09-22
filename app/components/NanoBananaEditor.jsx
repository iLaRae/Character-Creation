// // // app/components/NanoBananaEditor.jsx
// // "use client";

// // import { useEffect, useRef, useState } from "react";

// // /* Bob's Burgers palette */
// // const BOBS = {
// //   yellow: "#F7E26D",
// //   red: "#D62E2E",
// //   teal: "#6BC5C5",
// //   blue: "#6EC1E4",
// //   brown: "#6B3E26",
// //   beige: "#F1D3A2",
// // };

// // /**
// //  * Circle previews:
// //  * Put tiny images in /public/presets/*.png to match preview paths below.
// //  * If a preview is missing, an emoji fallback is shown.
// //  */
// // const PRESETS = [
// //   /* E-COMMERCE */
// //   { key: "edit_white_bg", label: "Pure White", op: "edit_white_bg", prompt: "Pure #FFFFFF background; soft natural shadow; centered; square-friendly crop.", preview: "/presets/white.png", emoji: "⬜" },
// //   { key: "remove_bg", label: "Transparent", op: "remove_bg", prompt: "Remove background; preserve edges; PNG with alpha transparency.", preview: "/presets/transparent.png", emoji: "🪄" },
// //   { key: "photo_studio", label: "Studio Polish", op: "photo_studio", prompt: "Soft three-point lighting; minimal noise; subtle ground shadow.", preview: "/presets/studio.png", emoji: "💡" },
// //   { key: "square_1080", label: "Square 1080", op: "square_1080", prompt: "Square 1080x1080; centered; safe margins; crisp retail finish.", preview: "/presets/square.png", emoji: "🔲" },
// //   { key: "reflection_floor", label: "Reflection", op: "reflection_floor", prompt: "Glossy floor reflection with soft falloff; pristine studio feel.", preview: "/presets/reflection.png", emoji: "🪞" },
// //   { key: "ghost_mannequin", label: "Ghost Mannequin", op: "ghost_mannequin", prompt: "Remove mannequin/stand; realistic inner-neck shading; catalog-ready.", preview: "/presets/ghost.png", emoji: "👕" },
// //   { key: "ecom_amazon", label: "Amazon Main", op: "ecom_amazon", prompt: "Amazon main image: pure white background; product fills ≥85%; no text/props.", preview: "/presets/amazon.png", emoji: "🛒" },
// //   { key: "ecom_ebay", label: "eBay Main", op: "ecom_ebay", prompt: "eBay main image: clean white/light gray BG, natural shadow, accurate color.", preview: "/presets/ebay.png", emoji: "📦" },
// //   { key: "ecom_color_bg", label: "Pastel Backdrop", op: "ecom_color_bg", prompt: "Soft pastel gradient backdrop (mint/teal/pink) with gentle shadows.", preview: "/presets/pastel.png", emoji: "🌈" },
// //   { key: "ecom_lifestyle", label: "Lifestyle Set", op: "ecom_lifestyle", prompt: "Simple lifestyle: wood table, daylight window, realistic soft shadows.", preview: "/presets/lifestyle.png", emoji: "🏠" },
// //   { key: "ecom_topdown", label: "Top-Down Flat-lay", op: "ecom_topdown", prompt: "Top-down flat-lay; neat layout; even lighting; soft shadows.", preview: "/presets/flatlay.png", emoji: "🧺" },
// //   { key: "ecom_packshot", label: "Packshot", op: "ecom_packshot", prompt: "Straight-on packshot; centered; label readable; subtle shadow.", preview: "/presets/packshot.png", emoji: "🎁" },

// //   /* BOB'S BURGERS — CHARACTER VIBES */
// //   { key: "bobs_burgers_style", label: "Bob’s Style", op: "bobs_burgers_style", prompt: "Bold outlines, flat colors, simple shading, off-white backdrop.", preview: "/presets/bobs.png", emoji: "🍔" },
// //   { key: "bobs_portrait", label: "Bob’s Portrait", op: "bobs_portrait", prompt: "Waist-up portrait; thick linework; limited palette; off-white background.", preview: "/presets/bobs_portrait.png", emoji: "🧑‍🍳" },
// //   { key: "bobs_tina", label: "Tina Vibe", op: "bobs_tina", prompt: "Teal tones, large round glasses silhouette, straight hair; Bob’s-style flat shading.", preview: "/presets/tina.png", emoji: "👓" },
// //   { key: "bobs_gene", label: "Gene Vibe", op: "bobs_gene", prompt: "Playful expression; blue/yellow tones; simple shading; Bob’s-style.", preview: "/presets/gene.png", emoji: "🎹" },
// //   { key: "bobs_louise", label: "Louise Vibe", op: "bobs_louise", prompt: "Pink/green accent (bunny-ears hat motif), cheeky grin; bold outline.", preview: "/presets/louise.png", emoji: "🐰" },
// //   { key: "bobs_linda", label: "Linda Vibe", op: "bobs_linda", prompt: "Red top tones, cat-eye glasses silhouette, cheerful expression; flat colors.", preview: "/presets/linda.png", emoji: "🍷" },
// //   { key: "bobs_teddy", label: "Teddy Vibe", op: "bobs_teddy", prompt: "Cap/hat silhouette, friendly handyman vibe, warm neutrals; simple shading.", preview: "/presets/teddy.png", emoji: "🧰" },

// //   /* BOB'S BURGERS — ENVIRONMENTS */
// //   { key: "bobs_restaurant_scene", label: "Diner", op: "bobs_restaurant_scene", prompt: "Checker floor, ketchup & mustard bottles, menu board; flat colors.", preview: "/presets/diner.png", emoji: "🍟" },
// //   { key: "bobs_counter", label: "Counter", op: "bobs_counter", prompt: "Laminate counter, swivel stools, griddle background, condiment caddies.", preview: "/presets/counter.png", emoji: "🍽️" },
// //   { key: "bobs_grill_line", label: "Grill Line", op: "bobs_grill_line", prompt: "Flat-top grill, spatulas, order tickets on string; warm kitchen hues.", preview: "/presets/grill.png", emoji: "🥓" },
// //   { key: "bobs_alley", label: "Back Alley", op: "bobs_alley", prompt: "Brick walls, dumpsters, posters; flat cartoon colors and shadows.", preview: "/presets/alley.png", emoji: "🧱" },
// //   { key: "bobs_ocean_pier", label: "Ocean Pier", op: "bobs_ocean_pier", prompt: "Boardwalk, ocean backdrop, carnival lights, simple booths; flat shading.", preview: "/presets/pier.png", emoji: "🎡" },
// //   { key: "bobs_arcade", label: "Arcade", op: "bobs_arcade", prompt: "Bright cabinets, simple neon shapes, checker patterns; playful vibe.", preview: "/presets/arcade.png", emoji: "🕹️" },
// //   { key: "bobs_school_hall", label: "School Hall", op: "bobs_school_hall", prompt: "Lockers, bulletin board, flat colors, minimal shadows.", preview: "/presets/school.png", emoji: "🏫" },
// //   { key: "bobs_apartment", label: "Apartment", op: "bobs_apartment", prompt: "Cozy living room, simple furniture, warm flat palette.", preview: "/presets/apartment.png", emoji: "🛋️" },
// //   { key: "bobs_night_diner", label: "Night Diner", op: "bobs_night_diner", prompt: "Cool exterior lighting, warm interior glow, window reflections.", preview: "/presets/night.png", emoji: "🌙" },
// //   { key: "bobs_holiday_lights", label: "Holiday Lights", op: "bobs_holiday_lights", prompt: "Main street with festive string lights, shop windows, flat colors.", preview: "/presets/holiday.png", emoji: "✨" },
// // ];

// // const LS_HISTORY_KEY = "nano_banana_history_v2";

// // export default function NanoBananaEditor() {
// //   const [file, setFile] = useState(null);
// //   const [idx, setIdx] = useState(0);
// //   const active = PRESETS[idx];

// //   const [operation, setOperation] = useState(active.op);
// //   const [prompt, setPrompt] = useState(active.prompt);

// //   const [loading, setLoading] = useState(false);
// //   const [resultB64, setResultB64] = useState(null);
// //   const [error, setError] = useState(null);

// //   const [isDragging, setIsDragging] = useState(false);

// //   // webcam
// //   const videoRef = useRef(null);
// //   const canvasRef = useRef(null);
// //   const [stream, setStream] = useState(null);
// //   const [camReady, setCamReady] = useState(false);

// //   // history
// //   const [history, setHistory] = useState([]);

// //   useEffect(() => {
// //     try {
// //       const raw = localStorage.getItem(LS_HISTORY_KEY);
// //       setHistory(raw ? JSON.parse(raw) : []);
// //     } catch {}
// //   }, []);

// //   useEffect(() => {
// //     const p = PRESETS[idx];
// //     setOperation(p.op);
// //     setPrompt(p.prompt);
// //   }, [idx]);

// //   useEffect(() => {
// //     const v = videoRef.current;
// //     if (!v) return;
// //     if (stream) {
// //       v.srcObject = stream;
// //       v.onloadedmetadata = () => {
// //         v.play().then(() => setCamReady(true)).catch(() => setCamReady(true));
// //       };
// //     } else {
// //       v.srcObject = null;
// //     }
// //     return () => { if (v) v.srcObject = null; };
// //   }, [stream]);

// //   const startCamera = async () => {
// //     setError(null);
// //     try {
// //       const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
// //       setStream(s);
// //     } catch {
// //       setError("Camera access denied or unavailable.");
// //     }
// //   };
// //   const stopCamera = () => {
// //     try { stream?.getTracks()?.forEach((t) => t.stop()); } catch {}
// //     setStream(null); setCamReady(false);
// //   };
// //   const capturePhoto = async () => {
// //     const v = videoRef.current, c = canvasRef.current;
// //     if (!v || !c) return;
// //     const w = v.videoWidth || 1080, h = v.videoHeight || 1080;
// //     c.width = w; c.height = h;
// //     c.getContext("2d").drawImage(v, 0, 0, w, h);
// //     const blob = await new Promise((r) => c.toBlob(r, "image/png"));
// //     if (!blob) return;
// //     setFile(new File([blob], "webcam-capture.png", { type: "image/png" }));
// //   };

// //   const pushHistory = (entry) => {
// //     try {
// //       const next = [entry, ...history].slice(0, 28);
// //       setHistory(next);
// //       localStorage.setItem(LS_HISTORY_KEY, JSON.stringify(next));
// //     } catch {}
// //   };
// //   const clearHistory = () => { setHistory([]); localStorage.removeItem(LS_HISTORY_KEY); };
// //   const reapplyHistory = (h) => {
// //     const i = PRESETS.findIndex((p) => p.key === h.presetKey);
// //     setIdx(i >= 0 ? i : 0);
// //     setOperation(h.operation);
// //     setPrompt(h.prompt);
// //     setResultB64(h.imageBase64);
// //   };

// //   async function handleSubmit(e) {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError(null);
// //     setResultB64(null);

// //     const form = new FormData();
// //     form.append("operation", operation);
// //     form.append("prompt", prompt);
// //     if (file) form.append("image", file);

// //     try {
// //       const res = await fetch("/api/nano", { method: "POST", body: form });
// //       const data = await res.json();
// //       if (!res.ok) throw new Error(data.error || "Request failed");
// //       setResultB64(data.imageBase64);
// //       pushHistory({
// //         id: `${Date.now()}`,
// //         ts: new Date().toISOString(),
// //         presetKey: active.key,
// //         label: active.label,
// //         operation,
// //         prompt,
// //         imageBase64: data.imageBase64,
// //       });
// //     } catch (err) {
// //       setError(err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   const btnBase = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
// //   const btnPrimary = `${btnBase} text-white`;
// //   const btnMuted = `${btnBase}`;

// //   return (
// //     <div className="mx-auto max-w-6xl px-4 py-10">
// //       {/* Header */}
// //       <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
// //         <div>
// //           <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: BOBS.red }}>
// //             Nano Banana Editor
// //           </h2>
// //           <p className="mt-1 text-sm" style={{ color: "#4b3a2b" }}>
// //             Tap a circle to pick a preset, tweak the prompt, and generate. History saves locally.
// //           </p>
// //         </div>
// //         <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs" style={{ border: `1px solid ${BOBS.brown}33`, background: "#fff7db", color: "#5b3a23" }}>
// //           <span className="h-2 w-2 rounded-full" style={{ background: BOBS.teal }} />
// //           Ready
// //         </div>
// //       </div>

// //       {/* Card */}
// //       <div className="rounded-2xl shadow-sm backdrop-blur" style={{ border: `1px solid ${BOBS.brown}33`, background: "#fffceb" }}>
// //         <div className="rounded-t-2xl p-1" style={{ background: `linear-gradient(90deg, ${BOBS.yellow}, ${BOBS.beige}, ${BOBS.red})` }} />
// //         <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">
// //           {/* LEFT: Webcam + Upload */}
// //           <section className="space-y-4">
// //             {/* Webcam */}
// //             <div className="rounded-xl p-4 shadow-sm" style={{ border: `1px solid ${BOBS.brown}33`, background: "#fffdf5" }}>
// //               <div className="mb-3 flex flex-wrap items-center gap-2">
// //                 {!stream ? (
// //                   <button onClick={startCamera} className={btnPrimary} style={{ background: BOBS.red }}>
// //                     Start Webcam
// //                   </button>
// //                 ) : (
// //                   <button onClick={stopCamera} className={btnMuted} style={{ background: "#fff5e7", color: "#3b2a1d", border: `1px solid ${BOBS.brown}33` }}>
// //                     Stop Webcam
// //                   </button>
// //                 )}
// //                 <button onClick={capturePhoto} disabled={!camReady} className={`${btnMuted} disabled:opacity-50`} style={{ background: "#fff5e7", color: "#3b2a1d", border: `1px solid ${BOBS.brown}33` }}>
// //                   Capture Photo
// //                 </button>
// //                 <span className="text-xs" style={{ color: "#6b4a2e" }}>
// //                   {camReady ? "Camera ready" : stream ? "Loading camera..." : "Camera off"}
// //                 </span>
// //               </div>

// //               <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
// //                 <div className="overflow-hidden rounded-lg" style={{ border: `1px solid ${BOBS.brown}33`, background: "#1a1a1a" }}>
// //                   <video ref={videoRef} playsInline muted style={{ width: "100%", height: "auto" }} />
// //                 </div>
// //                 <div className="rounded-lg p-2 text-center" style={{ border: `2px dashed ${BOBS.brown}55`, background: "#fff8e6" }}>
// //                   <p className="mb-2 text-xs font-medium" style={{ color: "#5b3a23" }}>Selected / Captured</p>
// //                   {file ? (
// //                     <img src={URL.createObjectURL(file)} alt="Selected" style={{ maxWidth: "100%", height: "auto" }} className="mx-auto rounded" />
// //                   ) : (
// //                     <div className="text-xs" style={{ color: "#8b6a4d" }}>No image selected yet.</div>
// //                   )}
// //                 </div>
// //               </div>

// //               <canvas ref={canvasRef} className="hidden" />
// //             </div>

// //             {/* Drag & drop */}
// //             <div
// //               className="group relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl p-6 text-center transition"
// //               style={{ border: `2px dashed ${isDragging ? BOBS.teal : `${BOBS.brown}55`}`, background: isDragging ? "#e7fbfb" : "#fff8e6" }}
// //               onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
// //               onDragLeave={() => setIsDragging(false)}
// //               onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f) setFile(f); }}
// //               onClick={() => document.getElementById("file-input-nano")?.click()}
// //             >
// //               <div className="rounded-full p-3 shadow-sm" style={{ background: "#fff1d0", color: "#5b3a23" }}>
// //                 <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M11 16h2V9l3 3l1.5-1.5L12 4L6.5 10.5L8 12l3-3v7Zm-6 4h14v-2H5v2Z"/></svg>
// //               </div>
// //               <p className="text-sm font-medium" style={{ color: "#4b3a2b" }}>Drag & drop an image</p>
// //               <p className="text-xs" style={{ color: "#7a5a3d" }}>PNG, JPG up to ~10MB</p>
// //               <input id="file-input-nano" type="file" accept="image/*" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
// //             </div>
// //           </section>

// //           {/* RIGHT: Circle picker + prompt + result */}
// //           <section className="space-y-4">
// //             {/* Circle preset picker */}
// //             <div className="rounded-xl p-4 shadow-sm" style={{ border: `1px solid ${BOBS.brown}33`, background: "#fffdf5" }}>
// //               <div className="mb-2 flex items-center justify-between">
// //                 <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#5b3a3a" }}>Presets</span>
// //                 <span className="truncate rounded-full px-2 py-1 text-xs" style={{ border: `1px solid ${BOBS.brown}33`, background: "#fff6e9", color: "#6b3e26" }}>{active.label}</span>
// //               </div>

// //               <div className="relative">
// //                 <div className="flex gap-4 overflow-x-auto pb-2">
// //                   {PRESETS.map((p, i) => {
// //                     const selected = i === idx;
// //                     return (
// //                       <button
// //                         key={p.key}
// //                         type="button"
// //                         onClick={() => setIdx(i)}
// //                         className="group flex w-20 min-w-20 flex-col items-center gap-2 focus:outline-none"
// //                         title={p.label}
// //                       >
// //                         <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border shadow-sm"
// //                              style={{ borderColor: selected ? BOBS.red : `${BOBS.brown}55`, boxShadow: selected ? `0 0 0 3px ${BOBS.red}33` : undefined, background: "#fffaf0" }}>
// //                           {p.preview ? (
// //                             <img src={p.preview} alt={p.label} className="h-full w-full object-cover" draggable={false} />
// //                           ) : (
// //                             <div className="flex h-full w-full items-center justify-center text-2xl"><span>{p.emoji || "✨"}</span></div>
// //                           )}
// //                         </div>
// //                         <div className="w-20 truncate text-center text-[11px] font-medium" style={{ color: selected ? BOBS.red : "#6b3e26" }}>
// //                           {p.label}
// //                         </div>
// //                       </button>
// //                     );
// //                   })}
// //                 </div>
// //               </div>

// //               {/* Prompt editor */}
// //               <div className="mt-4">
// //                 <label className="mb-1 block text-xs font-semibold uppercase tracking-wide" style={{ color: "#5b3a23" }}>
// //                   Extra prompt (optional)
// //                 </label>
// //                 <input
// //                   value={prompt}
// //                   onChange={(e) => setPrompt(e.target.value)}
// //                   placeholder="e.g., center the item, keep natural shadow"
// //                   className="w-full rounded-xl border px-3 py-2 text-sm shadow-sm outline-none ring-0 transition"
// //                   style={{ borderColor: `${BOBS.brown}55`, background: "#fffaf0", color: "#3b2a1d" }}
// //                 />
// //               </div>

// //               <div className="mt-4 flex items-center gap-2">
// //                 <button type="button" onClick={() => setFile(null)} className={btnMuted} style={{ background: "#fff5e7", color: "#3b2a1d", border: `1px solid ${BOBS.brown}33` }}>
// //                   Reset Image
// //                 </button>
// //                 <button type="submit" onClick={handleSubmit} disabled={loading} className={`${btnPrimary} disabled:opacity-50`} style={{ background: BOBS.red }}>
// //                   {loading ? (
// //                     <span className="inline-flex items-center gap-2">
// //                       <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
// //                       Processing…
// //                     </span>
// //                   ) : (
// //                     <span className="inline-flex items-center gap-2">Generate / Edit</span>
// //                   )}
// //                 </button>
// //               </div>

// //               {error && (
// //                 <div className="mt-3 rounded-lg px-3 py-2 text-sm" style={{ border: `1px solid ${BOBS.red}55`, background: "#ffe4e4", color: "#7a1f1f" }}>
// //                   {error}
// //                 </div>
// //               )}
// //             </div>

// //             {/* Result */}
// //             {resultB64 && (
// //               <div className="overflow-hidden rounded-xl shadow-sm" style={{ border: `1px solid ${BOBS.brown}33`, background: "#fffdf5" }}>
// //                 <div className="flex items-center justify-between px-4 py-2 text-sm" style={{ borderBottom: `1px solid ${BOBS.brown}33`, background: "#fff6e1" }}>
// //                   <span className="font-medium" style={{ color: "#4b3a2b" }}>Result</span>
// //                   <a className="inline-flex items-center gap-1 hover:underline" style={{ color: BOBS.teal }} href={`data:image/png;base64,${resultB64}`} download="nano-banana-result.png">
// //                     Download PNG
// //                     <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M5 20h14v-2H5v2Zm7-3l5-5h-3V4h-4v8H7l5 5Z"/></svg>
// //                   </a>
// //                 </div>
// //                 <div className="p-4">
// //                   <img src={`data:image/png;base64,${resultB64}`} alt="Result" style={{ maxWidth: "100%", height: "auto" }} className="mx-auto rounded-lg" />
// //                 </div>
// //               </div>
// //             )}
// //           </section>
// //         </div>
// //       </div>

// //       {/* History */}
// //       <div className="mt-8">
// //         <div className="mb-2 flex items-center justify-between">
// //           <h3 className="text-lg font-bold" style={{ color: "#4b3a2b" }}>History</h3>
// //           {history.length > 0 && (
// //             <button onClick={clearHistory} className={btnMuted} style={{ background: "#fff5e7", color: "#3b2a1d", border: `1px solid ${BOBS.brown}33` }}>
// //               Clear
// //             </button>
// //           )}
// //         </div>

// //         {history.length === 0 ? (
// //           <p className="text-sm" style={{ color: "#7a5a3d" }}>
// //             No history yet. Generate an image and it’ll be saved here.
// //           </p>
// //         ) : (
// //           <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
// //             {history.map((h) => (
// //               <div key={h.id} className="overflow-hidden rounded-xl" style={{ border: `1px solid ${BOBS.brown}33`, background: "#fffdf5" }}>
// //                 <div className="flex items-center justify-between px-3 py-1.5 text-[11px]" style={{ borderBottom: `1px solid ${BOBS.brown}33`, background: "#fff6e1", color: "#5b3a23" }}>
// //                   <span className="truncate">{h.label}</span>
// //                   <span className="rounded-full px-2 py-0.5" style={{ background: "#e8fff7", color: "#14665e" }}>
// //                     {new Date(h.ts).toLocaleTimeString()}
// //                   </span>
// //                 </div>
// //                 <div className="p-2">
// //                   <img src={`data:image/png;base64,${h.imageBase64}`} alt={h.label} style={{ width: "100%", height: "auto" }} className="rounded" />
// //                 </div>
// //                 <div className="flex items-center justify-between gap-2 px-3 pb-3">
// //                   <button onClick={() => reapplyHistory(h)} className="text-xs font-medium underline" style={{ color: BOBS.red }}>
// //                     Reapply
// //                   </button>
// //                   <span className="truncate text-[10px]" style={{ color: "#7a5a3d" }}>{h.operation}</span>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>

// //       <p className="mt-6 text-center text-xs" style={{ color: "#7a5a3d" }}>
// //         Tip: For transparent backgrounds, choose the <span className="font-semibold">Transparent</span> preset.
// //       </p>
// //     </div>
// //   );
// // }


// // app/components/NanoBananaEditor.jsx
// "use client";

// import { useEffect, useRef, useState } from "react";

// /* Bob's Burgers palette */
// const BOBS = {
//   yellow: "#F7E26D",
//   red: "#D62E2E",
//   teal: "#6BC5C5",
//   blue: "#6EC1E4",
//   brown: "#6B3E26",
//   beige: "#F1D3A2",
// };

// /**
//  * Circle previews:
//  * Put tiny images in /public/presets/*.png to match preview paths below.
//  * If a preview is missing, an emoji fallback is shown.
//  */
// const PRESETS = [
//   /* E-COMMERCE */
//   { key: "edit_white_bg", label: "Pure White", op: "edit_white_bg", prompt: "Pure #FFFFFF background; soft natural shadow; centered; square-friendly crop.", preview: "/presets/white.png", emoji: "⬜" },
//   { key: "remove_bg", label: "Transparent", op: "remove_bg", prompt: "Remove background; preserve edges; PNG with alpha transparency.", preview: "/presets/transparent.png", emoji: "🪄" },
//   { key: "photo_studio", label: "Studio Polish", op: "photo_studio", prompt: "Soft three-point lighting; minimal noise; subtle ground shadow.", preview: "/presets/studio.png", emoji: "💡" },
//   { key: "square_1080", label: "Square 1080", op: "square_1080", prompt: "Square 1080x1080; centered; safe margins; crisp retail finish.", preview: "/presets/square.png", emoji: "🔲" },
//   { key: "reflection_floor", label: "Reflection", op: "reflection_floor", prompt: "Glossy floor reflection with soft falloff; pristine studio feel.", preview: "/presets/reflection.png", emoji: "🪞" },
//   { key: "ghost_mannequin", label: "Ghost Mannequin", op: "ghost_mannequin", prompt: "Remove mannequin/stand; realistic inner-neck shading; catalog-ready.", preview: "/presets/ghost.png", emoji: "👕" },
//   { key: "ecom_amazon", label: "Amazon Main", op: "ecom_amazon", prompt: "Amazon main image: pure white background; product fills ≥85%; no text/props.", preview: "/presets/amazon.png", emoji: "🛒" },
//   { key: "ecom_ebay", label: "eBay Main", op: "ecom_ebay", prompt: "eBay main image: clean white/light gray BG, natural shadow, accurate color.", preview: "/presets/ebay.png", emoji: "📦" },
//   { key: "ecom_color_bg", label: "Pastel Backdrop", op: "ecom_color_bg", prompt: "Soft pastel gradient backdrop (mint/teal/pink) with gentle shadows.", preview: "/presets/pastel.png", emoji: "🌈" },
//   { key: "ecom_lifestyle", label: "Lifestyle Set", op: "ecom_lifestyle", prompt: "Simple lifestyle: wood table, daylight window, realistic soft shadows.", preview: "/presets/lifestyle.png", emoji: "🏠" },
//   { key: "ecom_topdown", label: "Top-Down Flat-lay", op: "ecom_topdown", prompt: "Top-down flat-lay; neat layout; even lighting; soft shadows.", preview: "/presets/flatlay.png", emoji: "🧺" },
//   { key: "ecom_packshot", label: "Packshot", op: "ecom_packshot", prompt: "Straight-on packshot; centered; label readable; subtle shadow.", preview: "/presets/packshot.png", emoji: "🎁" },

//   /* BOB'S BURGERS — CHARACTER VIBES */
//   { key: "bobs_burgers_style", label: "Bob’s Style", op: "bobs_burgers_style", prompt: "Bold outlines, flat colors, simple shading, off-white backdrop.", preview: "/presets/bobs.png", emoji: "🍔" },
//   { key: "bobs_portrait", label: "Bob’s Portrait", op: "bobs_portrait", prompt: "Waist-up portrait; thick linework; limited palette; off-white background.", preview: "/presets/bobs_portrait.png", emoji: "🧑‍🍳" },
//   { key: "bobs_tina", label: "Tina Vibe", op: "bobs_tina", prompt: "Teal tones, large round glasses silhouette, straight hair; Bob’s-style flat shading.", preview: "/presets/tina.png", emoji: "👓" },
//   { key: "bobs_gene", label: "Gene Vibe", op: "bobs_gene", prompt: "Playful expression; blue/yellow tones; simple shading; Bob’s-style.", preview: "/presets/gene.png", emoji: "🎹" },
//   { key: "bobs_louise", label: "Louise Vibe", op: "bobs_louise", prompt: "Pink/green accent (bunny-ears hat motif), cheeky grin; bold outline.", preview: "/presets/louise.png", emoji: "🐰" },
//   { key: "bobs_linda", label: "Linda Vibe", op: "bobs_linda", prompt: "Red top tones, cat-eye glasses silhouette, cheerful expression; flat colors.", preview: "/presets/linda.png", emoji: "🍷" },
//   { key: "bobs_teddy", label: "Teddy Vibe", op: "bobs_teddy", prompt: "Cap/hat silhouette, friendly handyman vibe, warm neutrals; simple shading.", preview: "/presets/teddy.png", emoji: "🧰" },

//   /* BOB'S BURGERS — ENVIRONMENTS */
//   { key: "bobs_restaurant_scene", label: "Diner", op: "bobs_restaurant_scene", prompt: "Checker floor, ketchup & mustard bottles, menu board; flat colors.", preview: "/presets/diner.png", emoji: "🍟" },
//   { key: "bobs_counter", label: "Counter", op: "bobs_counter", prompt: "Laminate counter, swivel stools, griddle background, condiment caddies.", preview: "/presets/counter.png", emoji: "🍽️" },
//   { key: "bobs_grill_line", label: "Grill Line", op: "bobs_grill_line", prompt: "Flat-top grill, spatulas, order tickets on string; warm kitchen hues.", preview: "/presets/grill.png", emoji: "🥓" },
//   { key: "bobs_alley", label: "Back Alley", op: "bobs_alley", prompt: "Brick walls, dumpsters, posters; flat cartoon colors and shadows.", preview: "/presets/alley.png", emoji: "🧱" },
//   { key: "bobs_ocean_pier", label: "Ocean Pier", op: "bobs_ocean_pier", prompt: "Boardwalk, ocean backdrop, carnival lights, simple booths; flat shading.", preview: "/presets/pier.png", emoji: "🎡" },
//   { key: "bobs_arcade", label: "Arcade", op: "bobs_arcade", prompt: "Bright cabinets, simple neon shapes, checker patterns; playful vibe.", preview: "/presets/arcade.png", emoji: "🕹️" },
//   { key: "bobs_school_hall", label: "School Hall", op: "bobs_school_hall", prompt: "Lockers, bulletin board, flat colors, minimal shadows.", preview: "/presets/school.png", emoji: "🏫" },
//   { key: "bobs_apartment", label: "Apartment", op: "bobs_apartment", prompt: "Cozy living room, simple furniture, warm flat palette.", preview: "/presets/apartment.png", emoji: "🛋️" },
//   { key: "bobs_night_diner", label: "Night Diner", op: "bobs_night_diner", prompt: "Cool exterior lighting, warm interior glow, window reflections.", preview: "/presets/night.png", emoji: "🌙" },
//   { key: "bobs_holiday_lights", label: "Holiday Lights", op: "bobs_holiday_lights", prompt: "Main street with festive string lights, shop windows, flat colors.", preview: "/presets/holiday.png", emoji: "✨" },
// ];

// const LS_HISTORY_KEY = "nano_banana_history_v2";

// export default function NanoBananaEditor() {
//   const [file, setFile] = useState(null);
//   const [idx, setIdx] = useState(0);
//   const active = PRESETS[idx];

//   const [operation, setOperation] = useState(active.op);
//   const [prompt, setPrompt] = useState(active.prompt);

//   const [loading, setLoading] = useState(false);
//   const [resultB64, setResultB64] = useState(null);
//   const [error, setError] = useState(null);

//   const [isDragging, setIsDragging] = useState(false);

//   // webcam
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [stream, setStream] = useState(null);
//   const [camReady, setCamReady] = useState(false);

//   // history
//   const [history, setHistory] = useState([]);

//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem(LS_HISTORY_KEY);
//       setHistory(raw ? JSON.parse(raw) : []);
//     } catch {}
//   }, []);

//   useEffect(() => {
//     const p = PRESETS[idx];
//     setOperation(p.op);
//     setPrompt(p.prompt);
//   }, [idx]);

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

//   const startCamera = async () => {
//     setError(null);
//     try {
//       const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
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
//     setFile(new File([blob], "webcam-capture.png", { type: "image/png" }));
//   };

//   const pushHistory = (entry) => {
//     try {
//       const next = [entry, ...history].slice(0, 28);
//       setHistory(next);
//       localStorage.setItem(LS_HISTORY_KEY, JSON.stringify(next));
//     } catch {}
//   };
//   const clearHistory = () => { setHistory([]); localStorage.removeItem(LS_HISTORY_KEY); };
//   const reapplyHistory = (h) => {
//     const i = PRESETS.findIndex((p) => p.key === h.presetKey);
//     setIdx(i >= 0 ? i : 0);
//     setOperation(h.operation);
//     setPrompt(h.prompt);
//     setResultB64(h.imageBase64);
//   };

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setResultB64(null);

//     const form = new FormData();
//     form.append("operation", operation);
//     form.append("prompt", prompt);
//     if (file) form.append("image", file);

//     try {
//       const res = await fetch("/api/nano", { method: "POST", body: form });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Request failed");
//       setResultB64(data.imageBase64);
//       pushHistory({
//         id: `${Date.now()}`,
//         ts: new Date().toISOString(),
//         presetKey: active.key,
//         label: active.label,
//         operation,
//         prompt,
//         imageBase64: data.imageBase64,
//       });
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const btnBase =
//     "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
//   const btnPrimary = `${btnBase} text-white`;
//   const btnMuted = `${btnBase}`;

//   return (
//     <div className="mx-auto w-full max-w-[1152px] px-3 sm:px-4 lg:px-6 py-8 sm:py-10">
//       {/* Header */}
//       <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
//         <div>
//           <h2 className="text-[1.25rem] sm:text-2xl font-extrabold tracking-tight" style={{ color: BOBS.red }}>
//             Nano Banana Editor
//           </h2>
//           <p className="mt-1 text-sm sm:text-[0.95rem]" style={{ color: "#4b3a2b" }}>
//             Tap a circle to pick a preset, tweak the prompt, and generate. History saves locally.
//           </p>
//         </div>
//         <div
//           className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs"
//           style={{ border: `1px solid ${BOBS.brown}33`, background: "#fff7db", color: "#5b3a23" }}
//         >
//           <span className="h-2 w-2 rounded-full" style={{ background: BOBS.teal }} />
//           Ready
//         </div>
//       </div>

//       {/* Card */}
//       <div className="rounded-2xl shadow-sm backdrop-blur" style={{ border: `1px solid ${BOBS.brown}33`, background: "#fffceb" }}>
//         <div className="rounded-t-2xl p-1" style={{ background: `linear-gradient(90deg, ${BOBS.yellow}, ${BOBS.beige}, ${BOBS.red})` }} />
//         <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 lg:grid-cols-2">
//           {/* LEFT: Webcam + Upload */}
//           <section className="space-y-4">
//             {/* Webcam */}
//             <div className="rounded-xl p-4 shadow-sm" style={{ border: `1px solid ${BOBS.brown}33`, background: "#fffdf5" }}>
//               <div className="mb-3 flex flex-wrap items-center gap-2">
//                 {!stream ? (
//                   <button onClick={startCamera} className={btnPrimary} style={{ background: BOBS.red }}>
//                     Start Webcam
//                   </button>
//                 ) : (
//                   <button onClick={stopCamera} className={btnMuted} style={{ background: "#fff5e7", color: "#3b2a1d", border: `1px solid ${BOBS.brown}33` }}>
//                     Stop Webcam
//                   </button>
//                 )}
//                 <button
//                   onClick={capturePhoto}
//                   disabled={!camReady}
//                   className={`${btnMuted} disabled:opacity-50`}
//                   style={{ background: "#fff5e7", color: "#3b2a1d", border: `1px solid ${BOBS.brown}33` }}
//                 >
//                   Capture Photo
//                 </button>
//                 <span className="text-xs" style={{ color: "#6b4a2e" }}>
//                   {camReady ? "Camera ready" : stream ? "Loading camera..." : "Camera off"}
//                 </span>
//               </div>

//               <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//                 {/* Video ratio wrapper to avoid distortion on phones */}
//                 <div className="overflow-hidden rounded-lg" style={{ border: `1px solid ${BOBS.brown}33`, background: "#1a1a1a" }}>
//                   <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
//                     <video
//                       ref={videoRef}
//                       playsInline
//                       muted
//                       className="absolute inset-0 h-full w-full object-contain"
//                     />
//                   </div>
//                 </div>

//                 {/* Selected / Captured preview */}
//                 <div className="rounded-lg p-2 text-center" style={{ border: `2px dashed ${BOBS.brown}55`, background: "#fff8e6" }}>
//                   <p className="mb-2 text-xs font-medium" style={{ color: "#5b3a23" }}>Selected / Captured</p>
//                   {file ? (
//                     <img
//                       src={URL.createObjectURL(file)}
//                       alt="Selected"
//                       loading="lazy"
//                       decoding="async"
//                       className="mx-auto h-auto w-full max-h-[45vh] rounded object-contain"
//                     />
//                   ) : (
//                     <div className="text-xs" style={{ color: "#8b6a4d" }}>No image selected yet.</div>
//                   )}
//                 </div>
//               </div>

//               <canvas ref={canvasRef} className="hidden" />
//             </div>

//             {/* Drag & drop */}
//             <div
//               className="group relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl p-6 text-center transition"
//               style={{ border: `2px dashed ${isDragging ? BOBS.teal : `${BOBS.brown}55`}`, background: isDragging ? "#e7fbfb" : "#fff8e6" }}
//               onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
//               onDragLeave={() => setIsDragging(false)}
//               onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f) setFile(f); }}
//               onClick={() => document.getElementById("file-input-nano")?.click()}
//             >
//               <div className="rounded-full p-3 shadow-sm" style={{ background: "#fff1d0", color: "#5b3a23" }}>
//                 <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M11 16h2V9l3 3l1.5-1.5L12 4L6.5 10.5L8 12l3-3v7Zm-6 4h14v-2H5v2Z"/></svg>
//               </div>
//               <p className="text-sm sm:text-base font-medium" style={{ color: "#4b3a2b" }}>Drag &amp; drop an image</p>
//               <p className="text-xs" style={{ color: "#7a5a3d" }}>PNG, JPG up to ~10MB</p>
//               <input id="file-input-nano" type="file" accept="image/*" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
//             </div>
//           </section>

//           {/* RIGHT: Circle picker + prompt + result */}
//           <section className="space-y-4">
//             {/* Circle preset picker */}
//             <div className="rounded-xl p-4 shadow-sm" style={{ border: `1px solid ${BOBS.brown}33`, background: "#fffdf5" }}>
//               <div className="mb-2 flex items-center justify-between gap-2">
//                 <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#5b3a3a" }}>Presets</span>
//                 <span className="truncate rounded-full px-2 py-1 text-xs" style={{ border: `1px solid ${BOBS.brown}33`, background: "#fff6e9", color: "#6b3e26" }}>{active.label}</span>
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
//                       title={p.label}
//                     >
//                       <div
//                         className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border shadow-sm"
//                         style={{
//                           borderColor: selected ? BOBS.red : `${BOBS.brown}55`,
//                           boxShadow: selected ? `0 0 0 3px ${BOBS.red}33` : undefined,
//                           background: "#fffaf0",
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
//                           <div className="flex h-full w-full items-center justify-center text-2xl"><span>{p.emoji || "✨"}</span></div>
//                         )}
//                       </div>
//                       <div className="w-20 truncate text-center text-[11px] font-medium" style={{ color: selected ? BOBS.red : "#6b3e26" }}>
//                         {p.label}
//                       </div>
//                     </button>
//                   );
//                 })}
//               </div>

//               {/* Prompt editor */}
//               <div className="mt-4">
//                 <label className="mb-1 block text-xs font-semibold uppercase tracking-wide" style={{ color: "#5b3a23" }}>
//                   Extra prompt (optional)
//                 </label>
//                 <input
//                   value={prompt}
//                   onChange={(e) => setPrompt(e.target.value)}
//                   placeholder="e.g., center the item, keep natural shadow"
//                   className="w-full rounded-xl border px-3 py-2 text-sm shadow-sm outline-none"
//                   style={{ borderColor: `${BOBS.brown}55`, background: "#fffaf0", color: "#3b2a1d" }}
//                 />
//               </div>

//               <div className="mt-4 flex flex-wrap items-center gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setFile(null)}
//                   className={btnMuted}
//                   style={{ background: "#fff5e7", color: "#3b2a1d", border: `1px solid ${BOBS.brown}33` }}
//                 >
//                   Reset Image
//                 </button>
//                 <button
//                   type="submit"
//                   onClick={handleSubmit}
//                   disabled={loading}
//                   className={`${btnPrimary} disabled:opacity-50`}
//                   style={{ background: BOBS.red }}
//                 >
//                   {loading ? (
//                     <span className="inline-flex items-center gap-2">
//                       <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
//                       Processing…
//                     </span>
//                   ) : (
//                     <span className="inline-flex items-center gap-2">Generate / Edit</span>
//                   )}
//                 </button>
//               </div>

//               {error && (
//                 <div className="mt-3 rounded-lg px-3 py-2 text-sm" style={{ border: `1px solid ${BOBS.red}55`, background: "#ffe4e4", color: "#7a1f1f" }}>
//                   {error}
//                 </div>
//               )}
//             </div>

//             {/* Result */}
//             {resultB64 && (
//               <div className="overflow-hidden rounded-xl shadow-sm" style={{ border: `1px solid ${BOBS.brown}33`, background: "#fffdf5" }}>
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-2 text-sm" style={{ borderBottom: `1px solid ${BOBS.brown}33`, background: "#fff6e1" }}>
//                   <span className="font-medium" style={{ color: "#4b3a2b" }}>Result</span>
//                   <a
//                     className="inline-flex items-center gap-1 hover:underline"
//                     style={{ color: BOBS.teal }}
//                     href={`data:image/png;base64,${resultB64}`}
//                     download="nano-banana-result.png"
//                   >
//                     Download PNG
//                     <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M5 20h14v-2H5v2Zm7-3l5-5h-3V4h-4v8H7l5 5Z"/></svg>
//                   </a>
//                 </div>
//                 <div className="p-4">
//                   <div className="relative mx-auto w-full" style={{ maxWidth: 1200 }}>
//                     <img
//                       src={`data:image/png;base64,${resultB64}`}
//                       alt="Result"
//                       loading="lazy"
//                       decoding="async"
//                       className="mx-auto h-auto w-full max-h-[70vh] rounded-lg object-contain"
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}
//           </section>
//         </div>
//       </div>

//       {/* History */}
//       <div className="mt-8">
//         <div className="mb-2 flex items-center justify-between">
//           <h3 className="text-lg font-bold" style={{ color: "#4b3a2b" }}>History</h3>
//           {history.length > 0 && (
//             <button onClick={clearHistory} className={btnMuted} style={{ background: "#fff5e7", color: "#3b2a1d", border: `1px solid ${BOBS.brown}33` }}>
//               Clear
//             </button>
//           )}
//         </div>

//         {history.length === 0 ? (
//           <p className="text-sm" style={{ color: "#7a5a3d" }}>
//             No history yet. Generate an image and it’ll be saved here.
//           </p>
//         ) : (
//           <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
//             {history.map((h) => (
//               <div key={h.id} className="overflow-hidden rounded-xl" style={{ border: `1px solid ${BOBS.brown}33`, background: "#fffdf5" }}>
//                 <div className="flex items-center justify-between px-3 py-1.5 text-[11px]" style={{ borderBottom: `1px solid ${BOBS.brown}33`, background: "#fff6e1", color: "#5b3a23" }}>
//                   <span className="truncate">{h.label}</span>
//                   <span className="rounded-full px-2 py-0.5" style={{ background: "#e8fff7", color: "#14665e" }}>
//                     {new Date(h.ts).toLocaleTimeString()}
//                   </span>
//                 </div>
//                 <div className="p-2">
//                   <img
//                     src={`data:image/png;base64,${h.imageBase64}`}
//                     alt={h.label}
//                     loading="lazy"
//                     decoding="async"
//                     className="h-auto w-full rounded object-contain"
//                   />
//                 </div>
//                 <div className="flex items-center justify-between gap-2 px-3 pb-3">
//                   <button onClick={() => reapplyHistory(h)} className="text-xs font-medium underline" style={{ color: BOBS.red }}>
//                     Reapply
//                   </button>
//                   <span className="truncate text-[10px]" style={{ color: "#7a5a3d" }}>{h.operation}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <p className="mt-6 text-center text-xs" style={{ color: "#7a5a3d" }}>
//         Tip: For transparent backgrounds, choose the <span className="font-semibold">Transparent</span> preset.
//       </p>
//     </div>
//   );
// }


// app/components/NanoBananaEditor.jsx
"use client";

import { useEffect, useRef, useState } from "react";

/* Bob's Burgers palette */
const BOBS = {
  yellow: "#F7E26D",
  red: "#D62E2E",
  teal: "#6BC5C5",
  blue: "#6EC1E4",
  brown: "#6B3E26",
  beige: "#F1D3A2",
};

/**
 * Circle previews:
 * Put tiny images in /public/presets/*.png to match preview paths below.
 * If a preview is missing, an emoji fallback is shown.
 */
const PRESETS = [
  /* E-COMMERCE */
  { key: "edit_white_bg", label: "Pure White", op: "edit_white_bg", prompt: "Pure #FFFFFF background; soft natural shadow; centered; square-friendly crop.", preview: "/presets/white.png", emoji: "⬜" },
  { key: "remove_bg", label: "Transparent", op: "remove_bg", prompt: "Remove background; preserve edges; PNG with alpha transparency.", preview: "/presets/transparent.png", emoji: "🪄" },
  { key: "photo_studio", label: "Studio Polish", op: "photo_studio", prompt: "Soft three-point lighting; minimal noise; subtle ground shadow.", preview: "/presets/studio.png", emoji: "💡" },
  { key: "square_1080", label: "Square 1080", op: "square_1080", prompt: "Square 1080x1080; centered; safe margins; crisp retail finish.", preview: "/presets/square.png", emoji: "🔲" },
  { key: "reflection_floor", label: "Reflection", op: "reflection_floor", prompt: "Glossy floor reflection with soft falloff; pristine studio feel.", preview: "/presets/reflection.png", emoji: "🪞" },
  { key: "ghost_mannequin", label: "Ghost Mannequin", op: "ghost_mannequin", prompt: "Remove mannequin/stand; realistic inner-neck shading; catalog-ready.", preview: "/presets/ghost.png", emoji: "👕" },
  { key: "ecom_amazon", label: "Amazon Main", op: "ecom_amazon", prompt: "Amazon main image: pure white background; product fills ≥85%; no text/props.", preview: "/presets/amazon.png", emoji: "🛒" },
  { key: "ecom_ebay", label: "eBay Main", op: "ecom_ebay", prompt: "eBay main image: clean white/light gray BG, natural shadow, accurate color.", preview: "/presets/ebay.png", emoji: "📦" },
  { key: "ecom_color_bg", label: "Pastel Backdrop", op: "ecom_color_bg", prompt: "Soft pastel gradient backdrop (mint/teal/pink) with gentle shadows.", preview: "/presets/pastel.png", emoji: "🌈" },
  { key: "ecom_lifestyle", label: "Lifestyle Set", op: "ecom_lifestyle", prompt: "Simple lifestyle: wood table, daylight window, realistic soft shadows.", preview: "/presets/lifestyle.png", emoji: "🏠" },
  { key: "ecom_topdown", label: "Top-Down Flat-lay", op: "ecom_topdown", prompt: "Top-down flat-lay; neat layout; even lighting; soft shadows.", preview: "/presets/flatlay.png", emoji: "🧺" },
  { key: "ecom_packshot", label: "Packshot", op: "ecom_packshot", prompt: "Straight-on packshot; centered; label readable; subtle shadow.", preview: "/presets/packshot.png", emoji: "🎁" },

  /* BOB'S BURGERS — CHARACTER VIBES */
  { key: "bobs_burgers_style", label: "Bob’s Style", op: "bobs_burgers_style", prompt: "Bold outlines, flat colors, simple shading, off-white backdrop.", preview: "/presets/bobs.png", emoji: "🍔" },
  { key: "bobs_portrait", label: "Bob’s Portrait", op: "bobs_portrait", prompt: "Waist-up portrait; thick linework; limited palette; off-white background.", preview: "/presets/bobs_portrait.png", emoji: "🧑‍🍳" },
  { key: "bobs_tina", label: "Tina Vibe", op: "bobs_tina", prompt: "Teal tones, large round glasses silhouette, straight hair; Bob’s-style flat shading.", preview: "/presets/tina.png", emoji: "👓" },
  { key: "bobs_gene", label: "Gene Vibe", op: "bobs_gene", prompt: "Playful expression; blue/yellow tones; simple shading; Bob’s-style.", preview: "/presets/gene.png", emoji: "🎹" },
  { key: "bobs_louise", label: "Louise Vibe", op: "bobs_louise", prompt: "Pink/green accent (bunny-ears hat motif), cheeky grin; bold outline.", preview: "/presets/louise.png", emoji: "🐰" },
  { key: "bobs_linda", label: "Linda Vibe", op: "bobs_linda", prompt: "Red top tones, cat-eye glasses silhouette, cheerful expression; flat colors.", preview: "/presets/linda.png", emoji: "🍷" },
  { key: "bobs_teddy", label: "Teddy Vibe", op: "bobs_teddy", prompt: "Cap/hat silhouette, friendly handyman vibe, warm neutrals; simple shading.", preview: "/presets/teddy.png", emoji: "🧰" },

  /* BOB'S BURGERS — ENVIRONMENTS */
  { key: "bobs_restaurant_scene", label: "Diner", op: "bobs_restaurant_scene", prompt: "Checker floor, ketchup & mustard bottles, menu board; flat colors.", preview: "/presets/diner.png", emoji: "🍟" },
  { key: "bobs_counter", label: "Counter", op: "bobs_counter", prompt: "Laminate counter, swivel stools, griddle background, condiment caddies.", preview: "/presets/counter.png", emoji: "🍽️" },
  { key: "bobs_grill_line", label: "Grill Line", op: "bobs_grill_line", prompt: "Flat-top grill, spatulas, order tickets on string; warm kitchen hues.", preview: "/presets/grill.png", emoji: "🥓" },
  { key: "bobs_alley", label: "Back Alley", op: "bobs_alley", prompt: "Brick walls, dumpsters, posters; flat cartoon colors and shadows.", preview: "/presets/alley.png", emoji: "🧱" },
  { key: "bobs_ocean_pier", label: "Ocean Pier", op: "bobs_ocean_pier", prompt: "Boardwalk, ocean backdrop, carnival lights, simple booths; flat shading.", preview: "/presets/pier.png", emoji: "🎡" },
  { key: "bobs_arcade", label: "Arcade", op: "bobs_arcade", prompt: "Bright cabinets, simple neon shapes, checker patterns; playful vibe.", preview: "/presets/arcade.png", emoji: "🕹️" },
  { key: "bobs_school_hall", label: "School Hall", op: "bobs_school_hall", prompt: "Lockers, bulletin board, flat colors, minimal shadows.", preview: "/presets/school.png", emoji: "🏫" },
  { key: "bobs_apartment", label: "Apartment", op: "bobs_apartment", prompt: "Cozy living room, simple furniture, warm flat palette.", preview: "/presets/apartment.png", emoji: "🛋️" },
  { key: "bobs_night_diner", label: "Night Diner", op: "bobs_night_diner", prompt: "Cool exterior lighting, warm interior glow, window reflections.", preview: "/presets/night.png", emoji: "🌙" },
  { key: "bobs_holiday_lights", label: "Holiday Lights", op: "bobs_holiday_lights", prompt: "Main street with festive string lights, shop windows, flat colors.", preview: "/presets/holiday.png", emoji: "✨" },
];

const LS_HISTORY_KEY = "nano_banana_history_v2";

export default function NanoBananaEditor() {
  const [file, setFile] = useState(null);
  const [idx, setIdx] = useState(0);
  const active = PRESETS[idx];

  const [operation, setOperation] = useState(active.op);
  const [prompt, setPrompt] = useState(active.prompt);

  const [loading, setLoading] = useState(false);
  const [resultB64, setResultB64] = useState(null);
  const [error, setError] = useState(null);

  const [isDragging, setIsDragging] = useState(false);

  // webcam
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [camReady, setCamReady] = useState(false);

  // NEW: full-screen camera overlay
  const [camFullscreen, setCamFullscreen] = useState(false);

  // history
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_HISTORY_KEY);
      setHistory(raw ? JSON.parse(raw) : []);
    } catch {}
  }, []);

  useEffect(() => {
    const p = PRESETS[idx];
    setOperation(p.op);
    setPrompt(p.prompt);
  }, [idx]);

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
      const res = await fetch("/api/nano", { method: "POST", body: form });
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

  const btnBase =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  const btnPrimary = `${btnBase} text-white`;
  const btnMuted = `${btnBase}`;

  return (
    <div className="mx-auto w-full max-w-[1152px] px-3 sm:px-4 lg:px-6 py-8 sm:py-10">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-[1.25rem] sm:text-2xl font-extrabold tracking-tight" style={{ color: BOBS.red }}>
            Nano Banana Editor
          </h2>
          <p className="mt-1 text-sm sm:text-[0.95rem]" style={{ color: "#4b3a2b" }}>
            Tap a circle to pick a preset, tweak the prompt, and generate. History saves locally.
          </p>
        </div>
        <div
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs"
          style={{ border: `1px solid ${BOBS.brown}33`, background: "#fff7db", color: "#5b3a23" }}
        >
          <span className="h-2 w-2 rounded-full" style={{ background: BOBS.teal }} />
          Ready
        </div>
      </div>

      {/* Card */}
      <div className="rounded-2xl shadow-sm backdrop-blur" style={{ border: `1px solid ${BOBS.brown}33`, background: "#fffceb" }}>
        <div className="rounded-t-2xl p-1" style={{ background: `linear-gradient(90deg, ${BOBS.yellow}, ${BOBS.beige}, ${BOBS.red})` }} />
        <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 lg:grid-cols-2">
          {/* LEFT: Webcam + Upload */}
          <section className="space-y-4">
            {/* Webcam */}
            <div className="rounded-xl p-4 shadow-sm" style={{ border: `1px solid ${BOBS.brown}33`, background: "#fffdf5" }}>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {!stream ? (
                  <button onClick={startCamera} className={btnPrimary} style={{ background: BOBS.red }}>
                    Start Webcam
                  </button>
                ) : (
                  <button onClick={stopCamera} className={btnMuted} style={{ background: "#fff5e7", color: "#3b2a1d", border: `1px solid ${BOBS.brown}33` }}>
                    Stop Webcam
                  </button>
                )}
                <button
                  onClick={capturePhoto}
                  disabled={!camReady}
                  className={`${btnMuted} disabled:opacity-50`}
                  style={{ background: "#fff5e7", color: "#3b2a1d", border: `1px solid ${BOBS.brown}33` }}
                >
                  Capture Photo
                </button>

                {/* NEW: Full-screen camera trigger (great on mobile) */}
                <button
                  onClick={openFullscreenCamera}
                  className={btnPrimary}
                  style={{ background: "#111827" }}
                >
                  Full-screen Camera
                </button>

                <span className="text-xs" style={{ color: "#6b4a2e" }}>
                  {camReady ? "Camera ready" : stream ? "Loading camera..." : "Camera off"}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Video ratio wrapper to avoid distortion on phones */}
                <div className="overflow-hidden rounded-lg" style={{ border: `1px solid ${BOBS.brown}33`, background: "#1a1a1a" }}>
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

                {/* Selected / Captured preview */}
                <div className="rounded-lg p-2 text-center" style={{ border: `2px dashed ${BOBS.brown}55`, background: "#fff8e6" }}>
                  <p className="mb-2 text-xs font-medium" style={{ color: "#5b3a23" }}>Selected / Captured</p>
                  {file ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Selected"
                      loading="lazy"
                      decoding="async"
                      className="mx-auto h-auto w-full max-h-[45vh] rounded object-contain"
                    />
                  ) : (
                    <div className="text-xs" style={{ color: "#8b6a4d" }}>No image selected yet.</div>
                  )}
                </div>
              </div>

              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Drag & drop */}
            <div
              className="group relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl p-6 text-center transition"
              style={{ border: `2px dashed ${isDragging ? BOBS.teal : `${BOBS.brown}55`}`, background: isDragging ? "#e7fbfb" : "#fff8e6" }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f) setFile(f); }}
              onClick={() => document.getElementById("file-input-nano")?.click()}
            >
              <div className="rounded-full p-3 shadow-sm" style={{ background: "#fff1d0", color: "#5b3a23" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M11 16h2V9l3 3l1.5-1.5L12 4L6.5 10.5L8 12l3-3v7Zm-6 4h14v-2H5v2Z"/></svg>
              </div>
              <p className="text-sm sm:text-base font-medium" style={{ color: "#4b3a2b" }}>Drag &amp; drop an image</p>
              <p className="text-xs" style={{ color: "#7a5a3d" }}>PNG, JPG up to ~10MB</p>
              <input id="file-input-nano" type="file" accept="image/*" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </div>
          </section>

          {/* RIGHT: Circle picker + prompt + result */}
          <section className="space-y-4">
            {/* Circle preset picker */}
            <div className="rounded-xl p-4 shadow-sm" style={{ border: `1px solid ${BOBS.brown}33`, background: "#fffdf5" }}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#5b3a3a" }}>Presets</span>
                <span className="truncate rounded-full px-2 py-1 text-xs" style={{ border: `1px solid ${BOBS.brown}33`, background: "#fff6e9", color: "#6b3e26" }}>{active.label}</span>
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
                      title={p.label}
                    >
                      <div
                        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border shadow-sm"
                        style={{
                          borderColor: selected ? BOBS.red : `${BOBS.brown}55`,
                          boxShadow: selected ? `0 0 0 3px ${BOBS.red}33` : undefined,
                          background: "#fffaf0",
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
                          <div className="flex h-full w-full items-center justify-center text-2xl"><span>{p.emoji || "✨"}</span></div>
                        )}
                      </div>
                      <div className="w-20 truncate text-center text-[11px] font-medium" style={{ color: selected ? BOBS.red : "#6b3e26" }}>
                        {p.label}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Prompt editor */}
              <div className="mt-4">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide" style={{ color: "#5b3a23" }}>
                  Extra prompt (optional)
                </label>
                <input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., center the item, keep natural shadow"
                  className="w-full rounded-xl border px-3 py-2 text-sm shadow-sm outline-none"
                  style={{ borderColor: `${BOBS.brown}55`, background: "#fffaf0", color: "#3b2a1d" }}
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className={btnMuted}
                  style={{ background: "#fff5e7", color: "#3b2a1d", border: `1px solid ${BOBS.brown}33` }}
                >
                  Reset Image
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`${btnPrimary} disabled:opacity-50`}
                  style={{ background: BOBS.red }}
                >
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
                <div className="mt-3 rounded-lg px-3 py-2 text-sm" style={{ border: `1px solid ${BOBS.red}55`, background: "#ffe4e4", color: "#7a1f1f" }}>
                  {error}
                </div>
              )}
            </div>

            {/* Result */}
            {resultB64 && (
              <div className="overflow-hidden rounded-xl shadow-sm" style={{ border: `1px solid ${BOBS.brown}33`, background: "#fffdf5" }}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-2 text-sm" style={{ borderBottom: `1px solid ${BOBS.brown}33`, background: "#fff6e1" }}>
                  <span className="font-medium" style={{ color: "#4b3a2b" }}>Result</span>
                  <a
                    className="inline-flex items-center gap-1 hover:underline"
                    style={{ color: BOBS.teal }}
                    href={`data:image/png;base64,${resultB64}`}
                    download="nano-banana-result.png"
                  >
                    Download PNG
                    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M5 20h14v-2H5v2Zm7-3l5-5h-3V4h-4v8H7l5 5Z"/></svg>
                  </a>
                </div>
                <div className="p-4">
                  <div className="relative mx-auto w-full" style={{ maxWidth: 1200 }}>
                    <img
                      src={`data:image/png;base64,${resultB64}`}
                      alt="Result"
                      loading="lazy"
                      decoding="async"
                      className="mx-auto h-auto w-full max-h-[70vh] rounded-lg object-contain"
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
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-bold" style={{ color: "#4b3a2b" }}>History</h3>
          {history.length > 0 && (
            <button onClick={clearHistory} className={btnMuted} style={{ background: "#fff5e7", color: "#3b2a1d", border: `1px solid ${BOBS.brown}33` }}>
              Clear
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p className="text-sm" style={{ color: "#7a5a3d" }}>
            No history yet. Generate an image and it’ll be saved here.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {history.map((h) => (
              <div key={h.id} className="overflow-hidden rounded-xl" style={{ border: `1px solid ${BOBS.brown}33`, background: "#fffdf5" }}>
                <div className="flex items-center justify-between px-3 py-1.5 text-[11px]" style={{ borderBottom: `1px solid ${BOBS.brown}33`, background: "#fff6e1", color: "#5b3a23" }}>
                  <span className="truncate">{h.label}</span>
                  <span className="rounded-full px-2 py-0.5" style={{ background: "#e8fff7", color: "#14665e" }}>
                    {new Date(h.ts).toLocaleTimeString()}
                  </span>
                </div>
                <div className="p-2">
                  <img
                    src={`data:image/png;base64,${h.imageBase64}`}
                    alt={h.label}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full rounded object-contain"
                  />
                </div>
                <div className="flex items-center justify-between gap-2 px-3 pb-3">
                  <button onClick={() => reapplyHistory(h)} className="text-xs font-medium underline" style={{ color: BOBS.red }}>
                    Reapply
                  </button>
                  <span className="truncate text-[10px]" style={{ color: "#7a5a3d" }}>{h.operation}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-xs" style={{ color: "#7a5a3d" }}>
        Tip: For transparent backgrounds, choose the <span className="font-semibold">Transparent</span> preset.
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
                  onClick={() => setCamReady((r) => r)} // placeholder button for tips / future pause
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
