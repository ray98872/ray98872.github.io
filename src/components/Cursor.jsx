import { useEffect, useRef } from "react";

export default function Cursor() {
  const ref = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced || !ref.current) return;

    const dot = ref.current;
    let x = -50;
    let y = -50;
    let tx = -50;
    let ty = -50;
    let frame;

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      dot.style.opacity = "1";
    };
    const onLeave = () => {
      dot.style.opacity = "0";
    };
    const onOver = (e) => {
      const interactive = e.target.closest("a, button");
      dot.style.width = interactive ? "44px" : "12px";
      dot.style.height = interactive ? "44px" : "12px";
    };

    const loop = () => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      frame = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseover", onOver, { passive: true });
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseover", onOver);
    };
  }, []);

  return <div ref={ref} className="cursor-dot" style={{ opacity: 0 }} aria-hidden="true" />;
}
