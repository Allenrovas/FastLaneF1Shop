<script lang="ts">
  import { onMount } from 'svelte';
  import { writable, derived } from 'svelte/store';
  import { fade, fly, scale } from 'svelte/transition';
  import { elasticOut } from 'svelte/easing';
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
  const isCartOpen = writable<boolean>(false);
  const isLoading = writable<boolean>(true);

  // GitHub Pages configuration - ajusta con tu repo
  const GITHUB_REPO_URL = 'https://raw.githubusercontent.com/tu-usuario/tu-repo/main';

  // Derived store for filtered products
  const filteredProducts = derived(
    [products, selectedCategory], 
    ([$products, $selectedCategory]) => 
      $selectedCategory === 'all' 
        ? $products 
        : $products.filter(p => p.category === $selectedCategory)
  );

  // Load products from GitHub Pages
  async function loadProducts(): Promise<void> {
    try {
      isLoading.set(true);
      
      // Fetch from your GitHub repo's products.json file
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
          description: "El monoplaza dominador de la temporada, pilotado por Max Verstappen hacia su tercer título mundial consecutivo.",
          category: "championship",
          price: 89.99,
          images: ["rb19_1.jpg", "rb19_2.jpg", "rb19_3.jpg"],
          imageFolder: "images/rb19/"
        },
        {
          id: 2,
          name: "Ferrari SF-23",
          description: "La máquina roja de Maranello con el corazón palpitante de la Scuderia Ferrari.",
          category: "ferrari",
          price: 79.99,
          images: ["sf23_1.jpg", "sf23_2.jpg"],
          imageFolder: "images/sf23/"
        },
        {
          id: 3,
          name: "Mercedes W14",
          description: "La flecha plateada de Mercedes-AMG Petronas, buscando recuperar su supremacía.",
          category: "mercedes",
          price: 74.99,
          images: ["w14_1.jpg", "w14_2.jpg", "w14_3.jpg"],
          imageFolder: "images/w14/"
        },
        {
          id: 4,
          name: "McLaren MCL60",
          description: "El papaya speed de McLaren Racing con tecnología de vanguardia.",
          category: "mclaren",
          price: 69.99,
          images: ["mcl60_1.jpg"],
          imageFolder: "images/mcl60/"
        },
        {
          id: 5,
          name: "Aston Martin AMR23",
          description: "El verde británico de Aston Martin con elegancia y velocidad.",
          category: "aston",
          price: 65.99,
          images: ["amr23_1.jpg", "amr23_2.jpg"],
          imageFolder: "images/amr23/"
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
    // Recargar carrito del localStorage
    reloadCart();
    
    // Cargar datos
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
        Colecciona los monoplazas más icónicos de la Fórmula 1 y vive la emoción de las carreras más espectaculares
      </p>
      
      <!-- Hero Card -->
      <div class="flex justify-center mb-8" in:scale={{ duration: 600, delay: 600, easing: elasticOut }}>
        <div class="card variant-glass-surface p-6 rounded-container-token border border-surface-50/20 backdrop-blur-md">
          <div class="flex items-center space-x-4">
            <div class="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
            <span class="text-lg font-semibold text-surface-50">Edición Limitada Premium</span>
            <div class="w-3 h-3 bg-warning-400 rounded-full animate-pulse delay-500"></div>
          </div>
          <p class="text-sm text-surface-50/80 mt-2">Modelos exclusivos con certificado de autenticidad</p>
        </div>
      </div>
      
      <!-- CTA Button -->
      <div in:fly={{ y: 20, duration: 600, delay: 800 }}>
        <button class="btn variant-filled-warning text-surface-900 font-bold px-8 py-4 text-lg hover:scale-105 transition-all duration-300 shadow-2xl">
          <iconify-icon icon="mdi:racing-helmet" class="mr-2 text-xl"></iconify-icon>
          Explora la Colección
        </button>
      </div>
    </div>
  </div>
  
  <!-- Racing stripe with animation -->
  <div class="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-error-500 via-warning-400 to-error-500 animate-pulse"></div>
</section>

<!-- Cart Button (Fixed) -->
<button
  class="btn variant-filled-primary fixed top-20 right-4 z-50 rounded-full !p-3 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110"
  on:click={() => isCartOpen.set(true)}
>
  <iconify-icon icon="mdi:cart" class="text-xl text-on-primary-token"></iconify-icon>
  {#if $cartItemCount > 0}
    <span class="badge variant-filled-warning absolute -top-2 -right-2 text-xs font-bold animate-bounce">
      {$cartItemCount}
    </span>
  {/if}
</button>

<!-- Category Filter -->
<section class="container mx-auto px-4 py-12 bg-surface-50 dark:bg-surface-900">
  <div class="text-center mb-8">
    <h2 class="text-3xl font-bold text-surface-900-50-token mb-4">Explora por Escuderías</h2>
    <p class="text-surface-600-300-token max-w-2xl mx-auto">
      Descubre los monoplazas más legendarios organizados por las escuderías que han marcado la historia de la Fórmula 1
    </p>
  </div>
  
  <div class="flex flex-wrap gap-4 justify-center">
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
          <div class="w-2 h-2 rounded-full bg-current opacity-75"></div>
          <span>{category.name}</span>
        </span>
      </button>
    {/each}
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
    <p class="text-lg text-surface-700-200-token font-medium">Cargando monoplazas legendarios...</p>
    <div class="mt-4 text-sm text-surface-500-400-token">Preparando la pista para ti</div>
  </div>
{/if}

<!-- Products Grid -->
{#if !$isLoading}
  <section class="container mx-auto px-4 py-12 bg-surface-50 dark:bg-surface-900">
    {#if $filteredProducts.length === 0}
      <div class="text-center py-20" in:fade>
        <div class="text-8xl mb-6 text-surface-300-600-token opacity-50 font-bold">F1</div>
        <h3 class="text-3xl font-bold mb-4 text-surface-900-50-token">No hay productos disponibles</h3>
        <p class="text-surface-600-300-token mb-8 max-w-md mx-auto text-lg">
          Selecciona una categoría diferente para explorar nuestros increíbles monoplazas
        </p>
        <button 
          class="btn variant-filled-primary text-lg px-8 py-4"
          on:click={() => selectedCategory.set(null)}
        >
          <iconify-icon icon="mdi:view-grid" class="mr-2"></iconify-icon>
          Ver Todos los Productos
        </button>
      </div>
    {:else}
      <!-- Products Header -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-surface-900-50-token mb-4">
          {$selectedCategory ? $categories.find(c => c.id === $selectedCategory)?.name : 'Todos los Monoplazas'}
        </h2>
        <div class="flex items-center justify-center space-x-4 text-surface-600-300-token">
          <span class="font-medium">{$filteredProducts.length} modelos disponibles</span>
          <div class="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
          <span class="text-sm">En stock</span>
        </div>
      </div>

      <!-- Products Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each $filteredProducts as product, i}
          <div 
            class="card card-hover overflow-hidden bg-surface-0-token dark:bg-surface-800-token border border-surface-200 dark:border-surface-700 
            transition-all duration-300 hover:shadow-2xl hover:border-primary-300 dark:hover:border-primary-600 hover:-translate-y-2"
            in:fly={{ y: 50, duration: 500, delay: i * 100 }}
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
              
              <!-- Quick View Button -->
              <div class="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button class="btn btn-sm variant-filled-surface rounded-full shadow-lg">
                  <iconify-icon icon="mdi:eye" class="text-sm"></iconify-icon>
                </button>
              </div>
              
              <!-- Hover Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-surface-900/90 via-surface-900/20 to-transparent 
              opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6">
                <div class="text-surface-50 w-full">
                  <h3 class="font-bold text-lg drop-shadow-md mb-2">{product.name}</h3>
                  <div class="flex items-center justify-between">
                    <span class="text-sm opacity-90">Ver detalles</span>
                    <iconify-icon icon="mdi:arrow-right" class="text-lg"></iconify-icon>
                  </div>
                </div>
              </div>
            </header>

            <!-- Product Info -->
            <div class="p-6 bg-surface-50 dark:bg-surface-800">
              <h3 class="h4 font-bold mb-3 text-surface-900-50-token leading-tight line-clamp-2">{product.name}</h3>
              <p class="text-surface-600-300-token text-sm mb-5 line-clamp-3 leading-relaxed">
                {product.description}
              </p>
              
              <!-- Product Features -->
              <div class="flex items-center space-x-2 mb-4">
                <div class="w-2 h-2 bg-success-500 rounded-full"></div>
                <span class="text-xs text-surface-600-300-token font-medium">Edición Limitada</span>
              </div>
              
              <!-- Price and Add to Cart -->
              <div class="flex items-center justify-between pt-4 border-t border-surface-200 dark:border-surface-600">
                <div class="flex flex-col">
                  <div class="text-2xl font-bold text-success-600 dark:text-success-400">
                    ${product.price}
                  </div>
                  <div class="text-xs text-surface-500-400-token">Precio final</div>
                </div>
                <button
                  class="btn variant-filled-primary font-semibold hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                  on:click={() => handleAddToCart(product)}
                >
                  <iconify-icon icon="mdi:cart-plus" class="mr-2"></iconify-icon>
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

<!-- Cart Drawer -->
{#if $isCartOpen}
  <div class="fixed inset-0 z-50 overflow-hidden" transition:fade>
    <div class="absolute inset-0 bg-surface-900/60 dark:bg-surface-950/70 backdrop-blur-sm" on:click={() => isCartOpen.set(false)}></div>
    <div 
      class="absolute right-0 top-0 h-full w-full max-w-md bg-surface-0-token dark:bg-surface-800-token shadow-2xl border-l border-surface-200 dark:border-surface-700"
      transition:fly={{ x: 300, duration: 300 }}
    >
      <div class="flex flex-col h-full">
        <!-- Cart Header -->
        <div class="p-6 border-b border-surface-200 dark:border-surface-600 bg-surface-50 dark:bg-surface-750">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="h3 font-bold text-surface-900-50-token">Carrito de Compras</h3>
              <p class="text-sm text-surface-600-300-token">
                {$cartItemCount} {$cartItemCount === 1 ? 'artículo' : 'artículos'}
              </p>
            </div>
            <button 
              class="btn btn-sm variant-soft-surface rounded-full hover:variant-filled-surface transition-all duration-200"
              on:click={() => isCartOpen.set(false)}
            >
              <iconify-icon icon="mdi:close" class="text-lg"></iconify-icon>
            </button>
          </div>
        </div>

        <!-- Cart Items -->
        <div class="flex-1 overflow-y-auto p-6 bg-surface-25 dark:bg-surface-825">
          {#if $cart.length === 0}
            <div class="text-center py-20">
              <div class="text-8xl mb-8 text-surface-300-600-token opacity-30 font-bold">F1</div>
              <h4 class="text-2xl font-semibold mb-4 text-surface-800-100-token">Tu garaje está vacío</h4>
              <p class="text-surface-600-300-token mb-8 leading-relaxed">
                Añade algunos monoplazas legendarios a tu colección personal
              </p>
              <button 
                class="btn variant-filled-primary px-8 py-3"
                on:click={() => isCartOpen.set(false)}
              >
                <iconify-icon icon="mdi:racing-helmet" class="mr-2"></iconify-icon>
                Explorar Monoplazas
              </button>
            </div>
          {:else}
            <div class="space-y-4">
              {#each $cart as item}
                <div class="card variant-soft-surface p-4 border border-surface-200 dark:border-surface-600 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200">
                  <div class="flex items-center space-x-4">
                    <!-- Product Image -->
                    <div class="relative overflow-hidden rounded-container-token w-16 h-16 bg-surface-200 dark:bg-surface-600">
                      <img 
                        src={getProductImageUrl(item, 0)} 
                        alt={item.name}
                        class="w-full h-full object-cover"
                        on:error={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div class="w-full h-full hidden items-center justify-center text-2xl font-bold text-surface-500-400-token">F1</div>
                    </div>
                    
                    <!-- Product Details -->
                    <div class="flex-1 min-w-0">
                      <h4 class="font-semibold text-sm text-surface-900-50-token truncate">{item.name}</h4>
                      <p class="text-success-600 dark:text-success-400 font-bold text-lg">${item.price}</p>
                      <p class="text-xs text-surface-500-400-token">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    
                    <!-- Quantity Controls -->
                    <div class="flex items-center space-x-2 bg-surface-100 dark:bg-surface-700 rounded-full p-1">
                      <button 
                        class="btn btn-sm variant-soft-surface rounded-full w-8 h-8 !p-0 hover:variant-filled-surface transition-all duration-200"
                        on:click={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <iconify-icon icon="mdi:minus" class="text-xs"></iconify-icon>
                      </button>
                      <span class="w-8 text-center font-semibold text-surface-900-50-token text-sm">{item.quantity}</span>
                      <button 
                        class="btn btn-sm variant-soft-surface rounded-full w-8 h-8 !p-0 hover:variant-filled-surface transition-all duration-200"
                        on:click={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <iconify-icon icon="mdi:plus" class="text-xs"></iconify-icon>
                      </button>
                    </div>
                    
                    <!-- Remove Button -->
                    <button 
                      class="btn btn-sm variant-soft-error rounded-full w-8 h-8 !p-0 hover:variant-filled-error transition-all duration-200"
                      on:click={() => removeFromCart(item.id)}
                      title="Eliminar del carrito"
                    >
                      <iconify-icon icon="mdi:delete" class="text-xs"></iconify-icon>
                    </button>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>

        <!-- Cart Footer -->
        {#if $cart.length > 0}
          <div class="p-6 border-t border-surface-200 dark:border-surface-600 bg-surface-50 dark:bg-surface-750">
            <div class="space-y-3 mb-6">
              <div class="flex justify-between items-center text-sm">
                <span class="text-surface-600-300-token">Subtotal ({$cartItemCount} {$cartItemCount === 1 ? 'item' : 'items'}):</span>
                <span class="font-semibold text-surface-900-50-token">${$cartTotal.toFixed(2)}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-surface-600-300-token">Envío mundial:</span>
                <span class="font-semibold text-success-600 dark:text-success-400">Gratis</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-surface-600-300-token">Garantía premium:</span>
                <span class="font-semibold text-success-600 dark:text-success-400">Incluida</span>
              </div>
              <div class="border-t border-surface-200 dark:border-surface-600 pt-3">
                <div class="flex justify-between items-center">
                  <span class="text-lg font-bold text-surface-900-50-token">Total:</span>
                  <span class="text-2xl font-bold text-success-600 dark:text-success-400">
                    ${$cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            <button class="btn variant-filled-success w-full font-semibold hover:scale-105 transition-transform duration-200 mb-3">
              <iconify-icon icon="mdi:credit-card" class="mr-2"></iconify-icon>
              Proceder al Pago
            </button>
            <button 
              class="btn variant-soft-surface w-full text-sm"
              on:click={() => isCartOpen.set(false)}
            >
              <iconify-icon icon="mdi:shopping" class="mr-2"></iconify-icon>
              Continuar comprando
            </button>
          </div>
        {/if}
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
</style>