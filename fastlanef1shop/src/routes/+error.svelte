<script lang="ts">
  import { page } from '$app/stores';
  import { base } from '$app/paths';
  import { fade, fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  
  // Iconos (si usas el sistema de iconos)
  // Si no tienes acceso a estos iconos, puedes usar emojis o SVG inline
  
  let mounted = false;
  
  onMount(() => {
    mounted = true;
  });
  
  // Determinar el tipo de error y mensaje personalizado
  $: errorType = $page.status >= 500 ? 'server' : 'client';
  $: errorTitle = getErrorTitle($page.status);
  $: errorMessage = getErrorMessage($page.status);
  
  function getErrorTitle(status: number): string {
    switch (status) {
      case 404: return "Página no encontrada";
      case 403: return "Acceso denegado";
      case 500: return "Error del servidor";
      case 503: return "Servicio no disponible";
      default: return "Oops! Algo salió mal";
    }
  }
  
  function getErrorMessage(status: number): string {
    switch (status) {
      case 404: return "La página que buscas no existe o ha sido movida a otra ubicación.";
      case 403: return "No tienes permisos para acceder a esta página.";
      case 500: return "Nuestros servidores están experimentando problemas técnicos.";
      case 503: return "El servicio está temporalmente no disponible.";
      default: return "Se ha producido un error inesperado. Por favor, intenta nuevamente más tarde.";
	}
  }
</script>
<svelte:head>
  <title>{errorTitle} - Fast Lane F1 Shop</title>
  <meta name="description" content="{errorMessage}" />
</svelte:head>

{#if mounted}
  <div class="min-h-screen flex flex-col items-center justify-center bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 p-4" in:fade={{ duration: 400 }}>
	<div class="text-center max-w-md">
	  <div class="text-9xl mb-4 font-bold">{ $page.status }</div>
	  <h1 class="text-3xl font-semibold mb-2">{ errorTitle }</h1>
	  <p class="mb-6 text-lg">{ errorMessage }</p>
	  <a href="{base}/" class="inline-block px-6 py-3 bg-primary-600 text-white rounded hover:bg-primary-700 transition" in:fly={{ y: 20, duration: 400, delay: 200 }}>
		Volver al inicio
	  </a>
	</div>
  </div>
{/if}