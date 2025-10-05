import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte'],
	preprocess: [vitePreprocess()],

	vitePlugin: {
		inspector: true,
	},

	kit: {
		inlineStyleThreshold: 1024,
		scrollReset: true,
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html', 
			precompress: false,
			strict: false         
		}),
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/FastLaneF1Shop' : '',
		}
	}
};

export default config;
