/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                coup: {
                    bg: '#09090b',
                    card: '#18181b',
                    'card-hover': '#27272a',
                    border: '#27272a',
                    'border-light': '#3f3f46',
                },
            },
            animation: {
                'fade-in': 'fade-in 0.5s ease-out forwards',
                'fade-in-up': 'fade-in-up 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards',
                'fade-in-down': 'fade-in-down 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards',
                'scale-in': 'scale-in 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards',
                'slide-in-right': 'slide-in-right 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards',
                'slide-in-left': 'slide-in-left 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards',
                'float': 'float 3s ease-in-out infinite',
                'card-enter': 'card-enter 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards',
                'shimmer': 'shimmer 2s infinite',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
            },
            keyframes: {
                'fade-in': {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
                'fade-in-up': {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                'fade-in-down': {
                    from: { opacity: '0', transform: 'translateY(-20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                'scale-in': {
                    from: { opacity: '0', transform: 'scale(0.95)' },
                    to: { opacity: '1', transform: 'scale(1)' },
                },
                'slide-in-right': {
                    from: { opacity: '0', transform: 'translateX(20px)' },
                    to: { opacity: '1', transform: 'translateX(0)' },
                },
                'slide-in-left': {
                    from: { opacity: '0', transform: 'translateX(-20px)' },
                    to: { opacity: '1', transform: 'translateX(0)' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-6px)' },
                },
                'card-enter': {
                    from: { opacity: '0', transform: 'translateY(30px) rotateX(-10deg)' },
                    to: { opacity: '1', transform: 'translateY(0) rotateX(0)' },
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                'pulse-glow': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.6' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
};