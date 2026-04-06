type EventPayload = Record<string, any>;

type Listener = (payload: EventPayload) => Promise<void>;

class EventBus {
  private listeners: Record<string, Listener[]> = {};

  on(event: string, listener: Listener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  async emit(event: string, payload: EventPayload) {
    const handlers = this.listeners[event] || [];

    await Promise.all(handlers.map(h => h(payload)));
  }
}

export const eventBus = new EventBus();