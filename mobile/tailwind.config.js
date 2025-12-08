/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#007AFF', // iOS Blue
        secondary: '#5AC8FA', // iOS Light Blue
        background: '#F2F4F6', // Apple-style Gray
        'ios-blue': {
          DEFAULT: '#007AFF',
          50: '#EDF6FF',
          100: '#D6E9FF',
          200: '#B3D7FF',
          300: '#85C0FF',
          400: '#52A3FF',
          500: '#1F85FF',
          600: '#007AFF',
          700: '#0062CC',
          800: '#004C99',
          900: '#003973',
        },
        gray: {
          0: '#F8F9FA',
          100: '#F1F3F5',
          200: '#E9ECEF',
          300: '#DEE2E6',
          400: '#CED4DA',
          500: '#ADB5BD',
          600: '#868E96',
          700: '#495057',
          800: '#343A40',
          900: '#212529',
        }
      },
    },
  },
  plugins: [],
}

