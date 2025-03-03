/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				arabic: ['Noto Sans Arabic', 'sans-serif'],
			},
		},
	},
	plugins: [
		require('@tailwindcss/forms'),
	],
}
