import { useEffect } from "react";
import { X, FileText, Move } from "lucide-react";
import ShaderScene from "./ShaderScene.jsx";

export default function ShaderOverlay({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Sphere tracing live demo"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex h-full max-h-[860px] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-line bg-bg">
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-medium text-cream">Introduction to Sphere Tracing — live scene</h2>
            <p className="mt-0.5 hidden font-mono text-[10px] text-dim sm:block">
              glsl raymarcher · runs on your gpu · from my bsc dissertation
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <span className="hidden items-center gap-1.5 font-mono text-[10px] text-faint sm:inline-flex">
              <Move size={11} aria-hidden="true" /> drag to orbit
            </span>
            <a
              href="/papers/introduction-to-sphere-tracing.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] text-copper-soft transition-colors hover:text-copper"
            >
              <FileText size={12} aria-hidden="true" /> read the paper
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close demo"
              className="cursor-pointer rounded-md p-1.5 text-faint transition-colors hover:text-cream"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1">
          <ShaderScene interactive maxDpr={1.5} className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}
