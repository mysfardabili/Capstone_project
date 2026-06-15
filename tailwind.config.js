/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          dark: 'var(--primary-dark)',
          light: 'var(--primary-light)',
          bg: 'var(--primary-bg)',
        },
        background: 'var(--bg-color)',
        surface: 'var(--surface)',
        text: {
          main: 'var(--text-main)',
          muted: 'var(--text-muted)',
          inverse: 'var(--text-inverse)',
        },
        border: 'var(--border)',
        danger: 'var(--danger)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        icon: {
          blue: {
            bg: 'var(--icon-bg-blue)',
            color: 'var(--icon-color-blue)',
          },
          red: {
            bg: 'var(--icon-bg-red)',
            color: 'var(--icon-color-red)',
          },
          yellow: {
            bg: 'var(--icon-bg-yellow)',
            color: 'var(--icon-color-yellow)',
          },
          green: {
            bg: 'var(--icon-bg-green)',
            color: 'var(--icon-color-green)',
          },
        },
        table: {
          header: 'var(--table-header)',
          'row-hover': 'var(--table-row-hover)',
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'custom-sm': 'var(--shadow-sm)',
        'custom-md': 'var(--shadow-md)',
        'custom-lg': 'var(--shadow-lg)',
        'card': '0 10px 30px -5px rgba(0,0,0,0.05)',
      },
      borderRadius: {
        'custom-md': 'var(--radius-md)',
        'custom-lg': 'var(--radius-lg)',
      },
      animation: {
        'pulse-red': 'pulse-red 2s infinite',
        'fade-in': 'fadeIn 0.3s ease',
        'slide-in': 'slideIn 0.3s ease',
      },
      keyframes: {
        'pulse-red': {
          '0%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.4)' },
          '70%': { boxShadow: '0 0 0 10px rgba(239, 68, 68, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0)' },
        },
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(-5px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          'from': { opacity: '0', transform: 'translateX(100%)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
