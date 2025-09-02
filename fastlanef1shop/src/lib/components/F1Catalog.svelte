<script lang="ts">
  import { onMount } from 'svelte';
  import { writable, derived } from 'svelte/store';
  import { fade, fly, scale } from 'svelte/transition';
  import { elasticOut } from 'svelte/easing';
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
  } from '../stores/cart';
  import { categories, loadCategories, type Category } from '../stores/categories';

  // Component stores
  const products = writable<Product[]>([]);
  const selectedCategory = writable<string>('all');
  const isLoading = writable<boolean>(true);
  const searchQuery = writable<string>('');

  // GitHub Pages configuration
  const GITHUB_REPO_URL = 'https://raw.githubusercontent.com/tu-usuario/tu-repo/main';

  // Derived store for filtered products
  const filteredProducts = derived(
    [products, selectedCategory, searchQuery], 
    ([$products, $selectedCategory, $searchQuery]) => {
      let filtered = $selectedCategory === 'all' 
        ? $products 
        : $products.filter(p => p.category === $selectedCategory);
      
      if ($searchQuery.trim()) {
        const query = $searchQuery.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.team.toLowerCase().includes(query)
        );
      }
      
      return filtered;
    }
  );

  // Load products from GitHub Pages
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
      
      // Fallback mock data para desarrollo
      const mockProducts: Product[] = [
        {
          id: 1,
          name: "Red Bull RB19",
          description: "El monoplaza dominador de la temporada 2023, pilotado por Max Verstappen hacia su tercer título mundial consecutivo.",
          category: "championship",
          price: 89.99,
          originalPrice: 99.99,
          images: ["rb19_1.jpg", "rb19_2.jpg", "rb19_3.jpg"],
          imageFolder: "images/rb19/",
          specifications: {
            engine: "Honda RBPT V6 Turbo",
            power: "1050+ HP",
            weight: "798 kg",
            topSpeed: "370 km/h",
            acceleration: "0-100 km/h en 2.3s"
          },
          features: ["Aerodinámica revolucionaria", "Sistema híbrido avanzado", "Chasis de fibra de carbono"],
          inStock: true,
          limitedEdition: true,
          year: 2023,
          team: "Red Bull Racing"
        },
        {
          id: 2,
          name: "Ferrari SF-23",
          description: "La máquina roja de Maranello con el corazón palpitante de la Scuderia Ferrari.",
          category: "ferrari",
          price: 79.99,
          images: ["sf23_1.jpg", "sf23_2.jpg"],
          imageFolder: "images/sf23/",
          inStock: true,
          limitedEdition: false,
          year: 2023,
          team: "Scuderia Ferrari"
        },
        {
          id: 3,
          name: "Mercedes W14",
          description: "La flecha plateada de Mercedes-AMG Petronas, buscando recuperar su supremacía.",
          category: "mercedes",
          price: 74.99,
          images: ["w14_1.jpg", "w14_2.jpg", "w14_3.jpg"],
          imageFolder: "images/w14/",
          inStock: true,
          limitedEdition: false,
          year: 2023,
          team: "Mercedes-AMG Petronas"
        },
        {
          id: 4,
          name: "McLaren MCL60",
          description: "El papaya speed de McLaren Racing con tecnología de vanguardia británica.",
          category: "mclaren",
          price: 69.99,
          originalPrice: 79.99,
          images: ["mcl60_1.jpg"],
          imageFolder: "images/mcl60/",
          inStock: true,
          limitedEdition: true,
          year: 2023,
          team: "McLaren F1 Team"
        },
        {
          id: 5,
          name: "Aston Martin AMR23",
          description: "El verde británico de Aston Martin con elegancia y velocidad suprema.",
          category: "aston",
          price: 65.99,
          images: ["amr23_1.jpg", "amr23_2.jpg"],
          imageFolder: "images/amr23/",
          inStock: false,
          limitedEdition: true,
          year: 2023,
          team: "Aston Martin Aramco"
        },
        {
          id: 6,
          name: "Alpine A523",
          description: "El espíritu francés de Alpine con ingeniería de precisión y pasión competitiva.",
          category: "alpine",
          price: 62.99,
          images: ["a523_1.jpg"],
          imageFolder: "images/a523/",
          inStock: true,
          limitedEdition: false,
          year: 2023,
          team: "BWT Alpine F1 Team"
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

  function handleAddToCart(product: Product, event: Event): void {
    event.stopPropagation(); // Prevent navigation when clicking add to cart
    addToCart(product);
  }

  function handleProductClick(productId: number): void {
    goto(`/producto/${productId}`);
  }

  onMount(() => {
    reloadCart();
    loadCategories();
    loadProducts();
  });
</script>

<!-- Hero Section -->
<section class="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 dark:from-primary-600 dark:via-primary-700 dark:to-secondary-600">
  <!-- Dynamic overlay with better contrast -->
  <div class="absolute inset-0 bg-surface-900/40 dark:bg-surface-900/60"></div>
  
  <!-- Animated background elements -->
  <div class="absolute inset-0 opacity-10">
    <div class="absolute top-20 right-32 w-48 h-48 rounded-full bg-warning-400 animate-pulse"></div>
    <div class="absolute bottom-32 left-20 w-32 h-32 rounded-full bg-error-500 animate-bounce"></div>
    <div class="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-success-400 animate-ping"></div>
  </div>
  
  <!-- Racing lines decoration -->
  <div class="absolute inset-0 opacity-20">
    <div class="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-warning-400 to-transparent animate-pulse"></div>
    <div class="absolute top-3/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-error-500 to-transparent animate-pulse delay-1000"></div>
  </div>

  <div class="relative container mx-auto px-4 py-20 text-center">
    <div class="max-w-4xl mx-auto">
      <h1 
        class="text-5xl md:text-7xl font-bold mb-6 font-heading-token text-on-primary-token drop-shadow-2xl"
        in:fly={{ y: 50, duration: 800, delay: 200 }}
      >
        VELOCIDAD
        <span class="block text-warning-400 dark:text-warning-300 animate-pulse">SUPREMA</span>
      </h1>
      
      <p 
        class="text-xl md:text-2xl mb-8 text-surface-50/90 leading-relaxed max-w-2xl mx-auto"
        in:fly={{ y: 30, duration: 800, delay: 400 }}
      >
        Colecciona los monoplazas más icónicos de la Fórmula 1 y vive la emoción de las carreras más espectaculares del mundo
      </p>
      
      <!-- Hero Stats Card -->
      <div class="flex justify-center mb-8" in:scale={{ duration: 600, delay: 600, easing: elasticOut }}>
        <div class="card variant-glass-surface p-6 rounded-container-token border border-surface-50/20 backdrop-blur-md">
          <div class="flex items-center justify-center space-x-8">
            <div class="text-center">
              <div class="text-3xl font-bold text-warning-400 mb-1">{$filteredProducts.length}+</div>
              <div class="text-sm text-surface-50/90">Modelos</div>
            </div>
            <div class="w-px h-12 bg-surface-50/30"></div>
            <div class="text-center">
              <div class="text-3xl font-bold text-success-400 mb-1">100%</div>
              <div class="text-sm text-surface-50/90">Auténticos</div>
            </div>
            <div class="w-px h-12 bg-surface-50/30"></div>
            <div class="text-center">
              <div class="text-3xl font-bold text-error-400 mb-1">★</div>
              <div class="text-sm text-surface-50/90">Premium</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- CTA Button -->
      <div in:fly={{ y: 20, duration: 600, delay: 800 }}>
        <button 
          class="btn variant-filled-warning text-surface-900 font-bold px-8 py-4 text-lg hover:scale-105 transition-all duration-300 shadow-2xl"
          on:click={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <iconify-icon icon="mdi:racing-helmet" class="mr-2 text-xl"></iconify-icon>
          Explora la Colección
        </button>
      </div>
    </div>
  </div>
  
  <!-- Racing stripe with animation -->
  <div class="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-error-500 via-warning-400 to-error-500 animate-pulse"></div>
</section>

<!-- Search and Filter Section -->
<section class="container mx-auto px-4 py-12 bg-surface-50 dark:bg-surface-900">
  <div class="max-w-4xl mx-auto">
    <!-- Search Bar -->
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-surface-900 dark:text-surface-50 mb-4">
        Encuentra tu Monoplaza Perfecto
      </h2>
      <div class="relative max-w-md mx-auto">
        <input
          type="text"
          placeholder="Buscar por nombre, equipo o descripción..."
          class="input w-full pl-12 pr-4 py-3 text-lg rounded-full bg-surface-100 dark:bg-surface-700 border-2 border-surface-200 dark:border-surface-600 focus:border-primary-500 transition-all duration-300"
          bind:value={$searchQuery}
        />
        <iconify-icon 
          icon="mdi:magnify" 
          class="absolute left-4 top-1/2 transform -translate-y-1/2 text-surface-500 dark:text-surface-400 text-xl"
        ></iconify-icon>
        {#if $searchQuery}
          <button
            class="absolute right-3 top-1/2 transform -translate-y-1/2 btn btn-sm variant-ghost-surface rounded-full w-8 h-8 !p-0"
            on:click={() => searchQuery.set('')}
          >
            <iconify-icon icon="mdi:close" class="text-lg"></iconify-icon>
          </button>
        {/if}
      </div>
    </div>
    
    <!-- Category Filter Pills -->
    <div class="text-center mb-6">
      <p class="text-surface-600 dark:text-surface-300 mb-6">
        Explora por escudería y descubre las máquinas que han marcado la historia
      </p>
      
      <div class="flex flex-wrap gap-3 justify-center">
        {#each $categories as category, i}
          <button
            class="btn {$selectedCategory === category.id 
              ? `${category.variant} shadow-lg scale-105` 
              : 'variant-soft-surface hover:variant-filled-surface'} 
            rounded-full transition-all duration-300 font-semibold px-6 py-3
            hover:scale-105 hover:shadow-md"
            on:click={() => selectedCategory.set(category.id)}
            in:fly={{ x: -50, duration: 500, delay: i * 100 }}
          >
            <span class="flex items-center space-x-2">
              <iconify-icon 
                icon={category.id === 'all' ? 'mdi:view-grid' :
                      category.id === 'championship' ? 'mdi:trophy' :
                      category.id === 'ferrari' ? 'mdi:horse' :
                      category.id === 'mercedes' ? 'mdi:star-three-points' :
                      category.id === 'mclaren' ? 'mdi:speedometer' :
                      category.id === 'aston' ? 'mdi:shield' :
                      'mdi:car-sports'} 
                class="text-sm"
              ></iconify-icon>
              <span>{category.name}</span>
              {#if category.id !== 'all'}
                <span class="badge variant-soft text-xs">
                  {$products.filter(p => p.category === category.id).length}
                </span>
              {/if}
            </span>
          </button>
        {/each}
      </div>
    </div>
  </div>
</section>

<!-- Loading State -->
{#if $isLoading}
  <div class="container mx-auto px-4 py-16 text-center bg-surface-50 dark:bg-surface-900" in:fade>
    <div class="flex justify-center items-center space-x-4 mb-6">
      <div class="placeholder animate-pulse w-12 h-12 rounded-full bg-primary-300 dark:bg-primary-600"></div>
      <div class="placeholder animate-pulse w-10 h-10 rounded-full bg-secondary-300 dark:bg-secondary-600 delay-200"></div>
      <div class="placeholder animate-pulse w-8 h-8 rounded-full bg-warning-300 dark:bg-warning-600 delay-400"></div>
    </div>
    <p class="text-lg text-surface-700 dark:text-surface-200 font-medium">
      Cargando monoplazas legendarios...
    </p>
    <div class="mt-4 text-sm text-surface-500 dark:text-surface-400">
      Preparando la pista para ti
    </div>
  </div>
{/if}

<!-- Products Grid -->
{#if !$isLoading}
  <section id="products-section" class="container mx-auto px-4 py-12 bg-surface-50 dark:bg-surface-900">
    {#if $filteredProducts.length === 0}
      <div class="text-center py-20" in:fade>
        <div class="text-8xl mb-6 text-surface-300 dark:text-surface-600 opacity-50 font-bold">F1</div>
        <h3 class="text-3xl font-bold mb-4 text-surface-900 dark:text-surface-50">
          {$searchQuery ? 'No encontramos resultados' : 'No hay productos disponibles'}
        </h3>
        <p class="text-surface-600 dark:text-surface-300 mb-8 max-w-md mx-auto text-lg">
          {$searchQuery 
            ? `No encontramos monoplazas que coincidan con "${$searchQuery}". Intenta con otros términos.`
            : 'Selecciona una categoría diferente para explorar nuestros increíbles monoplazas'
          }
        </p>
        <div class="space-x-4">
          {#if $searchQuery}
            <button 
              class="btn variant-filled-primary text-lg px-8 py-4"
              on:click={() => searchQuery.set('')}
            >
              <iconify-icon icon="mdi:close" class="mr-2"></iconify-icon>
              Limpiar Búsqueda
            </button>
          {/if}
          <button 
            class="btn variant-soft-surface text-lg px-8 py-4"
            on:click={() => selectedCategory.set('all')}
          >
            <iconify-icon icon="mdi:view-grid" class="mr-2"></iconify-icon>
            Ver Todos los Productos
          </button>
        </div>
      </div>
    {:else}
      <!-- Products Header -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-surface-900 dark:text-surface-50 mb-4">
          {$searchQuery 
            ? `Resultados para "${$searchQuery}"` 
            : $selectedCategory === 'all' 
              ? 'Toda la Colección' 
              : $categories.find(c => c.id === $selectedCategory)?.name
          }
        </h2>
        <div class="flex items-center justify-center space-x-6 text-surface-600 dark:text-surface-300">
          <div class="flex items-center space-x-2">
            <iconify-icon icon="mdi:package-variant" class="text-lg text-success-500"></iconify-icon>
            <span class="font-medium">{$filteredProducts.length} modelos disponibles</span>
          </div>
          <div class="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
          <div class="flex items-center space-x-2">
            <iconify-icon icon="mdi:truck-delivery" class="text-lg text-primary-500"></iconify-icon>
            <span class="text-sm">Envío gratis mundial</span>
          </div>
        </div>
      </div>

      <!-- Products Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each $filteredProducts as product, i}
          <div 
            class="card card-hover overflow-hidden bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 
            transition-all duration-300 hover:shadow-2xl hover:border-primary-300 dark:hover:border-primary-600 hover:-translate-y-2 cursor-pointer"
            in:fly={{ y: 50, duration: 500, delay: i * 100 }}
            on:click={() => handleProductClick(product.id)}
            on:keydown={(e) => e.key === 'Enter' && handleProductClick(product.id)}
            tabindex="0"
            role="button"
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
              
              <!-- Product Badges -->
              <div class="absolute top-4 right-4 space-y-2">
                <span class="badge variant-filled-surface text-xs font-bold shadow-lg">
                  #{product.id.toString().padStart(3, '0')}
                </span>
                {#if product.limitedEdition}
                  <span class="badge variant-filled-warning text-xs font-bold shadow-lg animate-pulse block">
                    <iconify-icon icon="mdi:star" class="mr-1 text-xs"></iconify-icon>
                    Limitada
                  </span>
                {/if}
                {#if product.originalPrice && product.originalPrice > product.price}
                  <span class="badge variant-filled-error text-xs font-bold shadow-lg block">
                    <iconify-icon icon="mdi:sale" class="mr-1 text-xs"></iconify-icon>
                    Oferta
                  </span>
                {/if}
              </div>
              
              <!-- Stock Status -->
              <div class="absolute top-4 left-4">
                <span class="badge {product.inStock ? 'variant-filled-success' : 'variant-filled-error'} text-xs font-bold shadow-lg">
                  <iconify-icon icon="{product.inStock ? 'mdi:check-circle' : 'mdi:close-circle'}" class="mr-1 text-xs"></iconify-icon>
                  {product.inStock ? 'Disponible' : 'Agotado'}
                </span>
              </div>
              
              <!-- Quick Actions Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-surface-900/90 via-surface-900/20 to-transparent 
              opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6">
                <div class="text-surface-50 w-full">
                  <div class="flex items-center justify-between mb-4">
                    <div>
                      <h3 class="font-bold text-lg drop-shadow-md mb-1">{product.name}</h3>
                      <p class="text-sm opacity-90">{product.team} • {product.year}</p>
                    </div>
                  </div>
                  <div class="flex space-x-2">
                    <button 
                      class="btn variant-filled-primary flex-1 font-semibold"
                      on:click={(e) => handleAddToCart(product, e)}
                      disabled={!product.inStock}
                    >
                      <iconify-icon icon="mdi:cart-plus" class="mr-1"></iconify-icon>
                      {product.inStock ? 'Añadir' : 'Agotado'}
                    </button>
                    <button class="btn variant-soft-surface w-12 h-12 !p-0">
                      <iconify-icon icon="mdi:eye" class="text-lg"></iconify-icon>
                    </button>
                  </div>
                </div>
              </div>
            </header>

            <!-- Product Info -->
            <div class="p-6 bg-surface-25 dark:bg-surface-825">
              <!-- Team and Year -->
              <div class="flex items-center justify-between mb-3">
                <span class="badge variant-soft-primary text-xs font-medium">
                  {product.team}
                </span>
                <span class="badge variant-soft-secondary text-xs font-medium">
                  {product.year}
                </span>
              </div>
              
              <h3 class="h4 font-bold mb-3 text-surface-900 dark:text-surface-50 leading-tight line-clamp-2">
                {product.name}
              </h3>
              
              <p class="text-surface-600 dark:text-surface-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                {product.description}
              </p>
              
              <!-- Rating -->
              <div class="flex items-center space-x-2 mb-4">
                <div class="flex space-x-1">
                  {#each Array(5) as _, starIndex}
                    <iconify-icon icon="mdi:star" class="text-warning-500 text-sm"></iconify-icon>
                  {/each}
                </div>
                <span class="text-xs text-surface-500 dark:text-surface-400">(4.9)</span>
              </div>
              
              <!-- Price and Actions -->
              <div class="flex items-center justify-between pt-4 border-t border-surface-200 dark:border-surface-600">
                <div class="flex flex-col">
                  <div class="flex items-center space-x-2">
                    <span class="text-2xl font-bold text-success-600 dark:text-success-400">
                      ${product.price.toFixed(2)}
                    </span>
                    {#if product.originalPrice && product.originalPrice > product.price}
                      <span class="text-sm text-surface-500 dark:text-surface-400 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    {/if}
                  </div>
                  <div class="flex items-center space-x-2 text-xs text-surface-500 dark:text-surface-400 mt-1">
                    <iconify-icon icon="mdi:truck-delivery" class="text-xs"></iconify-icon>
                    <span>Envío gratis</span>
                  </div>
                </div>
                
                <button
                  class="btn variant-filled-primary font-semibold hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                  on:click={(e) => handleAddToCart(product, e)}
                  disabled={!product.inStock}
                >
                  <iconify-icon icon="mdi:cart-plus" class="mr-2"></iconify-icon>
                  {product.inStock ? 'Añadir' : 'Agotado'}
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
      
      <!-- Load More Section -->
      {#if $filteredProducts.length >= 6}
        <div class="text-center mt-12">
          <p class="text-surface-600 dark:text-surface-300 mb-6">
            Has visto {$filteredProducts.length} de nuestros increíbles monoplazas
          </p>
          <button class="btn variant-soft-primary text-lg px-8 py-4">
            <iconify-icon icon="mdi:reload" class="mr-2"></iconify-icon>
            Cargar Más Modelos
          </button>
        </div>
      {/if}
    {/if}
  </section>
{/if}

<!-- Featured Benefits Section -->
<section class="bg-gradient-to-r from-surface-100 to-surface-200 dark:from-surface-800 dark:to-surface-700 py-16">
  <div class="container mx-auto px-4">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold text-surface-900 dark:text-surface-50 mb-4">
        ¿Por qué elegir Fast Lane F1 Shop?
      </h2>
      <p class="text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
        Somos más que una tienda, somos tu puerta de entrada al mundo de la Fórmula 1
      </p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="text-center p-6" in:fly={{ y: 30, duration: 600, delay: 200 }}>
        <div class="w-16 h-16 bg-gradient-to-br from-success-500 to-success-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <iconify-icon icon="mdi:shield-check" class="text-3xl text-white"></iconify-icon>
        </div>
        <h3 class="text-xl font-bold text-surface-900 dark:text-surface-50 mb-3">
          100% Auténticos
        </h3>
        <p class="text-surface-600 dark:text-surface-300 leading-relaxed">
          Todos nuestros modelos vienen con certificado de autenticidad.
        </p>
      </div>
      
      <div class="text-center p-6" in:fly={{ y: 30, duration: 600, delay: 400 }}>
        <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <iconify-icon icon="mdi:truck-delivery" class="text-3xl text-white"></iconify-icon>
        </div>
        <h3 class="text-xl font-bold text-surface-900 dark:text-surface-50 mb-3">
          Envío a toda la República de Guatemala
        </h3>
        <p class="text-surface-600 dark:text-surface-300 leading-relaxed">
          Entrega segura a cualquier parte de Guatemala en 1-3 días hábiles.
        </p>
      </div>
      
      <div class="text-center p-6" in:fly={{ y: 30, duration: 600, delay: 600 }}>
        <div class="w-16 h-16 bg-gradient-to-br from-warning-500 to-warning-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <iconify-icon icon="mdi:star-circle" class="text-3xl text-white"></iconify-icon>
        </div>
        <h3 class="text-xl font-bold text-surface-900 dark:text-surface-50 mb-3">
          Ediciones Exclusivas
        </h3>
        <p class="text-surface-600 dark:text-surface-300 leading-relaxed">
          Acceso prioritario a lanzamientos limitados y modelos exclusivos de colección.
        </p>
      </div>
    </div>
  </div>
</section>

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
  
  /* Search input focus enhancement */
  .input:focus {
    box-shadow: 0 0 0 3px rgba(var(--color-primary-500), 0.1);
  }
</style>