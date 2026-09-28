// Live topographic contour map for <canvas data-topo>.
//
// A 3D simplex-noise height field (x, y, time) is sampled on a coarse grid and
// traced with marching squares. Every fifth contour is drawn heavier, like the
// index contours on a USGS quad. A "summit" follows the pointer (or wanders on
// its own on touch devices); contours above SUMMIT_LEVEL exist only around it
// and are drawn in the accent color.
//
// Options (data attributes): data-seed, data-interactive, data-intensity.

const STEP = 0.13; // contour interval, in field units
const INDEX_EVERY = 5;
const SUMMIT_LEVEL = 1;
const TIME_SPEED = 0.000045;

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// --- 3D simplex noise (after Stefan Gustavson's public-domain reference) ---
const GRAD3 = new Float32Array([
  1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1,
  0, 1, -1, 0, -1, -1,
]);
const F3 = 1 / 3;
const G3 = 1 / 6;

function createNoise3D(seed: number) {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  let s = seed % 2147483647 || 1;
  for (let i = 255; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    const tmp = p[i];
    p[i] = p[j];
    p[j] = tmp;
  }
  const perm = new Uint8Array(512);
  const permMod12 = new Uint8Array(512);
  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255];
    permMod12[i] = perm[i] % 12;
  }

  return function noise3(x: number, y: number, z: number): number {
    const s = (x + y + z) * F3;
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const k = Math.floor(z + s);
    const t = (i + j + k) * G3;
    const x0 = x - (i - t);
    const y0 = y - (j - t);
    const z0 = z - (k - t);
    // Offsets of the second and third simplex corners (no allocations: this runs ~20k times a frame).
    let i1 = 0,
      j1 = 0,
      k1 = 0,
      i2 = 0,
      j2 = 0,
      k2 = 0;
    if (x0 >= y0) {
      if (y0 >= z0) {
        i1 = i2 = j2 = 1;
      } else if (x0 >= z0) {
        i1 = i2 = k2 = 1;
      } else {
        k1 = i2 = k2 = 1;
      }
    } else if (y0 < z0) {
      k1 = j2 = k2 = 1;
    } else if (x0 < z0) {
      j1 = j2 = k2 = 1;
    } else {
      j1 = i2 = j2 = 1;
    }
    const x1 = x0 - i1 + G3;
    const y1 = y0 - j1 + G3;
    const z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2 * G3;
    const y2 = y0 - j2 + 2 * G3;
    const z2 = z0 - k2 + 2 * G3;
    const x3 = x0 - 1 + 3 * G3;
    const y3 = y0 - 1 + 3 * G3;
    const z3 = z0 - 1 + 3 * G3;
    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255;

    let n = 0;
    let tt = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (tt > 0) {
      const g = permMod12[ii + perm[jj + perm[kk]]] * 3;
      tt *= tt;
      n += tt * tt * (GRAD3[g] * x0 + GRAD3[g + 1] * y0 + GRAD3[g + 2] * z0);
    }
    tt = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (tt > 0) {
      const g = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3;
      tt *= tt;
      n += tt * tt * (GRAD3[g] * x1 + GRAD3[g + 1] * y1 + GRAD3[g + 2] * z1);
    }
    tt = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (tt > 0) {
      const g = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3;
      tt *= tt;
      n += tt * tt * (GRAD3[g] * x2 + GRAD3[g + 1] * y2 + GRAD3[g + 2] * z2);
    }
    tt = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (tt > 0) {
      const g = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3;
      tt *= tt;
      n += tt * tt * (GRAD3[g] * x3 + GRAD3[g + 1] * y3 + GRAD3[g + 2] * z3);
    }
    return 32 * n;
  };
}

// --- Marching squares: add the segment(s) where level L crosses one cell ---
function segment(path: Path2D, x1: number, y1: number, x2: number, y2: number) {
  path.moveTo(x1, y1);
  path.lineTo(x2, y2);
}

function addCell(
  path: Path2D,
  a: number, // top-left
  b: number, // top-right
  c: number, // bottom-right
  d: number, // bottom-left
  L: number,
  x: number,
  y: number,
  s: number
) {
  const idx = (a > L ? 8 : 0) | (b > L ? 4 : 0) | (c > L ? 2 : 0) | (d > L ? 1 : 0);
  switch (idx) {
    case 0:
    case 15:
      return;
    case 1:
    case 14: // left – bottom
      return segment(path, x, y + (s * (L - a)) / (d - a), x + (s * (L - d)) / (c - d), y + s);
    case 2:
    case 13: // bottom – right
      return segment(path, x + (s * (L - d)) / (c - d), y + s, x + s, y + (s * (L - b)) / (c - b));
    case 3:
    case 12: // left – right
      return segment(path, x, y + (s * (L - a)) / (d - a), x + s, y + (s * (L - b)) / (c - b));
    case 4:
    case 11: // top – right
      return segment(path, x + (s * (L - a)) / (b - a), y, x + s, y + (s * (L - b)) / (c - b));
    case 6:
    case 9: // top – bottom
      return segment(path, x + (s * (L - a)) / (b - a), y, x + (s * (L - d)) / (c - d), y + s);
    case 7:
    case 8: // top – left
      return segment(path, x + (s * (L - a)) / (b - a), y, x, y + (s * (L - a)) / (d - a));
    default: {
      // Saddles (5, 10): resolve with the cell's center value.
      const tx = x + (s * (L - a)) / (b - a);
      const ry = y + (s * (L - b)) / (c - b);
      const bx = x + (s * (L - d)) / (c - d);
      const ly = y + (s * (L - a)) / (d - a);
      if ((idx === 5) === (a + b + c + d) / 4 > L) {
        segment(path, tx, y, x, ly);
        segment(path, bx, y + s, x + s, ry);
      } else {
        segment(path, tx, y, x + s, ry);
        segment(path, x, ly, bx, y + s);
      }
    }
  }
}

class TopoMap {
  private ctx: CanvasRenderingContext2D;
  private noise: (x: number, y: number, z: number) => number;
  private width = 0;
  private height = 0;
  private cell = 12;
  private cols = 0;
  private rows = 0;
  private field = new Float32Array(0);
  private time: number;
  private raf = 0;
  private last = 0;
  private visible = false;
  private colors = { minor: '', index: '', summit: '' };
  private intensity: number;
  private interactive: boolean;
  private host: HTMLElement;
  // Summit position (0–1 of the canvas), eased toward its target.
  private summit = {
    x: 0.72,
    y: 0.42,
    tx: 0.72,
    ty: 0.42,
    strength: 0,
    target: 0.9,
    pointer: false,
  };

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    const seed = Number(canvas.dataset.seed ?? 7);
    this.noise = createNoise3D(seed * 9973 + 17);
    this.time = seed * 3.7;
    this.intensity = Number(canvas.dataset.intensity ?? 1);
    this.interactive = canvas.dataset.interactive !== undefined;
    this.host = (canvas.closest('[data-topo-host]') as HTMLElement) ?? canvas.parentElement!;

    this.readColors();
    this.resize();
    const start = this.wander(performance.now());
    Object.assign(this.summit, { x: start.x, y: start.y, tx: start.x, ty: start.y });

    const ro = new ResizeObserver(() => {
      this.resize();
      if (!this.shouldAnimate()) this.render();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      this.sync();
    });
    io.observe(canvas);

    // Recolor when the theme class on <html> changes.
    const mo = new MutationObserver(() => {
      this.readColors();
      if (!this.shouldAnimate()) this.render();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const onVisibility = () => this.sync();
    document.addEventListener('visibilitychange', onVisibility);
    reducedMotion.addEventListener('change', onVisibility);

    if (this.interactive) {
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
        const rect = canvas.getBoundingClientRect();
        this.summit.tx = (e.clientX - rect.left) / rect.width;
        this.summit.ty = (e.clientY - rect.top) / rect.height;
        this.summit.pointer = true;
        this.summit.target = 1;
      };
      const onLeave = () => {
        this.summit.pointer = false;
      };
      this.host.addEventListener('pointermove', onMove, { passive: true });
      this.host.addEventListener('pointerleave', onLeave);
    }

    this.render();
  }

  private shouldAnimate() {
    return this.visible && !document.hidden && !reducedMotion.matches;
  }

  private sync() {
    if (this.shouldAnimate()) {
      if (!this.raf) {
        this.last = performance.now();
        this.raf = requestAnimationFrame(this.frame);
      }
    } else if (this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
  }

  private readColors() {
    const styles = getComputedStyle(this.canvas);
    const contour = styles.getPropertyValue('--contour').trim() || '244 239 227';
    const accent = styles.getPropertyValue('--accent').trim() || '199 91 48';
    const k = this.intensity;
    this.colors = {
      minor: `rgb(${contour} / ${0.1 * k})`,
      index: `rgb(${contour} / ${0.22 * k})`,
      summit: `rgb(${accent} / ${Math.min(1, 0.85 * k)})`,
    };
  }

  private resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = Math.max(1, rect.width);
    this.height = Math.max(1, rect.height);
    this.canvas.width = Math.round(this.width * dpr);
    this.canvas.height = Math.round(this.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.cell = this.width < 640 ? 10 : 12;
    this.cols = Math.ceil(this.width / this.cell);
    this.rows = Math.ceil(this.height / this.cell);
    this.field = new Float32Array((this.cols + 1) * (this.rows + 1));
  }

  private frame = (now: number) => {
    this.raf = requestAnimationFrame(this.frame);
    const dt = Math.min(64, now - this.last);
    this.last = now;
    this.time += dt * TIME_SPEED;

    const summit = this.summit;
    if (!summit.pointer) {
      const target = this.wander(now);
      summit.tx = target.x;
      summit.ty = target.y;
      summit.target = 0.9;
    }
    const ease = summit.pointer ? 0.08 : 0.02;
    summit.x += (summit.tx - summit.x) * ease;
    summit.y += (summit.ty - summit.y) * ease;
    summit.strength += (summit.target - summit.strength) * 0.04;

    this.render();
  };

  // Where the summit drifts when no pointer steers it, clear of the text:
  // the right half on wide screens, the band below the buttons on narrow ones.
  private wander(now: number) {
    const narrow = this.width < 768;
    return {
      x: 0.7 + Math.sin(now * 0.00011) * (narrow ? 0.12 : 0.16),
      y: (narrow ? 0.86 : 0.45) + Math.cos(now * 0.00009) * (narrow ? 0.05 : 0.2),
    };
  }

  private sample() {
    const { cols, rows, cell, field, width, height, noise, time } = this;
    // Roughly three to four hills across, whatever the canvas size.
    const freq = 1 / Math.min(440, Math.max(240, width * 0.3));
    const sx = this.summit.x * width;
    const sy = this.summit.y * height;
    const radius = Math.min(140, Math.max(90, width * 0.085));
    const falloff = 1 / (2 * radius * radius);
    const strength = reducedMotion.matches ? 0.9 : this.summit.strength;
    let i = 0;
    for (let r = 0; r <= rows; r++) {
      const y = r * cell;
      for (let c = 0; c <= cols; c++) {
        const x = c * cell;
        let v =
          noise(x * freq, y * freq, time) * 0.72 +
          noise(x * freq * 2.3 + 31.7, y * freq * 2.3 - 12.4, time * 1.6) * 0.28;
        const dx = x - sx;
        const dy = y - sy;
        const g = Math.exp(-(dx * dx + dy * dy) * falloff) * strength;
        if (g > 0.002) v = v * (1 - g) + g * 1.6;
        field[i++] = v;
      }
    }
  }

  private render() {
    this.sample();
    const { ctx, cols, rows, cell, field, width, height } = this;
    const stride = cols + 1;
    const minor = new Path2D();
    const index = new Path2D();
    const summit = new Path2D();

    for (let r = 0; r < rows; r++) {
      const y = r * cell;
      for (let c = 0; c < cols; c++) {
        const i0 = r * stride + c;
        const a = field[i0];
        const b = field[i0 + 1];
        const cc = field[i0 + stride + 1];
        const d = field[i0 + stride];
        const lo = Math.min(a, b, cc, d);
        const hi = Math.max(a, b, cc, d);
        const kHi = Math.floor(hi / STEP);
        for (let k = Math.ceil(lo / STEP); k <= kHi; k++) {
          const L = k * STEP;
          const path = L >= SUMMIT_LEVEL ? summit : k % INDEX_EVERY === 0 ? index : minor;
          addCell(path, a, b, cc, d, L, c * cell, y, cell);
        }
      }
    }

    ctx.clearRect(0, 0, width, height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 1;
    ctx.strokeStyle = this.colors.minor;
    ctx.stroke(minor);
    ctx.lineWidth = 1.35;
    ctx.strokeStyle = this.colors.index;
    ctx.stroke(index);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = this.colors.summit;
    ctx.stroke(summit);
  }
}

function init() {
  document.querySelectorAll<HTMLCanvasElement>('canvas[data-topo]').forEach((canvas) => {
    if (canvas.dataset.topoReady) return;
    canvas.dataset.topoReady = 'true';
    new TopoMap(canvas);
  });
}

init();
