<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';
  import type { Product  } from '../stores/cart';

  // Importar iconos
  import LucideCartPlus from '~icons/lucide/shopping-cart';
  import LucideEye from '~icons/lucide/eye';
  import LucideStar from '~icons/lucide/star';
  import LucideCheck from '~icons/lucide/check-circle';
  import LucideInfo from '~icons/lucide/info';
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

<!-- Product Card -->
<div 
  class="card card-hover overflow-hidden bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 
  transition-all duration-300 hover:shadow-2xl hover:border-primary-300 dark:hover:border-primary-600 hover:-translate-y-2 cursor-pointer
  {variant === 'compact' ? 'max-w-sm' : ''}"
  in:fly={{ y: 50, duration: 500, delay: index * animationDelay }}
  on:click={handleCardClick}
  on:keydown={(e) => e.key === 'Enter' && handleCardClick()}
  tabindex="0"
  role="button"
  aria-label="Ver detalles de {product.name}"
>
  <!-- Product Image -->
  <header class="card-header relative overflow-hidden bg-surface-100 dark:bg-surface-700 {variant === 'compact' ? 'h-48' : 'h-56'} group">
    <img 
      src={getProductImageUrl(product, 0)} 
      alt={product.name}
      class="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
      on:error={handleImageError}
    />
    
    <!-- Product Badges -->
    <div class="absolute top-4 right-4 space-y-2">
      <span class="badge variant-filled-surface text-xs font-bold shadow-lg">
        #{product.id.toString().padStart(3, '0')}
      </span>
      {#if product.limitedEdition}
        <span class="badge variant-filled-warning text-xs font-bold shadow-lg animate-pulse block">
          <LucideStar class="mr-1 w-3 h-3" />
          Limitada
        </span>
      {/if}
      {#if product.originalPrice && product.originalPrice > product.price}
        <span class="badge variant-filled-error text-xs font-bold shadow-lg block">
          <LucideInfo class="mr-1 w-3 h-3" />
          Oferta
        </span>
      {/if}
    </div>
    
    <!-- Stock Status -->
    <div class="absolute top-4 left-4">
      <span class="badge {product.inStock ? 'variant-filled-success' : 'variant-filled-error'} text-xs font-bold shadow-lg flex items-center">
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
    <div class="absolute inset-0 bg-gradient-to-t from-surface-900/90 via-surface-900/20 to-transparent 
    opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6">
      <div class="text-surface-50 w-full">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="font-bold {variant === 'compact' ? 'text-base' : 'text-lg'} drop-shadow-md mb-1 line-clamp-1">
              {product.name}
            </h3>
            <p class="text-sm opacity-90">{product.team} • {product.year}</p>
          </div>
        </div>
        <div class="flex space-x-2 items-stretch">
  <button 
    class="btn variant-filled-primary flex-1 font-semibold min-h-[44px]"
    on:click={handleAddToCart}
    disabled={!product.inStock}
    aria-label="Añadir {product.name} al carrito"
  >
    <LucideCartPlus class="mr-1 w-4 h-4" />
    {product.inStock ? 'Añadir' : 'Agotado'}
  </button>
  <button 
    class="btn variant-soft-surface w-12 h-12 !p-0 flex-shrink-0"
    on:click={handleViewDetails}
    aria-label="Ver detalles de {product.name}"
  >
    <LucideEye class="w-5 h-5" />
  </button>
</div>
      </div>
    </div>
  </header>

  <!-- Product Info -->
  <div class="p-6 bg-surface-25 dark:bg-surface-800">
    <!-- Category Tags -->
    <div class="flex flex-wrap gap-2 mb-3">
      <span class="badge variant-soft-primary text-xs font-medium">
        {product.team}
      </span>
      <span class="badge variant-soft-secondary text-xs font-medium">
        {product.manufacturer}
      </span>
      <span class="badge variant-soft-tertiary text-xs font-medium">
        {product.scale}
      </span>
      {#if product.driver}
        <span class="badge variant-soft-warning text-xs font-medium">
          {product.driver}
        </span>
      {/if}
    </div>
    
    <div class="mb-3 min-h-[56px] flex items-start">
      <h3 class="h4 font-bold text-surface-900 dark:text-surface-50 leading-tight line-clamp-3">
        {product.name}
      </h3>
    </div>
    
    <p class="text-surface-600 dark:text-surface-300 text-sm mb-4 leading-relaxed {showFullDescription ? '' : 'line-clamp-3'}">
      {product.description}
    </p>
    
    <!-- Price and Actions -->
    <div class="flex items-end justify-between pt-4 border-t border-surface-200 dark:border-surface-600 min-h-[80px]">
      <div class="flex flex-col justify-end flex-1 pr-4">
        <div class="flex items-baseline space-x-2 mb-2">
          <span class="text-2xl font-bold text-success-600 dark:text-success-400 whitespace-nowrap">
            Q. {product.price.toFixed(2)}
          </span>
          {#if product.originalPrice && product.originalPrice > product.price}
            <span class="text-sm text-surface-500 dark:text-surface-400 line-through whitespace-nowrap">
              Q. {product.originalPrice.toFixed(2)}
            </span>
          {/if}
        </div>
        <div class="flex items-center space-x-2 text-xs text-surface-500 dark:text-surface-400">
          <LucideTruck class="w-3 h-3 flex-shrink-0" />
          <span>Envíos a toda Guatemala</span>
        </div>
      </div>
    
    <div class="flex-shrink-0">
      <button
        class="btn variant-filled-primary font-semibold hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg min-w-[120px] h-[48px]"
        on:click={handleAddToCart}
        disabled={!product.inStock}
        aria-label="Añadir {product.name} al carrito"
      >
        <LucideCartPlus class="mr-2 w-4 h-4" />
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
  
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  /* Enhanced shadow effects */
  .shadow-3xl {
    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
  }
  
  /* Racing-themed animations */
  @keyframes racing-line {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100vw); }
  }
  
  .animate-racing {
    animation: racing-line 3s ease-in-out infinite;
  }
  
  /* Card hover effects */
  .card-hover {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .card-hover:hover {
    transform: translateY(-8px);
  }
  
  /* Focus styles for accessibility */
  .card-hover:focus {
    outline: 2px solid rgb(var(--color-primary-500));
    outline-offset: 2px;
  }
</style>