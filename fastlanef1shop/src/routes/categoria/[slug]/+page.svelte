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

  const filteredProducts = derived(
    [products, page], 
    ([$products, $page]) => 
      $products.filter(p => p.category === $page.params.slug)
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
      
      // Fallback mock data
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

<!-- Cart Button (Fixed) -->
<button
  class="btn variant-filled-primary fixed top-20 right-4 z-50 rounded-full !p-3 shadow-2xl"
  on:click={() => isCartOpen.set(true)}
>
  <iconify-icon icon="mdi:cart" class="text-xl"></iconify-icon>
  {#if $cartItemCount > 0}
    <span class="badge variant-filled-warning absolute -top-2 -right-2 text-xs">
      {$cartItemCount}
    </span>
  {/if}
</button>

<!-- Breadcrumb -->
<section class="container mx-auto px-4 py-4">
  <nav class="breadcrumb">
    <ol class="flex items-center space-x-2 text-sm text-surface-600-300-token dark:text-surface-300-600-token">
      <li><a href="/" class="hover:text-primary-500 transition-colors">Inicio</a></li>
      <li><iconify-icon icon="mdi:chevron-right" class="text-xs"></iconify-icon></li>
      <li class="font-semibold text-surface-900-50-token dark:text-surface-50-900-token">
        {$currentCategory?.name || categorySlug}
      </li>
    </ol>
  </nav>
</section>

<!-- Category Hero -->
{#if $currentCategory}
  <section class="relative overflow-hidden bg-gradient-to-br from-primary-500 to-secondary-500 dark:from-primary-700 dark:to-secondary-700" transition:fade>
    <div class="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
    <div class="relative container mx-auto px-4 py-16 text-center text-white">
      <h1 class="text-4xl md:text-6xl font-bold mb-4 font-heading-token" in:fly={{ y: 30, duration: 600 }}>
        {$currentCategory.name}
      </h1>
      {#if $currentCategory.description}
        <p class="text-lg md:text-xl opacity-90 max-w-2xl mx-auto" in:fly={{ y: 20, duration: 600, delay: 200 }}>
          {$currentCategory.description}
        </p>
      {/if}
      <div class="mt-6" in:fly={{ y: 20, duration: 600, delay: 400 }}>
        <span class="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-semibold backdrop-blur-sm">
          {$filteredProducts.length} modelos disponibles
        </span>
      </div>
    </div>
  </section>
{/if}

<!-- Loading -->
{#if $isLoading}
  <div class="container mx-auto px-4 py-16 text-center" in:fade>
    <div class="placeholder animate-pulse w-12 h-12 rounded-full mx-auto mb-4 bg-surface-300-600-token dark:bg-surface-600-300-token"></div>
    <p class="text-lg">Cargando monoplazas...</p>
  </div>
{/if}

<!-- Products Grid -->
{#if !$isLoading}
  <section class="container mx-auto px-4 py-12">
    {#if $filteredProducts.length === 0}
      <div class="text-center py-16" in:fade>
        <div class="text-6xl mb-4 opacity-30">F1</div>
        <h3 class="text-2xl font-bold mb-2">No hay productos en esta categoría</h3>
        <p class="text-surface-600-300-token dark:text-surface-300-600-token mb-6">
          Aún no tenemos monoplazas disponibles en esta categoría.
        </p>
        <button 
          class="btn variant-filled-primary"
          on:click={() => goto('/')}
        >
          Ver todos los productos
        </button>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each $filteredProducts as product, i}
          <div 
            class="card card-hover overflow-hidden bg-surface-50-900-token dark:bg-surface-900-50-token"
            in:fly={{ y: 50, duration: 500, delay: i * 100 }}
          >
            <!-- Product Image -->
            <header class="card-header relative overflow-hidden bg-surface-200-700-token dark:bg-surface-700-200-token h-48">
              <img 
                src={getProductImageUrl(product, 0)} 
                alt={product.name}
                class="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                on:error={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyMEM4Ljk1NDMgMjAgMCAyOC45NTQzIDAgNDBIMTBDMTAgMzQuNDc3MSAxNC40NzcxIDMwIDE5IDMwSDIxQzI1LjUyMjkgMzAgMzAgMzQuNDc3MSAzMCA0MEg0MEMzMCAyOC45NTQzIDMxLjA0NTcgMjAgMjAgMjBaIiBmaWxsPSIjQzNDM0MzIi8+Cjwvc3ZnPgo=';
                  e.currentTarget.classList.add('opacity-50');
                }}
              />
              <div class="absolute top-3 right-3">
                <span class="badge variant-filled-error text-xs">
                  #{product.id.toString().padStart(3, '0')}
                </span>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div class="text-white">
                  <h3 class="font-bold text-sm">{product.name}</h3>
                </div>
              </div>
            </header>

            <!-- Product Info -->
            <div class="p-4">
              <h3 class="h4 font-bold mb-2">{product.name}</h3>
              <p class="text-surface-600-300-token dark:text-surface-300-600-token text-sm mb-4 line-clamp-3">
                {product.description}
              </p>
              
              <!-- Price and Add to Cart -->
              <div class="flex items-center justify-between">
                <div class="text-2xl font-bold text-success-600-300-token dark:text-success-300-600-token">
                  ${product.price}
                </div>
                <button
                  class="btn variant-filled-primary btn-sm"
                  on:click={() => handleAddToCart(product)}
                >
                  <iconify-icon icon="mdi:cart-plus" class="mr-1"></iconify-icon>
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

<!-- Cart Drawer (mismo que el componente principal) -->
{#if $isCartOpen}
  <div class="fixed inset-0 z-50 overflow-hidden" transition:fade>
    <div class="absolute inset-0 bg-black/50 dark:bg-black/70" on:click={() => isCartOpen.set(false)}></div>
    <div 
      class="absolute right-0 top-0 h-full w-full max-w-md bg-surface-50-900-token dark:bg-surface-900-50-token shadow-2xl"
      transition:fly={{ x: 300, duration: 300 }}
    >
      <div class="flex flex-col h-full">
        <!-- Cart Header -->
        <div class="p-6 border-b border-surface-300-600-token dark:border-surface-600-300-token">
          <div class="flex items-center justify-between">
            <h3 class="h3 font-bold">Carrito de Compras</h3>
            <button 
              class="btn btn-sm variant-soft-surface rounded-full"
              on:click={() => isCartOpen.set(false)}
            >
              <iconify-icon icon="mdi:close"></iconify-icon>
            </button>
          </div>
        </div>

        <!-- Cart Items -->
        <div class="flex-1 overflow-y-auto p-6">
          {#if $cart.length === 0}
            <div class="text-center py-12">
              <div class="text-6xl mb-4 opacity-30">F1</div>
              <p class="text-surface-600-300-token dark:text-surface-300-600-token">Tu carrito está vacío</p>
            </div>
          {:else}
            <div class="space-y-4">
              {#each $cart as item}
                <div class="card variant-soft-surface p-4">
                  <div class="flex items-center space-x-4">
                    <div class="placeholder w-16 h-16 rounded-container-token">
                      <img 
                        src={getProductImageUrl(item, 0)} 
                        alt={item.name}
                        class="w-full h-full object-cover rounded-container-token"
                        on:error={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div class="w-full h-full hidden items-center justify-center text-2xl">F1</div>
                    </div>
                    <div class="flex-1">
                      <h4 class="font-semibold text-sm">{item.name}</h4>
                      <p class="text-success-600-300-token dark:text-success-300-600-token font-bold">${item.price}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                      <button 
                        class="btn btn-sm variant-soft-surface rounded-full w-8 h-8 !p-0"
                        on:click={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <iconify-icon icon="mdi:minus" class="text-xs"></iconify-icon>
                      </button>
                      <span class="w-8 text-center font-semibold">{item.quantity}</span>
                      <button 
                        class="btn btn-sm variant-soft-surface rounded-full w-8 h-8 !p-0"
                        on:click={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <iconify-icon icon="mdi:plus" class="text-xs"></iconify-icon>
                      </button>
                    </div>
                    <button 
                      class="btn btn-sm variant-soft-error rounded-full w-8 h-8 !p-0"
                      on:click={() => removeFromCart(item.id)}
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
          <div class="p-6 border-t border-surface-300-600-token dark:border-surface-600-300-token">
            <div class="flex justify-between items-center mb-4">
              <span class="text-lg font-bold">Total:</span>
              <span class="text-2xl font-bold text-success-600-300-token dark:text-success-300-600-token">
                ${$cartTotal.toFixed(2)}
              </span>
            </div>
            <button class="btn variant-filled-success w-full">
              <iconify-icon icon="mdi:credit-card" class="mr-2"></iconify-icon>
              Proceder al Pago
            </button>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style lang="postcss">
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>