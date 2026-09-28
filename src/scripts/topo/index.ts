// Live topographic contour map for <canvas data-topo> (see core.ts).
//
// Options (data attributes): data-seed, data-interactive, data-intensity.
// Add `data-topo-host` to the container that should steer the summit.
//
// Where OffscreenCanvas is supported, each map renders in its own worker; this
// module only watches the DOM (size, visibility, theme, pointer, motion
// preference) and posts messages. Otherwise the same loop runs here.
import { createHost, type HostMessage, type Palette } from './core';
import TopoWorker from './worker?worker';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function readPalette(canvas: HTMLCanvasElement, intensity: number): Palette {
  const styles = getComputedStyle(canvas);
  const contour = styles.getPropertyValue('--contour').trim() || '244 239 227';
  const accent = styles.getPropertyValue('--accent').trim() || '199 91 48';
  return {
    minor: `rgb(${contour} / ${0.1 * intensity})`,
    index: `rgb(${contour} / ${0.22 * intensity})`,
    summit: `rgb(${accent} / ${Math.min(1, 0.85 * intensity)})`,
  };
}

function connect(canvas: HTMLCanvasElement) {
  const drawn = () => canvas.classList.add('is-drawn');
  if ('transferControlToOffscreen' in canvas) {
    try {
      const worker = new TopoWorker();
      worker.onmessage = drawn;
      const offscreen = canvas.transferControlToOffscreen();
      return {
        target: offscreen,
        send: (msg: HostMessage, transfer: Transferable[] = []) =>
          worker.postMessage(msg, transfer),
      };
    } catch {
      // Fall through to the main-thread renderer.
    }
  }
  const host = createHost(drawn);
  return { target: canvas, send: (msg: HostMessage) => host(msg) };
}

function mount(canvas: HTMLCanvasElement) {
  const intensity = Number(canvas.dataset.intensity ?? 1);
  const { target, send } = connect(canvas);
  const rect = canvas.getBoundingClientRect();
  send(
    {
      type: 'init',
      canvas: target,
      seed: Number(canvas.dataset.seed ?? 7),
      palette: readPalette(canvas, intensity),
      width: rect.width,
      height: rect.height,
      dpr: window.devicePixelRatio,
      still: reducedMotion.matches,
    },
    target === canvas ? [] : [target as OffscreenCanvas]
  );

  new ResizeObserver(([entry]) => {
    const { width, height } = entry.contentRect;
    send({ type: 'resize', width, height, dpr: window.devicePixelRatio });
  }).observe(canvas);

  let visible = false;
  const run = () => send({ type: 'run', running: visible && !document.hidden });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    run();
  }).observe(canvas);
  document.addEventListener('visibilitychange', run);

  reducedMotion.addEventListener('change', () =>
    send({ type: 'still', still: reducedMotion.matches })
  );

  // Recolor when the theme class on <html> changes.
  new MutationObserver(() =>
    send({ type: 'palette', palette: readPalette(canvas, intensity) })
  ).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  if (canvas.dataset.interactive !== undefined) {
    const host = (canvas.closest('[data-topo-host]') as HTMLElement) ?? canvas.parentElement!;
    host.addEventListener(
      'pointermove',
      (e) => {
        if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
        const box = canvas.getBoundingClientRect();
        send({
          type: 'pointer',
          x: (e.clientX - box.left) / box.width,
          y: (e.clientY - box.top) / box.height,
        });
      },
      { passive: true }
    );
    host.addEventListener('pointerleave', () => send({ type: 'leave' }));
  }
}

// Decorative, so it waits for the page to settle; the canvas fades in (see Topo.astro).
const whenIdle = (fn: () => void) =>
  'requestIdleCallback' in window
    ? requestIdleCallback(fn, { timeout: 1200 })
    : setTimeout(fn, 200);

document.querySelectorAll<HTMLCanvasElement>('canvas[data-topo]').forEach((canvas) => {
  if (canvas.dataset.topoReady) return;
  canvas.dataset.topoReady = 'true';
  whenIdle(() => mount(canvas));
});
