/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#4338ca', foreground: '#ffffff' }, /* indigo-700 */
        destructive: { DEFAULT: '#dc2626', foreground: '#ffffff' },
        ring: '#4338ca',
        background: '#ffffff',
        foreground: '#111827',
        card: '#ffffff',
        'card-foreground': '#111827',
        input: '#e5e7eb',
        muted: '#f3f4f6',
        'muted-foreground': '#6b7280',
        accent: '#f5f5f5',
        'accent-foreground': '#111827',
        border: '#e5e7eb',
      },
      borderRadius: { lg: '0.5rem' }
    },
  },
  plugins: [require('tailwindcss-animate')],
}
