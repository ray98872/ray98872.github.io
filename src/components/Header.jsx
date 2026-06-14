import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "../data/profile.js";

export default function Header() {
  return (
    <header className="flex items-center justify-between py-6">
      <a href="/" className="fade-in font-display text-lg italic text-cream" aria-label="Home">
        Ray Mahbub
      </a>
      <nav className="hidden items-center gap-5 text-[10px] font-medium uppercase tracking-[0.18em] text-dim lg:flex">
        {["Shipped", "Engineered", "Research", "For fun"].map((label) => (
          <a
            key={label}
            href={`#${label.toLowerCase().replace(" ", "-")}`}
            className="transition-colors duration-300 hover:text-cream"
          >
            {label}
          </a>
        ))}
      </nav>
      <div className="fade-in flex items-center gap-5" style={{ "--d": "100ms" }}>
        <span
          className="hidden items-center gap-3 text-[10px] font-medium uppercase tracking-[0.18em] text-dim sm:flex"
          aria-hidden="true"
        >
          contact
          <span className="h-px w-6 bg-gradient-to-r from-line to-transparent" />
        </span>
        <a
          href={`mailto:${profile.email}`}
          aria-label="Email"
          title={profile.email.toLowerCase()}
          className="text-faint transition-colors duration-300 hover:text-copper-soft"
        >
          <Mail size={17} aria-hidden="true" />
        </a>
        <a
          href={profile.socials.github}
          aria-label="GitHub"
          className="text-faint transition-colors duration-300 hover:text-copper-soft"
        >
          <Github size={17} aria-hidden="true" />
        </a>
        <a
          href={profile.socials.linkedin}
          aria-label="LinkedIn"
          className="text-faint transition-colors duration-300 hover:text-copper-soft"
        >
          <Linkedin size={17} aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}
