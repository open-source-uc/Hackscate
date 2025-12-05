// Polyfill for MessageChannel in Cloudflare Workers
// React's scheduler uses MessageChannel for its async scheduling
if (typeof MessageChannel === 'undefined') {
  // @ts-ignore
  globalThis.MessageChannel = class MessageChannel {
    port1: {
      onmessage: ((ev: { data: any }) => void) | null;
      postMessage: (data: any) => void;
      close: () => void;
    };
    port2: {
      onmessage: ((ev: { data: any }) => void) | null;
      postMessage: (data: any) => void;
      close: () => void;
    };

    constructor() {
      const channel = this;
      this.port1 = {
        onmessage: null,
        postMessage(data: any) {
          if (channel.port2.onmessage) {
            queueMicrotask(() => {
              channel.port2.onmessage?.({ data });
            });
          }
        },
        close() {}
      };
      this.port2 = {
        onmessage: null,
        postMessage(data: any) {
          if (channel.port1.onmessage) {
            queueMicrotask(() => {
              channel.port1.onmessage?.({ data });
            });
          }
        },
        close() {}
      };
    }
  };
}

export {};
