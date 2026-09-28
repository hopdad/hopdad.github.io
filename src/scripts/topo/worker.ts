// Worker entry: renders a contour map into a transferred OffscreenCanvas, so
// drawing and compositing stay off the main thread.
import { createHost, type HostMessage } from './core';

const scope = self as unknown as {
  postMessage(message: unknown): void;
  onmessage: ((event: MessageEvent<HostMessage>) => void) | null;
};

const host = createHost(() => scope.postMessage('drawn'));
scope.onmessage = (event) => host(event.data);
