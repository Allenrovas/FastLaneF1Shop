<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { addToCart, type Product } from '../stores/cart';
  import ProductCard from './ProductCard.svelte';

  const GITHUB_REPO_URL = 'https://raw.githubusercontent.com/Allenrovas/Datos_Catalogo/main';

  let allProducts: Product[] = [];
  let innerWidth = 0;

  $: cols = innerWidth >= 2200 ? 6 : innerWidth >= 1800 ? 5 : innerWidth >= 1024 ? 4 : innerWidth >= 640 ? 2 : 1;

  $: featured = allProducts
    .filter(p => p.inStock)
    .sort((a, b) => {
      if (a.limitedEdition && !b.limitedEdition) return -1;
      if (!a.limitedEdition && b.limitedEdition) return 1;
      return b.id - a.id;
    })
    .slice(0, cols);

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

<svelte:window bind:innerWidth={innerWidth} />

{#if featured.length > 0}
  <section class="py-16 px-4 bg-[#131313]">
    <div class="mx-auto max-w-[2400px] px-4">
      <div class="text-center mb-10">
        <h2 class="font-headline text-3xl font-bold text-white uppercase tracking-[0.1em] mb-4">
          Novedades
        </h2>
        <p class="text-surface-200 max-w-lg mx-auto">
          Los últimos modelos añadidos a nuestra colección exclusiva
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 min-[1800px]:grid-cols-5 min-[2200px]:grid-cols-6 gap-6">
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
