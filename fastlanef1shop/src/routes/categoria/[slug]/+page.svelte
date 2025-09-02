<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { writable, derived } from 'svelte/store';
  import { fade, fly } from 'svelte/transition';
  import { goto } from '$app/navigation';
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
  import { categories, loadCategories, type Category } from '$lib/stores/categories';

  // Importar iconos con unplugin
  import LucideHome from '~icons/lucide/home';
  import LucideChevronRight from '~icons/lucide/chevron-right';
  import LucideHelmet from '~icons/lucide-lab/motor-racing-helmet';
  import LucideShoppingCart from '~icons/lucide/shopping-cart';
  import LucideClose from '~icons/lucide/x';
  import LucidePlus from '~icons/lucide/plus';
  import LucideMinus from '~icons/lucide/minus';
  import LucideTrash from '~icons/lucide/trash-2';
  import LucideF1 from '~icons/lucide/car-front';
  import LucideStar from '~icons/lucide/star';
  import LucideCheck from '~icons/lucide/check-circle';
  import LucideCartPlus from '~icons/lucide/shopping-cart';
  import LucideEye from '~icons/lucide/eye';
  import LucideArrowLeft from '~icons/lucide/arrow-left';
  import LucideTruck from '~icons/lucide/truck';
  import LucideShield from '~icons/lucide/shield-check';
  import LucideCreditCard from '~icons/lucide/credit-card';
  import LucideShoppingBag from '~icons/lucide/shopping-bag';
  import LucideCalculator from '~icons/lucide/calculator';

  // Stores
  const products = writable<Product[]>([]);
  const isLoading = writable<boolean>(true);
  const isCartOpen = writable<boolean>(false);

  // GitHub configuration
  const GITHUB_REPO_URL = 'https://raw.githubusercontent.com/tu-usuario/tu-repo/main';

  // Get category from URL
  $: categorySlug = $page.params.slug;
  
  // Derived stores
  const currentCategory = derived(
    [categories, page],
    ([$categories, $page]) => 
      $categories.find(cat => cat.id === $page.params.slug) || null
  );

  // Filtrar productos que contengan la categoría en su array de categorías
  const filteredProducts = derived(
    [products, page], 
    ([$products, $page]) => 
      $products.filter(p => p.categories.includes($page.params.slug))
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
      
      // Fallback mock data con múltiples categorías
      const mockProducts: Product[] = [
        {
          id: 1,
          name: "Red Bull RB19 Max Verstappen",
          description: "El monoplaza dominador de la temporada, pilotado por Max Verstappen hacia su tercer título mundial consecutivo.",
          categories: ["championship", "red-bull", "verstappen", "burago", "scale-1-43"],
          price: 89.99,
          images: ["rb19_1.jpg", "rb19_2.jpg", "rb19_3.jpg"],
          imageFolder: "images/rb19/",
          inStock: true,
          limitedEdition: true,
          year: 2023,
          team: "Red Bull Racing",
          manufacturer: "Bburago",
          scale: "1:43",
          driver: "Max Verstappen"
        },
        {
          id: 2,
          name: "Ferrari SF-23 Charles Leclerc",
          description: "La máquina roja de Maranello con el corazón palpitante de la Scuderia Ferrari.",
          categories: ["ferrari", "leclerc", "minichamps", "scale-1-43"],
          price: 79.99,
          images: ["sf23_1.jpg", "sf23_2.jpg"],
          imageFolder: "images/sf23/",
          inStock: true,
          limitedEdition: false,
          year: 2023,
          team: "Scuderia Ferrari",
          manufacturer: "Minichamps",
          scale: "1:43",
          driver: "Charles Leclerc"
        },
        {
          id: 3,
          name: "Mercedes W14 Lewis Hamilton",
          description: "La flecha plateada de Mercedes-AMG Petronas, buscando recuperar su supremacía.",
          categories: ["mercedes", "hamilton", "spark", "scale-1-18"],
          price: 149.99,
          images: ["w14_1.jpg", "w14_2.jpg", "w14_3.jpg"],
          imageFolder: "images/w14/",
          inStock: true,
          limitedEdition: false,
          year: 2023,
          team: "Mercedes-AMG Petronas",
          manufacturer: "Spark Model",
          scale: "1:18",
          driver: "Lewis Hamilton"
        }
      ];
      
      products.set(mockProducts);
    } finally {
      isLoading.set(false);
    }
  }

  function getProductImageUrl(product: Product, imageIndex: number = 0): string {
    return `${GITHUB_REPO_URL}/${product.imageFolder}${product.images[imageIndex]}`;
  }

  function handleAddToCart(product: Product): void {
    addToCart(product);
    console.log(`Added ${product.name} to cart`);
  }

  onMount(() => {
    reloadCart();
    loadCategories();
    loadProducts();
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
          href="/" 
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
  <section class="container mx-auto px-4 py-16 bg-surface-50 dark:bg-surface-900">
    {#if $filteredProducts.length === 0}
      <div class="text-center py-24" in:fade>
        <div class="text-8xl mb-8 text-surface-300-600-token opacity-30 font-bold">F1</div>
        <h3 class="text-3xl font-bold mb-4 text-surface-900-50-token">No hay productos en esta categoría</h3>
        <p class="text-surface-600-300-token mb-8 max-w-md mx-auto text-lg leading-relaxed">
          Aún no tenemos monoplazas disponibles en esta categoría, pero pronto añadiremos nuevos modelos emocionantes.
        </p>
        <button 
          class="btn variant-filled-primary text-lg px-8 py-4 hover:scale-105 transition-transform duration-200"
          on:click={() => goto('/')}
        >
          <LucideArrowLeft class="mr-2 w-5 h-5" />
          Ver Todos los Productos
        </button>
      </div>
    {:else}
      <!-- Section Header -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-surface-900-50-token mb-4">
          Colección {$currentCategory.name}
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

      <!-- Products Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each $filteredProducts as product, i}
          <div 
        class="card card-hover overflow-hidden bg-surface-0-token dark:bg-surface-800-token border border-surface-200 dark:border-surface-700 
        transition-all duration-300 hover:shadow-2xl hover:border-primary-300 dark:hover:border-primary-600 hover:-translate-y-2 cursor-pointer"
        in:fly={{ y: 50, duration: 500, delay: i * 100 }}
        on:click={() => goto(`/producto/${product.id}`)}
          >
        <!-- Product Image -->
        <header class="card-header relative overflow-hidden bg-surface-100 dark:bg-surface-700 h-56 group">
          <img 
            src={getProductImageUrl(product, 0)} 
            alt={product.name}
            class="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
            on:error={(e) => {
          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyMEM4Ljk1NDMgMjAgMCAyOC45NTQzIDAgNDBIMTBDMTAgMzQuNDc3MSAxNC40NzcxIDMwIDE5IDMwSDIxQzI1LjUyMjkgMzAgMzAgMzQuNDc3MSAzMCA0MEg0MEMzMCAyOC45NTQzIDMxLjA0NTcgMjAgMjAgMjBaIiBmaWxsPSIjQzNDM0MzIi8+Cjwvc3ZnPgo=';
          e.currentTarget.classList.add('opacity-50');
            }}
          />
          
          <!-- Product ID Badge -->
          <div class="absolute top-4 right-4">
            <span class="badge variant-filled-error text-xs font-bold shadow-lg">
          #{product.id.toString().padStart(3, '0')}
            </span>
          </div>
          
          <!-- Limited Edition Badge -->
          {#if product.limitedEdition}
            <div class="absolute top-4 left-4">
          <span class="badge variant-filled-warning text-xs font-bold shadow-lg animate-pulse">
            <LucideStar class="mr-1 w-3 h-3" />
            Limitada
          </span>
            </div>
          {/if}
          
          <!-- Enhanced Hover Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-surface-900/90 via-surface-900/20 to-transparent 
          opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6">
            <div class="text-surface-50 w-full">
          <h3 class="font-bold text-lg drop-shadow-md mb-2">{product.name}</h3>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <LucideEye class="w-4 h-4" />
              <span class="text-sm opacity-90">Ver detalles</span>
            </div>
            <div class="flex items-center space-x-1">
              <div class="w-1.5 h-1.5 bg-success-400 rounded-full"></div>
              <span class="text-xs opacity-80">Disponible</span>
            </div>
          </div>
            </div>
          </div>
        </header>

        <!-- Product Info -->
        <div class="p-6 bg-surface-50 dark:bg-surface-800" on:click|stopPropagation>
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
          
          <h3 class="h4 font-bold mb-3 text-surface-900-50-token leading-tight line-clamp-2">{product.name}</h3>
          <p class="text-surface-600-300-token text-sm mb-5 line-clamp-3 leading-relaxed">
            {product.description}
          </p>
          
          <!-- Product Features -->
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
          <span class="text-xs text-surface-600-300-token font-medium">
            {product.limitedEdition ? 'Edición Limitada' : 'Disponible'}
          </span>
            </div>
            <div class="flex items-center space-x-1">
          {#each Array(5) as _, starIndex}
            <LucideStar class="text-warning-500 w-4 h-4 fill-current" />
          {/each}
            </div>
          </div>
          
          <!-- Price and Add to Cart -->
          <div class="flex items-center justify-between pt-4 border-t border-surface-200 dark:border-surface-600">
            <div class="flex flex-col">
          <div class="text-2xl font-bold text-success-600 dark:text-success-400">
            ${product.price.toFixed(2)}
          </div>
          <div class="text-xs text-surface-500-400-token">Precio final • Envío gratis</div>
            </div>
            <button
          class="btn variant-filled-primary font-semibold hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
          on:click={() => handleAddToCart(product)}
            >
          <LucideCartPlus class="mr-2 w-4 h-4" />
          Añadir
            </button>
          </div>
        </div>
          </div>
        {/each}
      </div>
    {/if}
  </section>
{/if}

<style lang="postcss">
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
  
  /* Card hover effects with racing theme */
  .card-hover {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .card-hover:hover {
    transform: translateY(-8px);
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