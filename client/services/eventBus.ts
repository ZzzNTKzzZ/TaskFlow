export type Handler = (payload?: any) => void;

const listeners: Map<string, Set<Handler>> = new Map();

export const on = (event: string, handler: Handler) => {
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event)!.add(handler);
  return () => off(event, handler);
};

export const off = (event: string, handler: Handler) => {
  const s = listeners.get(event);
  if (s) s.delete(handler);
};

export const emit = (event: string, payload?: any) => {
  const s = listeners.get(event);
  if (!s) return;
  for (const h of Array.from(s)) {
    try {
      h(payload);
    } catch (e) {
      // swallow handler errors
      console.error(`eventBus handler error for event ${event}:`, e);
    }
  }
};

export default { on, off, emit };