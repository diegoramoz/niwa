import type { MetadataRoute } from "next";
import { APP } from "@/lib/metadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP.displayName,
    short_name: APP.shortName,
    description: APP.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#000000",
    categories: ["business", "productivity"],
    // Enable deep linking by adding protocol handler
    protocol_handlers: [
      {
        protocol: `web+${APP.shortName.toLowerCase()}`,
        url: "/%s",
      },
    ],
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
