import { profile } from "../data/profile.js";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="flex items-center justify-between border-t border-line py-7">
      <p className="font-mono text-[11px] text-dim">© {year} {profile.name.join(" ")}</p>
      <p className="font-mono text-[11px] text-dim">react · vite · tailwind</p>
    </footer>
  );
}
