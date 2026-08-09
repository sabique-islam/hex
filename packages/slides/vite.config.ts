import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

/** Prebundle @hex/slides with Univer 0.24 inlined so the Next host can keep Univer 0.25 for sheets. */
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "HexSlides",
      formats: ["es"],
      fileName: () => "hex-slides.js",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
    },
    cssCodeSplit: false,
    sourcemap: true,
    emptyOutDir: true,
  },
});
