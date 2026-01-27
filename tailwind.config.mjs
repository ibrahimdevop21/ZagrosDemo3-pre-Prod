/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				arabic: ['Cairo', 'sans-serif'],
				sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
			},
			colors: {
				// Semantic background colors
				'bg-base': 'rgb(var(--color-bg-base) / <alpha-value>)',
				'bg-surface': 'rgb(var(--color-bg-surface) / <alpha-value>)',
				'bg-surface-hover': 'rgb(var(--color-bg-surface-hover) / <alpha-value>)',
				'bg-surface-muted': 'rgb(var(--color-bg-surface-muted) / <alpha-value>)',
				'bg-brand': 'rgb(var(--color-bg-brand) / <alpha-value>)',
				'bg-brand-muted': 'rgb(var(--color-bg-brand-muted) / <alpha-value>)',
				'bg-brand-hover': 'rgb(var(--color-bg-brand-hover) / <alpha-value>)',
				
				// Semantic text colors
				'text-primary': 'rgb(var(--color-text-primary) / <alpha-value>)',
				'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
				'text-tertiary': 'rgb(var(--color-text-tertiary) / <alpha-value>)',
				'text-inverse': 'rgb(var(--color-text-inverse) / <alpha-value>)',
				'text-brand': 'rgb(var(--color-text-brand) / <alpha-value>)',
				
				// Brand colors
				'brand-primary': 'rgb(var(--color-brand-primary) / <alpha-value>)',
				'brand-primary-hover': 'rgb(var(--color-brand-primary-hover) / <alpha-value>)',
				'brand-accent': 'rgb(var(--color-brand-accent) / <alpha-value>)',
				
				// Utility colors
				'border-default': 'rgb(var(--color-border-default) / <alpha-value>)',
				'border-muted': 'rgb(var(--color-border-muted) / <alpha-value>)',
				'border-brand': 'rgb(var(--color-border-brand) / <alpha-value>)',
			},
			spacing: {
				// Section-level spacing
				'section-xs': 'var(--space-section-xs)',
				'section-sm': 'var(--space-section-sm)',
				'section-md': 'var(--space-section-md)',
				'section-lg': 'var(--space-section-lg)',
				
				// Content-level spacing
				'content-xs': 'var(--space-content-xs)',
				'content-sm': 'var(--space-content-sm)',
				'content-md': 'var(--space-content-md)',
				'content-lg': 'var(--space-content-lg)',
				'content-xl': 'var(--space-content-xl)',
			},
			maxWidth: {
				'prose': 'var(--prose-width)',
			},
		},
	},
	plugins: [
		require('@tailwindcss/forms'),
	],
}
