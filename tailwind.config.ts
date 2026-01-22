import type { Config } from "tailwindcss"

const config: Config = {
    darkMode: ["class"],
    content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		animation: {
  			'gradient-shimmer': 'gradient-shimmer 3s ease-in-out infinite',
  			'glow-breathe': 'glow-breathe 4s ease-in-out infinite',
  			'glow-drift-slow': 'glow-drift-slow 8s ease-in-out infinite',
  			'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
  			'fade-in-up-stagger': 'fade-in-up 0.6s ease-out forwards',
  			'scale-in': 'scale-in 0.5s ease-out forwards',
  			'ambient-drift': 'ambient-drift 20s ease-in-out infinite',
  			'particle-float': 'particle-float 8s ease-in-out infinite',
  			'reveal-from-left': 'reveal-from-left 0.8s ease-out forwards',
  			'reveal-from-left-slow': 'reveal-from-left-slow 1.5s ease-out forwards',
  			'reveal-from-right': 'reveal-from-right 0.8s ease-out forwards',
  			'reveal-from-top': 'reveal-from-top 0.8s ease-out forwards',
  			'gradient': 'gradient 8s linear infinite',
  			'zoom-in-slow': 'zoom-in-slow 25s ease-in-out infinite',
  			'scroll-logos-ltr': 'scroll-logos-ltr 50s linear infinite',
  			'scroll-logos-rtl': 'scroll-logos-rtl 50s linear infinite',
  			'float-up': 'float-up 0.8s ease-out forwards',
  			'float-up-delay-1': 'float-up 0.8s ease-out 0.1s forwards',
  			'float-up-delay-2': 'float-up 0.8s ease-out 0.2s forwards',
  			'float-up-delay-3': 'float-up 0.8s ease-out 0.3s forwards',
  			'float-up-delay-4': 'float-up 0.8s ease-out 0.4s forwards',
  			'float-up-delay-5': 'float-up 0.8s ease-out 0.5s forwards',
  			'float-up-delay-6': 'float-up 0.8s ease-out 0.6s forwards',
  			'float': 'float 6s ease-in-out infinite',
  		},
  		keyframes: {
  			'gradient-shimmer': {
  				'0%, 100%': { backgroundPosition: '0% 50%' },
  				'50%': { backgroundPosition: '100% 50%' },
  			},
  			'glow-breathe': {
  				'0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
  				'50%': { opacity: '0.6', transform: 'scale(1.05)' },
  			},
  			'glow-drift-slow': {
  				'0%, 100%': { transform: 'translate(0, 0) scale(1)' },
  				'50%': { transform: 'translate(20px, -20px) scale(1.1)' },
  			},
  			'pulse-glow': {
  				'0%, 100%': { opacity: '0.3' },
  				'50%': { opacity: '0.5' },
  			},
  			'fade-in-up': {
  				'0%': { opacity: '0', transform: 'translateY(20px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' },
  			},
  			'scale-in': {
  				'0%': { opacity: '0', transform: 'scale(0.9)' },
  				'100%': { opacity: '1', transform: 'scale(1)' },
  			},
  			'ambient-drift': {
  				'0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.3' },
  				'33%': { transform: 'translate(30px, -30px) scale(1.1)', opacity: '0.4' },
  				'66%': { transform: 'translate(-20px, 20px) scale(0.95)', opacity: '0.35' },
  			},
  			'particle-float': {
  				'0%, 100%': { transform: 'translateY(0px)', opacity: '0.4' },
  				'50%': { transform: 'translateY(-20px)', opacity: '0.6' },
  			},
  			'reveal-from-left': {
  				'0%': { opacity: '0', transform: 'translateX(-30px)' },
  				'100%': { opacity: '1', transform: 'translateX(0)' },
  			},
  			'reveal-from-left-slow': {
  				'0%': { opacity: '0', transform: 'translateX(-50px)' },
  				'100%': { opacity: '1', transform: 'translateX(0)' },
  			},
  			'reveal-from-right': {
  				'0%': { opacity: '0', transform: 'translateX(30px)' },
  				'100%': { opacity: '1', transform: 'translateX(0)' },
  			},
  			'reveal-from-top': {
  				'0%': { opacity: '0', transform: 'translateY(-30px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' },
  			},
  			'gradient': {
  				'0%': { backgroundPosition: '0% 50%' },
  				'100%': { backgroundPosition: '200% 50%' },
  			},
  			'zoom-in-slow': {
  				'0%': { transform: 'scale(1)' },
  				'100%': { transform: 'scale(1.1)' },
  			},
  			'scroll-logos-ltr': {
  				'0%': { transform: 'translateX(0%)' },
  				'100%': { transform: 'translateX(-50%)' },
  			},
  			'scroll-logos-rtl': {
  				'0%': { transform: 'translateX(-50%)' },
  				'100%': { transform: 'translateX(0%)' },
  			},
  			'float-up': {
  				'0%': { opacity: '0', transform: 'translateY(30px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' },
  			},
  			'float': {
  				'0%, 100%': { transform: 'translateY(0px)' },
  				'50%': { transform: 'translateY(-10px)' },
  			},
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))',
  				dark: 'hsl(220 60% 12%)',
  				light: 'hsl(220 40% 25%)',
  			},
  			navy: {
  				DEFAULT: 'hsl(220, 50%, 25%)',
  				light: 'hsl(220, 50%, 35%)',
  				dark: 'hsl(220, 50%, 20%)',
  			},
  			teal: {
  				DEFAULT: 'hsl(180, 45%, 40%)',
  				light: 'hsl(180, 45%, 50%)',
  				dark: 'hsl(180, 45%, 35%)',
  			},
  			navy: {
  				DEFAULT: 'hsl(220, 50%, 25%)',
  				light: 'hsl(220, 50%, 35%)',
  				dark: 'hsl(220, 50%, 20%)',
  			},
  			teal: {
  				DEFAULT: 'hsl(180, 45%, 40%)',
  				light: 'hsl(180, 45%, 50%)',
  				dark: 'hsl(180, 45%, 35%)',
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))',
  				blue: 'hsl(217 91% 60%)',
  				gray2: 'hsl(0 0% 45.1%)',
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontSize: {
  			'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.05em' }],
  			'sm': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0.02em' }],
  			'base': ['1rem', { lineHeight: '1.75', letterSpacing: '0.01em' }],
  			'lg': ['1.125rem', { lineHeight: '1.75', letterSpacing: '0.01em' }],
  			'xl': ['1.25rem', { lineHeight: '1.75', letterSpacing: '0em' }],
  			'2xl': ['1.5rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
  			'3xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
  			'4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
  			'5xl': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
  			'6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
  		},
  		letterSpacing: {
  			'tighter': '-0.03em',
  			'tight': '-0.02em',
  			'normal': '0.01em',
  			'wide': '0.02em',
  			'wider': '0.05em',
  		},
  		lineHeight: {
  			'relaxed': '1.75',
  			'loose': '1.8',
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
