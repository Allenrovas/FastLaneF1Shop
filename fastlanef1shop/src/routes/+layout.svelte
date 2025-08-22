<script lang="ts">
  import '../app.postcss';
  import { AppShell, AppBar, Toast, Modal, initializeStores } from '@skeletonlabs/skeleton';
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
  import { storePopup } from '@skeletonlabs/skeleton';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { fade, fly } from 'svelte/transition';
  import Formula1Icon from '~icons/arcticons/formula-1';
  import { 
    cart, 
    cartTotal, 
    cartItemCount, 
    removeFromCart, 
    updateQuantity,
    reloadCart,
    type Product 
  } from '$lib/stores/cart';
  import { categories, loadCategories } from '$lib/stores/categories';

  // Initialize Skeleton stores
  initializeStores();
  
  // Configure floating UI
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  // Cart drawer state
  const isCartOpen = writable<boolean>(false);
  const GITHUB_REPO_URL = 'https://raw.githubusercontent.com/tu-usuario/tu-repo/main';

  function getProductImageUrl(product: Product, imageIndex: number = 0): string {
    return `${GITHUB_REPO_URL}/${product.imageFolder}${product.images[imageIndex]}`;
  }

  onMount(() => {
    reloadCart();
    loadCategories();
  });
</script>

<!-- App Shell -->
<AppShell>
  <svelte:fragment slot="header">
    <AppBar 
      background="bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700" 
      padding="p-4"
    >
      <svelte:fragment slot="lead">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <Formula1Icon class="text-white text-lg" />
          </div>
          <div>
            <h1 class="text-xl font-bold text-surface-900 dark:text-surface-50">
              Fast Lane F1
            </h1>
          </div>
        </div>
      </svelte:fragment>
      
      <svelte:fragment slot="trail">
        <!-- Cart Button -->
        <button
          class="btn variant-soft-primary relative"
          on:click={() => isCartOpen.set(true)}
        >
          <iconify-icon icon="mdi:cart" class="text-xl"></iconify-icon>
          {#if $cartItemCount > 0}
            <span class="badge variant-filled-error absolute -top-2 -right-2 text-xs font-bold">
              {$cartItemCount}
            </span>
          {/if}
        </button>
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>
  
  <!-- Page Content -->
  <main class="min-h-screen bg-surface-50 dark:bg-surface-900">
    <slot />
  </main>

  <!-- Footer -->
  <svelte:fragment slot="pageFooter">
    <footer class="bg-white dark:bg-surface-800 py-12 border-t border-surface-200 dark:border-surface-700">
      <div class="container mx-auto px-4">
        <!-- Footer Content -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Brand Section -->
          <div>
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Formula1Icon class="text-white text-lg" />
              </div>
              <span class="text-xl font-bold text-surface-900 dark:text-surface-50">Fast Lane F1</span>
            </div>
            <p class="text-surface-600 dark:text-surface-300 leading-relaxed mb-6 max-w-md">
              Colección completa de monoplazas de Fórmula 1. Desde los campeones del mundo hasta las máquinas más icónicas.
            </p>
          </div>

          <!-- Dynamic Categories -->
          <div>
            <h3 class="font-bold text-lg mb-4 text-surface-900 dark:text-surface-50">Categorías</h3>
            <ul class="space-y-2">
              {#each $categories as category}
                <li>
                  <a 
                    href="/categoria/{category.id}" 
                    class="text-surface-600 dark:text-surface-300 hover:text-primary-500 transition-colors duration-200"
                  >
                    {category.name}
                  </a>
                </li>
              {/each}
            </ul>
          </div>

          <!-- Info Links -->
          <div>
            <h3 class="font-bold text-lg mb-4 text-surface-900 dark:text-surface-50">Información</h3>
            <ul class="space-y-2">
              <li>
                <a href="#about" class="text-surface-600 dark:text-surface-300 hover:text-primary-500 transition-colors duration-200">
                  Acerca de
                </a>
              </li>
              <li>
                <a href="#shipping" class="text-surface-600 dark:text-surface-300 hover:text-primary-500 transition-colors duration-200">
                  Envíos
                </a>
              </li>
              <li>
                <a href="#contact" class="text-surface-600 dark:text-surface-300 hover:text-primary-500 transition-colors duration-200">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Copyright -->
        <div class="pt-8 border-t border-surface-200 dark:border-surface-700">
          <div class="text-center">
            <p class="text-sm text-surface-500 dark:text-surface-400">
              © {new Date().getFullYear()} Fast Lane F1 Shop. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  </svelte:fragment>
</AppShell>

<!-- Cart Drawer -->
{#if $isCartOpen}
  <div class="fixed inset-0 z-50 overflow-hidden" transition:fade>
    <div class="absolute inset-0 bg-surface-900/50 backdrop-blur-sm" on:click={() => isCartOpen.set(false)}></div>
    <div 
      class="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-surface-800 shadow-xl border-l border-surface-200 dark:border-surface-700"
      transition:fly={{ x: 300, duration: 300 }}
    >
      <div class="flex flex-col h-full">
        <!-- Cart Header -->
        <div class="p-6 border-b border-surface-200 dark:border-surface-700">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xl font-bold text-surface-900 dark:text-surface-50">Carrito</h3>
              <p class="text-sm text-surface-600 dark:text-surface-300">
                {$cartItemCount} {$cartItemCount === 1 ? 'artículo' : 'artículos'}
              </p>
            </div>
            <button 
              class="btn btn-sm variant-soft-surface"
              on:click={() => isCartOpen.set(false)}
            >
              <iconify-icon icon="mdi:close" class="text-lg"></iconify-icon>
            </button>
          </div>
        </div>

        <!-- Cart Items -->
        <div class="flex-1 overflow-y-auto p-6">
          {#if $cart.length === 0}
            <div class="text-center py-20">
              <iconify-icon icon="mdi:cart-outline" class="text-6xl text-surface-300 dark:text-surface-600 mb-4"></iconify-icon>
              <h4 class="text-lg font-semibold mb-2 text-surface-900 dark:text-surface-50">Tu carrito está vacío</h4>
              <p class="text-surface-600 dark:text-surface-300 mb-6">
                Añade algunos monoplazas a tu colección
              </p>
              <button 
                class="btn variant-filled-primary"
                on:click={() => isCartOpen.set(false)}
              >
                Explorar productos
              </button>
            </div>
          {:else}
            <div class="space-y-4">
              {#each $cart as item}
                <div class="card p-4 border border-surface-200 dark:border-surface-600">
                  <div class="flex items-center space-x-4">
                    <!-- Product Image -->
                    <div class="w-16 h-16 bg-surface-200 dark:bg-surface-600 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={getProductImageUrl(item, 0)} 
                        alt={item.name}
                        class="w-full h-full object-cover"
                        on:error={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div class="w-full h-full hidden items-center justify-center">
                        <iconify-icon icon="mdi:car-sports" class="text-2xl text-surface-500"></iconify-icon>
                      </div>
                    </div>
                    
                    <!-- Product Details -->
                    <div class="flex-1 min-w-0">
                      <h4 class="font-semibold text-sm text-surface-900 dark:text-surface-50 truncate">{item.name}</h4>
                      <p class="text-primary-500 font-bold">${item.price}</p>
                    </div>
                    
                    <!-- Quantity Controls -->
                    <div class="flex items-center space-x-2">
                      <button 
                        class="btn btn-sm variant-soft-surface w-8 h-8 !p-0"
                        on:click={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <iconify-icon icon="mdi:minus" class="text-xs"></iconify-icon>
                      </button>
                      <span class="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                      <button 
                        class="btn btn-sm variant-soft-surface w-8 h-8 !p-0"
                        on:click={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <iconify-icon icon="mdi:plus" class="text-xs"></iconify-icon>
                      </button>
                    </div>
                    
                    <!-- Remove Button -->
                    <button 
                      class="btn btn-sm variant-soft-error w-8 h-8 !p-0"
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
          <div class="p-6 border-t border-surface-200 dark:border-surface-700">
            <div class="flex justify-between items-center mb-4">
              <span class="text-lg font-bold text-surface-900 dark:text-surface-50">Total:</span>
              <span class="text-2xl font-bold text-primary-500">
                ${$cartTotal.toFixed(2)}
              </span>
            </div>
            
            <button class="btn variant-filled-primary w-full font-semibold">
              <iconify-icon icon="mdi:credit-card" class="mr-2"></iconify-icon>
              Proceder al pago
            </button>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<!-- Global Components -->
<Toast />
<Modal />

<style lang="postcss">
  /* Smooth scrolling */
  :global(html) {
    scroll-behavior: smooth;
  }
</style>