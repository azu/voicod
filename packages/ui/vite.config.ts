import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    plugins: [
        preact(),
        VitePWA({
            manifest: {
                background_color: "white",
                theme_color: "white",
                description: "Voice note editor",
                display: "fullscreen",
                lang: "ja-JP",
                icons: [
                    {
                        src: "https://voicod.pages.dev/voicodx192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "https://voicod.pages.dev/voicod.png",
                        sizes: "256x256",
                        type: "image/png",
                    },
                    {
                        src: "https://voicod.pages.dev/voicodx512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
                name: "Voicod",
                short_name: "voicod",
                start_url: ".",
            },
        }),
    ],
});
