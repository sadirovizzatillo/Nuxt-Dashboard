/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './app.vue',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#e6f0ff',
                    100: '#b3d1ff',
                    200: '#80b3ff',
                    300: '#4d94ff',
                    400: '#1a75ff',
                    500: '#0056e0',
                    600: '#0043ad',
                    700: '#00307a',
                    800: '#001d47',
                    900: '#000a14',
                },
            },
            fontFamily: {
                sans: ['Nunito Sans', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
