import type { Config } from "tailwindcss";
import theme, { fontFamily } from "tailwindcss/defaultTheme";
import sharedConfig from "@suzu/ui/tailwind.config";
import plugin from "tailwindcss/plugin";
const path = require("path");

const config: Config = {
  presets: [sharedConfig],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    path.join(
      path.dirname(require.resolve("@suzu/ui")),
      "**/*.{js,ts,jsx,tsx,mdx}",
    ),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "trans-black-5": "rgba(31, 31, 31, 0.05)",
        "trans-black-10": "rgba(31, 31, 31, 0.1)",
        "trans-black-20": "rgba(31, 31, 31, 0.2)",
        "trans-black-30": "rgba(31, 31, 31, 0.3)",
        "trans-black-40": "rgba(31, 31, 31, 0.4)",
        "trans-black-50": "rgba(31, 31, 31, 0.5)",
        "trans-black-60": "rgba(31, 31, 31, 0.6)",
        "trans-black-70": "rgba(31, 31, 31, 0.7)",
        "trans-black-80": "rgba(31, 31, 31, 0.8)",
        "trans-black-90": "rgba(31, 31, 31, 0.9)",

        "trans-neutral-5": "rgba(245, 245, 245, 0.05)",
        "trans-neutral-10": "rgba(245, 245, 245, 0.1)",
        "trans-neutral-20": "rgba(245, 245, 245, 0.2)",
        "trans-neutral-30": "rgba(245, 245, 245, 0.3)",
        "trans-neutral-40": "rgba(245, 245, 245, 0.4)",
        "trans-neutral-50": "rgba(245, 245, 245, 0.5)",
        "trans-neutral-60": "rgba(245, 245, 245, 0.6)",
        "trans-neutral-70": "rgba(245, 245, 245, 0.7)",
        "trans-neutral-80": "rgba(245, 245, 245, 0.8)",
        "trans-neutral-90": "rgba(245, 245, 245, 0.9)",

        "trans-white-5": "rgba(255, 255, 255, 0.05)",
        "trans-white-10": "rgba(255, 255, 255, 0.1)",
        "trans-white-20": "rgba(255, 255, 255, 0.2)",
        "trans-white-30": "rgba(255, 255, 255, 0.3)",
        "trans-white-40": "rgba(255, 255, 255, 0.4)",
        "trans-white-50": "rgba(255, 255, 255, 0.5)",
        "trans-white-60": "rgba(255, 255, 255, 0.6)",
        "trans-white-70": "rgba(255, 255, 255, 0.7)",
        "trans-white-80": "rgba(255, 255, 255, 0.8)",
        "trans-white-90": "rgba(255, 255, 255, 0.9)",
      },
      maxHeight: {
        custom: "calc(100dvh - 170px)",
      },
      height: {
        custom: "calc(100dvh - 90px)",
      },
      borderRadius: {
        base: "20px",
      },
      boxShadow: {
        "common-sm":
          "0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06)",
        "common-lg":
          "4px 0px 6px -2px rgba(16, 24, 40, 0.03), 12px 0px 16px -4px rgba(16, 24, 40, 0.08)",
        "common-xl":
          "0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)",
      },
      backgroundColor: {
        "trans-black": "rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [
    function ({ addUtilities }: { addUtilities: Function }) {
      const newUtilities = {
        ".content": {
          content: "attr(data-placeholder)",
        },
        ".backdrop-blur-sm": {
          "backdrop-filter": "blur(8px)",
        },
        ".backdrop-blur-lg": {
          "backdrop-filter": "blur(16px)",
        },
        ".before:empty::before": {
          content: "attr(data-placeholder)",
          float: "left",
          height: "0",
          "pointer-events": "none",
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
    plugin(({ addComponents, theme }) => {
      addComponents({
        ".btn": {
          width: "100%",
          height: theme("spacing.10"),
          borderRadius: theme("borderRadius.full"),
          fontSize: theme("fontSize.[15px]"),
          minWidth: "127px",
          padding: "8px 16px",
        },
        ".btn-default": {
          "&:not(:disabled)": {
            backgroundColor: theme("colors.neutral.900"),
            color: theme("colors.neutral.50"),
          },
          "&:disabled": {
            backgroundColor: "rgba(0, 0, 0, .05)",
            color: theme("colors.neutral.300"),
          },
        },
      });
    }),
  ],
};
export default config;
