<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { writable, derived } from 'svelte/store';
  import { fade, fly } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { 
    cart, 
    cartTotal, 
    cartItemCount, 
    addToCart, 
    removeFromCart, 
    updateQuantity,
    reloadCart,
    type Product 
  } from '$lib/stores/cart';
  import { 
    categories, 
    categoriesLoading,
    loadCategories, 
    getCategoryById,
    type Category 
  } from '$lib/stores/categories';

  // Importar el componente ProductCard
  import ProductCard from '$lib/components/ProductCard.svelte';

  // Importar iconos con unplugin
  import LucideHome from '~icons/lucide/home';
  import LucideChevronRight from '~icons/lucide/chevron-right';
  import LucideArrowLeft from '~icons/lucide/arrow-left';
  import LucideShield from '~icons/lucide/shield-check';
  import LucidePackage from '~icons/lucide/package';
  import LucideGrid from '~icons/lucide/grid-3x3';

  // Stores
  const products = writable<Product[]>([]);
  const isLoading = writable<boolean>(true);
  const currentCategory = writable<Category | null>(null);

  // GitHub configuration
  const GITHUB_REPO_URL = 'https://raw.githubusercontent.com/Allenrovas/Datos_Catalogo/main';

  // Get category from URL
  $: categorySlug = $page.params.slug;
  
  // Update current category when categories load or slug changes
  $: if ($categories.length > 0 && categorySlug) {
    const cat = getCategoryById(categorySlug);
    currentCategory.set(cat || null);
  }

  // Filtrar productos que contengan la categoría en su array de categorías
  const filteredProducts = derived(
    [products, page], 
    ([$products, $page]) => 
      $products
        .filter(p => p.categories.includes($page.params.slug))
        .sort((a, b) => Number(b.inStock) - Number(a.inStock))
  );

  // Load products
  async function loadProducts(): Promise<void> {
    try {
      isLoading.set(true);
      
      const response = await fetch(`${GITHUB_REPO_URL}/data/products.json`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: Product[] = await response.json();
      products.set(data);
      
      console.log(`✓ ${data.length} productos cargados`);
      
    } catch (error) {
      console.error('Error loading products:', error);
      products.set([]);
    } finally {
      isLoading.set(false);
    }
  }

  // Event handlers para ProductCard
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

  onMount(async () => {
    reloadCart();
    await loadCategories();
    await loadProducts();
  });
</script>

<svelte:head>
  <title>{$currentCategory?.name || 'Categoría'} - Fast Lane F1 Shop</title>
  <meta name="description" content="Descubre los mejores monoplazas de {$currentCategory?.name || 'esta categoría'} en nuestra colección exclusiva." />
</svelte:head>

<!-- Breadcrumb -->
<section class="container mx-auto px-4 py-6 bg-surface-50 dark:bg-surface-900">
  <nav class="breadcrumb">
    <ol class="flex items-center space-x-3 text-sm">
      <li>
        <a 
          href="{base || '/'}"
          class="flex items-center space-x-2 text-surface-600-300-token hover:text-primary-500 transition-colors duration-200 font-medium group"
        >
          <span>Inicio</span>
        </a>
      </li>
      <li class="text-surface-400-500-token">
        <LucideChevronRight class="w-4 h-4" />
      </li>
      <li class="flex items-center space-x-2">
        <span class="font-semibold text-surface-900-50-token">
          {$currentCategory?.name || categorySlug}
        </span>
      </li>
    </ol>
  </nav>
</section>

<!-- Category Hero -->
{#if $currentCategory}
  <section class="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 dark:from-primary-600 dark:via-primary-700 dark:to-secondary-600" transition:fade>
    <!-- Enhanced overlay for better contrast -->
    <div class="absolute inset-0 bg-surface-900/40 dark:bg-surface-900/60"></div>
    
    <!-- Dynamic background elements -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-16 right-20 w-40 h-40 rounded-full bg-warning-400 animate-pulse"></div>
      <div class="absolute bottom-20 left-16 w-24 h-24 rounded-full bg-error-500 animate-ping"></div>
      <div class="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-success-400 animate-bounce"></div>
    </div>
    
    <!-- Racing lines -->
    <div class="absolute inset-0 opacity-20">
      <div class="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-warning-400 to-transparent"></div>
      <div class="absolute bottom-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-error-500 to-transparent"></div>
    </div>

    <div class="relative container mx-auto px-4 py-20 text-center">
      <div class="max-w-4xl mx-auto">
        <!-- Category badge -->
        <div class="mb-6" in:fly={{ y: 20, duration: 600 }}>
          <span class="inline-block px-4 py-2 bg-surface-50/20 dark:bg-surface-50/30 rounded-full text-sm font-semibold text-on-primary-token border border-surface-50/30 backdrop-blur-sm">
            {$currentCategory.type === 'team' ? 'Escudería' :
             $currentCategory.type === 'manufacturer' ? 'Fabricante' :
             $currentCategory.type === 'scale' ? 'Escala' :
             $currentCategory.type === 'driver' ? 'Piloto' : 'Categoría'}
          </span>
        </div>
        
        <h1 class="text-4xl md:text-6xl font-bold mb-6 font-heading-token text-on-primary-token drop-shadow-2xl" in:fly={{ y: 30, duration: 600, delay: 200 }}>
          {$currentCategory.name}
        </h1>
        
        {#if $currentCategory.description}
          <p class="text-lg md:text-xl text-surface-50/90 leading-relaxed max-w-3xl mx-auto mb-8" in:fly={{ y: 20, duration: 600, delay: 400 }}>
            {$currentCategory.description}
          </p>
        {/if}
        
        <!-- Stats card -->
        <div class="flex justify-center" in:fly={{ y: 20, duration: 600, delay: 600 }}>
          <div class="card variant-glass-surface p-6 rounded-container-token border border-surface-50/20 backdrop-blur-md">
            <div class="flex items-center justify-center space-x-6 text-on-primary-token">
              <div class="text-center">
                <div class="text-2xl font-bold text-warning-400">{$filteredProducts.length}</div>
                <div class="text-sm opacity-90">Modelos</div>
              </div>
              <div class="w-px h-8 bg-surface-50/30"></div>
              <div class="text-center">
                <div class="text-2xl font-bold text-success-400">100%</div>
                <div class="text-sm opacity-90">Auténticos</div>
              </div>
              <div class="w-px h-8 bg-surface-50/30"></div>
              <div class="text-center">
                <div class="text-2xl font-bold text-error-400">★</div>
                <div class="text-sm opacity-90">Premium</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Racing stripe with animation -->
    <div class="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-error-500 via-warning-400 to-error-500 animate-pulse"></div>
  </section>
{:else if $categoriesLoading}
  <!-- Loading category info -->
  <div class="container mx-auto px-4 py-12 text-center bg-surface-50 dark:bg-surface-900" in:fade>
    <div class="flex justify-center items-center space-x-4 mb-4">
      <div class="placeholder animate-pulse w-12 h-12 rounded-full bg-primary-300 dark:bg-primary-600"></div>
    </div>
    <p class="text-surface-600-300-token">Cargando información de categoría...</p>
  </div>
{:else}
  <!-- Category not found -->
  <div class="container mx-auto px-4 py-12 text-center bg-surface-50 dark:bg-surface-900" in:fade>
    <div class="text-6xl mb-4 opacity-30">❌</div>
    <h2 class="text-2xl font-bold mb-4 text-surface-900-50-token">Categoría no encontrada</h2>
    <p class="text-surface-600-300-token mb-6">La categoría "{categorySlug}" no existe o no está configurada.</p>
    <button 
      class="btn variant-filled-primary"
      on:click={() => goto(base || '/')}
    >
      <LucideArrowLeft class="mr-2 w-5 h-5" />
      Volver al inicio
    </button>
  </div>
{/if}

<!-- Loading State -->
{#if $isLoading}
  <div class="container mx-auto px-4 py-20 text-center bg-surface-50 dark:bg-surface-900" in:fade>
    <div class="flex justify-center items-center space-x-4 mb-8">
      <div class="placeholder animate-pulse w-12 h-12 rounded-full bg-primary-300 dark:bg-primary-600"></div>
      <div class="placeholder animate-pulse w-10 h-10 rounded-full bg-secondary-300 dark:bg-secondary-600 delay-200"></div>
      <div class="placeholder animate-pulse w-8 h-8 rounded-full bg-warning-300 dark:bg-warning-600 delay-400"></div>
    </div>
    <h3 class="text-xl font-semibold text-surface-900-50-token mb-2">Preparando la parrilla...</h3>
    <p class="text-surface-600-300-token">Cargando los monoplazas más espectaculares</p>
  </div>
{/if}

<!-- Products Section -->
{#if !$isLoading}
  <section class="px-4 py-16 bg-surface-50 dark:bg-surface-900">
    <div class="container mx-auto">
    {#if $filteredProducts.length === 0}
      <div class="text-center py-24" in:fade>
        <div class="text-8xl mb-8 text-surface-300-600-token opacity-30 font-bold">F1</div>
        <h3 class="text-3xl font-bold mb-4 text-surface-900-50-token">No hay productos en esta categoría</h3>
        <p class="text-surface-600-300-token mb-8 max-w-md mx-auto text-lg leading-relaxed">
          Aún no tenemos monoplazas disponibles en esta categoría, pero pronto añadiremos nuevos modelos emocionantes.
        </p>
        <button 
          class="btn variant-filled-primary text-lg px-8 py-4 hover:scale-105 transition-transform duration-200"
          on:click={() => goto(base || '/')}
        >
          <LucideArrowLeft class="mr-2 w-5 h-5" />
          Ver Todos los Productos
        </button>
      </div>
    {:else}
      <!-- Section Header -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-surface-900-50-token mb-4">
          Colección {$currentCategory?.name || categorySlug}
        </h2>
        <div class="flex items-center justify-center space-x-4 text-surface-600-300-token">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
            <span class="font-medium">{$filteredProducts.length} modelos disponibles</span>
          </div>
          <div class="w-px h-4 bg-surface-300-600-token"></div>
          <div class="flex items-center space-x-2">
            <LucideShield class="w-4 h-4 text-success-500" />
            <span class="text-sm">Garantía premium incluida</span>
          </div>
        </div>
      </div>

      <!-- Products Grid con ProductCard -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each $filteredProducts as product, i}
          <ProductCard
            {product}
            index={i}
            animationDelay={100}
            onCardClick={handleProductClick}
            on:addToCart={handleAddToCart}
            on:viewDetails={handleViewDetails}
          />
        {/each}
      </div>
      
      <!-- Load More / Pagination -->
      {#if $filteredProducts.length >= 6}
        <div class="text-center mt-16">
          <div class="bg-gradient-to-r from-surface-100 to-surface-200 dark:from-surface-800 dark:to-surface-700 rounded-2xl p-8">
            <h3 class="text-xl font-bold text-surface-900 dark:text-surface-50 mb-4">
              ¡Increíble colección!
            </h3>
            <p class="text-surface-600 dark:text-surface-300 mb-6">
              Has explorado {$filteredProducts.length} modelos espectaculares de {$currentCategory?.name || categorySlug}
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                class="btn variant-ghost-surface text-lg px-8 py-3"
                on:click={() => goto(base || '/')}
              >
                <LucideGrid class="mr-2 w-5 h-5" />
                Explorar Todas las Categorías
              </button>
            </div>
          </div>
        </div>
      {/if}
    {/if}
    </div>
  </section>
{/if}

<!-- Related Categories Section -->
{#if $currentCategory && $filteredProducts.length > 0}
  <section class="bg-gradient-to-r from-surface-100 to-surface-200 dark:from-surface-800 dark:to-surface-700 py-16">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-surface-900 dark:text-surface-50 mb-4">
          Categorías Relacionadas
        </h2>
        <p class="text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
          Descubre más colecciones que podrían interesarte
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {#each $categories.filter(c => c.type === $currentCategory?.type && c.id !== $currentCategory?.id).slice(0, 3) as relatedCategory}
          <a 
            href="{base}/categoria/{relatedCategory.id}"
            class="card card-hover bg-surface-0 dark:bg-surface-800 p-6 text-center border border-surface-200 dark:border-surface-700 
            hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div class="w-16 h-16 {relatedCategory.variant} rounded-full flex items-center justify-center mx-auto mb-4">
              <LucideGrid class="w-8 h-8 text-white" />
            </div>
            <h3 class="font-bold text-lg text-surface-900 dark:text-surface-50 mb-2">
              {relatedCategory.name}
            </h3>
            <p class="text-surface-600 dark:text-surface-300 text-sm mb-4 line-clamp-2">
              {relatedCategory.description || ''}
            </p>
            <div class="flex items-center justify-center space-x-2 text-xs text-surface-500 dark:text-surface-400">
              <LucidePackage class="w-3 h-3" />
              <span>Ver colección</span>
            </div>
          </a>
        {/each}
      </div>
    </div>
  </section>
{/if}

<style lang="postcss">
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  /* Enhanced shadow effects */
  .shadow-3xl {
    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
  }
  
  /* Card hover effects with racing theme */
  .card-hover {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .card-hover:hover {
    transform: translateY(-4px);
  }
  
  /* Racing animations */
  @keyframes racing-glow {
    0%, 100% { 
      box-shadow: 0 0 5px rgba(var(--color-primary-500), 0.3);
    }
    50% { 
      box-shadow: 0 0 20px rgba(var(--color-primary-500), 0.5);
    }
  }
  
  .animate-racing-glow {
    animation: racing-glow 2s ease-in-out infinite;
  }
</style>