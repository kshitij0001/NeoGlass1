import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        brutal: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        // User's Custom Pastel Palette
        // Palette 1: Cream/Beige tones
        'cream-1': '#fbf8cc',
        'cream-2': '#fde4cf', 
        'cream-3': '#ffcfd2',
        'cream-4': '#f1c0e8',
        'cream-5': '#cfbaf0',
        'cream-6': '#a3c4f3',
        'cream-7': '#90dbf4',
        'cream-8': '#8eecf5',
        'cream-9': '#98f5e1',
        'cream-10': '#b9fbc0',
        
        // Palette 2: Bright pastels - Updated subject colors
        'bright-1': '#ffadad',
        'bright-2': '#f3d9df', // Updated chemistry color
        'bright-3': '#fdffb6',
        'bright-4': '#95D2B3', // Updated biology color
        'bright-5': '#9bf6ff',
        'bright-6': '#e9897e', // Updated physics color
        'bright-7': '#bdb2ff',
        'bright-8': '#ffc6ff',
        'bright-9': '#fffffc',
        
        // Palette 3: Muted tones
        'muted-1': '#e4dde3',
        'muted-2': '#ffd1ad',
        'muted-3': '#fbc5c8',
        'muted-4': '#f5a3c0',
        'muted-5': '#dae7e3',
        'muted-6': '#99ced6',
        'muted-7': '#ffd4b0',
        'muted-8': '#f6d6ff',
        'muted-9': '#8b9ed4',
        'muted-10': '#c1baea',
        
        // Palette 4: Soft neutrals
        'soft-1': '#e4dde3',
        'soft-2': '#f9c8da',
        'soft-3': '#fbdadc',
        'soft-4': '#fff1e6',
        'soft-5': '#dae7e3',
        'soft-6': '#bee1e6',
        'soft-7': '#edece8',
        'soft-8': '#e3e7f2',
        'soft-9': '#f6cbcb',
        'soft-10': '#cddafd',
        
        // Palette 5: Yellow/Green gradient
        'gradient-1': '#ffe09e',
        'gradient-2': '#fff394',
        'gradient-3': '#fbff94',
        'gradient-4': '#eeff8f',
        'gradient-5': '#e1ff94',
        'gradient-6': '#cfff91',
        'gradient-7': '#c0ff8c',
        'gradient-8': '#9dff8a',
        'gradient-9': '#94ffaf',
        'gradient-10': '#a6fff2',
        'dark-text': 'hsl(220, 15%, 25%)', // Much darker text for readability
        'glass-white': 'rgba(255, 255, 255, 0.1)',
        'glass-dark': 'rgba(0, 0, 0, 0.1)',
        // Subject Colors with Contrast
        'physics-color': 'var(--physics-color)',
        'physics-contrast': 'var(--physics-contrast)',
        'chemistry-color': 'var(--chemistry-color)',
        'chemistry-contrast': 'var(--chemistry-contrast)',
        'biology-color': 'var(--biology-color)',
        'biology-contrast': 'var(--biology-contrast)',
        // Difficulty Colors with Contrast
        'difficulty-easy': 'var(--difficulty-easy-color)',
        'difficulty-easy-contrast': 'var(--difficulty-easy-contrast)',
        'difficulty-medium': 'var(--difficulty-medium-color)',
        'difficulty-medium-contrast': 'var(--difficulty-medium-contrast)',
        'difficulty-hard': 'var(--difficulty-hard-color)',
        'difficulty-hard-contrast': 'var(--difficulty-hard-contrast)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'soft': '0 4px 16px rgba(0, 0, 0, 0.05)',
        'soft-sm': '0 2px 8px rgba(0, 0, 0, 0.05)', 
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backdropBlur: {
        'glass': '16px',
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fab-pulse": {
          "0%, 100%": { 
            opacity: "1",
            transform: "scale(1)",
          },
          "50%": { 
            opacity: "0.8",
            transform: "scale(1.05)",
          },
        },
        "streak-pulse": {
          "0%, 100%": { 
            transform: "scale(1)",
          },
          "50%": { 
            transform: "scale(1.05)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fab-pulse": "fab-pulse 2s infinite",
        "streak-pulse": "streak-pulse 2s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
