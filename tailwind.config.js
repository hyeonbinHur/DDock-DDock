/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
    theme: {
        extend: {
            colors: {
                community: {
                    1: '#d0dff8',
                },
            },
            width: {
                '120' :'60rem' 
            }
        },
    },
    plugins: [],
};
