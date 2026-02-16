<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { addToCart, type Product } from '../stores/cart';
  import ProductCard from './ProductCard.svelte';

  const GITHUB_REPO_URL = 'https://raw.githubusercontent.com/Allenrovas/Datos_Catalogo/main';

  let allProducts: Product[] = [];

  $: featured = allProducts
    .filter(p => p.inStock)
    .sort((a, b) => {
      if (a.limitedEdition && !b.limitedEdition) return -1;
      if (!a.limitedEdition && b.limitedEdition) return 1;
      return b.id - a.id;
    })
    .slice(0, 4);

  onMount(async () => {
    try {
      const response = await fetch(`${GITHUB_REPO_URL}/data/products.json`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      allProducts = await response.json();
    } catch (error) {
      console.error('Error loading featured products:', error);
    }
  });

  function handleProductClick(productId: number): void {
    goto(`${base}/producto/${productId}`);
  }

  function handleAddToCart(event: CustomEvent): void {
    const { product } = event.detail;
    addToCart(product);
  }

  function handleViewDetails(event: CustomEvent): void {
    const { product } = event.detail;
    goto(`${base}/producto/${product.id}`);
  }
</script>

{#if featured.length > 0}
  <section class="py-16 px-4">
    <div class="container mx-auto max-w-screen-xl">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-white uppercase tracking-wider mb-3">
          Novedades
        </h2>
        <div class="w-16 h-0.5 bg-primary-500 mx-auto mb-4"></div>
        <p class="text-surface-200 max-w-lg mx-auto">
          Los últimos modelos añadidos a nuestra colección exclusiva
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {#each featured as product, i}
          <ProductCard
            {product}
            index={i}
            animationDelay={100}
            variant="compact"
            onCardClick={handleProductClick}
            on:addToCart={handleAddToCart}
            on:viewDetails={handleViewDetails}
          />
        {/each}
      </div>
    </div>
  </section>
{/if}
