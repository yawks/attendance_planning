import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"

const manifestForPlugin = {
  registerType: "prompt",
  manifest: {
    name: "Presence Tracker",
    short_name: "Presence",
    description: "Une application simple pour suivre les présences.",
    icons: [
      {
        src: "src/assets/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "src/assets/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    theme_color: "#ffffff",
    background_color: "#ffffff",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait-primary",
  },
};

export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugin)],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
