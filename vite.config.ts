import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
        'process.env.PRIVATE_KEY': `"${process.env.PRIVATE_KEY}"`,
        'process.env.POLYSCAN_API_KEY': `"${process.env.POLYSCAN_API_KEY}"`
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
            buffer: true
        })
    ]
    },
  },
  resolve: {
    alias: {
      process: "process/browser",
      stream: "stream-browserify",
      util: "util",
    },
  },
});