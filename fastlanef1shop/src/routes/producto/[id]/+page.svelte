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
    toastNotification,
    reloadCart,
    type Product
  } from '$lib/stores/cart';
  import { categories, loadCategories, type Category } from '$lib/stores/categories';

  import ProductCard from '$lib/components/ProductCard.svelte';

  // Icons
  import LucideHome from '~icons/lucide/home';
  import LucideChevronRight from '~icons/lucide/chevron-right';
  import LucideF1 from '~icons/lucide/car-front';
  import LucideHelmet from '~icons/lucide-lab/motor-racing-helmet';
  import LucideStar from '~icons/lucide/star';
  import LucideCheck from '~icons/lucide/check-circle';
  import LucideClose from '~icons/lucide/x-circle';
  import LucideZoomIn from '~icons/lucide/zoom-in';
  import LucideCartPlus from '~icons/lucide/shopping-cart';
  import LucideClock from '~icons/lucide/clock';
  import LucideLock from '~icons/lucide/lock';
  import LucideCreditCard from '~icons/lucide/credit-card';
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
  const zoomLevel = writable<number>(1);
  const imagePosition = writable<{ x: number; y: number }>({ x: 0, y: 0 });

  // GitHub configuration
  const GITHUB_REPO_URL = 'https://raw.githubusercontent.com/Allenrovas/Datos_Catalogo/main';
  const WHATSAPP_PHONE = '+50249395444';

  // Get product ID from URL
  $: productId = parseInt($page.params.id ?? '0');
  $: if ($page.params.id) {
    loadProduct();
  }

  // Derived stores
  const currentCategories = derived(
    [categories, product],
    ([$categories, $product]) =>
      $product ? $categories.filter(cat => $product.categories.includes(cat.id)) : []
  );

  const relatedProducts = writable<Product[]>([]);

  // Sticky bar visibility
  let showStickyBar = false;
  let ctaSectionEl: HTMLElement;

  function handleScroll() {
    if (ctaSectionEl) {
      const rect = ctaSectionEl.getBoundingClientRect();
      showStickyBar = rect.bottom < 0;
    }
  }

  // Load single product
  async function loadProduct(): Promise<void> {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

      const related = data
        .filter(p =>
          p.id !== foundProduct.id &&
          p.categories.some(cat => foundProduct.categories.includes(cat)) &&
          p.inStock
        )
        .slice(0, 3);
      relatedProducts.set(related);

    } catch (error) {
      console.error('Error loading product:', error);

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

      const mockRelated: Product[] = [
        {
          id: 2,
          name: "Red Bull RB19 Sergio Pérez",
          description: "El compañero de equipo de Verstappen en Red Bull Racing con la misma tecnología revolucionaria.",
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
        },
        {
          id: 3,
          name: "Red Bull RB20 Max Verstappen 2024",
          description: "La evolución del dominante RB19, llevando la supremacía de Red Bull a nuevas alturas.",
          categories: ["championship", "red-bull", "verstappen", "burago", "scale-1-43"],
          price: 94.99,
          images: ["rb20_1.jpg"],
          imageFolder: "images/rb20/",
          inStock: true,
          limitedEdition: true,
          year: 2024,
          team: "Red Bull Racing",
          manufacturer: "Bburago",
          scale: "1:43",
          driver: "Max Verstappen"
        },
        {
          id: 4,
          name: "Red Bull RB18 Max Verstappen - Campeón 2022",
          description: "El monoplaza que conquistó el campeonato 2022 y comenzó la era de dominio de Verstappen.",
          categories: ["championship", "red-bull", "verstappen", "burago", "scale-1-43"],
          price: 84.99,
          originalPrice: 94.99,
          images: ["rb18_1.jpg"],
          imageFolder: "images/rb18/",
          inStock: true,
          limitedEdition: true,
          year: 2022,
          team: "Red Bull Racing",
          manufacturer: "Bburago",
          scale: "1:43",
          driver: "Max Verstappen"
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

  function handleNotifyAvailability(): void {
    if (!$product) return;

    const whatsappMessage = encodeURIComponent(
      `Hola! Me gustaría que me notifiquen cuando el producto "${$product.name}" esté disponible nuevamente.\n\n` +
      `Link del producto: ${window.location.href}`
    );

    const whatsappURL = `https://wa.me/${WHATSAPP_PHONE}?text=${whatsappMessage}`;
    window.open(whatsappURL, '_blank');
  }

  function handleImageError(e: Event) {
    const img = e.currentTarget as HTMLImageElement;
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyMEM4Ljk1NDMgMjAgMCAyOC45NTQzIDAgNDBIMTBDMTAgMzQuNDc3MSAxNC40NzcxIDMwIDE5IDMwSDIxQzI1LjUyMjkgMzAgMzAgMzQuNDc3MSAzMCA0MEg0MEMzMCAyOC45NTQzIDMxLjA0NTcgMjAgMjAgMjBaIiBmaWxsPSIjQzNDM0MzIi8+Cjwvc3ZnPgo=';
    img.classList.add('opacity-50');
  }

  function handleImageZoom(event: MouseEvent): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    imagePosition.set({ x, y });

    if ($zoomLevel === 1) {
      zoomLevel.set(2);
    } else {
      zoomLevel.set(1);
      imagePosition.set({ x: 50, y: 50 });
    }
  }

  function handleRelatedProductClick(productId: number): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    goto(`${base}/producto/${productId}`);
  }

  function handleRelatedAddToCart(event: CustomEvent): void {
    const { product } = event.detail;
    addToCart(product);
  }

  function handleRelatedViewDetails(event: CustomEvent): void {
    const { product } = event.detail;
    goto(`${base}/producto/${product.id}`);
  }

  async function handleCopyLink(): Promise<void> {
    try {
      const currentUrl = `${window.location.origin}${$page.url.pathname}`;
      await navigator.clipboard.writeText(currentUrl);

      toastNotification.set({
        message: 'Enlace copiado al portapapeles',
        type: 'success',
        visible: true
      });

      setTimeout(() => {
        toastNotification.update(toast => ({ ...toast, visible: false }));
      }, 3000);

    } catch (err) {
      console.error('Error al copiar el link:', err);

      try {
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);

        toastNotification.set({
          message: 'Enlace copiado al portapapeles',
          type: 'success',
          visible: true
        });

        setTimeout(() => {
          toastNotification.update(toast => ({ ...toast, visible: false }));
        }, 3000);

      } catch (fallbackErr) {
        toastNotification.set({
          message: 'No se pudo copiar el enlace',
          type: 'error',
          visible: true
        });

        setTimeout(() => {
          toastNotification.update(toast => ({ ...toast, visible: false }));
        }, 3000);
      }
    }
  }

  // Spec key display names
  const specLabels: Record<string, string> = {
    engine: 'Motor',
    power: 'Potencia',
    weight: 'Peso',
    topSpeed: 'Velocidad Máx.',
    acceleration: 'Aceleración'
  };

  onMount(() => {
    reloadCart();
    loadCategories();
    loadProduct();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<svelte:head>
  <title>{$product?.name || 'Producto'} - Fast Lane F1 Shop</title>
  <meta name="description" content={$product?.description || 'Descubre este increíble monoplaza de Fórmula 1'} />
  <meta property="og:title" content={$product?.name || 'Producto'} />
  <meta property="og:description" content={$product?.description || 'Descubre este increíble monoplaza de Fórmula 1'} />
  <meta property="og:image" content={$product ? getProductImageUrl($product, 0) : ''} />
  <meta property="og:url" content={$page.url.href} />
  <meta property="og:type" content="product" />
  
  {#if $product}
    <script type="application/ld+json">
      {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": "{$product.name}",
        "description": "{$product.description}",
        "image": "{getProductImageUrl($product, 0)}",
        "brand": {
          "@type": "Brand",
          "name": "{$product.manufacturer}"
        },
        "manufacturer": "{$product.manufacturer}",
        "model": "{$product.team}",
        "offers": {
          "@type": "Offer",
          "url": "{$page.url.href}",
          "priceCurrency": "GTQ",
          "price": "{$product.price}",
          "availability": "{$product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'}"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "127"
        },
        "sku": "{$product.id}",
        "productionDate": "{$product.year}",
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Scale",
            "value": "{$product.scale}"
          },
          {
            "@type": "PropertyValue",
            "name": "Team",
            "value": "{$product.team}"
          },
          {
            "@type": "PropertyValue",
            "name": "Driver",
            "value": "{$product.driver || 'N/A'}"
          }
        ]
      }
    </script>
  {/if}
</svelte:head>

{#if $isLoading}
  <!-- Loading State -->
  <div class="container mx-auto px-4 py-20 text-center" in:fade>
    <div class="flex justify-center items-center mb-8">
      <div class="w-16 h-16 bg-[#2a2a2a] animate-pulse"></div>
    </div>
    <h3 class="font-headline text-2xl font-semibold text-white mb-4 uppercase tracking-wider">
      Cargando detalles del monoplaza...
    </h3>
    <p class="text-surface-300">Preparando la experiencia premium para ti</p>
  </div>
{:else if $product}
  <!-- Breadcrumb -->
  <section class="bg-[#1c1b1b]">
    <div class="container mx-auto px-4 py-4">
      <nav>
        <ol class="flex items-center gap-2 text-sm">
          <li>
            <a
              href="{base || '/'}"
              class="text-surface-400 hover:text-primary-500 transition-colors duration-200 font-medium"
            >
              Inicio
            </a>
          </li>
          <li class="text-surface-600">
            <LucideChevronRight class="w-3.5 h-3.5" />
          </li>
          <li>
            <a
              href={`${base}/categoria/${$product.team.toLowerCase().replace(/\s+/g, '-')}`}
              class="text-surface-400 hover:text-primary-500 transition-colors duration-200 font-medium"
            >
              {$product.team}
            </a>
          </li>
          <li class="text-surface-600">
            <LucideChevronRight class="w-3.5 h-3.5" />
          </li>
          <li class="text-white font-semibold truncate max-w-[200px]">
            {$product.name}
          </li>
        </ol>
      </nav>
    </div>
  </section>

  <!-- Product Detail Section -->
  <section class="bg-surface-900">
    <div class="container mx-auto px-4 py-6 lg:py-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12" in:fade={{ duration: 400 }}>

        <!-- Product Images -->
        <div class="space-y-4">
          <!-- Main Image -->
          <div class="relative bg-[#1c1b1b] overflow-hidden aspect-square group">
            <img
              src={getProductImageUrl($product, $selectedImageIndex)}
              alt={$product.name}
              class="w-full h-full object-cover transition-all duration-300 cursor-zoom-in select-none"
              style="transform: scale({$zoomLevel}); transform-origin: {$imagePosition.x}% {$imagePosition.y}%;"
              on:click={handleImageZoom}
              on:error={handleImageError}
              draggable="false"
            />

            <!-- Image Controls -->
            <div class="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                class="w-9 h-9 bg-[#131313]/70 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#131313] transition-colors"
                on:click|stopPropagation={() => {
                  if ($zoomLevel === 1) {
                    zoomLevel.set(2);
                  } else {
                    zoomLevel.set(1);
                    imagePosition.set({ x: 50, y: 50 });
                  }
                }}
                title="Zoom"
              >
                <LucideZoomIn class="w-4 h-4" />
              </button>
            </div>

            <!-- Limited Edition Badge -->
            {#if $product.limitedEdition}
              <div class="absolute top-3 left-3">
                <span class="chip-lap-timer bg-primary-500 text-white inline-flex items-center gap-1 shadow-lg">
                  <LucideStar class="w-3 h-3" />
                  Edición Limitada
                </span>
              </div>
            {/if}

            <!-- Stock Status -->
            <div class="absolute bottom-3 left-3">
              <span class="chip-lap-timer inline-flex items-center gap-1 shadow-lg
                {$product.inStock ? 'bg-success-600 text-white' : 'bg-[#2a2a2a] text-surface-300'}">
                {#if $product.inStock}
                  <LucideCheck class="w-3 h-3" />
                  En Stock
                {:else}
                  <LucideClose class="w-3 h-3" />
                  Agotado
                {/if}
              </span>
            </div>
          </div>

          <!-- Thumbnail Images -->
          <div class="flex gap-3 overflow-x-auto pb-2">
            {#each $product.images as image, index}
              <button
                class="flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 bg-[#1c1b1b] overflow-hidden border-2 transition-all duration-200
                  {$selectedImageIndex === index ? 'border-primary-500' : 'border-[#2a2a2a] hover:border-surface-400'}"
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

          <!-- MOBILE: Name + Price + CTA first (visible only on mobile) -->
          <div class="lg:hidden" bind:this={ctaSectionEl}>
            <!-- Product Name -->
            <h1 class="text-2xl font-black font-headline uppercase tracking-[0.08em] text-white mb-3 leading-tight">
              {$product.name}
            </h1>

            <!-- Compact meta line -->
            <div class="flex flex-wrap items-center gap-2 text-xs text-surface-400 font-headline uppercase tracking-[0.1em] mb-4">
              <span>{$product.team}</span>
              <span class="w-px h-3 bg-surface-600"></span>
              <span>{$product.scale}</span>
              <span class="w-px h-3 bg-surface-600"></span>
              <span>{$product.manufacturer}</span>
              {#if $product.driver}
                <span class="w-px h-3 bg-surface-600"></span>
                <span>{$product.driver}</span>
              {/if}
              <span class="w-px h-3 bg-surface-600"></span>
              <span>{$product.year}</span>
            </div>

            <!-- Price -->
            <div class="flex items-baseline gap-3 mb-5">
              <span class="text-3xl font-headline font-black text-primary-500">
                Q. {$product.price.toFixed(2)}
              </span>
              {#if $product.originalPrice && $product.originalPrice > $product.price}
                <span class="text-lg text-surface-500 line-through">
                  Q. {$product.originalPrice.toFixed(2)}
                </span>
                <span class="chip-lap-timer bg-primary-500/20 text-primary-400">
                  -{Math.round((1 - $product.price / $product.originalPrice) * 100)}%
                </span>
              {/if}
            </div>

            <!-- Mobile CTA Button -->
            <button
              class="w-full inline-flex items-center justify-center gap-2 btn-kinetic py-3.5"
              on:click={() => $product.inStock ? handleAddToCart($product) : handleNotifyAvailability()}
            >
              {#if $product.inStock}
                <LucideCartPlus class="w-5 h-5" />
                Añadir al Carrito
              {:else}
                <LucideClock class="w-5 h-5" />
                Notificarme Disponibilidad
              {/if}
            </button>

            <!-- Trust signals -->
            <div class="flex items-center justify-center gap-4 mt-3 text-xs text-surface-400">
              <span class="flex items-center gap-1">
                <LucideTruck class="w-3.5 h-3.5" />
                Envío GT
              </span>
              <span class="w-px h-3 bg-surface-700"></span>
              <span class="flex items-center gap-1">
                <LucideShield class="w-3.5 h-3.5" />
                Garantía
              </span>
              <span class="w-px h-3 bg-surface-700"></span>
              <span class="flex items-center gap-1">
                <LucideLock class="w-3.5 h-3.5" />
                Compra segura
              </span>
            </div>
          </div>

          <!-- DESKTOP: Full product info (hidden on mobile, shown on lg+) -->
          <div class="hidden lg:block">
            <!-- Category badges -->
            <div class="flex flex-wrap gap-2 mb-4">
              {#each $currentCategories as category}
                <span class="badge {category.variant} text-sm font-medium">
                  {category.name}
                </span>
              {/each}
            </div>

            <!-- Product detail badges — Lap Timer chips -->
            <div class="flex flex-wrap gap-2 mb-6">
              <span class="chip-lap-timer bg-[#1c1b1b] text-surface-200 inline-flex items-center gap-1">
                <LucideHelmet class="w-3 h-3 text-primary-500" />
                {$product.team}
              </span>
              <span class="chip-lap-timer bg-[#1c1b1b] text-surface-200">
                {$product.manufacturer}
              </span>
              <span class="chip-lap-timer bg-[#1c1b1b] text-surface-200">
                Escala {$product.scale}
              </span>
              {#if $product.driver}
                <span class="chip-lap-timer bg-[#1c1b1b] text-surface-200">
                  {$product.driver}
                </span>
              {/if}
              <span class="chip-lap-timer bg-[#1c1b1b] text-surface-200">
                {$product.year}
              </span>
            </div>

            <h1 class="text-4xl font-black font-headline uppercase tracking-[0.08em] text-white mb-6 leading-tight">
              {$product.name}
            </h1>

            <!-- Price — Headline font -->
            <div class="flex items-baseline gap-4 mb-6">
              <span class="text-4xl font-headline font-black text-primary-500">
                Q. {$product.price.toFixed(2)}
              </span>
              {#if $product.originalPrice && $product.originalPrice > $product.price}
                <span class="text-xl text-surface-500 line-through">
                  Q. {$product.originalPrice.toFixed(2)}
                </span>
                <span class="chip-lap-timer bg-primary-500/20 text-primary-400">
                  -{Math.round((1 - $product.price / $product.originalPrice) * 100)}%
                </span>
              {/if}
            </div>
          </div>

          <!-- Description (both mobile and desktop) -->
          <div>
            <p class="text-surface-300 leading-relaxed text-base lg:text-lg">
              {$product.description}
            </p>
          </div>

          <!-- Key Features -->
          {#if $product.features && $product.features.length > 0}
            <div>
              <h3 class="font-headline text-sm font-bold text-white uppercase tracking-[0.1em] mb-4 flex items-center gap-2">
                <LucideCog class="w-4 h-4 text-primary-500" />
                Características
              </h3>
              <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {#each $product.features as feature}
                  <li class="flex items-center gap-2.5 p-3 bg-[#1c1b1b]">
                    <LucideCheck class="text-primary-500 w-4 h-4 flex-shrink-0" />
                    <span class="text-surface-200 text-sm">{feature}</span>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}

          <!-- Mobile: Category badges (after features) -->
          <div class="lg:hidden">
            <div class="flex flex-wrap gap-2">
              {#each $currentCategories as category}
                <span class="badge {category.variant} text-xs font-medium">
                  {category.name}
                </span>
              {/each}
            </div>
          </div>

          <!-- Desktop: Add to Cart Section -->
          <div class="hidden lg:block">
            <div class="bg-[#1c1b1b] p-6">
              <div class="flex items-center justify-between mb-5">
                <div>
                  <h3 class="font-headline text-sm font-bold text-white uppercase tracking-[0.1em] mb-1.5">
                    Añadir a tu colección
                  </h3>
                  <div class="flex items-center gap-4 text-xs text-surface-400">
                    <span class="flex items-center gap-1">
                      <LucideTruck class="w-3.5 h-3.5" />
                      Envíos a toda Guatemala
                    </span>
                    <span class="flex items-center gap-1">
                      <LucideShield class="w-3.5 h-3.5" />
                      Garantía premium
                    </span>
                  </div>
                </div>
              </div>

              <button
                class="w-full inline-flex items-center justify-center gap-2 btn-kinetic py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                on:click={() => $product.inStock ? handleAddToCart($product) : handleNotifyAvailability()}
                disabled={false}
              >
                {#if $product.inStock}
                  <LucideCartPlus class="w-5 h-5" />
                  Añadir al Carrito — Q. {$product.price.toFixed(2)}
                {:else}
                  <LucideClock class="w-5 h-5" />
                  Notificarme cuando esté disponible
                {/if}
              </button>

              <div class="flex items-center justify-center mt-4 gap-4 text-xs text-surface-400">
                <span class="flex items-center gap-1">
                  <LucideLock class="w-3.5 h-3.5" />
                  Compra segura
                </span>
                <span class="w-px h-3 bg-surface-700"></span>
                <span class="flex items-center gap-1">
                  <LucideCreditCard class="w-3.5 h-3.5" />
                  Pago fácil
                </span>
              </div>
            </div>
          </div>

          <!-- Share Section -->
          <div class="flex items-center justify-between pt-4 bg-[#1c1b1b] -mx-0 px-4 py-4 mt-4">
            <span class="text-surface-400 text-sm font-headline font-medium uppercase tracking-[0.1em]">Compartir</span>
            <div class="flex gap-2">
              <button
                class="w-9 h-9 bg-[#2a2a2a] flex items-center justify-center text-surface-300 hover:text-white hover:bg-[#353534] transition-all duration-200"
                on:click={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: $product.name,
                      text: $product.description,
                      url: window.location.href
                    });
                  } else {
                    handleCopyLink();
                  }
                }}
                title="Compartir"
              >
                <LucideShare class="w-4 h-4" />
              </button>
              <button
                class="w-9 h-9 bg-[#2a2a2a] flex items-center justify-center text-surface-300 hover:text-white hover:bg-[#353534] transition-all duration-200"
                on:click={handleCopyLink}
                title="Copiar enlace"
              >
                <LucideLink class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Technical Specifications -->
  {#if $product.specifications}
    <section class="bg-[#1c1b1b]">
      <div class="container mx-auto px-4 py-12 lg:py-16 max-w-4xl">
        <div class="text-center mb-10">
          <h2 class="font-headline text-2xl lg:text-3xl font-bold text-white uppercase tracking-[0.1em] mb-3">
            Especificaciones Técnicas
          </h2>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {#each Object.entries($product.specifications) as [key, value]}
            <div class="bg-[#131313] p-5 text-center hover:bg-[#0e0e0e] transition-colors duration-200">
              <div class="w-12 h-12 bg-[#2a2a2a] flex items-center justify-center mx-auto mb-3">
                {#if key === 'engine'}
                  <LucideEngine class="w-6 h-6 text-primary-500" />
                {:else if key === 'power'}
                  <LucideBolt class="w-6 h-6 text-primary-500" />
                {:else if key === 'weight'}
                  <LucideWeight class="w-6 h-6 text-primary-500" />
                {:else if key === 'topSpeed'}
                  <LucideGauge class="w-6 h-6 text-primary-500" />
                {:else}
                  <LucideTimer class="w-6 h-6 text-primary-500" />
                {/if}
              </div>
              <h3 class="font-headline text-xs font-bold text-surface-400 uppercase tracking-[0.15em] mb-1.5">
                {specLabels[key] || key.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <p class="font-headline text-sm lg:text-base font-bold text-white leading-snug">
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
    <section class="bg-[#131313]">
      <div class="container mx-auto px-4 py-12 lg:py-16">
        <div class="text-center mb-10">
          <h2 class="font-headline text-2xl lg:text-3xl font-bold text-white uppercase tracking-[0.1em] mb-4">
            Productos Relacionados
          </h2>
          <p class="text-surface-400 text-sm max-w-md mx-auto">
            Otros monoplazas que podrían interesarte
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {#each $relatedProducts as relatedProduct, i}
            <ProductCard
              product={relatedProduct}
              index={i}
              animationDelay={100}
              onCardClick={handleRelatedProductClick}
              variant="default"
              showFullDescription={false}
              on:addToCart={handleRelatedAddToCart}
              on:viewDetails={handleRelatedViewDetails}
            />
          {/each}
        </div>

        <!-- CTA -->
        <div class="text-center mt-12">
          <a
            href="{base}/catalogo"
            class="inline-flex items-center gap-2 btn-kinetic px-8 py-3.5"
          >
            <LucideEye class="w-5 h-5" />
            Ver Toda la Colección
          </a>
        </div>
      </div>
    </section>
  {/if}

  <!-- Sticky Mobile Bottom Bar -->
  {#if showStickyBar && $product}
    <div
      class="fixed bottom-0 left-0 right-0 z-40 lg:hidden glass-nav px-4 py-3 safe-area-bottom"
      in:fly={{ y: 60, duration: 250 }}
      out:fly={{ y: 60, duration: 200 }}
    >
      <div class="flex items-center gap-3">
        <div class="flex-1 min-w-0">
          <div class="text-xs text-surface-300 truncate font-headline uppercase tracking-wider">{$product.name}</div>
          <div class="text-lg font-headline font-black text-primary-500">Q. {$product.price.toFixed(2)}</div>
        </div>
        <button
          class="flex-shrink-0 inline-flex items-center gap-2 btn-kinetic px-6 py-3 text-sm"
          on:click={() => $product.inStock ? handleAddToCart($product) : handleNotifyAvailability()}
        >
          {#if $product.inStock}
            <LucideCartPlus class="w-4 h-4" />
            Añadir
          {:else}
            <LucideClock class="w-4 h-4" />
            Notificar
          {/if}
        </button>
      </div>
    </div>
  {/if}
{:else}
  <!-- Product Not Found -->
  <div class="container mx-auto px-4 py-20 text-center" in:fade>
    <div class="max-w-md mx-auto">
      <div class="w-20 h-20 bg-[#2a2a2a] flex items-center justify-center mx-auto mb-8">
        <LucideF1 class="w-10 h-10 text-surface-400" />
      </div>
      <h2 class="font-headline text-2xl font-bold text-white uppercase tracking-[0.1em] mb-6">
        Producto no encontrado
      </h2>
      <p class="text-surface-400 mb-8 leading-relaxed">
        El monoplaza que buscas no está disponible o ha sido movido a otra ubicación.
      </p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href="{base || '/'}"
          class="inline-flex items-center justify-center gap-2 bg-primary-500 text-white font-bold px-6 py-3 uppercase tracking-wider rounded-lg hover:bg-primary-600 transition-colors duration-200"
        >
          <LucideHome class="w-4 h-4" />
          Volver al Inicio
        </a>
        <button
          class="inline-flex items-center justify-center gap-2 text-surface-300 hover:text-white font-medium text-sm uppercase tracking-wider transition-colors duration-200"
          on:click={() => history.back()}
        >
          <LucideArrowLeft class="w-4 h-4" />
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

  .cursor-zoom-out {
    cursor: zoom-out;
  }

  .cursor-move {
    cursor: move;
  }

  .select-none {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  :global(body.modal-open) {
    overflow: hidden !important;
  }

  .zoom-transition {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .floating-controls {
    backdrop-filter: blur(8px);
    background: rgba(255, 255, 255, 0.1);
  }

  /* Safe area for devices with home indicator */
  .safe-area-bottom {
    padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
  }
</style>