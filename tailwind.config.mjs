/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			padding: {
				'safe-bottom': 'env(safe-area-inset-bottom)',
			},
		},
	},
	plugins: [],
}
