module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx}', // Adjust based on your project structure
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        fontFamily: {
          custom: ['PP Neue Montreal', 'sans-serif'], // Define the custom font
        },
      },
    },
    plugins: [],
};