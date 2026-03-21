import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { transformWithEsbuild } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function jsxInJsPlugin() {
  return {
    name: "jsx-in-js",
    enforce: "pre",
    async transform(code, id) {
      const fid = id.replace(/\\/g, "/");
      if (!fid.includes("/src/") || !fid.endsWith(".js")) return null;
      return transformWithEsbuild(code, id, {
        loader: "jsx",
        jsx: "automatic",
      });
    },
  };
}

export default defineConfig({
  plugins: [jsxInJsPlugin(), react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: path.join(__dirname, "src/setupVitest.js"),
    include: ["src/**/*.test.{js,jsx}"],
    css: true,
  },
});
