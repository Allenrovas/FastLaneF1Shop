<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { writable, derived } from 'svelte/store';
  import { fade, fly, scale } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import { 
    cart, 
    cartTotal, 
    cartItemCount, 
    addToCart,
    reloadCart,
    type Product 
  } from '$lib/stores/cart';
  import { categories, loadCategories, type Category } from '$lib/stores/categories';

  // Importar iconos con unplugin
  import LucideHome from '~icons/lucide/home';
  import LucideChevronRight from '~icons/lucide/chevron-right';
  import LucideF1 from '~icons/lucide/car-front';
  import LucideHelmet from '~icons/lucide-lab/motor-racing-helmet';
  import LucideStar from '~icons/lucide/star';
  import LucideCheck from '~icons/lucide/check-circle';
  import LucideClose from '~icons/lucide/x-circle';
  import LucideZoomIn from '~icons/lucide/zoom-in';
  import LucideMaximize from '~icons/lucide/maximize';
  import LucideCartPlus from '~icons/lucide/shopping-cart';
  import LucideClock from '~icons/lucide/clock';
  import LucideLock from '~icons/lucide/lock';
  import LucideCreditCard from '~icons/lucide/credit-card';
  import LucideFacebook from '~icons/lucide/facebook';
  import LucideTwitter from '~icons/lucide/twitter';
  import LucideShare from '~icons/lucide/share-2';
  import LucideLink from '~icons/lucide/link';
  import LucideCog from '~icons/lucide/cog';
  import LucideEngine from '~icons/lucide/cpu';
  import LucideBolt from '~icons/lucide/zap';
  import LucideWeight from '~icons/lucide/weight';
  import LucideGauge from '~icons/lucide/gauge';
  import LucideTimer from '~icons/lucide/timer';
  import LucideArrowLeft from '~icons/lucide/arrow-left';
  import LucideEye from '~icons/lucide/eye';  
  import LucideTruck from '~icons/lucide/truck';
  import LucideShield from '~icons/lucide/shield-check';

  // Component stores
  const product = writable<Product | null>(null);
  const isLoading = writable<boolean>(true);
  const selectedImageIndex = writable<number>(0);
  const isZoomed = writable<boolean>(false);

  // GitHub configuration
  const GITHUB_REPO_URL = 'https://raw.githubusercontent.com/tu-usuario/tu-repo/main';

  // Get product ID from URL
  $: productId = parseInt($page.params.id ?? '0');

  // Derived stores
  const currentCategories = derived(
    [categories, product],
    ([$categories, $product]) => 
      $product ? $categories.filter(cat => $product.categories.includes(cat.id)) : []
  );

  const relatedProducts = writable<Product[]>([]);

  // Load single product
  async function loadProduct(): Promise<void> {
    try {
      isLoading.set(true);
      
      const response = await fetch(`${GITHUB_REPO_URL}/data/products.json`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: Product[] = await response.json();
      const foundProduct = data.find(p => p.id === productId);
      
      if (!foundProduct) {
        throw new Error('Product not found');
      }
      
      product.set(foundProduct);
      
      // Set related products (same categories, excluding current)
      const related = data
        .filter(p => 
          p.id !== foundProduct.id && 
          p.categories.some(cat => foundProduct.categories.includes(cat))
        )
        .slice(0, 3);
      relatedProducts.set(related);
      
    } catch (error) {
      console.error('Error loading product:', error);
      
      // Fallback mock data con nuevas propiedades
      const mockProduct: Product = {
        id: productId,
        name: "Red Bull RB19 Max Verstappen",
        description: "El monoplaza dominador de la temporada 2023, pilotado por Max Verstappen hacia su tercer título mundial consecutivo. Una obra maestra de la ingeniería aerodinámica que redefinió los límites de la velocidad en la Fórmula 1.",
        categories: ["championship", "red-bull", "verstappen", "burago", "scale-1-43"],
        price: 89.99,
        originalPrice: 99.99,
        images: ["rb19_1.jpg", "rb19_2.jpg", "rb19_3.jpg", "rb19_4.jpg"],
        imageFolder: "images/rb19/",
        specifications: {
          engine: "Honda RBPT V6 Turbo Híbrido",
          power: "1050+ HP",
          weight: "798 kg",
          topSpeed: "370 km/h",
          acceleration: "0-100 km/h en 2.3s"
        },
        features: [
          "Aerodinámica revolucionaria",
          "Sistema de suspensión adaptativa",
          "Chasis de fibra de carbono",
          "Sistema híbrido avanzado",
          "Frenos de carbono-carbono",
          "Neumáticos Pirelli exclusivos"
        ],
        inStock: true,
        limitedEdition: true,
        year: 2023,
        team: "Red Bull Racing",
        manufacturer: "Bburago",
        scale: "1:43",
        driver: "Max Verstappen"
      };
      
      product.set(mockProduct);
      
      // Mock related products
      const mockRelated: Product[] = [
        {
          id: 2,
          name: "Red Bull RB19 Sergio Pérez",
          description: "El compañero de equipo de Verstappen en Red Bull Racing.",
          categories: ["red-bull", "burago", "scale-1-43"],
          price: 89.99,
          images: ["rb19_perez.jpg"],
          imageFolder: "images/rb19/",
          inStock: true,
          limitedEdition: false,
          year: 2023,
          team: "Red Bull Racing",
          manufacturer: "Bburago",
          scale: "1:43",
          driver: "Sergio Pérez"
        }
      ];
      relatedProducts.set(mockRelated);
    } finally {
      isLoading.set(false);
    }
  }

  function getProductImageUrl(product: Product, imageIndex: number = 0): string {
    return `${GITHUB_REPO_URL}/${product.imageFolder}${product.images[imageIndex]}`;
  }

  function handleAddToCart(product: Product): void {
    addToCart(product);
  }

  function handleImageError(e: Event) {
    const img = e.currentTarget as HTMLImageElement;
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyMEM4Ljk1NDMgMjAgMCAyOC45NTQzIDAgNDBIMTBDMTAgMzQuNDc3MSAxNC40NzcxIDMwIDE5IDMwSDIxQzI1LjUyMjkgMzAgMzAgMzQuNDc3MSAzMCA0MEg0MEMzMCAyOC45NTQzIDMxLjA0NTcgMjAgMjAgMjBaIiBmaWxsPSIjQzNDM0MzIi8+Cjwvc3ZnPgo=';
    img.classList.add('opacity-50');
  }

  onMount(() => {
    reloadCart();
    loadCategories();
    loadProduct();
  });
</script>

<svelte:head>
  <title>{$product?.name || 'Producto'} - Fast Lane F1 Shop</title>
  <meta name="description" content={$product?.description || 'Descubre este increíble monoplaza de Fórmula 1'} />
</svelte:head>

{#if $isLoading}
  <!-- Loading State -->
  <div class="container mx-auto px-4 py-20 text-center" in:fade>
    <div class="flex justify-center items-center space-x-4 mb-8">
      <div class="placeholder animate-pulse w-16 h-16 rounded-full bg-primary-300 dark:bg-primary-600"></div>
      <div class="placeholder animate-pulse w-12 h-12 rounded-full bg-secondary-300 dark:bg-secondary-600"></div>
      <div class="placeholder animate-pulse w-8 h-8 rounded-full bg-warning-300 dark:bg-warning-600"></div>
    </div>
    <h3 class="text-2xl font-semibold text-surface-900 dark:text-surface-50 mb-4">
      Cargando detalles del monoplaza...
    </h3>
    <p class="text-surface-600 dark:text-surface-300">Preparando la experiencia premium para ti</p>
  </div>
{:else if $product}
  <!-- Breadcrumb -->
  <section class="container mx-auto px-4 py-6 bg-surface-50 dark:bg-surface-900">
    <nav class="breadcrumb">
      <ol class="flex items-center space-x-3 text-sm">
        <li>
          <a 
            href="/" 
            class="flex items-center space-x-2 text-surface-600 dark:text-surface-300 hover:text-primary-500 transition-colors duration-200 font-medium"
          >
            <span>Inicio</span>
          </a>
        </li>
        <li class="text-surface-400 dark:text-surface-500">
          <LucideChevronRight class="w-4 h-4" />
        </li>
        <li class="flex items-center space-x-2">
          <span class="font-semibold text-surface-900 dark:text-surface-50">
            {$product.name}
          </span>
        </li>
      </ol>
    </nav>
  </section>

  <!-- Product Detail Section -->
  <section class="container mx-auto px-4 py-12">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12" in:fade={{ duration: 600 }}>
      <!-- Product Images -->
      <div class="space-y-4">
        <!-- Main Image -->
        <div class="relative bg-surface-100 dark:bg-surface-700 rounded-2xl overflow-hidden aspect-square group">
          <img 
            src={getProductImageUrl($product, $selectedImageIndex)} 
            alt={$product.name}
            class="w-full h-full object-cover transition-all duration-500 cursor-zoom-in {$isZoomed ? 'scale-150' : 'scale-100'}"
            on:click={() => isZoomed.update(z => !z)}
            on:error={handleImageError}
            in:scale={{ duration: 400 }}
          />
          
          <!-- Image Controls -->
          <div class="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button class="btn btn-sm variant-filled-surface rounded-full shadow-lg">
              <LucideZoomIn class="w-4 h-4" />
            </button>
            <button class="btn btn-sm variant-filled-surface rounded-full shadow-lg">
              <LucideMaximize class="w-4 h-4" />
            </button>
          </div>
          
          <!-- Limited Edition Badge -->
          {#if $product.limitedEdition}
            <div class="absolute top-4 left-4">
              <span class="badge variant-filled-warning text-sm font-bold shadow-lg animate-pulse">
                <LucideStar class="mr-1 w-4 h-4" />
                Edición Limitada
              </span>
            </div>
          {/if}
          
          <!-- Stock Status -->
          <div class="absolute bottom-4 left-4">
            <span class="badge {$product.inStock ? 'variant-filled-success' : 'variant-filled-error'} text-sm font-bold shadow-lg">
              {#if $product.inStock}
                <LucideCheck class="mr-1 w-4 h-4" />
                En Stock
              {:else}
                <LucideClose class="mr-1 w-4 h-4" />
                Agotado
              {/if}
            </span>
          </div>
        </div>
        
        <!-- Thumbnail Images -->
        <div class="flex space-x-4 overflow-x-auto pb-2">
          {#each $product.images as image, index}
            <button
              class="flex-shrink-0 w-20 h-20 bg-surface-200 dark:bg-surface-600 rounded-lg overflow-hidden border-2 transition-all duration-300 
              {$selectedImageIndex === index ? 'border-primary-500 scale-105' : 'border-transparent hover:border-surface-300'}"
              on:click={() => selectedImageIndex.set(index)}
            >
              <img 
                src={getProductImageUrl($product, index)} 
                alt="{$product.name} - Vista {index + 1}"
                class="w-full h-full object-cover"
                on:error={handleImageError}
              />
            </button>
          {/each}
        </div>
      </div>

      <!-- Product Information -->
      <div class="space-y-6">
        <!-- Product Header -->
        <div in:fly={{ y: 30, duration: 600, delay: 200 }}>
          <!-- Category badges -->
          <div class="flex flex-wrap gap-2 mb-4">
            {#each $currentCategories as category}
              <span class="badge {category.variant} text-sm font-medium">
                {category.name}
              </span>
            {/each}
          </div>
          
          <!-- Product details badges -->
          <div class="flex flex-wrap gap-2 mb-6">
            <span class="badge variant-soft-primary text-sm font-medium">
              <LucideHelmet class="mr-1 w-3 h-3" />
              {$product.team}
            </span>
            <span class="badge variant-soft-secondary text-sm font-medium">
              {$product.manufacturer}
            </span>
            <span class="badge variant-soft-tertiary text-sm font-medium">
              Escala {$product.scale}
            </span>
            {#if $product.driver}
              <span class="badge variant-soft-warning text-sm font-medium">
                {$product.driver}
              </span>
            {/if}
            <span class="badge variant-soft-surface text-sm font-medium">
              {$product.year}
            </span>
          </div>
          
          <h1 class="text-4xl font-bold text-surface-900 dark:text-surface-50 mb-4 leading-tight">
            {$product.name}
          </h1>
          
          <!-- Rating -->
          <div class="flex items-center space-x-3 mb-4">
            <div class="flex space-x-1">
              {#each Array(5) as _, i}
                <LucideStar class="text-warning-500 w-5 h-5 fill-current" />
              {/each}
            </div>
            <span class="text-surface-600 dark:text-surface-300 text-sm">
              (4.9/5.0 • 127 reseñas)
            </span>
          </div>
          
          <!-- Price -->
          <div class="flex items-center space-x-4 mb-6">
            <span class="text-4xl font-bold text-success-600 dark:text-success-400">
              ${$product.price.toFixed(2)}
            </span>
            {#if $product.originalPrice && $product.originalPrice > $product.price}
              <span class="text-2xl text-surface-500 dark:text-surface-400 line-through">
                ${$product.originalPrice.toFixed(2)}
              </span>
              <span class="badge variant-filled-error text-sm font-bold">
                ¡Oferta!
              </span>
            {/if}
          </div>
        </div>

        <!-- Product Description -->
        <div class="prose prose-sm max-w-none" in:fly={{ y: 30, duration: 600, delay: 300 }}>
          <p class="text-surface-700 dark:text-surface-200 leading-relaxed text-lg">
            {$product.description}
          </p>
        </div>

        <!-- Key Features -->
        {#if $product.features && $product.features.length > 0}
          <div in:fly={{ y: 30, duration: 600, delay: 400 }}>
            <h3 class="text-xl font-bold text-surface-900 dark:text-surface-50 mb-4 flex items-center">
              <LucideCog class="mr-2 w-5 h-5 text-primary-500" />
              Características Principales
            </h3>
            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {#each $product.features as feature, i}
                <li class="flex items-center space-x-3 p-3 bg-surface-100 dark:bg-surface-700 rounded-lg"
                    in:fly={{ x: -30, duration: 400, delay: 500 + (i * 100) }}>
                  <LucideCheck class="text-success-500 w-5 h-5" />
                  <span class="text-surface-800 dark:text-surface-100 font-medium">{feature}</span>
                </li>
              {/each}
            </ul>
          </div>
        {/if}

        <!-- Add to Cart Section -->
        <div class="bg-surface-100 dark:bg-surface-700 p-6 rounded-2xl" 
             in:fly={{ y: 30, duration: 600, delay: 600 }}>
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-bold text-surface-900 dark:text-surface-50 mb-2">
                Añadir a tu colección
              </h3>
              <div class="flex items-center space-x-4 text-sm text-surface-600 dark:text-surface-300">
                <span class="flex items-center">
                  <LucideTruck class="mr-1 w-4 h-4" />
                  Envío gratis mundial
                </span>
                <span class="flex items-center">
                  <LucideShield class="mr-1 w-4 h-4" />
                  Garantía premium
                </span>
              </div>
            </div>
          </div>
          
          <button
            class="btn variant-filled-primary w-full text-lg font-semibold py-4 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            on:click={() => handleAddToCart($product)}
            disabled={!$product.inStock}
          >
            {#if $product.inStock}
              <LucideCartPlus class="mr-2 w-5 h-5" />
              Añadir al Carrito - ${$product.price.toFixed(2)}
            {:else}
              <LucideClock class="mr-2 w-5 h-5" />
              Notificarme cuando esté disponible
            {/if}
          </button>
          
          <div class="flex items-center justify-center mt-4 space-x-4 text-sm text-surface-500 dark:text-surface-400">
            <span class="flex items-center">
              <LucideLock class="mr-1 w-4 h-4" />
              Compra segura
            </span>
            <div class="w-px h-4 bg-surface-300 dark:bg-surface-600"></div>
            <span class="flex items-center">
              <LucideCreditCard class="mr-1 w-4 h-4" />
              Pago fácil
            </span>
          </div>
        </div>

        <!-- Share Section -->
        <div class="flex items-center justify-between pt-6 border-t border-surface-200 dark:border-surface-600">
          <span class="text-surface-600 dark:text-surface-300 font-medium">Compartir:</span>
          <div class="flex space-x-3">
            <button class="btn btn-sm variant-soft-primary rounded-full w-10 h-10 !p-0">
              <LucideFacebook class="w-4 h-4" />
            </button>
            <button class="btn btn-sm variant-soft-secondary rounded-full w-10 h-10 !p-0">
              <LucideTwitter class="w-4 h-4" />
            </button>
            <button class="btn btn-sm variant-soft-success rounded-full w-10 h-10 !p-0">
              <LucideShare class="w-4 h-4" />
            </button>
            <button class="btn btn-sm variant-soft-warning rounded-full w-10 h-10 !p-0">
              <LucideLink class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Technical Specifications -->
  {#if $product.specifications}
    <section class=" px-4 py-12 bg-surface-100 dark:bg-surface-800"
             in:fly={{ y: 50, duration: 600, delay: 800 }}>
      <div class="max-w-4xl container mx-auto">
        <h2 class="text-3xl font-bold text-center text-surface-900 dark:text-surface-50 mb-12 flex items-center justify-center">
          <LucideCog class="mr-3 w-7 h-7 text-primary-500" />
          Especificaciones Técnicas
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each Object.entries($product.specifications) as [key, value], i}
            <div class="card variant-ghost-surface p-6 text-center border border-surface-200 dark:border-surface-600"
                 in:scale={{ duration: 400, delay: 900 + (i * 100) }}>
              <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                {#if key === 'engine'}
                  <LucideEngine class="w-8 h-8 text-white" />
                {:else if key === 'power'}
                  <LucideBolt class="w-8 h-8 text-white" />
                {:else if key === 'weight'}
                  <LucideWeight class="w-8 h-8 text-white" />
                {:else if key === 'topSpeed'}
                  <LucideGauge class="w-8 h-8 text-white" />
                {:else}
                  <LucideTimer class="w-8 h-8 text-white" />
                {/if}
              </div>
              <h3 class="font-bold text-surface-900 dark:text-surface-50 mb-2 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <p class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                {value}
              </p>
            </div>
          {/each}
        </div>
      </div>
    </section>
  {/if}

  <!-- Related Products -->
  {#if $relatedProducts.length > 0}
    <section class="px-4 py-12 bg-surface-50 dark:bg-surface-900"
             in:fly={{ y: 50, duration: 600, delay: 1000 }}>
      <div class="container mx-auto">
      <div class="text-center mx-auto mb-12">
        <h2 class="text-3xl font-bold text-surface-900 dark:text-surface-50 mb-4">
          Productos Relacionados
        </h2>
        <p class="text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
          Descubre otros monoplazas que comparten categorías con este modelo
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        {#each $relatedProducts as relatedProduct, i}
          <div 
            class="card card-hover overflow-hidden bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 hover:shadow-2xl transition-all duration-300 cursor-pointer"
            in:fly={{ y: 50, duration: 500, delay: 1100 + (i * 100) }}
            on:click={() => goto(`/producto/${relatedProduct.id}`)}
            tabindex="0"
            role="link"
            aria-label={`Ver detalles de ${relatedProduct.name}`}
          >
            <header class="card-header relative overflow-hidden h-48 group">
              <img 
                src={getProductImageUrl(relatedProduct, 0)} 
                alt={relatedProduct.name}
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                on:error={handleImageError}
              />
              
              <div class="absolute inset-0 bg-gradient-to-t from-surface-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <button 
                  class="btn variant-filled-primary w-full"
                  on:click|stopPropagation={() => goto(`/producto/${relatedProduct.id}`)}
                >
                  <LucideEye class="mr-2 w-4 h-4" />
                  Ver Detalles
                </button>
              </div>
            </header>
            
            <div class="p-6">
              <!-- Categories for related product -->
              <div class="flex flex-wrap gap-1 mb-3">
                <span class="badge variant-soft-primary text-xs">{relatedProduct.team}</span>
                <span class="badge variant-soft-secondary text-xs">{relatedProduct.manufacturer}</span>
                <span class="badge variant-soft-tertiary text-xs">{relatedProduct.scale}</span>
              </div>
              
              <h3 class="font-bold text-surface-900 dark:text-surface-50 mb-2 line-clamp-2">
                {relatedProduct.name}
              </h3>
              <p class="text-surface-600 dark:text-surface-300 text-sm mb-4 line-clamp-3">
                {relatedProduct.description}
              </p>
              <div class="flex items-center justify-between">
                <span class="text-xl font-bold text-success-600 dark:text-success-400">
                  ${relatedProduct.price.toFixed(2)}
                </span>
                <button 
                  class="btn variant-soft-primary btn-sm"
                  on:click|stopPropagation={() => goto(`/producto/${relatedProduct.id}`)}
                >
                  Ver más
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
      </div>
    </section>
  {/if}
{:else}
  <!-- Product Not Found -->
  <div class="container mx-auto px-4 py-20 text-center" in:fade>
    <div class="max-w-md mx-auto">
      <div class="text-8xl mb-8 text-surface-300 dark:text-surface-600 opacity-50">🏎️</div>
      <h2 class="text-3xl font-bold text-surface-900 dark:text-surface-50 mb-4">
        Producto no encontrado
      </h2>
      <p class="text-surface-600 dark:text-surface-300 mb-8 leading-relaxed">
        El monoplaza que buscas no está disponible o ha sido movido a otra ubicación.
      </p>
      <div class="space-y-3">
        <button 
          class="btn variant-filled-primary px-8 py-3"
          on:click={() => goto('/')}
        >
          <LucideHome class="mr-2 w-4 h-4" />
          Volver al Inicio
        </button>
        <button 
          class="btn variant-soft-surface px-8 py-3"
          on:click={() => history.back()}
        >
          <LucideArrowLeft class="mr-2 w-4 h-4" />
          Página Anterior
        </button>
      </div>
    </div>
  </div>
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
  
  .card-hover {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .card-hover:hover {
    transform: translateY(-8px);
  }
  
  .cursor-zoom-in {
    cursor: zoom-in;
  }
  
  /* Custom scrollbar for thumbnails */
  .overflow-x-auto::-webkit-scrollbar {
    height: 6px;
  }
  
  .overflow-x-auto::-webkit-scrollbar-track {
    background: rgb(var(--color-surface-200));
  }
  
  .overflow-x-auto::-webkit-scrollbar-thumb {
    background: rgb(var(--color-primary-500));
    border-radius: 3px;
  }
</style>