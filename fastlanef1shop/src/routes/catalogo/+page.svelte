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

<!-- Catalog Header -->
<section class="bg-surface-900 pt-10 pb-4 px-4">
  <div class="container mx-auto max-w-screen-xl text-center">
    <h1 class="text-4xl md:text-5xl font-black text-white uppercase tracking-wider mb-3">
      Catálogo
    </h1>
    <div class="w-16 h-0.5 bg-primary-500 mx-auto mb-4"></div>
    <p class="text-surface-200 max-w-lg mx-auto">
      Explora nuestra colección completa de monoplazas de Fórmula 1 a escala
    </p>
  </div>
</section>

<!-- Full Catalog -->
<F1Catalog />
