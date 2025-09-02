import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"

const manifestForPlugin = {
  registerType: "prompt",
  includeAssets: ["icon-192x192.svg", "icon-512x512.svg"],
  manifest: {
    name: "Presence Tracker",
    short_name: "Presence",
    description: "Une application simple pour suivre les présences.",
    icons: [
      {
        src: "/icon-192x192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/icon-512x512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
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

const PORT = 8080;

export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugin)],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: { port: PORT, host: true },
  preview: { port: PORT, host: true },
})
