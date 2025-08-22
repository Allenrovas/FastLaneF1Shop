<script lang="ts">
  import { onMount } from 'svelte';
  import { writable, derived } from 'svelte/store';
  import { fade, fly, scale } from 'svelte/transition';
  import { elasticOut } from 'svelte/easing';
  import { modeCurrent } from '@skeletonlabs/skeleton';
  import { 
    cart, 
    cartTotal, 
    cartItemCount, 
    addToCart, 
    removeFromCart, 
    updateQuantity,
    type Product 
  } from '../stores/cart';

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

  // Categories with Skeleton color variants
  const categories = [
    { id: 'all', name: 'Todos', variant: 'variant-gradient-primary-secondary' },
    { id: 'championship', name: 'Campeones', variant: 'variant-gradient-warning-error' },
    { id: 'ferrari', name: 'Ferrari', variant: 'variant-gradient-error-primary' },
    { id: 'mercedes', name: 'Mercedes', variant: 'variant-gradient-surface-primary' },
    { id: 'mclaren', name: 'McLaren', variant: 'variant-gradient-tertiary-secondary' },
    { id: 'aston', name: 'Aston Martin', variant: 'variant-gradient-success-primary' },
    { id: 'alpine', name: 'Alpine', variant: 'variant-gradient-primary-tertiary' }
  ];

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
          name: "Red Bull RB19 2023",
          description: "El monoplaza dominador de la temporada 2023, pilotado por Max Verstappen hacia su tercer título mundial consecutivo.",
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
    // Optional: Show toast notification
    console.log(`Added ${product.name} to cart`);
  }

  onMount(() => {
    loadProducts();
  });
</script>

<!-- Hero Section -->
<section class="relative overflow-hidden bg-gradient-to-br from-primary-500 via-secondary-500 to-tertiary-500">
  <div class="absolute inset-0 bg-black/30"></div>
  <div class="relative container mx-auto px-4 py-20 text-center text-white">
    <h1 
      class="text-5xl md:text-7xl font-bold mb-6 font-heading-token"
      in:fly={{ y: 50, duration: 800, delay: 200 }}
    >
      VELOCIDAD
      <span class="block text-warning-400">SUPREMA</span>
    </h1>
    <p 
      class="text-xl md:text-2xl mb-8 opacity-90"
      in:fly={{ y: 30, duration: 800, delay: 400 }}
    >
      Colecciona los monoplazas más icónicos de la Fórmula 1
    </p>
    <div class="flex justify-center" in:scale={{ duration: 600, delay: 600, easing: elasticOut }}>
      <div class="card variant-glass-surface p-4 rounded-container-token">
        <span class="text-lg font-semibold">🏎️ Edición Limitada 2023-2024</span>
      </div>
    </div>
  </div>
  <!-- Racing stripe -->
  <div class="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-error-500 via-warning-400 to-error-500"></div>
</section>

<!-- Cart Button (Fixed) -->
<button
  class="btn variant-filled-primary fixed top-4 right-4 z-50 rounded-full !p-3 shadow-2xl"
  on:click={() => isCartOpen.set(true)}
>
  <iconify-icon icon="mdi:cart" class="text-xl"></iconify-icon>
  {#if $cartItemCount > 0}
    <span class="badge variant-filled-warning absolute -top-2 -right-2 text-xs">
      {$cartItemCount}
    </span>
  {/if}
</button>

<!-- Category Filter -->
<section class="container mx-auto px-4 py-8">
  <div class="flex flex-wrap gap-3 justify-center">
    {#each categories as category}
      <button
        class="btn {$selectedCategory === category.id ? category.variant : 'variant-soft-surface'} rounded-full"
        on:click={() => selectedCategory.set(category.id)}
      >
        {category.name}
      </button>
    {/each}
  </div>
</section>

<!-- Loading -->
{#if $isLoading}
  <div class="container mx-auto px-4 py-16 text-center" in:fade>
    <div class="placeholder animate-pulse w-12 h-12 rounded-full mx-auto mb-4"></div>
    <p class="text-lg">Cargando monoplazas...</p>
  </div>
{/if}

<!-- Products Grid -->
{#if !$isLoading}
  <section class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each $filteredProducts as product, i}
        <div 
          class="card card-hover overflow-hidden"
          in:fly={{ y: 50, duration: 500, delay: i * 100 }}
        >
          <!-- Product Image -->
          <header class="card-header relative overflow-hidden bg-surface-200-700-token h-48">
            <img 
              src={getProductImageUrl(product, 0)} 
              alt={product.name}
              class="w-full h-full object-cover"
              on:error={(e) => {
                // Fallback to placeholder if image fails to load
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyMEM4Ljk1NDMgMjAgMCAyOC45NTQzIDAgNDBIMTBDMTAgMzQuNDc3MSAxNC40NzcxIDMwIDE5IDMwSDIxQzI1LjUyMjkgMzAgMzAgMzQuNDc3MSAzMCA0MEg0MEMzMCAyOC45NTQzIDMxLjA0NTcgMjAgMjAgMjBaIiBmaWxsPSIjQzNDM0MzIi8+Cjwvc3ZnPgo=';
                e.currentTarget.classList.add('opacity-50');
              }}
            />
            <div class="absolute top-3 right-3">
              <span class="badge variant-filled-error text-xs">
                #{product.id.toString().padStart(3, '0')}
              </span>
            </div>
          </header>

          <!-- Product Info -->
          <div class="p-4">
            <h3 class="h3 font-bold mb-2">{product.name}</h3>
            <p class="text-surface-600-300-token text-sm mb-4 line-clamp-3">
              {product.description}
            </p>
            
            <!-- Price and Add to Cart -->
            <div class="flex items-center justify-between">
              <div class="text-2xl font-bold text-success-600-300-token">
                ${product.price}
              </div>
              <button
                class="btn variant-filled-primary"
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
  </section>
{/if}

<!-- Cart Drawer -->
{#if $isCartOpen}
  <div class="fixed inset-0 z-50 overflow-hidden" transition:fade>
    <div class="absolute inset-0 bg-black/50" on:click={() => isCartOpen.set(false)}></div>
    <div 
      class="absolute right-0 top-0 h-full w-full max-w-md bg-surface-50-900-token shadow-2xl"
      transition:fly={{ x: 300, duration: 300 }}
    >
      <div class="flex flex-col h-full">
        <!-- Cart Header -->
        <div class="p-6 border-b border-surface-300-600-token">
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
              <div class="text-6xl mb-4 opacity-30">🏎️</div>
              <p class="text-surface-600-300-token">Tu carrito está vacío</p>
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
                      <div class="w-full h-full hidden items-center justify-center text-2xl">🏎️</div>
                    </div>
                    <div class="flex-1">
                      <h4 class="font-semibold text-sm">{item.name}</h4>
                      <p class="text-success-600-300-token font-bold">${item.price}</p>
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
          <div class="p-6 border-t border-surface-300-600-token">
            <div class="flex justify-between items-center mb-4">
              <span class="text-lg font-bold">Total:</span>
              <span class="text-2xl font-bold text-success-600-300-token">
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