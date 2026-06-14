import { profile } from "../data/profile.js";

export default function Hero() {
  return (
    <section className="pb-12 pt-14 sm:pb-16 sm:pt-20">
      <p
        className="fade-in mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-cream/[0.04] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-faint"
        style={{ "--d": "150ms" }}
      >
        <span className="status-dot inline-block h-1.5 w-1.5 rounded-full bg-copper" aria-hidden="true" />
        {profile.role} · {profile.location}
      </p>
      <h1 className="max-w-3xl text-[clamp(2.2rem,6vw,4.2rem)] font-semibold leading-[1.04] tracking-[-0.02em] text-cream">
        <span className="line-mask">
          <span style={{ "--d": "250ms" }}>LLMs that reason,</span>
        </span>
        <span className="line-mask">
          <span style={{ "--d": "380ms" }}>
            <span className="font-display font-light italic text-copper">agents that act</span> —
          </span>
        </span>
        <span className="line-mask">
          <span style={{ "--d": "510ms" }}>systems that ship.</span>
        </span>
      </h1>
      <p className="fade-in mt-6 max-w-xl text-base leading-relaxed text-faint" style={{ "--d": "750ms" }}>
        AI developer at <span className="text-cream">ICS.AI</span> — building agentic and LLM
        systems in C#/.NET and Azure that run in production. MSc in Artificial Intelligence (Royal
        Holloway), BSc in Mathematics with Computer Science (Brunel). Promoted from Associate within
        twelve months.
      </p>
    </section>
  );
}
