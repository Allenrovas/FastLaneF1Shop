<script lang="ts">
  import '../app.postcss';
  import { AppShell, AppBar, Toast, Modal, initializeStores } from '@skeletonlabs/skeleton';
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
  import { storePopup } from '@skeletonlabs/skeleton';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { fade, fly } from 'svelte/transition';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Formula1Icon from '~icons/arcticons/formula-1';
  import { 
    cart, 
    cartTotal, 
    cartItemCount, 
    removeFromCart, 
    updateQuantity,
    reloadCart,
    clearCart,
    toastNotification,
    type Product 
  } from '$lib/stores/cart';
  import { categories, loadCategories } from '$lib/stores/categories';
  import MaterialSymbolsShoppingCartRounded from '~icons/material-symbols/shopping-cart-rounded'

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

  function handleCheckout() {
    // Aquí puedes implementar la lógica de checkout
    console.log('Proceeding to checkout...');
    isCartOpen.set(false);
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
      background="bg-gradient-to-r from-surface-50 to-surface-100 dark:from-surface-800 dark:to-surface-900 border-b border-surface-200 dark:border-surface-700 shadow-lg" 
      padding="p-4"
    >
      <svelte:fragment slot="lead">
        <button 
          class="flex items-center space-x-3 hover:scale-105 transition-transform duration-200"
          on:click={() => goto('/')}
        >
          <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200">
            <Formula1Icon class="text-white text-xl" />
          </div>
          <div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Fast Lane F1 Shop
            </h1>
          </div>
        </button>
      </svelte:fragment>
      
      <svelte:fragment slot="trail">
        <div class="flex items-center space-x-4">
          <!-- Cart Button -->
          <button
            class="btn variant-soft-primary relative hover:variant-filled-primary transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
            on:click={() => isCartOpen.set(true)}
          >
            <MaterialSymbolsShoppingCartRounded class="text-xl mr-2" />
            <span class="hidden sm:inline font-semibold">Carrito</span>
            {#if $cartItemCount > 0}
              <span class="badge variant-filled-error absolute -top-2 -right-2 text-xs font-bold animate-bounce min-w-[1.25rem] h-5">
                {$cartItemCount}
              </span>
            {/if}
          </button>
        </div>
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>
  
  <!-- Page Content -->
  <main class="min-h-screen bg-gradient-to-br from-surface-50 via-surface-25 to-surface-100 dark:from-surface-900 dark:via-surface-925 dark:to-surface-800">
    <slot />
  </main>

  <!-- Footer -->
  <svelte:fragment slot="pageFooter">
    <footer class="relative bg-gradient-to-r from-surface-900 to-surface-800 dark:from-surface-950 dark:to-surface-900 text-surface-50 overflow-hidden">
      <!-- Racing line decoration -->
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-warning-400 to-error-500"></div>
      
      <div class="container mx-auto px-4 py-16 relative">
        <!-- Footer Content -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <!-- Brand Section -->
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                <Formula1Icon class="text-white text-2xl" />
              </div>
              <div>
                <span class="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                  Fast Lane F1
                </span>
                <p class="text-surface-400 text-sm">Premium Collection</p>
              </div>
            </div>
            <p class="text-surface-300 leading-relaxed mb-6 max-w-md">
              La colección más completa de monoplazas de Fórmula 1. Desde los campeones del mundo hasta las máquinas más icónicas de la historia del automovilismo.
            </p>
            
            <!-- Social Links -->
            <div class="flex space-x-4">
              <button class="btn btn-sm variant-soft-primary rounded-full w-10 h-10 !p-0">
                <iconify-icon icon="mdi:facebook" class="text-lg"></iconify-icon>
              </button>
              <button class="btn btn-sm variant-soft-secondary rounded-full w-10 h-10 !p-0">
                <iconify-icon icon="mdi:twitter" class="text-lg"></iconify-icon>
              </button>
              <button class="btn btn-sm variant-soft-success rounded-full w-10 h-10 !p-0">
                <iconify-icon icon="mdi:instagram" class="text-lg"></iconify-icon>
              </button>
              <button class="btn btn-sm variant-soft-warning rounded-full w-10 h-10 !p-0">
                <iconify-icon icon="mdi:youtube" class="text-lg"></iconify-icon>
              </button>
            </div>
          </div>

          <!-- Dynamic Categories -->
          <div>
            <h3 class="font-bold text-lg mb-6 flex items-center">
              <iconify-icon icon="mdi:racing-helmet" class="mr-2 text-primary-400"></iconify-icon>
              Escuderías
            </h3>
            <ul class="space-y-3">
              {#each $categories.slice(1, 6) as category}
                <li>
                  <a 
                    href="/categoria/{category.id}" 
                    class="flex items-center space-x-2 text-surface-300 hover:text-primary-400 transition-colors duration-200 group"
                  >
                    <div class="w-2 h-2 bg-current rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-200"></div>
                    <span>{category.name}</span>
                  </a>
                </li>
              {/each}
            </ul>
          </div>

          <!-- Info Links -->
          <div>
            <h3 class="font-bold text-lg mb-6 flex items-center">
              <iconify-icon icon="mdi:information" class="mr-2 text-secondary-400"></iconify-icon>
              Información
            </h3>
            <ul class="space-y-3">
              <li>
                <a href="#about" class="flex items-center space-x-2 text-surface-300 hover:text-secondary-400 transition-colors duration-200 group">
                  <iconify-icon icon="mdi:account-group" class="text-sm opacity-50 group-hover:opacity-100"></iconify-icon>
                  <span>Acerca de</span>
                </a>
              </li>
              <li>
                <a href="#shipping" class="flex items-center space-x-2 text-surface-300 hover:text-secondary-400 transition-colors duration-200 group">
                  <iconify-icon icon="mdi:truck-delivery" class="text-sm opacity-50 group-hover:opacity-100"></iconify-icon>
                  <span>Envíos</span>
                </a>
              </li>
              <li>
                <a href="#contact" class="flex items-center space-x-2 text-surface-300 hover:text-secondary-400 transition-colors duration-200 group">
                  <iconify-icon icon="mdi:email" class="text-sm opacity-50 group-hover:opacity-100"></iconify-icon>
                  <span>Contacto</span>
                </a>
              </li>
              <li>
                <a href="#support" class="flex items-center space-x-2 text-surface-300 hover:text-secondary-400 transition-colors duration-200 group">
                  <iconify-icon icon="mdi:help-circle" class="text-sm opacity-50 group-hover:opacity-100"></iconify-icon>
                  <span>Soporte</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Newsletter -->
        <div class="border-t border-surface-700 pt-8 mb-8">
          <div class="max-w-md mx-auto text-center">
            <h4 class="text-lg font-semibold mb-4 flex items-center justify-center">
              <iconify-icon icon="mdi:email-newsletter" class="mr-2 text-warning-400"></iconify-icon>
              Mantente al día
            </h4>
            <p class="text-surface-400 mb-4">Recibe noticias sobre nuevos lanzamientos y ofertas exclusivas</p>
            <div class="flex space-x-2">
              <input 
                type="email" 
                placeholder="tu@email.com" 
                class="input rounded-full flex-1 bg-surface-800 border-surface-600 text-surface-100 placeholder-surface-400"
              />
              <button class="btn variant-filled-primary rounded-full px-6">
                <iconify-icon icon="mdi:send" class="text-lg"></iconify-icon>
              </button>
            </div>
          </div>
        </div>

        <!-- Copyright -->
        <div class="text-center border-t border-surface-700 pt-8">
          <div class="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <p class="text-sm text-surface-400">
              © {new Date().getFullYear()} Fast Lane F1 Shop. Todos los derechos reservados.
            </p>
            <div class="flex items-center space-x-6 text-sm text-surface-400">
              <a href="#privacy" class="hover:text-surface-200 transition-colors">Privacidad</a>
              <a href="#terms" class="hover:text-surface-200 transition-colors">Términos</a>
              <a href="#cookies" class="hover:text-surface-200 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </svelte:fragment>
</AppShell>

<!-- Enhanced Cart Drawer -->
{#if $isCartOpen}
  <div class="fixed inset-0 z-50 overflow-hidden" transition:fade={{ duration: 300 }}>
    <div class="absolute inset-0 bg-surface-900/70 backdrop-blur-sm" on:click={() => isCartOpen.set(false)}></div>
    <div 
      class="absolute right-0 top-0 h-full w-full max-w-lg bg-surface-0 dark:bg-surface-800 shadow-2xl border-l border-surface-200 dark:border-surface-700"
      transition:fly={{ x: 300, duration: 400 }}
    >
      <div class="flex flex-col h-full">
        <!-- Cart Header -->
        <div class="p-6 border-b border-surface-200 dark:border-surface-600 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-surface-800 dark:to-surface-750">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-2xl font-bold text-surface-900 dark:text-surface-50 flex items-center">
                <iconify-icon icon="mdi:cart" class="mr-2 text-primary-500"></iconify-icon>
                Mi Carrito
              </h3>
              <p class="text-surface-600 dark:text-surface-300 flex items-center mt-1">
                <iconify-icon icon="mdi:package-variant" class="mr-1 text-sm"></iconify-icon>
                {$cartItemCount} {$cartItemCount === 1 ? 'artículo' : 'artículos'}
              </p>
            </div>
            <div class="flex items-center space-x-2">
              {#if $cart.length > 0}
                <button 
                  class="btn btn-sm variant-ghost-error"
                  on:click={clearCart}
                  title="Vaciar carrito"
                >
                  <iconify-icon icon="mdi:delete-sweep" class="text-lg"></iconify-icon>
                </button>
              {/if}
              <button 
                class="btn btn-sm variant-ghost-surface"
                on:click={() => isCartOpen.set(false)}
              >
                <iconify-icon icon="mdi:close" class="text-xl"></iconify-icon>
              </button>
            </div>
          </div>
        </div>

        <!-- Cart Items -->
        <div class="flex-1 overflow-y-auto">
          {#if $cart.length === 0}
            <div class="flex flex-col items-center justify-center h-full px-6 text-center">
              <div class="w-32 h-32 bg-surface-200 dark:bg-surface-700 rounded-full flex items-center justify-center mb-6">
                <iconify-icon icon="mdi:cart-outline" class="text-6xl text-surface-400"></iconify-icon>
              </div>
              <h4 class="text-xl font-semibold mb-3 text-surface-900 dark:text-surface-50">
                Tu garaje está vacío
              </h4>
              <p class="text-surface-600 dark:text-surface-300 mb-6 leading-relaxed">
                Descubre nuestra increíble colección de monoplazas de Fórmula 1 y comienza a construir tu colección de ensueño.
              </p>
              <button 
                class="btn variant-filled-primary text-lg px-8 py-3"
                on:click={() => isCartOpen.set(false)}
              >
                <iconify-icon icon="mdi:racing-helmet" class="mr-2"></iconify-icon>
                Explorar Colección
              </button>
            </div>
          {:else}
            <div class="p-6 space-y-4">
              {#each $cart as item, i}
                <div 
                  class="card variant-ghost-surface border border-surface-200 dark:border-surface-600 p-4 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300"
                  in:fly={{ x: 50, duration: 300, delay: i * 50 }}
                >
                  <div class="flex items-center space-x-4">
                    <!-- Product Image -->
                    <div class="relative">
                      <div class="w-20 h-20 bg-surface-200 dark:bg-surface-600 rounded-lg overflow-hidden">
                        <img 
                          src={getProductImageUrl(item, 0)} 
                          alt={item.name}
                          class="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                          on:error={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling.style.display = 'flex';
                          }}
                        />
                        <div class="w-full h-full hidden items-center justify-center">
                          <iconify-icon icon="mdi:car-sports" class="text-3xl text-surface-500"></iconify-icon>
                        </div>
                      </div>
                      {#if item.limitedEdition}
                        <div class="absolute -top-1 -right-1">
                          <span class="badge variant-filled-warning text-xs font-bold">
                            <iconify-icon icon="mdi:star" class="text-xs mr-1"></iconify-icon>
                            Limitada
                          </span>
                        </div>
                      {/if}
                    </div>
                    
                    <!-- Product Details -->
                    <div class="flex-1 min-w-0">
                      <h4 class="font-semibold text-surface-900 dark:text-surface-50 mb-1 line-clamp-2">
                        {item.name}
                      </h4>
                      <p class="text-sm text-surface-600 dark:text-surface-400 mb-2">
                        {item.team} • {item.year}
                      </p>
                      <div class="flex items-center justify-between">
                        <div class="flex flex-col">
                          <span class="text-lg font-bold text-success-600 dark:text-success-400">
                            ${item.price.toFixed(2)}
                          </span>
                          <span class="text-xs text-surface-500 dark:text-surface-400">
                            Subtotal: ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Quantity and Actions -->
                    <div class="flex flex-col items-end space-y-2">
                      <!-- Quantity Controls -->
                      <div class="flex items-center bg-surface-100 dark:bg-surface-700 rounded-full p-1">
                        <button 
                          class="btn btn-sm variant-ghost-surface w-8 h-8 !p-0 rounded-full"
                          on:click={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <iconify-icon icon="mdi:minus" class="text-sm"></iconify-icon>
                        </button>
                        <span class="w-10 text-center font-semibold text-surface-900 dark:text-surface-50">
                          {item.quantity}
                        </span>
                        <button 
                          class="btn btn-sm variant-ghost-surface w-8 h-8 !p-0 rounded-full"
                          on:click={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <iconify-icon icon="mdi:plus" class="text-sm"></iconify-icon>
                        </button>
                      </div>
                      
                      <!-- Remove Button -->
                      <button 
                        class="btn btn-sm variant-ghost-error w-8 h-8 !p-0 rounded-full"
                        on:click={() => removeFromCart(item.id)}
                        title="Eliminar del carrito"
                      >
                        <iconify-icon icon="mdi:delete" class="text-sm"></iconify-icon>
                      </button>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>

        <!-- Cart Footer -->
        {#if $cart.length > 0}
          <div class="border-t border-surface-200 dark:border-surface-600 bg-surface-50 dark:bg-surface-750 p-6">
            <!-- Cart Summary -->
            <div class="space-y-3 mb-6">
              <div class="flex justify-between items-center">
                <span class="flex items-center text-surface-600 dark:text-surface-300">
                  <iconify-icon icon="mdi:calculator" class="mr-2 text-sm"></iconify-icon>
                  Subtotal ({$cartItemCount} items):
                </span>
                <span class="font-semibold text-surface-900 dark:text-surface-50">
                  ${$cartTotal.toFixed(2)}
                </span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="flex items-center text-surface-600 dark:text-surface-300">
                  <iconify-icon icon="mdi:truck-delivery" class="mr-2 text-sm"></iconify-icon>
                  Envío mundial:
                </span>
                <span class="font-semibold text-success-600 dark:text-success-400">
                  <iconify-icon icon="mdi:check-circle" class="mr-1 text-sm"></iconify-icon>
                  Gratis
                </span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="flex items-center text-surface-600 dark:text-surface-300">
                  <iconify-icon icon="mdi:shield-check" class="mr-2 text-sm"></iconify-icon>
                  Garantía premium:
                </span>
                <span class="font-semibold text-success-600 dark:text-success-400">
                  <iconify-icon icon="mdi:check-circle" class="mr-1 text-sm"></iconify-icon>
                  Incluida
                </span>
              </div>
              
              <div class="border-t border-surface-200 dark:border-surface-600 pt-3">
                <div class="flex justify-between items-center">
                  <span class="text-xl font-bold text-surface-900 dark:text-surface-50">Total:</span>
                  <span class="text-3xl font-bold text-success-600 dark:text-success-400">
                    ${$cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="space-y-3">
              <button 
                class="btn variant-filled-success w-full font-semibold text-lg py-4 hover:scale-105 transition-transform duration-200"
                on:click={handleCheckout}
              >
                <iconify-icon icon="mdi:credit-card" class="mr-2"></iconify-icon>
                Proceder al Pago
              </button>
              
              <button 
                class="btn variant-soft-surface w-full"
                on:click={() => isCartOpen.set(false)}
              >
                <iconify-icon icon="mdi:shopping" class="mr-2"></iconify-icon>
                Continuar Comprando
              </button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<!-- Toast Notification -->
{#if $toastNotification.visible}
  <div 
    class="fixed top-20 right-4 z-[60] max-w-sm"
    transition:fly={{ x: 300, duration: 300 }}
  >
    <div class="card variant-filled-{$toastNotification.type} p-4 shadow-2xl border-l-4 border-{$toastNotification.type}-400">
      <div class="flex items-center space-x-3">
        <iconify-icon 
          icon={$toastNotification.type === 'success' ? 'mdi:check-circle' : 
                $toastNotification.type === 'warning' ? 'mdi:alert-circle' :
                $toastNotification.type === 'error' ? 'mdi:close-circle' : 'mdi:information'}
          class="text-2xl text-on-{$toastNotification.type}-token"
        ></iconify-icon>
        <span class="font-semibold text-on-{$toastNotification.type}-token">
          {$toastNotification.message}
        </span>
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
  
  /* Line clamp utility */
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  /* Enhanced shadows */
  .shadow-3xl {
    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
  }
  
  /* Racing theme animations */
  @keyframes racing-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  .animate-racing-pulse {
    animation: racing-pulse 2s ease-in-out infinite;
  }
</style>