/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        cream: '#FDF8F0',
        ivory: '#FFFEF7',
        gold: '#FFB356',
        'sky-blue': '#1FA7E1',
        'sage-green': '#75D06A',
        'coral-rose': '#FF8B8B',
        charcoal: '#2D3436',
        'warm-gray': '#636E72',
        'light-gray': '#B2BEC3',
      },
      fontFamily: {
        'nunito': ['Nunito_400Regular'],
        'nunito-medium': ['Nunito_500Medium'],
        'nunito-semibold': ['Nunito_600SemiBold'],
        'nunito-bold': ['Nunito_700Bold'],
        'nunito-extrabold': ['Nunito_800ExtraBold'],
      },
    },
  },
  plugins: [],
};
