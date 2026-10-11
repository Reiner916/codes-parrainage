'use client';

/**
 * LiquidNetworkBackground.tsx
 * ────────────────────────────────────────────────────────────────────────────
 * Réseau animé "transaction network" plein écran, derrière le contenu,
 * pointer-events:none. Detecte le thème (classe `light`/`dark` sur <html>,
 * posée par next-themes) et recolore l'encre :
 *   • NUIT  → encre blanche brillante (compositing additif).
 *   • JOUR  → encre bleu nuit (compositing normal).
 * Le FOND vient de la page (body/sections) ; ici on ne dessine que le réseau.
 * Réagit à la souris + au scroll, respecte prefers-reduced-motion.
 * ──────────────────────────────────────────────────────────────────────────── */

import { CSSProperties, useEffect, useRef } from 'react';

type RGB = [number, number, number];

export interface LiquidNetworkBackgroundProps {
  /** Deep base color of the glow layer. Default ≈ #06060c. */
  baseColor?: RGB;
  violetColor?: RGB;
  blueColor?: RGB;
  deepColor?: RGB;
  /** Glow strength multiplier (0 flat … 1 default … 1.5 bolder). */
  intensity?: number;
  /** Cursor parallax on the glow layer. */
  parallax?: number;
  /** px² of viewport per network node (LOWER = more nodes). Default 13000. */
  networkDensity?: number;
  /** Cap device-pixel-ratio for perf. */
  maxDpr?: number;

  /* ── Theme ──────────────────────────────────────────────────────────────
   * The network re-colours itself to match your light / dark mode.
   *  'auto'  → detects light mode from <html class="light"> or
   *            [data-theme="light"] (re-checked every frame, so it follows
   *            a theme toggle live). Tweak detectLight() if your app differs.
   *  'light' / 'dark' → force one. */
  theme?: 'auto' | 'light' | 'dark';
  /** Line/node colour in dark mode ("r,g,b"). Default white. */
  darkInk?: string;
  /** Line/node colour in light mode ("r,g,b"). Default dark navy. */
  lightInk?: string;
  /** Render the WebGL "liquid glass" glow behind the network. Default false
   * (your site supplies its own background in both themes). */
  glow?: boolean;
}

/* ─────────────────────────── WebGL glow layer ───────────────────────────── */

const VERT = /* glsl */ `
  attribute vec2 aPos;
  void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform vec2 uResolution; uniform float uTime; uniform vec2 uMouse;
  uniform float uScroll; uniform float uIntensity; uniform float uParallax;
  uniform vec3 uBase; uniform vec3 uViolet; uniform vec3 uBlue; uniform vec3 uDeep;

  float hash(vec2 p){ p=fract(p*vec2(123.34,345.45)); p+=dot(p,p+34.345); return fract(p.x*p.y); }
  float noise(vec2 p){ vec2 i=floor(p),f=fract(p); vec2 u=f*f*(3.0-2.0*f);
    float a=hash(i),b=hash(i+vec2(1.0,0.0)),c=hash(i+vec2(0.0,1.0)),d=hash(i+vec2(1.0,1.0));
    return mix(mix(a,b,u.x),mix(c,d,u.x),u.y); }
  float fbm(vec2 p){ float v=0.0,a=0.5; mat2 m=mat2(1.6,1.2,-1.2,1.6);
    for(int i=0;i<5;i++){ v+=a*noise(p); p=m*p; a*=0.5; } return v; }
  float bloom(vec2 p, vec2 c, float r){ float d=length(p-c); return exp(-(d*d)/(r*r)); }

  void main(){
    vec2 uv = gl_FragCoord.xy/uResolution.xy;
    float aspect = uResolution.x/uResolution.y;
    vec2 q = uv-0.5; q.x*=aspect;
    float t = uTime*0.05; float sc = uScroll; vec2 par = uMouse*uParallax;
    vec2 fp = q*1.3; fp.y += sc*0.45;
    vec2 warp = vec2(fbm(fp+vec2(t*1.2,1.7)), fbm(fp+vec2(-t*0.9,4.3)));
    float field = fbm(fp+warp*0.9+par*0.5); field = smoothstep(0.1,0.95,field);
    vec3 col = uBase;
    vec2 c1 = vec2(0.54,0.40)+par*1.4+vec2(sin(t*1.3)*0.05,cos(t*1.1)*0.04); c1.y-=sc*0.12;
    col += uViolet*bloom(q,c1,0.62)*0.62*uIntensity;
    vec2 c2 = vec2(-0.60,0.38)+par*0.95+vec2(cos(t*0.9)*0.05,sin(t*1.4)*0.04); c2.y-=sc*0.18;
    col += uBlue*bloom(q,c2,0.55)*0.50*uIntensity;
    vec2 c3 = vec2(0.45,-0.45)+par*0.6+vec2(sin(t*0.7)*0.04,cos(t*0.8)*0.05); c3.y-=sc*0.10;
    col += uDeep*bloom(q,c3,0.7)*0.6*uIntensity;
    vec2 c4 = vec2(0.42*sin(sc*0.8+1.0),0.42*sin(sc*0.6))+par*0.7;
    col += uViolet*bloom(q,c4,0.7)*0.26*uIntensity;
    vec2 c5 = vec2(0.50*cos(sc*0.7+2.0),0.40*cos(sc*0.5+1.0))+par*0.5;
    col += uBlue*bloom(q,c5,0.62)*0.22*uIntensity;
    col += mix(uBlue,uViolet,field)*field*0.12*uIntensity;
    float g=(hash(gl_FragCoord.xy+fract(uTime)*100.0)-0.5)*0.025; col+=g;
    float vig=smoothstep(1.25,0.25,length(q)); col*=mix(0.80,1.0,vig);
    gl_FragColor = vec4(col,1.0);
  }
`;

const DEFAULTS = {
  baseColor: [0.0, 0.0, 0.0] as RGB,
  violetColor: [0.46, 0.37, 0.96] as RGB,
  blueColor: [0.16, 0.29, 0.72] as RGB,
  deepColor: [0.07, 0.1, 0.27] as RGB,
};

export default function LiquidNetworkBackground({
  baseColor = DEFAULTS.baseColor,
  violetColor = DEFAULTS.violetColor,
  blueColor = DEFAULTS.blueColor,
  deepColor = DEFAULTS.deepColor,
  intensity = 0,
  parallax = 0.08,
  networkDensity = 13000,
  maxDpr = 1.5,
  theme = 'auto',
  darkInk = '255,255,255',
  lightInk = '28,32,58',
  glow = false,
}: LiquidNetworkBackgroundProps) {
  const glowRef = useRef<HTMLCanvasElement | null>(null);
  const netRef = useRef<HTMLCanvasElement | null>(null);

  /* ── Glow layer (WebGL) ─ only when `glow` is enabled ───────────────── */
  useEffect(() => {
    if (!glow) return;
    const canvas = glowRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', {
      antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: 'low-power',
    });
    if (!gl) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog); gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const U = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = U('uResolution'), uTime = U('uTime'), uMouse = U('uMouse'), uScroll = U('uScroll'),
      uInt = U('uIntensity'), uPar = U('uParallax'), uBase = U('uBase'), uViolet = U('uViolet'),
      uBlue = U('uBlue'), uDeep = U('uDeep');
    gl.uniform1f(uInt, intensity); gl.uniform1f(uPar, parallax);
    gl.uniform3fv(uBase, baseColor); gl.uniform3fv(uViolet, violetColor);
    gl.uniform3fv(uBlue, blueColor); gl.uniform3fv(uDeep, deepColor);

    // idempotent, self-healing sizing (safe to call every frame)
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      const w = Math.max(1, Math.floor(innerWidth * dpr));
      const h = Math.max(1, Math.floor(innerHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
        gl.viewport(0, 0, w, h); gl.uniform2f(uRes, w, h);
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const tgt: [number, number] = [0, 0];
    const ms: [number, number] = [0, 0];
    let scroll = 0;
    const onMove = (e: PointerEvent) => {
      tgt[0] = (e.clientX / innerWidth) * 2 - 1;
      tgt[1] = -((e.clientY / innerHeight) * 2 - 1);
    };
    const onScroll = () => { scroll = scrollY / Math.max(1, innerHeight); };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const start = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      resize();
      ms[0] += (tgt[0] - ms[0]) * 0.05;
      ms[1] += (tgt[1] - ms[1]) * 0.05;
      gl.uniform1f(uTime, reduce ? 0 : (now - start) / 1000);
      gl.uniform2f(uMouse, ms[0], ms[1]);
      gl.uniform1f(uScroll, scroll);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      gl.deleteProgram(prog); gl.deleteBuffer(buf);
    };
  }, [glow, baseColor, violetColor, blueColor, deepColor, intensity, parallax, maxDpr]);

  /* ── Network layer (2D canvas) ──────────────────────────────────────── */
  useEffect(() => {
    const net = netRef.current;
    if (!net) return;
    const ctx = net.getContext('2d')!;

    // Theme detection — re-read live each frame so a day/night toggle is
    // reflected immediately. Adjust this to match your app's convention.
    const detectLight = () => {
      if (theme === 'light') return true;
      if (theme === 'dark') return false;
      const el = document.documentElement;
      return el.classList.contains('light') || el.getAttribute('data-theme') === 'light';
    };

    const LINK = 132, MOUSE = 200;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    type Node = { x: number; y: number; vx: number; vy: number; r: number; depth: number; ph: number; blue: boolean; lit: number; };
    let W = 0, H = 0;
    let nodes: Node[] = [];
    const signals: { a: number; b: number; t: number; sp: number }[] = [];
    let mx = -9999, my = -9999, mOn = false;
    let lastScroll = scrollY;

    const build = () => {
      const count = Math.round(Math.min(160, Math.max(36, (W * H) / networkDensity)));
      nodes = [];
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.14, vy: (Math.random() - 0.5) * 0.14,
          r: Math.random() * 1.5 + 1.1, depth: 0.04 + Math.random() * 0.2,
          ph: Math.random() * Math.PI * 2, blue: Math.random() > 0.5, lit: 0,
        });
      }
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      net.width = Math.max(1, W * dpr); net.height = Math.max(1, H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; mOn = true; };
    const onBlur = () => { mOn = false; };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('blur', onBlur);
    document.addEventListener('mouseleave', onBlur);

    const neighbour = (i: number) => {
      const a = nodes[i]; let best = -1, bd = LINK * LINK;
      for (let j = 0; j < nodes.length; j++) {
        if (j === i) continue;
        const dx = nodes[j].x - a.x, dy = nodes[j].y - a.y, d2 = dx * dx + dy * dy;
        if (d2 < bd) { bd = d2; best = j; }
      }
      return best;
    };

    let t0 = performance.now(), sigT = 0, raf = 0;
    const frame = (now: number) => {
      const dt = Math.min(40, now - t0); t0 = now;
      const step = reduce ? 0 : dt / 16.67;
      const ds = scrollY - lastScroll; lastScroll = scrollY;

      ctx.clearRect(0, 0, W, H);
      // Light → dark ink + normal compositing ('lighter' would erase dark
      // strokes on a light page). Dark → white ink + additive shine.
      const light = detectLight();
      const ink = light ? lightInk : darkInk;
      const shine = light ? 'rgba(40,46,90,0.22)' : 'rgba(255,255,255,0.9)';
      ctx.globalCompositeOperation = light ? 'source-over' : 'lighter';

      for (const n of nodes) {
        n.x += n.vx * step; n.y += n.vy * step - ds * n.depth; n.lit *= 0.92;
        if (mOn) {
          const dx = n.x - mx, dy = n.y - my, d = Math.hypot(dx, dy);
          if (d < MOUSE && d > 0.01) { const f = (1 - d / MOUSE) * 0.6 * step; n.x += (dx / d) * f; n.y += (dy / d) * f; }
        }
        const m = 70;
        if (n.x < -m) n.x += W + 2 * m; else if (n.x > W + m) n.x -= W + 2 * m;
        if (n.y < -m) n.y += H + 2 * m; else if (n.y > H + m) n.y -= H + 2 * m;
      }

      ctx.lineWidth = 1.1;
      ctx.shadowColor = shine;
      ctx.shadowBlur = 6;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]; const dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const d = Math.sqrt(d2);
            const op = (1 - d / LINK) * (0.34 + 0.5 * Math.max(a.lit, b.lit));
            ctx.strokeStyle = `rgba(${ink},${op})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      ctx.shadowBlur = 0;

      if (mOn) {
        for (const n of nodes) {
          const d = Math.hypot(n.x - mx, n.y - my);
          if (d < MOUSE) {
            const a = 1 - d / MOUSE; n.lit = Math.max(n.lit, a * 0.8);
            ctx.strokeStyle = `rgba(${ink},${a * 0.5})`; ctx.lineWidth = a * 1.4;
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(mx, my); ctx.stroke();
          }
        }
        ctx.lineWidth = 1;
      }

      sigT += dt;
      if (!reduce && sigT > 140 && signals.length < 22) {
        sigT = 0; const i = (Math.random() * nodes.length) | 0; const j = neighbour(i);
        if (j >= 0) signals.push({ a: i, b: j, t: 0, sp: 0.01 + Math.random() * 0.012 });
      }
      for (let s = signals.length - 1; s >= 0; s--) {
        const sig = signals[s]; sig.t += sig.sp * step;
        if (sig.t >= 1) { signals.splice(s, 1); continue; }
        const a = nodes[sig.a], b = nodes[sig.b];
        const x = a.x + (b.x - a.x) * sig.t, y = a.y + (b.y - a.y) * sig.t;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 7);
        g.addColorStop(0, `rgba(${ink},0.95)`); g.addColorStop(0.4, `rgba(${ink},0.6)`); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 7, 0, 6.2832); ctx.fill();
      }

      ctx.shadowColor = shine;
      ctx.shadowBlur = 7;
      for (const n of nodes) {
        const tw = 0.55 + 0.45 * Math.sin(now * 0.002 + n.ph);
        ctx.fillStyle = `rgba(${ink},${Math.min(1, 0.85 + n.lit * 0.6) * tw})`;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, 6.2832); ctx.fill();
      }
      ctx.shadowBlur = 0;

      ctx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('mouseleave', onBlur);
    };
  }, [networkDensity, theme, darkInk, lightInk]);

  const layer: CSSProperties = {
    position: 'fixed', inset: 0, width: '100%', height: '100%',
    display: 'block', pointerEvents: 'none',
  };
  return (
    <>
      {glow && (
        <canvas ref={glowRef} aria-hidden="true" style={{ ...layer, zIndex: -2, background: '#000' }} />
      )}
      <canvas ref={netRef} aria-hidden="true" style={{ ...layer, zIndex: -1 }} />
    </>
  );
}
