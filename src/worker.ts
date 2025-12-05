// Custom worker entry point that includes polyfills for Cloudflare Workers
// Polyfill MessageChannel before any other imports
if (typeof MessageChannel === 'undefined') {
  // @ts-ignore
  globalThis.MessageChannel = class MessageChannel {
    port1: any;
    port2: any;

    constructor() {
      const channel = this;
      this.port1 = {
        onmessage: null as ((ev: { data: any }) => void) | null,
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
        onmessage: null as ((ev: { data: any }) => void) | null,
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

import type { SSRManifest } from 'astro';
import { App } from 'astro/app';
import { handle } from '@astrojs/cloudflare/handler';

export function createExports(manifest: SSRManifest) {
  const app = new App(manifest);
  return {
    default: {
      // @ts-ignore - Cloudflare Workers types
      async fetch(request, env, ctx) {
        return handle(manifest, app, request, env, ctx);
      }
    }
  };
}
