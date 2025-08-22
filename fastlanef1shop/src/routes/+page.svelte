<script lang="ts">
  import F1Catalog from '$lib/components/F1Catalog.svelte';
  import { onMount } from 'svelte';

  // SEO and meta information
  const pageTitle = "Fast Lane F1 Shop - Colección Exclusiva de Monoplazas";
  const pageDescription = "Descubre la colección más completa de monoplazas de Fórmula 1. Desde Red Bull hasta Ferrari, Mercedes y más. ¡Velocidad suprema al alcance de tus manos!";

  onMount(() => {
    // Set page title
    document.title = pageTitle;
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', pageDescription);
    }
  });
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={pageDescription} />
  
  <!-- Racing-themed favicon -->
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏎️</text></svg>" />
</svelte:head>

<F1Catalog />