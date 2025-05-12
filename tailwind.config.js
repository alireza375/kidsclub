
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/**/*.blade.php',
        './resources/**/*.js',
        './resources/**/*.jsx',
        './resources/**/*.vue',
    ],
    theme: {
        extend: {

            fontFamily: {
                poppins: ['Poppins', 'sans-serif'],
                nunito: ['Nunito', 'sans-serif'],
                arial: ['arial', 'sans-serif'],
            },
            colors: {
                'rose': '#FCCDDA',
                'primary' : '#FE5C45',
                'secondary' : '#0C1A40',
                'text' : '#0C1A40',
                'coralred': '#FCF7EE',
                'navbar': '#00D5FE',
                'bgcolor': '#FCF6EE',
                'tertiary': '#49D574',
                // 'quaternary': '#FFC700',
                'breadcrumb': '#2E3C63',
                'dark-rose': '#FFD8D8',
                'teal-blue' : '#376179',

            },
            boxShadow: {
                dashboard: "0px 0px 20px 0px rgba(0, 0, 0, 0.10)", // Add the custom box shadow
              },
            screens: {
                "1xl": '1360px',
                "2.5xl": '1700px',
                "3xl": '1920px',
            },
            animation: {
        'spin-slow': 'spin 5s linear infinite',
      },

        },
    },
    plugins: [],
};
