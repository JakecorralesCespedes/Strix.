import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      $lib: path.resolve("./src/lib"),
      $components: path.resolve("./src/lib/components"),
      $services: path.resolve("./src/lib/services"),
      $stores: path.resolve("./src/stores"),
      $utils: path.resolve("./src/lib/utils"),
      $pages: path.resolve("./src/lib/pages"),
    },
  },
});
