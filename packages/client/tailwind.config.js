/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                coup: {
                    bg: '#0a0a0a',
                    card: '#1a1a1a',
                    border: '#333333',
                    accent: '#ffffff',
                },
            },
            animation: {
                'flip': 'flip 0.6s ease-in-out',
                'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                flip: {
                    '0%': { transform: 'rotateY(0deg)' },
                    '50%': { transform: 'rotateY(90deg)' },
                    '100%': { transform: 'rotateY(0deg)' },
                },
            },
        },
    },
    plugins: [],
};
