/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  important: false,
  separator: ':',
  corePlugins: {
    preflight: true,
    container: true,
  },
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-slow': 'bounceGentle 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'rotate-slow': 'rotateSlow 20s linear infinite',
        'gradient': 'gradientShift 8s ease infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'ripple': 'ripple 0.6s linear',
        'morphing': 'morphing 8s ease-in-out infinite',
        'bounce-gentle': 'bounceGentle 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px) scale(0.95)',
            filter: 'blur(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
            filter: 'blur(0)'
          },
        },
        slideUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px) rotateX(15deg)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) rotateX(0)'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '33%': { transform: 'translateY(-10px) rotate(1deg)' },
          '66%': { transform: 'translateY(-5px) rotate(-1deg)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
            transform: 'scale(1)'
          },
          '50%': {
            boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)',
            transform: 'scale(1.05)'
          },
        },
        rotateSlow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        morphing: {
          '0%, 100%': {
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%'
          },
          '50%': {
            borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%'
          },
        },
      },
      fontFamily: {
        sans: ['system-ui', 'Cairo', 'Tajawal', 'sans-serif'],
        display: ['Cairo', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        gradient: {
          start: '#667eea',
          middle: '#764ba2',
          end: '#f093fb',
        }
      },
      backdropBlur: {
        xs: '2px',
        '3xl': '64px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-lg': '0 0 30px rgba(59, 130, 246, 0.4)',
        'glow-xl': '0 0 40px rgba(59, 130, 246, 0.5)',
        'glow-2xl': '0 0 60px rgba(59, 130, 246, 0.6)',
        'inner-glow': 'inset 0 0 20px rgba(59, 130, 246, 0.2)',
        'neon': '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
        'soft': '0 2px 40px rgba(0, 0, 0, 0.1)',
        'float': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'hover': '0 20px 40px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
        '115': '1.15',
      },
      rotate: {
        '1': '1deg',
        '2': '2deg',
        '3': '3deg',
      },
      blur: {
        '4xl': '72px',
        '5xl': '96px',
      },
      grayscale: {
        25: '0.25',
        75: '0.75',
      },
      saturate: {
        25: '.25',
        75: '.75',
      },
      perspective: {
        '500': '500px',
        '1000': '1000px',
        '2000': '2000px',
      },
      transformOrigin: {
        'center-center': '50% 50%',
      },
      transitionProperty: {
        'spacing': 'margin, padding',
        'colors-shadows': 'color, background-color, border-color, text-decoration-color, fill, stroke, box-shadow',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.25, 0.8, 0.25, 1)',
        'elastic': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
      },
      willChange: {
        'transform-opacity': 'transform, opacity',
        'auto': 'auto',
        'scroll': 'scroll-position',
      }
    },
  },
  plugins: [
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.text-gradient': {
          'background-image': 'linear-gradient(45deg, #667eea, #764ba2)',
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          'color': 'transparent',
        },
        '.text-gradient-animated': {
          'background': 'linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c)',
          'background-size': '300% 300%',
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          'color': 'transparent',
          'animation': 'gradientShift 5s ease infinite',
        },
        '.glass': {
          'background': 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.card-hover': {
          'transition': 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          '&:hover': {
            'transform': 'translateY(-8px) scale(1.02)',
            'box-shadow': '0 20px 40px rgba(0, 0, 0, 0.1)',
          }
        },
        '.btn-magnetic': {
          'position': 'relative',
          'transition': 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
          '&:hover': {
            'transform': 'translateY(-2px)',
            'box-shadow': '0 10px 25px rgba(0, 0, 0, 0.15)',
          }
        },
        '.perspective-1000': {
          'perspective': '1000px',
        },
        '.transform-style-3d': {
          'transform-style': 'preserve-3d',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
        '.gpu-layer': {
          'transform': 'translateZ(0)',
          'backface-visibility': 'hidden',
          'perspective': '1000px',
        }
      }
      addUtilities(newUtilities)
    }
  ],
};
