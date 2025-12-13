import desktopPlugin from "@kerna/desktop-client/desktop-variants";
import baseConfig from "@kerna/ui/tailwind.config";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
    "../../packages/invoice/src/**/*.{ts,tsx}",
  ],
  presets: [baseConfig],
  plugins: [desktopPlugin],
} satisfies Config;
