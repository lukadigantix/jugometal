"use client";

import { useEffect, useRef, useState } from "react";

/*
  360° prikaz od niza fotografija (kadrovi snimljeni u krug, isti kadar i isti razmak između njih).
  - kadrovi se učitavaju tek kada je prikaz blizu ekrana; dok se ne učitaju vidi se `poster` i traka napretka
  - sam se polako okreće; prevlačenjem (miš/prst, bilo gde na bini) okreće se ručno, sa inercijom;
    strelice levo/desno sa tastature
  - crta na <canvas> (bez treptanja pri zameni slike), samo dok je vidljiv; poštuje prefers-reduced-motion
  - kada se promeni niz kadrova (druga boja), ugao ostaje isti
  - bez kadrova (ili sa jednim) prikazuje samo `poster`
*/

const REVOLUTION_S = 14; // jedan krug automatskog okretanja
const IDLE_RESUME_MS = 2500; // posle ručnog okretanja automatsko se vraća nakon pauze

export default function Spin360({
  frames,
  poster,
  alt,
  reverse = false,
  className = "",
  frameClassName = "inset-0",
  hud,
  tone = "dark",
  turntable = false,
}: {
  frames: string[];
  /** slika koja se vidi dok se kadrovi učitavaju, ili umesto 360° prikaza ako kadrova nema */
  poster: string;
  alt: string;
  /** ako su kadrovi snimani u suprotnom smeru */
  reverse?: boolean;
  /** cela bina (površina za prevlačenje) */
  className?: string;
  /** okvir unutar bine u kome se crta vozilo */
  frameClassName?: string;
  /** oznake preko bine; dobija ugao i da li je 360° spreman */
  hud?: (s: { deg: number; ready: boolean; spin: boolean }) => React.ReactNode;
  /** podloga prikaza: tamna (bina) ili svetla (bela kartica) - boja trake učitavanja */
  tone?: "dark" | "light";
  /** okretna platforma u perspektivi ispod vozila (pojačava utisak 3D) */
  turntable?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const imgs = useRef<HTMLImageElement[]>([]);
  const pos = useRef(0); // trenutni kadar (decimalno)
  const drawn = useRef(-1);
  const [near, setNear] = useState(false);
  const n = frames.length;
  const spin = n > 1;
  const key = frames.join("|");
  const [prog, setProg] = useState({ key: "", n: 0 });
  const loaded = prog.key === key ? prog.n : 0;
  const ready = spin && loaded >= n;
  const [frame, setFrame] = useState(0);

  // učitaj tek kada je blizu ekrana
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // učitavanje kadrova: prvi ide prvi, zatim svi ostali
  useEffect(() => {
    if (!near || !spin) return;
    const list = key.split("|");
    let alive = true;
    let count = 0;
    const images = list.map(() => new Image());
    imgs.current = images;
    drawn.current = -1;
    const done = () => {
      count += 1;
      if (alive) setProg({ key, n: count });
    };
    const load = (i: number) => {
      images[i].decoding = "async";
      images[i].onload = done;
      images[i].onerror = done;
      images[i].src = list[i];
    };
    const rest = () => list.forEach((_, i) => i && load(i));
    images[0].addEventListener("load", rest, { once: true });
    images[0].addEventListener("error", rest, { once: true });
    load(0);
    return () => {
      alive = false;
    };
  }, [near, spin, key]);

  // crtanje, okretanje i prevlačenje
  useEffect(() => {
    const cv = canvas.current;
    const el = host.current;
    const fr = box.current;
    if (!ready || !cv || !el || !fr) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dir = reverse ? -1 : 1;
    const auto = reduce ? 0 : n / REVOLUTION_S; // kadrova u sekundi

    /*
      Utisak 3D modela od malo kadrova (npr. 8 × 45°):
      - kadar nikad ne stoji: vozilo lagano klizi u smeru okretanja (svaki kadar je „centriran" na svom uglu)
      - prelaz u sledeći kadar ide uz horizontalno zamućenje pokreta i pretapanje (bez providnog vozila)
      - ispod vozila je okretna platforma u perspektivi čije se oznake okreću kontinuirano sa uglom;
        zadnja polovina se crta iza vozila, prednja ispred, pa scena dobija dubinu
      Sa mnogo kadrova (24+) prelaz je kratak i efekti su blaži.
    */
    const many = n >= 24;
    const TW = many ? 0.12 : 0.18; // pola širine prelaza (u kadrovima), oko sredine između dva kadra
    const DRIFT = many ? 0.01 : 0.045; // klizanje po kadru, deo širine vozila
    const BLUR = many ? 0.003 : 0.009; // najveće zamućenje pokreta, deo širine vozila
    const wrap = (k: number) => ((k % n) + n) % n;
    const ease = (x: number) => x * x * (3 - 2 * x);
    const light = tone === "light";

    // raspored: sa platformom vozilo zauzima gornjih ~84% visine, ispod je pod
    const layout = (im: HTMLImageElement) => {
      const w = cv.width, h = cv.height;
      const areaH = turntable ? h * 0.84 : h;
      const s = Math.min(w / im.naturalWidth, areaH / im.naturalHeight);
      const dw = im.naturalWidth * s, dh = im.naturalHeight * s;
      return { dw, dh, x: (w - dw) / 2, y: turntable ? areaH - dh : (h - dh) / 2 };
    };

    // vozilo sa pomakom u (lokalni ugao kadra, -0.5..0.5) i zamućenjem bl (px)
    const vehicle = (im: HTMLImageElement, u: number, alpha: number, bl: number) => {
      const L = layout(im);
      const dx = -u * DRIFT * L.dw * dir;
      const copies = bl > 0.8 ? 9 : 1;
      for (let c = 0; c < copies; c++) {
        const off = copies === 1 ? 0 : (c / (copies - 1) - 0.5) * 2 * bl;
        ctx.globalAlpha = copies === 1 ? alpha : Math.min(1, (alpha * 2.2) / copies);
        ctx.drawImage(im, L.x + dx + off, L.y, L.dw, L.dh);
      }
      ctx.globalAlpha = 1;
    };

    // okretna platforma: elipsa ispod točkova i oznake koje se okreću sa uglom
    const TICKS = 40;
    const platform = (im: HTMLImageElement, angle: number, half: "back" | "front") => {
      const L = layout(im);
      const cx = cv.width / 2, cy = L.y + L.dh * 0.965;
      const rx = L.dw * 0.5, ry = rx * 0.15;
      const ink = light ? "24,25,27" : "255,255,255";
      if (half === "back") {
        // pod: mekani sjaj i obrisi elipse
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
        g.addColorStop(0, light ? "rgba(24,25,27,0.07)" : "rgba(224,42,51,0.22)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(1, ry / rx);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, rx * 1.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        for (const [k, a] of [[1, light ? 0.16 : 0.22], [0.72, light ? 0.08 : 0.1]] as const) {
          ctx.strokeStyle = `rgba(${ink},${a})`;
          ctx.lineWidth = Math.max(1, cv.width / 1400);
          ctx.beginPath();
          ctx.ellipse(cx, cy, rx * k, ry * k, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      // oznake: bliže (dole) su krupnije i jasnije
      for (let k = 0; k < TICKS; k++) {
        const th = (k / TICKS) * Math.PI * 2 + angle * dir;
        const depth = Math.sin(th); // 1 = najbliže posmatraču
        if ((half === "front") !== depth > 0) continue;
        const px = cx + rx * Math.cos(th), py = cy + ry * depth;
        const near = (depth + 1) / 2;
        const major = k % 5 === 0;
        const len = (major ? 0.05 : 0.025) * ry * 6 * (0.5 + near * 0.6);
        ctx.strokeStyle = major ? `rgba(224,42,51,${0.35 + near * 0.55})` : `rgba(${ink},${(light ? 0.1 : 0.12) + near * (light ? 0.3 : 0.4)})`;
        ctx.lineWidth = Math.max(1, (cv.width / 900) * (0.6 + near * 0.8));
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + (cx - px) * (len / rx), py + (cy - py) * (len / rx));
        ctx.stroke();
      }
    };

    let shownDeg = -1;
    const draw = () => {
      const p = pos.current;
      const base = Math.floor(p);
      const f = p - base;
      // c: 0 = samo kadar base, 1 = samo kadar base+1; prelaz je oko f = 0.5
      const c = ease(Math.min(1, Math.max(0, (f - (0.5 - TW)) / (2 * TW))));
      const a = imgs.current[wrap(base)], b = imgs.current[wrap(base + 1)];
      if (!a?.naturalWidth) return;
      const ref = a;
      const blPx = Math.sin(Math.PI * c) * BLUR * layout(ref).dw;
      const angle = (p / n) * Math.PI * 2;
      ctx.clearRect(0, 0, cv.width, cv.height);
      if (turntable) platform(ref, angle, "back");
      if (c < 0.01 || !b?.naturalWidth) vehicle(a, f, 1, 0);
      else if (c > 0.99) vehicle(b, f - 1, 1, 0);
      else {
        vehicle(a, f, Math.min(1, 2 - 2 * c), blPx);
        vehicle(b, f - 1, Math.min(1, 2 * c), blPx);
      }
      if (turntable) platform(ref, angle, "front");
      // ugao za brojač: kontinuirano, ali React se osvežava samo kad se promeni ceo stepen
      const deg = ((Math.round((p / n) * 360) % 360) + 360) % 360;
      if (deg !== shownDeg) {
        shownDeg = deg;
        setFrame(deg);
      }
    };

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.max(1, Math.round(fr.clientWidth * dpr));
      cv.height = Math.max(1, Math.round(fr.clientHeight * dpr));
      requestAnimationFrame(() => draw());
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(fr);

    let dragging = false;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0; // kadrova u sekundi, posle puštanja
    let idleUntil = 0;
    const pxPerFrame = () => Math.max(3, (fr.clientWidth * 1.1) / n); // ~ jedan krug na širinu vozila

    const down = (e: PointerEvent) => {
      dragging = true;
      velocity = 0;
      lastX = e.clientX;
      lastT = performance.now();
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const now = performance.now();
      const df = ((e.clientX - lastX) / pxPerFrame()) * -dir;
      pos.current += df;
      velocity = df / Math.max(0.008, (now - lastT) / 1000);
      lastX = e.clientX;
      lastT = now;
      draw();
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      if (performance.now() - lastT > 80) velocity = 0; // zadržao pre puštanja
      idleUntil = performance.now() + IDLE_RESUME_MS;
      el.style.cursor = "grab";
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      pos.current = Math.round(pos.current) + (e.key === "ArrowRight" ? 1 : -1);
      velocity = 0;
      idleUntil = performance.now() + IDLE_RESUME_MS;
      draw();
    };
    el.style.cursor = "grab";
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("keydown", onKey);

    let raf = 0;
    let visible = true;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!dragging) {
        if (Math.abs(velocity) > 0.3) {
          pos.current += velocity * dt;
          velocity *= Math.pow(0.02, dt);
        } else if (now > idleUntil) {
          velocity = 0;
          pos.current += auto * dt;
        }
        draw();
      }
      raf = visible ? requestAnimationFrame(tick) : 0;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(el);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("keydown", onKey);
      el.style.cursor = "";
    };
  }, [ready, n, reverse, tone, turntable]);

  const deg = spin ? frame : 0; // u stepenima (crtanje ga osvežava)
  const pct = spin ? Math.round((loaded / n) * 100) : 0;

  return (
    <div
      ref={host}
      className={`select-none outline-none focus-visible:ring-2 focus-visible:ring-[#e02a33]/40 ${className}`}
      style={{ touchAction: "pan-y" }}
      {...(ready
        ? {
            role: "slider",
            tabIndex: 0,
            "aria-label": `${alt}, 360° prikaz, strelicama levo i desno okrećete model`,
            "aria-valuemin": 0,
            "aria-valuemax": 359,
            "aria-valuenow": deg,
            "aria-valuetext": `${deg}°`,
          }
        : {})}
    >
      <div ref={box} className={`absolute ${frameClassName}`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- slika iz public */}
        <img
          src={poster}
          alt={ready ? "" : alt}
          draggable={false}
          className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${turntable ? "pb-[16%]" : ""} ${ready ? "opacity-0" : "opacity-100"}`}
        />
        <canvas ref={canvas} aria-hidden className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`} />
      </div>

      {near && spin && !ready && (
        <div className="pointer-events-none absolute inset-x-[30%] bottom-12">
          <div className={`h-0.5 overflow-hidden rounded-full ${tone === "dark" ? "bg-white/10" : "bg-ink/10"}`}>
            <div className="h-full bg-[#e02a33] transition-[width] duration-200" style={{ width: `${pct}%` }} />
          </div>
          <p className={`mt-2 whitespace-nowrap text-center text-[10px] uppercase tracking-[0.2em] ${tone === "dark" ? "text-white/45" : "text-mist"}`}>Učitavanje 360° prikaza {pct}%</p>
        </div>
      )}

      {hud?.({ deg, ready, spin })}
    </div>
  );
}
