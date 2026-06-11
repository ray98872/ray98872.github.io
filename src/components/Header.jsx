import { Github, Linkedin } from "lucide-react";
import { profile } from "../data/profile.js";

export default function Header() {
  return (
    <header className="flex items-center justify-between py-6">
      <a href="/" className="fade-in font-display text-lg italic text-cream" aria-label="Home">
        ray mahbub
      </a>
      <div className="fade-in flex items-center gap-5" style={{ "--d": "100ms" }}>
        <a
          href={profile.socials.github}
          aria-label="GitHub"
          className="text-faint transition-colors duration-300 hover:text-cream"
        >
          <Github size={17} aria-hidden="true" />
        </a>
        <a
          href={profile.socials.linkedin}
          aria-label="LinkedIn"
          className="text-faint transition-colors duration-300 hover:text-cream"
        >
          <Linkedin size={17} aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}
