import { useEffect } from "react";
import Lenis from "lenis";
import Cursor from "./components/Cursor.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Bento from "./components/Bento.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    const root = document.documentElement;
    let frame;
    const raf = (time) => {
      lenis.raf(time);
      root.style.setProperty("--progress", (lenis.progress || 0).toFixed(4));
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-dvh overflow-x-clip">
      <div className="grain" aria-hidden="true" />
      <div className="halo" aria-hidden="true" />
      <span className="scroll-progress" aria-hidden="true" />
      <Cursor />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Header />
        <main>
          <Hero />
          <Bento />
        </main>
        <Footer />
      </div>
    </div>
  );
}
