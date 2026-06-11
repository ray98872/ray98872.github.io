import { useState } from "react";
import {
  ArrowUpRight,
  MapPin,
  FileText,
  Copy,
  Check,
  Mail,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { profile } from "../data/profile.js";
import Reveal from "./Reveal.jsx";

function Card({ href, label, title, desc, meta, graphic, span = "", delay = 0, children }) {
  const Tag = href ? "a" : "div";
  const external = href && href.startsWith("http");
  return (
    <Reveal delay={delay} className={span}>
      <Tag
        {...(href ? { href, ...(external ? { target: "_blank", rel: "noreferrer" } : {}) } : {})}
        className="bento-card group h-full"
      >
        {graphic && (
          <div className="card-graphic relative h-40 shrink-0 overflow-hidden sm:h-44" aria-hidden="true">
            {graphic}
          </div>
        )}
        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-dim">{label}</p>
            {href && <ArrowUpRight size={15} className="card-arrow shrink-0 text-dim" aria-hidden="true" />}
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
  const rows = ["jellyfin", "immich", "pi-hole", "gluetun"];
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

function Sphere() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="h-24 w-24 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 32% 30%, #f2f0ea 0%, #c97e4e 28%, #5b3a22 62%, #17120d 100%)",
          boxShadow: "0 24px 36px -12px rgba(0,0,0,0.7), 0 0 50px -10px rgba(201,126,78,0.35)",
        }}
      />
      <div
        className="absolute bottom-7 h-3 w-32 rounded-[50%]"
        style={{ background: "radial-gradient(ellipse, rgba(0,0,0,0.55), transparent 70%)" }}
      />
    </div>
  );
}

function ContactCard({ delay }) {
  const [copied, setCopied] = useState(false);
  const copyEmail = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };
  return (
    <Reveal delay={delay} className="h-full">
      <div className="bento-card h-full">
        <div className="flex flex-1 flex-col p-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-dim">Contact</p>
          <h2 className="mt-2 text-lg font-medium text-cream">Say hello</h2>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-faint">
            Roles, projects, or questions about the home lab.
          </p>
          <div className="mt-auto flex flex-col gap-2 pt-5">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 break-all font-mono text-[12px] text-copper-soft transition-colors hover:text-copper"
            >
              <Mail size={13} className="shrink-0" aria-hidden="true" /> {profile.email.toLowerCase()}
            </a>
            <button
              type="button"
              onClick={copyEmail}
              className="inline-flex w-fit cursor-pointer items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-dim transition-colors hover:text-copper"
            >
              {copied ? (
                <>
                  <Check size={11} aria-hidden="true" /> copied
                </>
              ) : (
                <>
                  <Copy size={11} aria-hidden="true" /> copy address
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function Bento() {
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
              MSc Artificial Intelligence, Royal Holloway
              <span className="block font-mono text-[10px] text-dim">BSc Mathematics w/ CS, Brunel</span>
            </span>
          </p>
        </div>
      </Card>
      <Card
        span="lg:col-span-2"
        href="https://ray98872.github.io/homelab/"
        label="Personal infrastructure"
        title="Self-hosted home server"
        desc="Jellyfin, Immich, Pi-hole and Gluetun in Docker — my media library, photos and DNS, self-hosted. Read the full stack breakdown."
        meta="docker · linux · write-up"
        graphic={<ServerRack />}
        delay={120}
      />
      <Card
        span="lg:col-span-2"
        href="https://ray98872.github.io/zerodowntime/"
        label="Cloud engineering"
        title="Zero-downtime blue-green deploys"
        desc="Updating a live GenAI Copilot's RAG index on Azure Container Apps without dropping traffic — C# API, GitHub Actions pipeline, interactive demo."
        meta="c# · azure · ci/cd · live demo"
        graphic={<BlueGreenFlow />}
        delay={140}
      />
      <Card
        span="lg:col-span-2"
        href="/papers/gpu-accelerated-conformal-prediction.pdf"
        label="MSc dissertation · 2024"
        title="GPU-Accelerated Conformal Prediction"
        desc="Parallelising uncertainty quantification with CUDA and PyTorch — read the full paper."
        meta="cuda · pytorch · pdf"
        graphic={<ConformalBand />}
        delay={160}
      />
      <Card
        span="lg:col-span-2"
        href="/papers/introduction-to-sphere-tracing.pdf"
        label="BSc dissertation · 2022"
        title="Introduction to Sphere Tracing"
        desc="A sphere-traced 3D scene in GLSL, with the SDF mathematics derived from first principles."
        meta="glsl · mathematics · pdf"
        graphic={<Sphere />}
        delay={200}
      />
      <Card
        span="lg:col-span-2"
        label="Game development"
        title="Local AI asset pipeline"
        desc="Generative models on my own hardware producing 3D models and pixel art for game projects."
        meta="local llms · ongoing"
        graphic={<PixelGrid />}
        delay={240}
      />
      <Card span="lg:col-span-2" label="Stack" delay={280}>
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
      <ContactCard delay={320} />
    </section>
  );
}
