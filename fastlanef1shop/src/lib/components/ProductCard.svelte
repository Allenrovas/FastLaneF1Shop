<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';
  import type { Product  } from '../stores/cart';

  // Importar iconos
  import LucideCartPlus from '~icons/lucide/shopping-cart';
  import LucideEye from '~icons/lucide/eye';
  import LucideStar from '~icons/lucide/star';
  import LucideCheck from '~icons/lucide/check-circle';
  import LucideTruck from '~icons/lucide/truck';
  import LucideClose from '~icons/lucide/x-circle';

  // Props
  export let product: Product;
  export let index: number = 0;
  export let animationDelay: number = 100;
  export let onCardClick: ((productId: number) => void) | null = null;
  export let showFullDescription: boolean = false;
  export let variant: 'default' | 'compact' = 'default';

  // GitHub Pages configuration
  const GITHUB_REPO_URL = 'https://raw.githubusercontent.com/Allenrovas/Datos_Catalogo/main';

  // Event dispatcher
  const dispatch = createEventDispatcher();

  function getProductImageUrl(product: Product, imageIndex: number = 0): string {
    return `${GITHUB_REPO_URL}/${product.imageFolder}${product.images[imageIndex]}`;
  }

  function handleAddToCart(event: Event): void {
    event.stopPropagation();
    dispatch('addToCart', { product });
  }

  function handleCardClick(): void {
    if (onCardClick) {
      onCardClick(product.id);
    } else {
      dispatch('cardClick', { product });
    }
  }

  function handleViewDetails(event: Event): void {
    event.stopPropagation();
    dispatch('viewDetails', { product });
  }

  // Fallback image handler
  function handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyMEM4Ljk1NDMgMjAgMCAyOC45NTQzIDAgNDBIMTBDMTAgMzQuNDc3MSAxNC40NzcxIDMwIDE5IDMwSDIxQzI1LjUyMjkgMzAgMzAgMzQuNDc3MSAzMCA0MEg0MEMzMCAyOC45NTQzIDMxLjA0NTcgMjAgMjAgMjBaIiBmaWxsPSIjQzNDM0MzIi8+Cjwvc3ZnPgo=';
    target.classList.add('opacity-50');
  }
</script>

<!-- Product Card — Kinetic Monolith: no borders, tonal shift -->
<div
  class="group overflow-hidden bg-[#2a2a2a] flex flex-col
  transition-all duration-300 hover:bg-[#353534] hover:shadow-[0_0_40px_rgba(225,6,0,0.08)] hover:-translate-y-1 cursor-pointer
  {variant === 'compact' ? 'max-w-sm' : ''}"
  in:fly={{ y: 30, duration: 400, delay: index * animationDelay }}
  on:click={handleCardClick}
  on:keydown={(e) => e.key === 'Enter' && handleCardClick()}
  tabindex="0"
  role="button"
  aria-label="Ver detalles de {product.name}"
>
  <!-- Product Image -->
  <header class="relative overflow-hidden bg-[#1c1b1b] {variant === 'compact' ? 'h-48' : 'h-56'}">
    <img
      src={getProductImageUrl(product, 0)}
      alt={product.name}
      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      on:error={handleImageError}
    />

    <!-- Product Badges — Lap Timer style -->
    <div class="absolute top-3 right-3 space-y-2">
      {#if product.limitedEdition}
        <span class="chip-lap-timer bg-primary-500 text-white shadow-lg block flex items-center">
          <LucideStar class="mr-1 w-3 h-3" />
          Limitada
        </span>
      {/if}
      {#if product.originalPrice && product.originalPrice > product.price}
        <span class="chip-lap-timer bg-[#131313]/90 text-white shadow-lg block">
          -{Math.round((1 - product.price / product.originalPrice) * 100)}%
        </span>
      {/if}
    </div>

    <!-- Stock Status -->
    <div class="absolute top-3 left-3">
      <span class="chip-lap-timer {product.inStock ? 'bg-success-600' : 'bg-surface-500'} text-white shadow-lg flex items-center">
        {#if product.inStock}
          <LucideCheck class="mr-1 w-3 h-3" />
          Disponible
        {:else}
          <LucideClose class="mr-1 w-3 h-3" />
          Agotado
        {/if}
      </span>
    </div>

    <!-- Quick Actions Overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent
    opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
      <div class="text-white w-full">
        <div class="mb-3">
          <h3 class="font-headline font-bold {variant === 'compact' ? 'text-sm' : 'text-base'} leading-tight line-clamp-1 uppercase tracking-wide">
            {product.name}
          </h3>
          <p class="text-sm text-surface-300 mt-0.5 font-headline">{product.team} &bull; {product.year}</p>
        </div>
        <div class="flex gap-2 items-stretch">
          <button
            class="btn btn-kinetic flex-1 min-h-[40px] text-sm py-2"
            on:click={handleAddToCart}
            disabled={!product.inStock}
            aria-label="Añadir {product.name} al carrito"
          >
            <LucideCartPlus class="mr-1 w-4 h-4" />
            {product.inStock ? 'Añadir' : 'Agotado'}
          </button>
          <button
            class="btn bg-[#353534] text-white w-10 h-10 !p-0 flex-shrink-0 hover:bg-surface-400 transition-colors"
            on:click={handleViewDetails}
            aria-label="Ver detalles de {product.name}"
          >
            <LucideEye class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Product Info -->
  <div class="p-5 flex flex-col flex-1">
    <!-- Category Tags — Lap Timer chips, fixed 2-line height -->
    <div class="flex flex-wrap gap-1.5 mb-3 h-[54px] overflow-hidden content-start">
      <span class="chip-lap-timer bg-[#1c1b1b] text-surface-300">
        {product.team}
      </span>
      <span class="chip-lap-timer bg-[#1c1b1b] text-surface-300">
        {product.manufacturer}
      </span>
      <span class="chip-lap-timer bg-[#1c1b1b] text-surface-300">
        {product.scale}
      </span>
      {#if product.driver}
        <span class="chip-lap-timer bg-[#1c1b1b] text-surface-300">
          {product.driver}
        </span>
      {/if}
    </div>

    <div class="mb-3 min-h-[48px] flex items-start">
      <h3 class="font-headline font-bold text-white leading-tight line-clamp-2 text-base">
        {product.name}
      </h3>
    </div>

    <p class="text-surface-200 text-sm mb-4 leading-relaxed line-clamp-2 min-h-[40px]">
      {product.description}
    </p>

    <!-- Price and Actions — bg shift instead of border-t, pushed to bottom -->
    <div class="flex items-end justify-between pt-3 bg-[#232323] -mx-5 px-5 -mb-5 pb-5 mt-auto">
      <div class="flex flex-col flex-1 pr-4">
        <div class="flex items-baseline gap-2 mb-1 flex-wrap">
          <span class="text-xl font-headline font-bold text-white whitespace-nowrap">
            Q.{product.price.toFixed(2)}
          </span>
          {#if product.originalPrice && product.originalPrice > product.price}
            <span class="text-sm text-surface-300 line-through whitespace-nowrap">
              Q.{product.originalPrice.toFixed(2)}
            </span>
          {/if}
        </div>
        <div class="flex items-center gap-1.5 text-xs text-surface-300">
          <LucideTruck class="w-3 h-3 flex-shrink-0" />
          <span>Envíos a toda Guatemala</span>
        </div>
      </div>

      <div class="flex-shrink-0">
        <button
          class="btn btn-kinetic min-w-[110px] h-[44px] text-sm"
          on:click={handleAddToCart}
          disabled={!product.inStock}
          aria-label="Añadir {product.name} al carrito"
        >
          <LucideCartPlus class="mr-1.5 w-4 h-4" />
          {product.inStock ? 'Añadir' : 'Agotado'}
        </button>
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Focus styles for accessibility */
  [role="button"]:focus-visible {
    outline: 2px solid rgb(225, 6, 0);
    outline-offset: 2px;
  }
</style>
