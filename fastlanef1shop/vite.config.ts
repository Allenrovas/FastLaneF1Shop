import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver'; // si usas con auto import en components

export default defineConfig({
  plugins: [
    sveltekit(),
    Icons({
      compiler: 'svelte', // importante para Svelte
      autoInstall: true,  // instala automáticamente las colecciones que falten
    }),
  ],
});