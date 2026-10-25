import type { CapacitorConfig } from "@capacitor/cli";

// The app opens the live site, so it always uses the same content and Supabase data.
const config: CapacitorConfig = {
  appId: "com.sololearn.app",
  appName: "Solo Learn",
  webDir: "www",
  server: {
    url: "https://sololearn-elhawy1.vercel.app",
    cleartext: false,
  },
};

export default config;
