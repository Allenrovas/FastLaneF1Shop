<script lang="ts">
  import F1Catalog from '$lib/components/F1Catalog.svelte';
  import { base } from '$app/paths';

  const pageTitle = "Catálogo - Fast Lane F1 Shop";
  const pageDescription = "Explora nuestro catálogo completo de monoplazas de Fórmula 1 a escala. Filtra por equipo, marca, escala y más.";
  const pageUrl = "https://fastlanef1shop.com/catalogo";
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <link rel="canonical" href={pageUrl} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={pageUrl} />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={pageDescription} />
</svelte:head>

<!-- Full Catalog (header is inside the component) -->
<F1Catalog />
