import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic tokens wired to CSS variables so the same classes work in
        // both dark (default) and light themes.
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        elevated: "rgb(var(--elevated) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        faint: "rgb(var(--faint) / <alpha-value>)",
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          soft: "rgb(var(--accent-soft) / <alpha-value>)",
        },
        warm: "rgb(var(--warm) / <alpha-value>)",
        gold: "rgb(var(--gold) / <alpha-value>)",
        ember: "rgb(var(--ember) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "fluid-xl": "clamp(2.5rem, 6vw, 5.5rem)",
        "fluid-lg": "clamp(2rem, 4.5vw, 4rem)",
        "fluid-md": "clamp(1.5rem, 3vw, 2.5rem)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        glow: "0 0 50px -12px rgb(var(--accent) / 0.32)",
        "glow-lg": "0 0 100px -24px rgb(var(--accent) / 0.4)",
        neu: "8px 8px 24px rgb(0 0 0 / 0.45), -6px -6px 20px rgb(255 255 255 / 0.03)",
        "inner-line": "inset 0 1px 0 0 rgb(255 255 255 / 0.06)",
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(circle at 50% 0%, rgb(var(--accent) / 0.18), transparent 55%)",
        "grid-fade":
          "linear-gradient(rgb(var(--line) / 0.5) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--line) / 0.5) 1px, transparent 1px)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-18px)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        // Magic UI / Aceternity effect keyframes
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
        "border-beam": {
          "100%": { "offset-distance": "100%" },
        },
        meteor: {
          "0%": { transform: "rotate(var(--angle)) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(var(--angle)) translateX(-500px)",
            opacity: "0",
          },
        },
        spotlight: {
          "0%": { opacity: "0", transform: "translate(-72%, -62%) scale(0.5)" },
          "100%": { opacity: "1", transform: "translate(-50%,-40%) scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.16,1,0.3,1) both",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin-slow 24s linear infinite",
        shimmer: "shimmer 2.4s infinite",
        "gradient-pan": "gradient-pan 8s ease infinite",
        blink: "blink 1s step-end infinite",
        marquee: "marquee var(--duration, 40s) linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration, 40s) linear infinite",
        "border-beam": "border-beam calc(var(--duration, 8) * 1s) infinite linear",
        meteor: "meteor var(--meteor-duration, 5s) linear infinite",
        spotlight: "spotlight 2s ease 0.6s 1 forwards",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
