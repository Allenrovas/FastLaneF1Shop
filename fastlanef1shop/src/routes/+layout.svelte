<script lang="ts">
  import '../app.postcss';
  import { AppShell, AppBar, Toast, Modal, initializeStores } from '@skeletonlabs/skeleton';
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
  import { storePopup } from '@skeletonlabs/skeleton';
  import { onMount, afterUpdate } from 'svelte';
  import { writable } from 'svelte/store';
  import { fade, fly } from 'svelte/transition';
  import { page } from '$app/stores';
  import { goto, afterNavigate } from '$app/navigation';
  import { base } from '$app/paths';
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

  // Importar iconos con unplugin
  import LucideF1 from '~icons/lucide/car-front';
  import LucideShoppingCart from '~icons/lucide/shopping-cart';
  import LucideClose from '~icons/lucide/x';
  import LucideTrash from '~icons/lucide/trash-2';
  import LucidePlus from '~icons/lucide/plus';
  import LucideMinus from '~icons/lucide/minus';
  import LucideCheck from '~icons/lucide/check-circle';
  import LucideCreditCard from '~icons/lucide/credit-card';
  import LucideShoppingBag from '~icons/lucide/shopping-bag';
  import LucidePackage from '~icons/lucide/package';
  import LucideTruck from '~icons/lucide/truck';
  import LucideCalculator from '~icons/lucide/calculator';
  import LucideHelmet from '~icons/lucide-lab/motor-racing-helmet';
  import LucideEmail from '~icons/lucide/mail';
  import LucideInfo from '~icons/lucide/info';
  import LucideStar from '~icons/lucide/star';
  import LucideDelete from '~icons/lucide/trash-2';
  import LucideFacebook from '~icons/lucide/facebook';
  import LucideInstagram from '~icons/lucide/instagram';
  import IcTwotoneTiktok from '~icons/ic/twotone-tiktok';
  import TablerBrandWhatsapp from '~icons/tabler/brand-whatsapp';
  import LucideMenu from '~icons/lucide/menu';
  import LucideHome from '~icons/lucide/home';
  import LucideBookOpen from '~icons/lucide/book-open';

  export const prerender = true;
  export const ssr = false;

  // Initialize Skeleton stores
  initializeStores();

  // Configure floating UI
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  afterNavigate(() => {
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
      if (element.scrollTop > 0 || element.scrollLeft > 0) {
        element.scrollTop = 0;
        element.scrollLeft = 0;
      }
    });
    mobileMenuOpen.set(false);
  });

  // Cart drawer state
  const isCartOpen = writable<boolean>(false);
  const mobileMenuOpen = writable<boolean>(false);
  const GITHUB_REPO_URL = 'https://raw.githubusercontent.com/Allenrovas/Datos_Catalogo/main';

  function getProductImageUrl(product: Product, imageIndex: number = 0): string {
    return `${GITHUB_REPO_URL}/${product.imageFolder}${product.images[imageIndex]}`;
  }

  function handleCheckout() {
    isCartOpen.set(false);
    goto(`${base}/checkout`);
  }

  const navLinks = [
    { href: base || '/', label: 'Inicio' },
    { href: `${base}/catalogo`, label: 'Catálogo' },
    { href: `${base}/shipping`, label: 'Envíos' },
    { href: `${base}/contact`, label: 'Contacto' },
  ];

  onMount(() => {
    reloadCart();
    loadCategories();
    const handleNavigation = () => {
      setTimeout(nuclearScrollReset, 0);
      setTimeout(nuclearScrollReset, 100);
    };

    window.addEventListener('popstate', handleNavigation);

    return () => {
      window.removeEventListener('popstate', handleNavigation);
    };
  });
</script>

<!-- App Shell -->
<AppShell>
  <svelte:fragment slot="header">
    <!-- Promotional Banner -->
    <div class="bg-primary-500 text-white text-center py-1.5 text-xs sm:text-sm font-medium tracking-wider uppercase">
      Modelos 100% Auténticos | Envíos a toda Guatemala
    </div>

    <AppBar
      background="bg-white shadow-sm border-b border-gray-200"
      padding="p-3 lg:p-4"
    >
      <svelte:fragment slot="lead">
        <div class="flex items-center gap-3">
          <!-- Mobile menu button -->
          <button
            class="lg:hidden btn btn-sm text-gray-700 hover:bg-gray-100 !p-1"
            on:click={() => mobileMenuOpen.update(v => !v)}
            aria-label="Menú"
          >
            <LucideMenu class="w-5 h-5" />
          </button>

          <button
            class="flex items-center hover:opacity-80 transition-opacity duration-200"
            on:click={() => goto(base || '/')}
          >
            <!-- Desktop logo -->
            <img src="{base}/F1L-full.png" alt="Fast Lane F1 Shop" class="h-12 hidden sm:block" />
            <!-- Mobile logo -->
            <img src="{base}/F1L.png" alt="Fast Lane F1" class="h-12 sm:hidden" />
          </button>
        </div>
      </svelte:fragment>

      <!-- Center navigation (desktop) -->
      <div class="hidden lg:flex items-center justify-center gap-8">
        {#each navLinks as link}
          <a
            href={link.href}
            class="text-sm uppercase tracking-wider font-medium text-gray-700 hover:text-primary-500 transition-colors duration-200"
          >
            {link.label}
          </a>
        {/each}
      </div>

      <svelte:fragment slot="trail">
        <div class="flex items-center gap-3">
          <!-- Cart Button -->
          <button
            class="btn btn-sm bg-white text-gray-700 border border-gray-300 hover:text-primary-500 hover:border-primary-500 relative transition-all duration-200"
            on:click={() => isCartOpen.set(true)}
          >
            <LucideShoppingCart class="w-4 h-4 sm:mr-2" />
            <span class="hidden sm:inline font-medium text-sm">Carrito</span>
            {#if $cartItemCount > 0}
              <span class="absolute -top-2 -right-2 bg-primary-500 text-white text-xs font-bold rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1">
                {$cartItemCount}
              </span>
            {/if}
          </button>
        </div>
      </svelte:fragment>
    </AppBar>

    <!-- Mobile Menu -->
    {#if $mobileMenuOpen}
      <div class="lg:hidden bg-white border-b border-gray-200" transition:fly={{ y: -10, duration: 200 }}>
        <nav class="container mx-auto px-4 py-3 flex flex-col gap-1">
          {#each navLinks as link}
            <a
              href={link.href}
              class="px-4 py-2.5 text-sm uppercase tracking-wider font-medium text-gray-700 hover:text-primary-500 hover:bg-gray-100 rounded transition-colors duration-200"
              on:click={() => mobileMenuOpen.set(false)}
            >
              {link.label}
            </a>
          {/each}
        </nav>
      </div>
    {/if}
  </svelte:fragment>

  <!-- Page Content -->
  <main class="min-h-screen bg-surface-900">
    <slot />
  </main>

  <!-- Footer -->
  <svelte:fragment slot="pageFooter">
    <footer class="relative bg-white text-gray-900 overflow-hidden">
      <!-- Red top line -->
      <div class="h-0.5 bg-primary-500"></div>

      <div class="container mx-auto px-4 py-16 relative">
        <!-- Footer Content -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <!-- Brand Section -->
          <div class="col-span-1 md:col-span-2">
            <div class="mb-6">
              <img src="{base}/F1L-full.png" alt="Fast Lane F1 Shop" class="h-24" />
            </div>
            <p class="text-gray-500 leading-relaxed mb-6 max-w-md">
              La colección más completa de monoplazas de Fórmula 1. Desde los campeones del mundo hasta las máquinas más icónicas de la historia del automovilismo.
            </p>

            <!-- Social Links -->
            <div class="flex gap-3">
              <button
                class="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary-500 hover:border-primary-500 transition-all duration-200"
                on:click={() => window.open('https://www.facebook.com/share/1GkYFBVWRQ/?mibextid=wwXIfr', '_blank')}
                aria-label="Facebook"
              >
                <LucideFacebook class="w-4 h-4" />
              </button>
              <button
                class="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary-500 hover:border-primary-500 transition-all duration-200"
                on:click={() => window.open('https://www.tiktok.com/@fastlanef1.shop', '_blank')}
                aria-label="TikTok"
              >
                <IcTwotoneTiktok class="w-4 h-4" />
              </button>
              <button
                class="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary-500 hover:border-primary-500 transition-all duration-200"
                on:click={() => window.open('https://www.instagram.com/fastlanef1shop/', '_blank')}
                aria-label="Instagram"
              >
                <LucideInstagram class="w-4 h-4" />
              </button>
              <button
                class="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary-500 hover:border-primary-500 transition-all duration-200"
                on:click={() => window.open('https://wa.me/+50249395444', '_blank')}
                aria-label="WhatsApp"
              >
                <TablerBrandWhatsapp class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Dynamic Categories -->
          <div>
            <h3 class="font-bold text-lg mb-6 flex items-center">
              <LucideHelmet class="mr-2 w-5 h-5 text-primary-500" />
              Escuderías
            </h3>
            <ul class="space-y-3">
              {#each $categories.filter(c => c.type === 'team').slice(0, 5) as category}
                <li>
                  <a
                    href={`${base}/categoria/${category.id}`}
                    class="flex items-center gap-2 text-gray-500 hover:text-primary-500 transition-colors duration-200 group"
                  >
                    <div class="w-1.5 h-1.5 bg-current rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-200"></div>
                    <span>{category.name}</span>
                  </a>
                </li>
              {/each}
            </ul>
          </div>

          <!-- Info Links -->
          <div>
            <h3 class="font-bold text-lg mb-6 flex items-center">
              <LucideInfo class="mr-2 w-5 h-5 text-primary-500" />
              Información
            </h3>
            <ul class="space-y-3">
              <li>
                <a href={`${base}/`} class="flex items-center gap-2 text-gray-500 hover:text-primary-500 transition-colors duration-200 group">
                  <LucideHome class="w-4 h-4 opacity-50 group-hover:opacity-100" />
                  <span>Inicio</span>
                </a>
              </li>
              <li>
                <a href={`${base}/catalogo`} class="flex items-center gap-2 text-gray-500 hover:text-primary-500 transition-colors duration-200 group">
                  <LucideBookOpen class="w-4 h-4 opacity-50 group-hover:opacity-100" />
                  <span>Catálogo</span>
                </a>
              </li>
              <li>
                <a href={`${base}/shipping`} class="flex items-center gap-2 text-gray-500 hover:text-primary-500 transition-colors duration-200 group">
                  <LucideTruck class="w-4 h-4 opacity-50 group-hover:opacity-100" />
                  <span>Envíos</span>
                </a>
              </li>
              <li>
                <a href={`${base}/contact`} class="flex items-center gap-2 text-gray-500 hover:text-primary-500 transition-colors duration-200 group">
                  <LucideEmail class="w-4 h-4 opacity-50 group-hover:opacity-100" />
                  <span>Contacto</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Copyright -->
        <div class="text-center border-t border-gray-200 pt-8">
          <p class="text-sm text-gray-400">
            © {new Date().getFullYear()} Fast Lane F1 Shop. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  </svelte:fragment>
</AppShell>

<!-- Enhanced Cart Drawer -->
{#if $isCartOpen}
  <div class="fixed inset-0 z-50 overflow-hidden" transition:fade={{ duration: 300 }}>
    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" on:click={() => isCartOpen.set(false)}></div>
    <div
      class="absolute right-0 top-0 h-full w-full max-w-lg bg-surface-800 shadow-2xl border-l border-surface-700"
      transition:fly={{ x: 300, duration: 400 }}
    >
      <div class="flex flex-col h-full">
        <!-- Cart Header -->
        <div class="p-6 border-b border-surface-700 bg-surface-900">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-2xl font-bold text-white flex items-center">
                <LucideShoppingCart class="mr-2 w-6 h-6 text-primary-500" />
                Mi Carrito
              </h3>
              <p class="text-surface-200 flex items-center mt-1">
                <LucidePackage class="mr-1 w-4 h-4" />
                {$cartItemCount} {$cartItemCount === 1 ? 'artículo' : 'artículos'}
              </p>
            </div>
            <div class="flex items-center gap-2">
              {#if $cart.length > 0}
                <button
                  class="btn btn-sm variant-ghost-error"
                  on:click={clearCart}
                  title="Vaciar carrito"
                >
                  <LucideDelete class="w-4 h-4" />
                </button>
              {/if}
              <button
                class="btn btn-sm variant-ghost-surface"
                on:click={() => isCartOpen.set(false)}
              >
                <LucideClose class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Cart Items -->
        <div class="flex-1 overflow-y-auto">
          {#if $cart.length === 0}
            <div class="flex flex-col items-center justify-center h-full px-6 text-center">
              <div class="w-32 h-32 bg-surface-700 rounded-full flex items-center justify-center mb-6">
                <LucideShoppingCart class="w-16 h-16 text-surface-300" />
              </div>
              <h4 class="text-xl font-semibold mb-3 text-white">
                Tu garaje está vacío
              </h4>
              <p class="text-surface-200 mb-6 leading-relaxed">
                Descubre nuestra increíble colección de monoplazas de Fórmula 1 y comienza a construir tu colección de ensueño.
              </p>
              <button
                class="btn bg-primary-500 text-white text-lg px-8 py-3 uppercase tracking-wider font-semibold"
                on:click={() => isCartOpen.set(false)}
              >
                <LucideHelmet class="mr-2 w-5 h-5" />
                Explorar Colección
              </button>
            </div>
          {:else}
            <div class="p-6 space-y-4">
              {#each $cart as item, i}
                <div
                  class="bg-surface-700 border border-surface-600 rounded-lg p-4 hover:border-primary-500/50 transition-all duration-200"
                  in:fly={{ x: 50, duration: 300, delay: i * 50 }}
                >
                  <div class="flex items-center gap-4">
                    <!-- Product Image -->
                    <div class="relative">
                      <div class="w-20 h-20 bg-surface-600 rounded-lg overflow-hidden">
                        <img
                          src={getProductImageUrl(item, 0)}
                          alt={item.name}
                          class="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                          on:error={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.nextElementSibling) e.currentTarget.nextElementSibling.style.display = 'flex';
                          }}
                        />
                        <div class="w-full h-full hidden items-center justify-center">
                          <LucideF1 class="w-8 h-8 text-surface-300" />
                        </div>
                      </div>
                      {#if item.limitedEdition}
                        <div class="absolute -top-1 -right-1">
                          <span class="badge bg-primary-500 text-white text-xs font-bold">
                            <LucideStar class="w-3 h-3 mr-1" />
                            Ltd
                          </span>
                        </div>
                      {/if}
                    </div>

                    <!-- Product Details -->
                    <div class="flex-1 min-w-0">
                      <h4 class="font-semibold text-white mb-1 line-clamp-2">
                        {item.name}
                      </h4>
                      <div class="flex flex-wrap gap-1 mb-2">
                        <span class="badge bg-surface-600 text-surface-200 text-xs">{item.team}</span>
                        <span class="badge bg-surface-600 text-surface-200 text-xs">{item.scale}</span>
                      </div>
                      <div class="flex items-center justify-between">
                        <div class="flex flex-col">
                          <span class="text-lg font-bold text-white">
                            Q. {item.price.toFixed(2)}
                          </span>
                          <span class="text-xs text-surface-200">
                            Subtotal: Q. {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Quantity and Actions -->
                    <div class="flex flex-col items-end gap-2">
                      <div class="flex items-center bg-surface-800 rounded-full p-1">
                        <button
                          class="btn btn-sm variant-ghost-surface w-8 h-8 !p-0 rounded-full"
                          on:click={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <LucideMinus class="w-3 h-3" />
                        </button>
                        <span class="w-10 text-center font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          class="btn btn-sm variant-ghost-surface w-8 h-8 !p-0 rounded-full"
                          on:click={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <LucidePlus class="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        class="btn btn-sm variant-ghost-error w-8 h-8 !p-0 rounded-full"
                        on:click={() => removeFromCart(item.id)}
                        title="Eliminar del carrito"
                      >
                        <LucideTrash class="w-3 h-3" />
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
          <div class="border-t border-surface-700 bg-surface-900 p-6">
            <div class="space-y-3 mb-6">
              <div class="flex justify-between items-center">
                <span class="flex items-center text-surface-200">
                  <LucideCalculator class="mr-2 w-4 h-4" />
                  Subtotal ({$cartItemCount} items):
                </span>
                <span class="font-semibold text-white">
                  Q. {$cartTotal.toFixed(2)}
                </span>
              </div>

              <div class="border-t border-surface-700 pt-3">
                <div class="flex justify-between items-center">
                  <span class="text-xl font-bold text-white">Total:</span>
                  <span class="text-3xl font-bold text-white">
                    Q. {$cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <button
                class="btn bg-primary-500 text-white w-full font-semibold text-lg py-4 uppercase tracking-wider hover:bg-primary-600 transition-colors duration-200"
                on:click={handleCheckout}
              >
                <LucideCreditCard class="mr-2 w-5 h-5" />
                Proceder al Pago
              </button>

              <button
                class="btn variant-ghost-surface w-full"
                on:click={() => isCartOpen.set(false)}
              >
                <LucideShoppingBag class="mr-2 w-5 h-5" />
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
      <div class="flex items-center gap-3">
        {#if $toastNotification.type === 'success'}
          <LucideCheck class="w-6 h-6" />
        {:else if $toastNotification.type === 'warning'}
          <LucideInfo class="w-6 h-6" />
        {:else if $toastNotification.type === 'error'}
          <LucideClose class="w-6 h-6" />
        {:else}
          <LucideInfo class="w-6 h-6" />
        {/if}
        <span class="font-semibold">
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
  :global(html) {
    scroll-behavior: smooth;
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
