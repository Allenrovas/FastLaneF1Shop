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
<section class="container mx-auto px-4 py-6 bg-surface-900">
  <nav class="breadcrumb">
    <ol class="flex items-center space-x-3 text-sm">
      <li>
        <a 
          href="{base || '/'}"
          class="flex items-center space-x-2 text-surface-200 hover:text-primary-500 transition-colors duration-200 font-medium group"
        >
          <span>Inicio</span>
        </a>
      </li>
      <li class="text-surface-300">
        <LucideChevronRight class="w-4 h-4" />
      </li>
      <li class="flex items-center space-x-2">
        <span class="font-semibold text-white">
          {$currentCategory?.name || categorySlug}
        </span>
      </li>
    </ol>
  </nav>
</section>

<!-- Category Hero -->
{#if $currentCategory}
  <section class="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-surface-900">
    <!-- Background gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-br from-surface-900 via-surface-900/95 to-primary-900/20"></div>

    <!-- Subtle grid pattern -->
    <div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px); background-size: 60px 60px;"></div>

    <div class="relative container mx-auto px-4 py-20 text-center">
      <div class="max-w-3xl mx-auto">
        <!-- Category badge -->
        <div class="mb-6" in:fly={{ y: 20, duration: 600 }}>
          <span class="inline-block px-4 py-2 bg-surface-800 border border-surface-700 rounded-lg text-xs font-bold text-surface-200 uppercase tracking-wider">
            {$currentCategory.type === 'team' ? 'Escudería' :
             $currentCategory.type === 'manufacturer' ? 'Fabricante' :
             $currentCategory.type === 'scale' ? 'Escala' :
             $currentCategory.type === 'driver' ? 'Piloto' : 'Categoría'}
          </span>
        </div>

        <h1 class="text-5xl md:text-7xl font-black mb-6 font-racing uppercase tracking-wider text-white leading-tight" in:fly={{ y: 40, duration: 600, delay: 100 }}>
          {$currentCategory.name}
        </h1>

        {#if $currentCategory.description}
          <p class="text-lg md:text-xl mb-10 text-surface-300 leading-relaxed max-w-xl mx-auto" in:fly={{ y: 30, duration: 600, delay: 250 }}>
            {$currentCategory.description}
          </p>
        {/if}

        <!-- Stats -->
        <div class="flex justify-center gap-8 mb-10" in:fly={{ y: 20, duration: 600, delay: 400 }}>
          <div class="text-center">
            <div class="text-2xl font-bold text-white">{$filteredProducts.length}</div>
            <div class="text-xs text-surface-300 uppercase tracking-wider">Modelos</div>
          </div>
          <div class="w-px h-10 bg-surface-700"></div>
          <div class="text-center">
            <div class="text-2xl font-bold text-white">100%</div>
            <div class="text-xs text-surface-300 uppercase tracking-wider">Auténticos</div>
          </div>
          <div class="w-px h-10 bg-surface-700"></div>
          <div class="text-center">
            <div class="text-2xl font-bold text-white">Premium</div>
            <div class="text-xs text-surface-300 uppercase tracking-wider">Calidad</div>
          </div>
        </div>

        <!-- CTA -->
        <div in:fly={{ y: 20, duration: 600, delay: 550 }}>
          <a
            href="{base}/catalogo"
            class="inline-flex items-center gap-2 bg-primary-500 text-white font-bold px-8 py-4 text-lg uppercase tracking-wider rounded-lg hover:bg-primary-600 transition-colors duration-200 shadow-lg"
          >
            Ver Catálogo Completo
          </a>
        </div>
      </div>
    </div>

    <!-- Red bottom line -->
    <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"></div>
  </section>
{:else if $categoriesLoading}
  <!-- Loading category info -->
  <div class="container mx-auto px-4 py-12 text-center bg-surface-900" in:fade>
    <div class="flex justify-center items-center space-x-4 mb-4">
      <div class="placeholder animate-pulse w-12 h-12 rounded-full bg-primary-600"></div>
    </div>
    <p class="text-surface-200">Cargando información de categoría...</p>
  </div>
{:else}
  <!-- Category not found -->
  <div class="container mx-auto px-4 py-12 text-center bg-surface-900" in:fade>
    <div class="text-6xl mb-4 opacity-30">❌</div>
    <h2 class="text-2xl font-bold mb-4 text-white">Categoría no encontrada</h2>
    <p class="text-surface-200 mb-6">La categoría "{categorySlug}" no existe o no está configurada.</p>
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
  <div class="container mx-auto px-4 py-20 text-center bg-surface-900" in:fade>
    <div class="flex justify-center items-center space-x-4 mb-8">
      <div class="placeholder animate-pulse w-12 h-12 rounded-full bg-primary-600"></div>
      <div class="placeholder animate-pulse w-10 h-10 rounded-full bg-secondary-600 delay-200"></div>
      <div class="placeholder animate-pulse w-8 h-8 rounded-full bg-warning-600 delay-400"></div>
    </div>
    <h3 class="text-xl font-semibold text-white mb-2">Preparando la parrilla...</h3>
    <p class="text-surface-200">Cargando los monoplazas más espectaculares</p>
  </div>
{/if}

<!-- Products Section -->
{#if !$isLoading}
  <section class="px-4 py-16 bg-surface-900">
    <div class="container mx-auto">
    {#if $filteredProducts.length === 0}
      <div class="text-center py-24" in:fade>
        <div class="text-8xl mb-8 text-surface-200 opacity-30 font-bold">F1</div>
        <h3 class="text-3xl font-bold mb-4 text-white">No hay productos en esta categoría</h3>
        <p class="text-surface-200 mb-8 max-w-md mx-auto text-lg leading-relaxed">
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
      <div class="text-center mb-10">
        <h2 class="text-2xl font-bold text-white uppercase tracking-wider mb-3">
          Colección {$currentCategory?.name || categorySlug}
        </h2>
        <div class="w-16 h-0.5 bg-primary-500 mx-auto mb-4"></div>
        <p class="text-surface-200 text-sm">
          {$filteredProducts.length} modelos disponibles
        </p>
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
          <div class="bg-surface-800 border border-surface-700 rounded-lg p-8">
            <h3 class="text-lg font-bold text-white uppercase tracking-wider mb-4">
              {$filteredProducts.length} modelos explorados
            </h3>
            <p class="text-surface-200 text-sm mb-6">
              Descubre más en nuestro catálogo completo
            </p>
            <button
              class="inline-flex items-center gap-2 bg-primary-500 text-white font-bold px-6 py-3 uppercase tracking-wider rounded-lg hover:bg-primary-600 transition-colors duration-200"
              on:click={() => goto(base || '/')}
            >
              <LucideGrid class="w-5 h-5" />
              Explorar Todas las Categorías
            </button>
          </div>
        </div>
      {/if}
    {/if}
    </div>
  </section>
{/if}

<!-- Related Categories Section -->
{#if $currentCategory && $filteredProducts.length > 0}
  <section class="bg-surface-800 py-16 px-4">
    <div class="container mx-auto max-w-screen-lg">
      <div class="text-center mb-10">
        <h2 class="text-2xl font-bold text-white uppercase tracking-wider mb-3">
          Categorías Relacionadas
        </h2>
        <div class="w-16 h-0.5 bg-primary-500 mx-auto"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        {#each $categories.filter(c => c.type === $currentCategory?.type && c.id !== $currentCategory?.id).slice(0, 3) as relatedCategory}
          <a
            href="{base}/categoria/{relatedCategory.id}"
            class="text-center p-6 bg-surface-900 border border-surface-700 rounded-lg hover:border-primary-500 transition-colors duration-200"
          >
            <div class="w-14 h-14 bg-surface-700 border border-surface-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <LucideGrid class="w-7 h-7 text-primary-500" />
            </div>
            <h3 class="font-bold text-white mb-2">{relatedCategory.name}</h3>
            <p class="text-surface-200 text-sm leading-relaxed line-clamp-2">
              {relatedCategory.description || 'Ver colección'}
            </p>
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
</style>