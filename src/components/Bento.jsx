import { useState, useRef } from "react";
import { ArrowUpRight, MapPin, Play, Pause } from "lucide-react";
import { profile } from "../data/profile.js";
import Reveal from "./Reveal.jsx";
import ShaderScene from "./ShaderScene.jsx";
import ShaderOverlay from "./ShaderOverlay.jsx";

function Card({ href, onClick, label, title, desc, meta, graphic, span = "", delay = 0, children }) {
  const Tag = href ? "a" : onClick ? "button" : "div";
  const external = href && href.startsWith("http");
  return (
    <Reveal delay={delay} className={span}>
      <Tag
        {...(href ? { href, ...(external ? { target: "_blank", rel: "noreferrer" } : {}) } : {})}
        {...(onClick ? { onClick, type: "button" } : {})}
        className={`bento-card group h-full w-full ${onClick ? "cursor-pointer text-left" : ""}`}
      >
        {graphic && (
          <div className="card-graphic relative h-40 shrink-0 overflow-hidden sm:h-44" aria-hidden="true">
            {graphic}
          </div>
        )}
        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-dim">{label}</p>
            {(href || onClick) && <ArrowUpRight size={15} className="card-arrow shrink-0 text-dim" aria-hidden="true" />}
          </div>
          {title && <h2 className="mt-2 text-lg font-medium tracking-[-0.01em] text-cream">{title}</h2>}
          {desc && <p className="mt-1.5 text-[13.5px] leading-relaxed text-faint">{desc}</p>}
          {children}
          {meta && <p className="mt-auto pt-4 font-mono text-[11px] text-dim">{meta}</p>}
        </div>
      </Tag>
    </Reveal>
  );
}

// A card that links to its own page like the others, but still hosts interactive
// content (an audio player). An <a> can't legally contain an <audio>, so the card
// is a div with a stretched transparent link; the player is lifted above it so it
// keeps its own clicks while everything else navigates.
function LinkedMediaCard({ href, label, title, desc, meta, graphic, span = "", delay = 0, children }) {
  const external = href.startsWith("http");
  return (
    <Reveal delay={delay} className={span}>
      <div className="bento-card is-linked h-full w-full">
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
          aria-label={title}
          className="absolute inset-0 z-10"
        />
        {graphic && (
          <div className="card-graphic relative h-40 shrink-0 overflow-hidden sm:h-44" aria-hidden="true">
            {graphic}
          </div>
        )}
        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-dim">{label}</p>
            <ArrowUpRight size={15} className="card-arrow shrink-0 text-dim" aria-hidden="true" />
          </div>
          {title && <h2 className="mt-2 text-lg font-medium tracking-[-0.01em] text-cream">{title}</h2>}
          {desc && <p className="mt-1.5 text-[13.5px] leading-relaxed text-faint">{desc}</p>}
          {children && <div className="relative z-20">{children}</div>}
          {meta && <p className="mt-auto pt-4 font-mono text-[11px] text-dim">{meta}</p>}
        </div>
      </div>
    </Reveal>
  );
}

// Themed audio player — replaces the default browser control so it matches the
// dark/copper palette. Sits above the card's stretched link and swallows its own
// clicks so play/seek never trigger navigation.
function GpuAudioPlayer({ src, caption }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const fmt = (s) =>
    !s || !isFinite(s) ? "0:00" : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  const swallow = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const toggle = (e) => {
    swallow(e);
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play();
    else a.pause();
  };

  const seek = (e) => {
    swallow(e);
    const a = audioRef.current;
    if (!a || !a.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    a.currentTime = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)) * a.duration;
  };

  const pct = duration ? (time / duration) * 100 : 0;

  return (
    <div className="mt-3 rounded-lg border border-line bg-bg/40 px-3 py-2.5" onClick={swallow}>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-copper text-bg shadow-[0_0_12px_rgba(201,126,78,0.45)] transition-transform hover:scale-105"
        >
          {playing ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" className="ml-0.5" />}
        </button>
        <div className="relative h-1.5 flex-1 cursor-pointer rounded-full bg-cream/10" onClick={seek}>
          <div className="absolute inset-y-0 left-0 rounded-full bg-copper" style={{ width: `${pct}%` }} />
        </div>
        <span className="font-mono text-[10px] tabular-nums text-dim whitespace-nowrap">
          {fmt(time)} / {fmt(duration)}
        </span>
      </div>
      {caption && <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-dim">{caption}</p>}
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        className="hidden"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onEnded={() => {
          setPlaying(false);
          setTime(0);
        }}
      />
    </div>
  );
}

function PinField() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_60%,rgba(201,126,78,0.12),transparent_65%)]">
      <svg viewBox="0 0 320 176" className="absolute inset-0 h-full w-full opacity-40">
        {Array.from({ length: 7 }).map((_, r) =>
          Array.from({ length: 13 }).map((_, c) => (
            <circle key={`${r}-${c}`} cx={10 + c * 25} cy={14 + r * 25} r="1.3" fill="#5b574e" />
          ))
        )}
      </svg>
      <span className="absolute h-20 w-20 rounded-full border border-copper/40 ripple" />
      <span className="absolute h-20 w-20 rounded-full border border-copper/30 ripple" style={{ "--d": "1100ms" }} />
      <MapPin size={34} className="relative text-copper drop-shadow-[0_0_18px_rgba(201,126,78,0.5)]" />
    </div>
  );
}

function ServerRack() {
  const rows = ["jellyfin", "pi-hole", "gluetun", "homepage"];
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-2 px-8">
      {rows.map((name, i) => (
        <div key={name} className="flex items-center gap-3 rounded-md border border-line bg-cream/[0.03] px-3 py-2">
          <span className="led h-1.5 w-1.5 rounded-full bg-copper" style={{ "--d": `${i * 350}ms` }} />
          <span className="font-mono text-[10px] text-faint">{name}</span>
          <span className="ml-auto font-mono text-[9px] text-dim">up</span>
        </div>
      ))}
    </div>
  );
}

function ComfyUIGraph() {
  // Node centres in the 320x176 viewBox. The flow pulses below animate along the
  // exact same coordinates, so they always track the wires.
  const nodes = [
    { id: "prompt", x: 40, y: 88, label: "Prompt", color: "#98948a" },
    { id: "sdxl", x: 120, y: 56, label: "SDXL", color: "#c97e4e" },
    { id: "upscale", x: 120, y: 120, label: "Upscale", color: "#c97e4e" },
    { id: "refine", x: 200, y: 88, label: "Refine", color: "#c97e4e" },
    { id: "output", x: 280, y: 88, label: "Output", color: "#f2f0ea" },
  ];
  const at = (id) => nodes.find((n) => n.id === id);
  const wires = [
    ["prompt", "sdxl"],
    ["prompt", "upscale"],
    ["sdxl", "refine"],
    ["upscale", "refine"],
    ["refine", "output"],
  ];
  // Two pulses travel the full pipeline, one through each branch, offset in time.
  const topPath = "M40,88 L120,56 L200,88 L280,88";
  const bottomPath = "M40,88 L120,120 L200,88 L280,88";
  const fade = { values: "0;1;1;1;0", keyTimes: "0;0.07;0.5;0.9;1", dur: "3.4s", repeatCount: "indefinite" };

  return (
    <svg viewBox="0 0 320 176" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="nodeBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(201,126,78,0.12)" />
          <stop offset="100%" stopColor="rgba(201,126,78,0.02)" />
        </radialGradient>
      </defs>
      <rect width="320" height="176" fill="url(#nodeBg)" />

      {/* Wires (copper, with a soft underglow) */}
      {wires.map(([from, to], i) => {
        const a = at(from);
        const b = at(to);
        return (
          <g key={`wire-${i}`}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(201,126,78,0.22)" strokeWidth="3.5" strokeLinecap="round" />
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#c97e4e" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
          </g>
        );
      })}

      {/* Flow pulses — follow the wires exactly */}
      <circle r="2.6" fill="#e0a075">
        <animateMotion dur="3.4s" repeatCount="indefinite" path={topPath} />
        <animate attributeName="opacity" values={fade.values} keyTimes={fade.keyTimes} dur={fade.dur} repeatCount="indefinite" />
      </circle>
      <circle r="2.6" fill="#e0a075">
        <animateMotion dur="3.4s" begin="-1.7s" repeatCount="indefinite" path={bottomPath} />
        <animate attributeName="opacity" values={fade.values} keyTimes={fade.keyTimes} dur={fade.dur} begin="-1.7s" repeatCount="indefinite" />
      </circle>

      {/* Nodes */}
      {nodes.map((n) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r="9" fill="none" stroke={n.color} strokeWidth="1" opacity="0.25" />
          <rect x={n.x - 6} y={n.y - 6} width="12" height="12" rx="3" fill={n.color} opacity="0.95" />
          <text x={n.x} y={n.y + 17} textAnchor="middle" className="font-mono" fontSize="8" fill={n.color} opacity="0.75">
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function CircuitBoard() {
  // A minimal PCB graphic: traces, vias and a chip — hardware-mod flavour
  const traces = [
    "M20,88 H72 V56 H148",
    "M20,88 H72 V120 H148",
    "M148,56 H200 V88 H280",
    "M148,120 H200 V88",
    "M52,88 V120",
    "M240,88 V56 H268",
  ];
  const vias = [
    [52, 88], [72, 56], [72, 120], [148, 56], [148, 88], [148, 120], [200, 88], [240, 88],
  ];
  return (
    <svg viewBox="0 0 320 176" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="320" height="176" fill="rgba(201,126,78,0.04)" />
      {/* grid */}
      {Array.from({ length: 9 }).map((_, r) =>
        Array.from({ length: 17 }).map((_, c) => (
          <circle key={`${r}-${c}`} cx={10 + c * 19} cy={12 + r * 19} r="0.9" fill="rgba(242,240,234,0.07)" />
        ))
      )}
      {/* traces */}
      {traces.map((d, i) => (
        <g key={i}>
          <path d={d} fill="none" stroke="rgba(201,126,78,0.22)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d={d} fill="none" stroke="#c97e4e" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
        </g>
      ))}
      {/* chip body */}
      <rect x="148" y="52" width="52" height="72" rx="6" fill="rgba(242,240,234,0.05)" stroke="rgba(201,126,78,0.4)" strokeWidth="1.2" />
      <rect x="156" y="60" width="36" height="56" rx="3" fill="rgba(201,126,78,0.08)" />
      <text x="174" y="92" textAnchor="middle" fontSize="8" fill="rgba(201,126,78,0.7)" fontFamily="monospace">CFW</text>
      <text x="174" y="103" textAnchor="middle" fontSize="7" fill="rgba(242,240,234,0.3)" fontFamily="monospace">v2.11</text>
      {/* vias */}
      {vias.map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="4.5" fill="rgba(10,10,11,0.9)" stroke="rgba(201,126,78,0.5)" strokeWidth="1" />
          <circle cx={cx} cy={cy} r="2" fill="rgba(201,126,78,0.55)" />
        </g>
      ))}
      {/* pulse travelling the main trace */}
      <circle r="2.5" fill="#e0a075">
        <animateMotion dur="3s" repeatCount="indefinite" path="M20,88 H72 V56 H148 H200 V88 H280" />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.05;0.9;1" dur="3s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function PixelGrid() {
  const cells = Array.from({ length: 60 });
  const tone = (i) => {
    const v = (i * 2654435761) % 100;
    if (v > 88) return "rgba(201,126,78,0.75)";
    if (v > 72) return "rgba(201,126,78,0.3)";
    if (v > 50) return "rgba(242,240,234,0.12)";
    return "rgba(242,240,234,0.04)";
  };
  return (
    <div className="absolute inset-6 grid grid-cols-12 gap-1.5">
      {cells.map((_, i) => (
        <span key={i} className="aspect-square rounded-[3px]" style={{ background: tone(i) }} />
      ))}
    </div>
  );
}

function ConformalBand() {
  return (
    <svg viewBox="0 0 320 176" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
      <path
        d="M0,120 C60,98 90,118 140,92 C190,66 240,88 320,52 L320,108 C240,140 190,118 140,142 C90,166 60,150 0,164 Z"
        fill="rgba(201,126,78,0.16)"
      />
      <path
        d="M0,142 C60,124 90,134 140,117 C190,100 240,103 320,80"
        fill="none"
        stroke="#c97e4e"
        strokeWidth="1.8"
      />
      <path
        d="M0,142 C60,124 90,134 140,117 C190,100 240,103 320,80"
        fill="none"
        stroke="rgba(201,126,78,0.35)"
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.25"
      />
      {[40, 110, 180, 250].map((x, i) => (
        <circle key={x} cx={x} cy={[131, 128, 110, 96][i]} r="2.5" fill="#f2f0ea" opacity="0.7" />
      ))}
    </svg>
  );
}

function RAGFlow() {
  const stages = [
    { x: 44, label: "SRD" },
    { x: 118, label: "chunk" },
    { x: 192, label: "embed" },
    { x: 266, label: "rank" },
  ];
  // Score bar widths: faithfulness 79%, relevancy 69%, recall 60%
  const scores = [
    { label: "faith", pct: 79, y: 148 },
    { label: "relev", pct: 69, y: 159 },
    { label: "recall", pct: 60, y: 170 },
  ];
  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(201,126,78,0.11),transparent_65%)]">
      <svg viewBox="0 0 320 176" className="absolute inset-0 h-full w-full">
        {/* pipeline rail */}
        <line x1="44" y1="44" x2="266" y2="44" stroke="rgba(242,240,234,0.10)" strokeWidth="1" />
        {/* stage chips */}
        {stages.map((s) => (
          <g key={s.label}>
            <rect x={s.x - 26} y={32} width="52" height="24" rx="7"
              fill="rgba(242,240,234,0.04)" stroke="rgba(242,240,234,0.14)" />
            <text x={s.x} y={48} textAnchor="middle" fontSize="9" fill="#98948a" fontFamily="monospace">
              {s.label}
            </text>
          </g>
        ))}
        {/* animated particle along pipeline */}
        <circle r="2.2" fill="#c97e4e">
          <animateMotion dur="2.6s" repeatCount="indefinite" path="M44,44 L266,44" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.06;0.88;1" dur="2.6s" repeatCount="indefinite" />
        </circle>
        {/* vector dot cluster */}
        {Array.from({ length: 30 }).map((_, i) => {
          const col = i % 10;
          const row = Math.floor(i / 10);
          const x = 28 + col * 27;
          const y = 82 + row * 22;
          const v = (i * 2654435761) % 100;
          const bright = v > 82;
          const mid = v > 60;
          return (
            <circle key={i} cx={x} cy={y} r={bright ? 3 : mid ? 2 : 1.4}
              fill={bright ? "rgba(201,126,78,0.75)" : mid ? "rgba(201,126,78,0.25)" : "rgba(242,240,234,0.09)"} />
          );
        })}
        {/* D20 */}
        <polygon points="291,72 279,94 303,94"
          fill="none" stroke="rgba(201,126,78,0.55)" strokeWidth="1.2" />
        <text x="291" y="89" textAnchor="middle" fontSize="8" fill="rgba(201,126,78,0.55)" fontFamily="monospace">20</text>
        {/* RAGAS mini-bars */}
        {scores.map((s) => (
          <g key={s.label}>
            <text x="28" y={s.y - 1} fontSize="7.5" fill="rgba(242,240,234,0.2)" fontFamily="monospace">{s.label}</text>
            <rect x="72" y={s.y - 6} width="80" height="3.5" rx="1.75" fill="rgba(242,240,234,0.06)" />
            <rect x="72" y={s.y - 6} width={80 * s.pct / 100} height="3.5" rx="1.75" fill="rgba(201,126,78,0.55)" />
            <text x="158" y={s.y - 1} fontSize="7.5" fill="rgba(201,126,78,0.6)" fontFamily="monospace">{(s.pct / 100).toFixed(2)}</text>
          </g>
        ))}
        <text x="28" y="140" fontSize="7" fill="rgba(242,240,234,0.15)" fontFamily="monospace" letterSpacing="0.12em">RAGAS EVAL</text>
      </svg>
    </div>
  );
}

function BlueGreenFlow() {
  return (
    <svg viewBox="0 0 320 176" className="absolute inset-0 h-full w-full">
      {/* routes */}
      <path d="M 48 88 C 90 88, 100 88, 138 88" fill="none" stroke="rgba(242,240,234,0.12)" strokeWidth="1.4" />
      <path d="M 182 80 C 215 62, 230 56, 262 52" fill="none" stroke="rgba(91,157,217,0.35)" strokeWidth="1.4" />
      <path d="M 182 96 C 215 114, 230 120, 262 124" fill="none" stroke="rgba(93,191,138,0.35)" strokeWidth="1.4" />
      {/* client */}
      <rect x="22" y="74" width="26" height="28" rx="7" fill="rgba(242,240,234,0.04)" stroke="rgba(242,240,234,0.14)" />
      <circle cx="35" cy="84" r="3.5" fill="none" stroke="#98948a" strokeWidth="1.2" />
      <path d="M 29 96 C 29 91, 41 91, 41 96" fill="none" stroke="#98948a" strokeWidth="1.2" />
      {/* router */}
      <rect x="138" y="70" width="44" height="36" rx="8" fill="rgba(201,126,78,0.08)" stroke="rgba(201,126,78,0.4)" />
      <text x="160" y="92" textAnchor="middle" fontSize="10" fill="#c97e4e" fontFamily="JetBrains Mono, monospace">
        {"⇄"}
      </text>
      {/* blue slot */}
      <rect x="262" y="38" width="40" height="26" rx="6" fill="rgba(91,157,217,0.08)" stroke="rgba(91,157,217,0.45)" />
      <text x="282" y="55" textAnchor="middle" fontSize="8.5" fill="#5b9dd9" fontFamily="JetBrains Mono, monospace">
        v1
      </text>
      {/* green slot */}
      <rect x="262" y="110" width="40" height="26" rx="6" fill="rgba(93,191,138,0.08)" stroke="rgba(93,191,138,0.45)" />
      <text x="282" y="127" textAnchor="middle" fontSize="8.5" fill="#5dbf8a" fontFamily="JetBrains Mono, monospace">
        v2
      </text>
      {/* travelling requests */}
      <circle r="2.4" fill="#5b9dd9" opacity="0.9">
        <animateMotion dur="2.4s" repeatCount="indefinite" path="M 48 88 C 90 88, 100 88, 138 88" />
      </circle>
      <circle r="2.4" fill="#5b9dd9" opacity="0.9">
        <animateMotion dur="2.4s" begin="1.2s" repeatCount="indefinite" path="M 182 80 C 215 62, 230 56, 262 52" />
      </circle>
      <circle r="2.4" fill="#5dbf8a" opacity="0.9">
        <animateMotion dur="2.4s" begin="0.6s" repeatCount="indefinite" path="M 48 88 C 90 88, 100 88, 138 88" />
      </circle>
      <circle r="2.4" fill="#5dbf8a" opacity="0.9">
        <animateMotion dur="2.4s" begin="1.8s" repeatCount="indefinite" path="M 182 96 C 215 114, 230 120, 262 124" />
      </circle>
    </svg>
  );
}

function SwarmFanout() {
  // Star fan-out: one orchestrator dispatches to five agents in parallel
  // (copper pulses), whose findings converge on a single synthesis step
  // (green pulses). Matches the dispatch → merge story of the write-up.
  const orch = { x: 44, y: 88 };
  const synth = { x: 286, y: 88 };
  const ax = 176; // agent column x
  const ys = [26, 57, 88, 119, 150]; // five agent nodes, vertically fanned
  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_50%,rgba(201,126,78,0.12),transparent_65%)]">
      <svg viewBox="0 0 320 176" className="absolute inset-0 h-full w-full">
        {/* spokes: orchestrator → agents (copper, with underglow) */}
        {ys.map((y, i) => (
          <g key={`o-${i}`}>
            <line x1={orch.x} y1={orch.y} x2={ax} y2={y} stroke="rgba(201,126,78,0.20)" strokeWidth="3" strokeLinecap="round" />
            <line x1={orch.x} y1={orch.y} x2={ax} y2={y} stroke="#c97e4e" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
          </g>
        ))}
        {/* converge: agents → synthesis */}
        {ys.map((y, i) => (
          <line key={`s-${i}`} x1={ax} y1={y} x2={synth.x} y2={synth.y} stroke="rgba(242,240,234,0.12)" strokeWidth="1.2" />
        ))}
        {/* dispatch pulses (copper, outbound) */}
        {ys.map((y, i) => (
          <circle key={`pd-${i}`} r="2.2" fill="#e0a075">
            <animateMotion dur="1.9s" begin={`${i * 0.12}s`} repeatCount="indefinite" path={`M${orch.x},${orch.y} L${ax},${y}`} />
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="1.9s" begin={`${i * 0.12}s`} repeatCount="indefinite" />
          </circle>
        ))}
        {/* result pulses (green, converging) */}
        {ys.map((y, i) => (
          <circle key={`pr-${i}`} r="2" fill="#5dbf8a">
            <animateMotion dur="2s" begin={`${0.95 + i * 0.12}s`} repeatCount="indefinite" path={`M${ax},${y} L${synth.x},${synth.y}`} />
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="2s" begin={`${0.95 + i * 0.12}s`} repeatCount="indefinite" />
          </circle>
        ))}
        {/* agent nodes */}
        {ys.map((y, i) => (
          <rect key={`a-${i}`} x={ax - 11} y={y - 8} width="22" height="16" rx="5"
            fill="rgba(242,240,234,0.05)" stroke="rgba(242,240,234,0.16)" strokeWidth="1" />
        ))}
        {/* orchestrator (pulsing) */}
        <circle cx={orch.x} cy={orch.y} r="13" fill="none" stroke="rgba(201,126,78,0.4)" strokeWidth="1">
          <animate attributeName="r" values="13;19;13" dur="2.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="2.6s" repeatCount="indefinite" />
        </circle>
        <rect x={orch.x - 15} y={orch.y - 15} width="30" height="30" rx="8" fill="rgba(201,126,78,0.14)" stroke="#c97e4e" strokeWidth="1.2" />
        <text x={orch.x} y={orch.y + 3} textAnchor="middle" fontSize="8" fill="#c97e4e" fontFamily="JetBrains Mono, monospace">orch</text>
        {/* synthesis (merge) */}
        <rect x={synth.x - 16} y={synth.y - 13} width="32" height="26" rx="7" fill="rgba(93,191,138,0.10)" stroke="rgba(93,191,138,0.5)" strokeWidth="1.2" />
        <text x={synth.x} y={synth.y + 3} textAnchor="middle" fontSize="8" fill="#5dbf8a" fontFamily="JetBrains Mono, monospace">merge</text>
      </svg>
    </div>
  );
}

// ── Section header ─────────────────────────────────────────────────────────────
function BentoSection({ num, title, id, children }) {
  return (
    <div id={id}>
      <Reveal>
        <div className="mb-5 flex items-baseline gap-3.5">
          <span className="font-display text-sm italic leading-none text-copper">{num}</span>
          <h2 className="text-[11px] font-medium uppercase tracking-[0.22em] text-faint">{title}</h2>
          <span className="h-px flex-1 bg-gradient-to-r from-line to-transparent" />
        </div>
      </Reveal>
      {children}
    </div>
  );
}

function LakehouseFlow() {
  const stages = [
    { x: 28, label: "iot" },
    { x: 108, label: "minio" },
    { x: 188, label: "spark" },
    { x: 268, label: "3σ" },
  ];
  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(201,126,78,0.12),transparent_65%)]">
      <svg viewBox="0 0 320 176" className="absolute inset-0 h-full w-full">
        {/* pipeline chips */}
        <line x1="52" y1="42" x2="244" y2="42" stroke="rgba(242,240,234,0.14)" strokeWidth="1" />
        <circle r="2.2" fill="#c97e4e">
          <animateMotion dur="3.2s" repeatCount="indefinite" path="M52,42 L244,42" />
        </circle>
        {stages.map((s) => (
          <g key={s.label}>
            <rect x={s.x - 24} y={30} width="48" height="24" rx="7" fill="rgba(242,240,234,0.04)" stroke="rgba(242,240,234,0.14)" />
            <text x={s.x} y={46} textAnchor="middle" className="font-mono" fontSize="9" fill="#98948a">
              {s.label}
            </text>
          </g>
        ))}
        {/* 3σ band */}
        <path
          d="M0,108 C50,104 90,112 140,106 C190,100 250,110 320,103 L320,141 C250,148 190,138 140,144 C90,150 50,142 0,146 Z"
          fill="rgba(201,126,78,0.10)"
        />
        {/* sensor trace with one excursion */}
        <path
          d="M0,128 L28,124 L52,130 L76,122 L100,127 L124,121 L148,90 L168,126 L196,120 L222,125 L248,118 L274,124 L298,119 L320,123"
          fill="none"
          stroke="rgba(155,180,201,0.65)"
          strokeWidth="1.5"
        />
        {/* flagged anomaly */}
        <circle cx="148" cy="90" r="3" fill="#c97e4e" />
        <circle cx="148" cy="90" r="6" fill="none" stroke="rgba(201,126,78,0.5)" strokeWidth="1">
          <animate attributeName="r" values="4;11" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0" dur="1.8s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}

export default function Bento() {
  const [shaderOpen, setShaderOpen] = useState(false);
  return (
    <section id="work" className="space-y-16 pb-20">

      {/* ── 01 Shipped ───────────────────────────────────────────────────────── */}
      <BentoSection num="01" title="Shipped" id="shipped">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <Card
            span="lg:col-span-6"
            href="https://thehalalpin.co.uk"
            label="Live in production"
            title="The Halal Pin"
            desc="Community-driven halal food finder. Sole developer across the full stack — product design, build, hosting, domain and deployment at thehalalpin.co.uk."
            meta="web platform · sole developer"
            graphic={<PinField />}
            delay={0}
          />
        </div>
      </BentoSection>

      {/* ── 02 Engineered ────────────────────────────────────────────────────── */}
      <BentoSection num="02" title="Engineered" id="engineered">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <Card
            span="lg:col-span-4"
            href="https://ray98872.github.io/dnd-rag/writeup.html"
            label="RAG · eval · LLM"
            title="D&D 5e Rules Oracle"
            desc="Production RAG system over the 2024 D&D SRD — hybrid dense + sparse retrieval, cross-encoder reranking, RAGAS evaluation and a streaming dark-fantasy chat frontend hosted on GitHub Pages."
            meta="qdrant · llama 3.3 70b · ragas · railway"
            graphic={<RAGFlow />}
            delay={0}
          />
          <Card
            span="lg:col-span-2"
            href="https://ray98872.github.io/zerodowntime/"
            label="Cloud engineering"
            title="Zero-downtime blue-green deploys"
            desc="Updating a live GenAI Copilot's RAG index on Azure Container Apps without dropping traffic — C# API, GitHub Actions pipeline, interactive demo."
            meta="c# · azure · ci/cd · live demo"
            graphic={<BlueGreenFlow />}
            delay={80}
          />
          <Card
            span="lg:col-span-4"
            href="https://ray98872.github.io/iot-lakehouse/"
            label="Data engineering"
            title="IoT Anomaly Detection Lakehouse"
            desc="An AWS + Databricks lakehouse replicated 1:1 in Docker Compose at £0 — MinIO, PySpark and a streaming sensor fleet flagging 3σ faults for predictive maintenance."
            meta="docker · pyspark · minio · write-up"
            graphic={<LakehouseFlow />}
            delay={160}
          />
          <Card
            span="lg:col-span-2"
            href="https://ray98872.github.io/swarm/writeup/"
            label="Multi-agent · RAG · SSE"
            title="Research Agent Swarm"
            desc="Five specialist agents fan out in parallel over a technical question — web search, docs, benchmarks, community signals and risk — then a synthesis agent merges their findings into a cited report."
            meta="python · groq · fastapi · sse · write-up"
            graphic={<SwarmFanout />}
            delay={240}
          />
        </div>
      </BentoSection>

      {/* ── 03 Research ──────────────────────────────────────────────────────── */}
      <BentoSection num="03" title="Research" id="research">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <Card
            span="lg:col-span-3"
            href="https://ray98872.github.io/chargeback-dispute-agent/"
            label="MSc dissertation → autonomous agent"
            title="Conformal prediction, from research to product"
            desc="MSc dissertation: GPU-accelerated conformal prediction intervals around car-price predictions in PyTorch + CUDA — manufacturing rigorous uncertainty bounds, not just point estimates. The follow-up wires the same calibrated-confidence math into an autonomous chargeback dispute agent that refunds only above 95% certainty. Write-up, live demo and the original dissertation paper."
            meta="pytorch · cuda · conformal prediction · agentic"
            graphic={<ConformalBand />}
            delay={0}
          />
          <Card
            span="lg:col-span-3"
            onClick={() => setShaderOpen(true)}
            label="BSc dissertation · 2022 · live"
            title="Introduction to Sphere Tracing"
            desc="The dissertation's GLSL raymarcher, running live on your GPU. Click to open and drag to orbit."
            meta="glsl · webgl · interactive"
            graphic={<ShaderScene maxDpr={1} className="h-full w-full" />}
            delay={80}
          />
        </div>
      </BentoSection>

      {/* ── 04 For fun ───────────────────────────────────────────────────────── */}
      <BentoSection num="04" title="For fun" id="for-fun">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <LinkedMediaCard
            span="lg:col-span-2"
            href="https://ray98872.github.io/local-ai-pipeline/"
            label="Game development"
            title="Local AI asset pipeline"
            desc="Generative game-asset tooling on an AMD RX 9070 XT: ComfyUI + SDXL images, Stable Audio Open music, and aisprite — Stable Diffusion wired into Aseprite for LoRA-styled pixel art."
            meta="comfyui · aseprite · directml · pixel-art"
            graphic={<ComfyUIGraph />}
            delay={0}
          >
            <GpuAudioPlayer src="/generated-music.mp3" caption="composed after Dark Souls III · Metroid Fusion" />
          </LinkedMediaCard>
          <Card
            span="lg:col-span-2"
            href="https://ray98872.github.io/homelab/"
            label="Personal infrastructure"
            title="Self-hosted home server"
            desc="Jellyfin, Pi-hole and Gluetun in Docker — my media library and DNS, self-hosted. Read the full stack breakdown."
            meta="docker · linux · write-up"
            graphic={<ServerRack />}
            delay={80}
          />
          <Card
            span="lg:col-span-2"
            href="https://ray98872.github.io/device-modding/"
            label="Hardware hobby"
            title="Device Modding & Tinkering"
            desc="Soft-mods, jailbreaks and homebrew across mobile, PlayStation, Nintendo and Xbox — since 2011 and XDA Developers."
            meta="custom firmware · homebrew · since 2011"
            graphic={<CircuitBoard />}
            delay={160}
          />
        </div>
      </BentoSection>

      {/* ── Stack ────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 border-t border-line pt-6 lg:grid-cols-6">
        <Card span="lg:col-span-6" label="Stack" delay={0}>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {profile.skills.map((skill) => (
              <li
                key={skill}
                className="rounded-md border border-line bg-cream/[0.03] px-2.5 py-1 font-mono text-[11px] text-faint transition-colors duration-300 hover:border-copper/40 hover:text-copper-soft"
              >
                {skill}
              </li>
            ))}
          </ul>
          <p className="mt-auto pt-4 font-mono text-[11px] text-dim">daily drivers, not logos</p>
        </Card>
      </div>

      <ShaderOverlay open={shaderOpen} onClose={() => setShaderOpen(false)} />
    </section>
  );
}
