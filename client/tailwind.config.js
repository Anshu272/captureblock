/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: {
                    primary: '#000000',
                    secondary: '#050505',
                    tertiary: '#0a0a0a',
                    input: 'rgba(255, 255, 255, 0.05)',
                    glass: 'rgba(0, 0, 0, 0.8)',
                },
                accent: {
                    primary: '#FFD700', // Gold
                    secondary: '#FFC107', // Amber
                    yellow: '#FFFF00',
                },
                status: {
                    success: '#4CAF50',
                    warning: '#FFD700',
                    danger: '#F44336',
                },
                text: {
                    primary: '#FFFFFF',
                    secondary: '#E0E0E0',
                    muted: '#808080',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                neon: '0 0 15px rgba(255, 215, 0, 0.3)',
                gold: '0 0 20px rgba(255, 215, 0, 0.2)',
                glass: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
            },
            backgroundImage: {
                'accent-gradient': 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)',
                'main-gradient': 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000000 100%)',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'claim': 'claim-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                'fade-in': 'fade-in 0.5s ease-out',
            },
            keyframes: {
                'claim-pop': {
                    '0%': { transform: 'scale(0.8)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                'fade-in': {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
