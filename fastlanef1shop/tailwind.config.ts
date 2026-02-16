import { join } from 'path'
import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { skeleton } from '@skeletonlabs/tw-plugin';
import { fastlanef1_theme } from './src/fastlanef1_theme'

export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')],
	theme: {
		extend: {
			colors: {
				'f1-red': '#e22928',
				'f1-black': '#000000',
				'f1-carbon': '#1a1a1a',
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				racing: ['Orbitron', 'system-ui', 'sans-serif'],
			},
		},
	},
	plugins: [
		forms,
		typography,
		skeleton({
			themes: {
				custom: [
					fastlanef1_theme,
				],
			},
		}),
	],
} satisfies Config;
