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
				// Brand colors - Deep Agricultural Green
				'brand-primary': 'rgb(var(--color-brand-primary) / <alpha-value>)',
				'brand-primary-hover': 'rgb(var(--color-brand-primary-hover) / <alpha-value>)',
				'brand-primary-light': 'rgb(var(--color-brand-primary-light) / <alpha-value>)',
				'brand-primary-muted': 'rgb(var(--color-brand-primary-muted) / <alpha-value>)',
				
				// Accent colors - Warm Agricultural Yellow
				'accent-primary': 'rgb(var(--color-accent-primary) / <alpha-value>)',
				'accent-hover': 'rgb(var(--color-accent-hover) / <alpha-value>)',
				'accent-light': 'rgb(var(--color-accent-light) / <alpha-value>)',
				'accent-muted': 'rgb(var(--color-accent-muted) / <alpha-value>)',
				
				// Background hierarchy
				'bg-base': 'rgb(var(--color-bg-base) / <alpha-value>)',
				'bg-surface': 'rgb(var(--color-bg-surface) / <alpha-value>)',
				'bg-surface-alt': 'rgb(var(--color-bg-surface-alt) / <alpha-value>)',
				'bg-surface-hover': 'rgb(var(--color-bg-surface-hover) / <alpha-value>)',
				'bg-green-tint': 'rgb(var(--color-bg-green-tint) / <alpha-value>)',
				'bg-green-light': 'rgb(var(--color-bg-green-light) / <alpha-value>)',
				'bg-yellow-tint': 'rgb(var(--color-bg-yellow-tint) / <alpha-value>)',
				'bg-brand': 'rgb(var(--color-bg-brand) / <alpha-value>)',
				'bg-brand-hover': 'rgb(var(--color-bg-brand-hover) / <alpha-value>)',
				'bg-brand-muted': 'rgb(var(--color-bg-brand-muted) / <alpha-value>)',
				'bg-brand-soft': 'rgb(var(--color-bg-brand-soft) / <alpha-value>)',
				
				// Text hierarchy
				'text-primary': 'rgb(var(--color-text-primary) / <alpha-value>)',
				'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
				'text-tertiary': 'rgb(var(--color-text-tertiary) / <alpha-value>)',
				'text-quaternary': 'rgb(var(--color-text-quaternary) / <alpha-value>)',
				'text-inverse': 'rgb(var(--color-text-inverse) / <alpha-value>)',
				'text-brand': 'rgb(var(--color-text-brand) / <alpha-value>)',
				'text-accent': 'rgb(var(--color-text-accent) / <alpha-value>)',
				
				// Border system
				'border-default': 'rgb(var(--color-border-default) / <alpha-value>)',
				'border-muted': 'rgb(var(--color-border-muted) / <alpha-value>)',
				'border-strong': 'rgb(var(--color-border-strong) / <alpha-value>)',
				'border-brand': 'rgb(var(--color-border-brand) / <alpha-value>)',
				'border-accent': 'rgb(var(--color-border-accent) / <alpha-value>)',
				'border-accent-light': 'rgb(var(--color-border-accent-light) / <alpha-value>)',
				
				// Footer colors
				'footer-bg': 'rgb(var(--color-footer-bg) / <alpha-value>)',
				'footer-text': 'rgb(var(--color-footer-text) / <alpha-value>)',
				'footer-text-muted': 'rgb(var(--color-footer-text-muted) / <alpha-value>)',
				'footer-border': 'rgb(var(--color-footer-border) / <alpha-value>)',
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
