import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A5F', // Navy blue from logo - main brand color
          light: '#2D4A6F', // Lighter navy for hovers
          dark: '#152A4A', // Darker navy for depth
          lighter: '#3D5A7F', // Very light navy
          darkest: '#0F1F3A', // Darkest navy
        },
        teal: {
          DEFAULT: '#0F766E', // Teal from logo - secondary brand color
          light: '#14B8A6', // Lighter teal for accents
          dark: '#0D5D56', // Darker teal
          lighter: '#2DD4BF', // Very light teal
          accent: '#5EEAD4', // Bright teal accent
        },
        secondary: {
          DEFAULT: '#FFFFFF', // Pure white
          white: '#FFFFFF', // Pure white for luxury feel
          gray: '#FAFAFA', // Very light gray background - luxurious
          gray2: '#F5F5F5', // Slightly darker gray - premium
          gray3: '#E8E8E8', // Border gray - refined
        },
        accent: {
          blue: '#E0F2FE', // Light blue background (navy tint)
          blue2: '#BAE6FD', // Medium blue accent
          teal: '#CCFBF1', // Light teal background
          teal2: '#99F6E4', // Medium teal accent
          gray: '#64748B', // Medium gray text
          gray2: '#475569', // Darker gray text
          success: '#10B981', // Green for success states
          warning: '#F59E0B', // Amber for warnings
          error: '#EF4444', // Red for errors
        },
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
