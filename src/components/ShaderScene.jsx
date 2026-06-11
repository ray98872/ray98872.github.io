import { useEffect, useRef } from "react";
import { VERT, FRAG } from "./sphereTracerShader.js";

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function ShaderScene({ interactive = false, maxDpr = 1.5, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);
    const uRes = gl.getUniformLocation(program, "iResolution");
    const uTime = gl.getUniformLocation(program, "iTime");
    const uMouse = gl.getUniformLocation(program, "iMouse");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let raf = 0;
    let visible = false;
    let mouseX = 0;
    let mouseY = 0;
    let dragging = false;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const draw = (t) => {
      resize();
      gl.uniform3f(uRes, canvas.width, canvas.height, 1);
      gl.uniform1f(uTime, t);
      gl.uniform4f(uMouse, mouseX, mouseY, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = () => {
      draw((performance.now() - start) / 1000);
      raf = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (raf) return;
      if (reduced) {
        draw(11.5);
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    const stopLoop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) startLoop();
        else stopLoop();
      },
      { threshold: 0.05 }
    );
    io.observe(canvas);

    const onPointerDown = (e) => {
      dragging = true;
      canvas.setPointerCapture?.(e.pointerId);
    };
    const onPointerUp = () => {
      dragging = false;
    };
    const onPointerMove = (e) => {
      if (!dragging) return;
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) * dpr;
      mouseY = (rect.height - (e.clientY - rect.top)) * dpr;
      if (reduced && visible) draw(11.5);
    };

    if (interactive) {
      canvas.addEventListener("pointerdown", onPointerDown);
      canvas.addEventListener("pointerup", onPointerUp);
      canvas.addEventListener("pointercancel", onPointerUp);
      canvas.addEventListener("pointermove", onPointerMove);
      canvas.style.touchAction = "none";
      canvas.style.cursor = "grab";
    }

    return () => {
      stopLoop();
      io.disconnect();
      if (interactive) {
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointerup", onPointerUp);
        canvas.removeEventListener("pointercancel", onPointerUp);
        canvas.removeEventListener("pointermove", onPointerMove);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [interactive, maxDpr]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="img"
      aria-label="Real-time sphere-traced 3D scene rendered in WebGL — reflective sphere, torus, capsule, cylinder and box on a mirrored plane"
    />
  );
}
