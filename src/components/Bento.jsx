import { useState } from "react";
import { ArrowUpRight, MapPin, Briefcase, GraduationCap } from "lucide-react";
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
  // Node positions and connections for ComfyUI pipeline
  const nodes = [
    { id: 1, x: 20, y: 50, label: "Prompt", color: "#98948a" },
    { id: 2, x: 60, y: 30, label: "SDXL", color: "#c97e4e" },
    { id: 3, x: 60, y: 70, label: "Upscale", color: "#c97e4e" },
    { id: 4, x: 100, y: 50, label: "Refine", color: "#c97e4e" },
    { id: 5, x: 140, y: 50, label: "Output", color: "#f2f0ea" },
  ];

  const connections = [
    [1, 2],
    [1, 3],
    [2, 4],
    [3, 4],
    [4, 5],
  ];

  return (
    <svg viewBox="0 0 320 176" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
      {/* Background gradient */}
      <defs>
        <radialGradient id="nodeBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(201,126,78,0.1)" />
          <stop offset="100%" stopColor="rgba(201,126,78,0.02)" />
        </radialGradient>
      </defs>
      <rect width="320" height="176" fill="url(#nodeBg)" />

      {/* Connections (wires) */}
      {connections.map(([from, to], i) => {
        const fromNode = nodes.find((n) => n.id === from);
        const toNode = nodes.find((n) => n.id === to);
        return (
          <g key={`wire-${i}`}>
            {/* Glow effect */}
            <line
              x1={fromNode.x * 2.2}
              y1={fromNode.y * 1.76}
              x2={toNode.x * 2.2}
              y2={toNode.y * 1.76}
              stroke="rgba(201,126,78,0.2)"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.4"
            />
            {/* Main wire */}
            <line
              x1={fromNode.x * 2.2}
              y1={fromNode.y * 1.76}
              x2={toNode.x * 2.2}
              y2={toNode.y * 1.76}
              stroke={fromNode.color}
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.7"
            />
          </g>
        );
      })}

      {/* Nodes */}
      {nodes.map((node) => (
        <g key={`node-${node.id}`}>
          {/* Node glow */}
          <circle
            cx={node.x * 2.2}
            cy={node.y * 1.76}
            r="7"
            fill="none"
            stroke={node.color}
            strokeWidth="1"
            opacity="0.3"
          />
          {/* Node body */}
          <rect
            x={node.x * 2.2 - 6}
            y={node.y * 1.76 - 6}
            width="12"
            height="12"
            rx="2"
            fill={node.color}
            opacity="0.9"
          />
          {/* Node label */}
          <text
            x={node.x * 2.2}
            y={node.y * 1.76 + 18}
            textAnchor="middle"
            className="font-mono"
            fontSize="8"
            fill={node.color}
            opacity="0.7"
          >
            {node.label}
          </text>
        </g>
      ))}

      {/* Animated data flow dot */}
      <circle r="2" fill="#c97e4e" opacity="0.8">
        <animateMotion dur="4s" repeatCount="indefinite">
          <mpath href="#flow-path" />
        </animateMotion>
      </circle>
      <path id="flow-path" d="M44,88 Q120,50 290,88" fill="none" />
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
    <section id="work" className="grid grid-cols-1 gap-4 pb-20 sm:grid-cols-2 lg:grid-cols-6">
      <Card
        span="lg:col-span-4"
        href="https://thehalalpin.co.uk"
        label="Live in production"
        title="The Halal Pin"
        desc="Community-driven halal food finder. Sole developer across the full stack — product design, build, hosting, domain and deployment at thehalalpin.co.uk."
        meta="web platform · sole developer"
        graphic={<PinField />}
        delay={0}
      />
      <Card span="lg:col-span-2" label="About" delay={80}>
        <div className="mt-2 space-y-3 text-[13.5px] leading-relaxed text-faint">
          <p>
            AI developer shipping production agentic systems at ICS.AI — promoted from AI Associate
            within 12 months.
          </p>
          <p className="flex items-start gap-2 text-[12.5px]">
            <Briefcase size={13} className="mt-0.5 shrink-0 text-copper" aria-hidden="true" />
            <span>
              {profile.experience[0].role} · {profile.experience[0].company}
              <span className="block font-mono text-[10px] text-dim">{profile.experience[0].period}</span>
            </span>
          </p>
          <p className="flex items-start gap-2 text-[12.5px]">
            <GraduationCap size={13} className="mt-0.5 shrink-0 text-copper" aria-hidden="true" />
            <span>
              MSc Artificial Intelligence
              <span className="block font-mono text-[10px] text-dim">Royal Holloway, University of London</span>
            </span>
          </p>
          <p className="flex items-start gap-2 text-[12.5px]">
            <GraduationCap size={13} className="mt-0.5 shrink-0 text-copper" aria-hidden="true" />
            <span>
              BSc Mathematics with Computer Science
              <span className="block font-mono text-[10px] text-dim">Brunel University London</span>
            </span>
          </p>
        </div>
      </Card>
      <Card
        span="lg:col-span-2"
        href="https://ray98872.github.io/homelab/"
        label="Personal infrastructure"
        title="Self-hosted home server"
        desc="Jellyfin, Pi-hole and Gluetun in Docker — my media library and DNS, self-hosted. Read the full stack breakdown."
        meta="docker · linux · write-up"
        graphic={<ServerRack />}
        delay={120}
      />
      <Card
        span="lg:col-span-2"
        href="https://ray98872.github.io/chargeback-dispute-agent/"
        label="MSc dissertation → autonomous agent"
        title="Conformal prediction, from research to product"
        desc="My dissertation built GPU-accelerated conformal intervals around car-price predictions; its extension puts the same math in charge — an autonomous dispute agent that refunds only above 95% calibrated confidence. Write-up, live demo and the original paper."
        meta="pytorch · cuda · conformal prediction · agentic"
        graphic={<ConformalBand />}
        delay={160}
      />
      <Card
        span="lg:col-span-2"
        onClick={() => setShaderOpen(true)}
        label="BSc dissertation · 2022 · live"
        title="Introduction to Sphere Tracing"
        desc="The dissertation's GLSL raymarcher, running live on your GPU. Click to open and drag to orbit."
        meta="glsl · webgl · interactive"
        graphic={<ShaderScene maxDpr={1} className="h-full w-full" />}
        delay={200}
      />
      <Card
        span="lg:col-span-2"
        label="Game development"
        title="Local AI asset pipeline"
        desc="Generative pipelines on AMD RX 9070XT: ComfyUI for SDXL image generation with upscaling, Stable Audio Open composing to MP3, and aisprite — a Python server that integrates Stable Diffusion directly into Aseprite for AI-powered pixel art with LoRA style control."
        meta="comfyui · aseprite · directml · pixel-art"
        graphic={<ComfyUIGraph />}
        delay={240}
      >
        <div className="mt-3 flex items-center gap-2 rounded-md bg-cream/[0.03] px-3 py-2 hover:bg-cream/[0.06] transition-colors">
          <span className="h-2 w-2 rounded-full bg-copper animate-pulse" />
          <audio controls className="h-5 flex-1 max-w-xs" controlsList="nodownload">
            <source src="/generated-music.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <span className="font-mono text-[10px] text-dim whitespace-nowrap">30s sample</span>
        </div>
      </Card>
      <Card
        span="lg:col-span-2"
        href="https://ray98872.github.io/iot-lakehouse/"
        label="Data engineering"
        title="IoT Anomaly Detection Lakehouse"
        desc="An AWS + Databricks lakehouse replicated 1:1 in Docker Compose at £0 — MinIO, PySpark and a streaming sensor fleet flagging 3σ faults for predictive maintenance. Write-up, in-browser demo and source."
        meta="docker · pyspark · minio · write-up"
        graphic={<LakehouseFlow />}
        delay={280}
      />
      <Card span="lg:col-span-6" label="Stack" delay={320}>
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
      <ShaderOverlay open={shaderOpen} onClose={() => setShaderOpen(false)} />
    </section>
  );
}