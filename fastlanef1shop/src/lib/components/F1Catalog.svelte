<script lang="ts">
  import { onMount } from 'svelte';
  import { writable, derived } from 'svelte/store';
  import { fade, fly } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
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
  import {
    categories,
    loadCategories,
    getTeamCategories,
    getManufacturerCategories,
    getScaleCategories,
    getCategoriesByType,
    type Category
  } from '../stores/categories';

  import ProductCard from './ProductCard.svelte';

  // Importar iconos
  import LucideMagnify from '~icons/lucide/search';
  import LucideClose from '~icons/lucide/x';
  import LucideGrid from '~icons/lucide/grid-3x3';
  import LucideTrophy from '~icons/lucide/trophy';
  import LucideStar from '~icons/lucide/star';
  import LucideZap from '~icons/lucide/zap';
  import LucideHeart from '~icons/lucide/heart';
  import LucideRocket from '~icons/lucide/rocket';
  import LucideShield from '~icons/lucide/shield';
  import LucideMountain from '~icons/lucide/mountain';
  import LucideFactory from '~icons/lucide/factory';
  import LucideGem from '~icons/lucide/gem';
  import LucideSparkles from '~icons/lucide/sparkles';
  import LucideCrown from '~icons/lucide/crown';
  import LucideRuler from '~icons/lucide/ruler';
  import LucideMaximize from '~icons/lucide/maximize';
  import LucideMinimize from '~icons/lucide/minimize';
  import LucideMaximize2 from '~icons/lucide/maximize-2';
  import LucideUser from '~icons/lucide/user';
  import LucidePackage from '~icons/lucide/package';
  import LucideTruck from '~icons/lucide/truck';
  import LucideFilter from '~icons/lucide/sliders-horizontal';

  // Component stores
  export const products = writable<Product[]>([]);
  const selectedCategories = writable<string[]>(['all']);
  const isFilterDrawerOpen = writable<boolean>(false);
  const isLoading = writable<boolean>(true);
  const searchQuery = writable<string>('');
  const activeFilterType = writable<'general' | 'team' | 'manufacturer' | 'scale'>('general');
  const categoriesLoaded = writable<boolean>(false);

  const GITHUB_REPO_URL = 'https://raw.githubusercontent.com/Allenrovas/Datos_Catalogo/main';

  const iconMap: Record<string, any> = {
    'lucide:grid-3x3': LucideGrid,
    'lucide:trophy': LucideTrophy,
    'lucide:star': LucideStar,
    'lucide:zap': LucideZap,
    'lucide:heart': LucideHeart,
    'lucide:rocket': LucideRocket,
    'lucide:shield': LucideShield,
    'lucide:mountain': LucideMountain,
    'lucide:factory': LucideFactory,
    'lucide:gem': LucideGem,
    'lucide:sparkles': LucideSparkles,
    'lucide:crown': LucideCrown,
    'lucide:ruler': LucideRuler,
    'lucide:maximize': LucideMaximize,
    'lucide:minimize': LucideMinimize,
    'lucide:maximize-2': LucideMaximize2,
    'lucide:user': LucideUser
  };

  const currentCategories = derived(
    [categories, activeFilterType, categoriesLoaded],
    ([$categories, $activeFilterType, $categoriesLoaded]) => {
      if (!$categoriesLoaded || !$categories.length) return [];
      return getCategoriesByType($activeFilterType);
    }
  );

  const activeFilterCount = derived(
    [selectedCategories, searchQuery],
    ([$selectedCategories, $searchQuery]) => {
      let count = 0;
      if (!$selectedCategories.includes('all')) count += $selectedCategories.length;
      if ($searchQuery.trim()) count += 1;
      return count;
    }
  );

  export const filteredProducts = derived(
    [products, selectedCategories, searchQuery],
    ([$products, $selectedCategories, $searchQuery]) => {
      let filtered = $products;

      if (!$selectedCategories.includes('all')) {
        filtered = $products.filter(p =>
          p.categories.some(cat => $selectedCategories.includes(cat))
        );
      }

      if ($searchQuery.trim()) {
        const query = $searchQuery.toLowerCase();
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.team.toLowerCase().includes(query) ||
          p.manufacturer.toLowerCase().includes(query) ||
          p.scale.toLowerCase().includes(query) ||
          (p.driver && p.driver.toLowerCase().includes(query))
        );
      }

      return filtered.sort((a, b) => {
        if (a.inStock === b.inStock) return 0;
        return a.inStock ? -1 : 1;
      });
    }
  );

  async function loadProducts(): Promise<void> {
    try {
      isLoading.set(true);
      const response = await fetch(`${GITHUB_REPO_URL}/data/products.json`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: Product[] = await response.json();
      products.set(data);
    } catch (error) {
      console.error('Error loading products:', error);
      const mockProducts: Product[] = [
        {
          id: 1, name: "Red Bull RB19 Max Verstappen",
          description: "El monoplaza dominador de la temporada 2023, pilotado por Max Verstappen hacia su tercer título mundial consecutivo.",
          categories: ["championship", "red-bull", "verstappen", "burago", "scale-1-43"],
          price: 89.99, originalPrice: 99.99,
          images: ["rb19_1.jpg", "rb19_2.jpg", "rb19_3.jpg"], imageFolder: "images/rb19/",
          specifications: { engine: "Honda RBPT V6 Turbo", power: "1050+ HP", weight: "798 kg", topSpeed: "370 km/h", acceleration: "0-100 km/h en 2.3s" },
          features: ["Aerodinámica revolucionaria", "Sistema híbrido avanzado", "Chasis de fibra de carbono"],
          inStock: true, limitedEdition: true, year: 2023, team: "Red Bull Racing", manufacturer: "Bburago", scale: "1:43", driver: "Max Verstappen"
        },
        {
          id: 2, name: "Ferrari SF-23 Charles Leclerc",
          description: "La máquina roja de Maranello con el corazón palpitante de la Scuderia Ferrari.",
          categories: ["ferrari", "leclerc", "minichamps", "scale-1-43"],
          price: 79.99, images: ["sf23_1.jpg", "sf23_2.jpg"], imageFolder: "images/sf23/",
          inStock: true, limitedEdition: false, year: 2023, team: "Scuderia Ferrari", manufacturer: "Minichamps", scale: "1:43", driver: "Charles Leclerc"
        },
        {
          id: 3, name: "Mercedes W14 Lewis Hamilton",
          description: "La flecha plateada de Mercedes-AMG Petronas, buscando recuperar su supremacía.",
          categories: ["mercedes", "hamilton", "spark", "scale-1-18"],
          price: 149.99, images: ["w14_1.jpg", "w14_2.jpg", "w14_3.jpg"], imageFolder: "images/w14/",
          inStock: true, limitedEdition: false, year: 2023, team: "Mercedes-AMG Petronas", manufacturer: "Spark Model", scale: "1:18", driver: "Lewis Hamilton"
        },
        {
          id: 4, name: "McLaren MCL60 Lando Norris",
          description: "El papaya speed de McLaren Racing con tecnología de vanguardia británica.",
          categories: ["mclaren", "burago", "scale-1-43", "limited"],
          price: 69.99, originalPrice: 79.99, images: ["mcl60_1.jpg"], imageFolder: "images/mcl60/",
          inStock: true, limitedEdition: true, year: 2023, team: "McLaren F1 Team", manufacturer: "Bburago", scale: "1:43", driver: "Lando Norris"
        },
        {
          id: 5, name: "Aston Martin AMR23 Fernando Alonso",
          description: "El verde británico de Aston Martin con elegancia y velocidad suprema.",
          categories: ["aston-martin", "amalgam", "scale-1-8", "limited"],
          price: 899.99, images: ["amr23_1.jpg", "amr23_2.jpg"], imageFolder: "images/amr23/",
          inStock: false, limitedEdition: true, year: 2023, team: "Aston Martin Aramco", manufacturer: "Amalgam Collection", scale: "1:8", driver: "Fernando Alonso"
        },
        {
          id: 6, name: "Alpine A523 Pierre Gasly",
          description: "El espíritu francés de Alpine con ingeniería de precisión y pasión competitiva.",
          categories: ["alpine", "spark", "scale-1-43"],
          price: 62.99, images: ["a523_1.jpg"], imageFolder: "images/a523/",
          inStock: true, limitedEdition: false, year: 2023, team: "BWT Alpine F1 Team", manufacturer: "Spark Model", scale: "1:43", driver: "Pierre Gasly"
        }
      ];
      products.set(mockProducts);
    } finally {
      isLoading.set(false);
    }
  }

  function handleProductClick(productId: number): void {
    goto(`${base}/producto/${productId}`);
  }

  function handleAddToCart(event: CustomEvent): void {
    const { product } = event.detail;
    addToCart(product);
  }

  function handleViewDetails(event: CustomEvent): void {
    const { product } = event.detail;
    goto(`${base}/producto/${product.id}`);
  }

  function toggleCategory(categoryId: string): void {
    selectedCategories.update(current => {
      if (categoryId === 'all') return ['all'];
      const filtered = current.filter(id => id !== 'all');
      if (filtered.includes(categoryId)) {
        const newSelection = filtered.filter(id => id !== categoryId);
        return newSelection.length === 0 ? ['all'] : newSelection;
      } else {
        return [...filtered, categoryId];
      }
    });
  }

  function getIconComponent(iconName: string) {
    return iconMap[iconName] || LucideGrid;
  }

  const categoryProductCounts = derived(
    products,
    ($products) => {
      return (categoryId: string): number => {
        if (categoryId === 'all') return $products.length;
        return $products.filter(p => p.categories.includes(categoryId)).length;
      };
    }
  );

  async function initializeApp() {
    try {
      reloadCart();
      await loadCategories();
      categoriesLoaded.set(true);
      await loadProducts();
    } catch (error) {
      console.error('Error initializing app:', error);
      categoriesLoaded.set(true);
    }
  }

  onMount(() => {
    initializeApp();
  });
</script>

<!-- Search and Filter Section -->
<section id="catalogo" class="container mx-auto px-4 py-12">
  <div class="max-w-6xl mx-auto">
    <!-- Search Bar -->
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-white mb-4">
        Encuentra tu Monoplaza Perfecto
      </h2>
      <div class="flex items-center gap-3 max-w-md mx-auto">
        <div class="relative flex-1">
          <input
            type="text"
            placeholder="Buscar por nombre, equipo, marca, escala..."
            class="input w-full pl-12 pr-4 py-3 text-lg rounded-lg bg-surface-800 border-2 border-surface-600 text-white placeholder-surface-500 focus:border-primary-500 transition-all duration-300"
            bind:value={$searchQuery}
          />
          <LucideMagnify class="absolute left-4 top-1/2 transform -translate-y-1/2 text-surface-300 w-5 h-5" />
          {#if $searchQuery}
            <button
              class="absolute right-3 top-1/2 transform -translate-y-1/2 btn btn-sm variant-ghost-surface rounded-full w-8 h-8 !p-0"
              on:click={() => searchQuery.set('')}
            >
              <LucideClose class="w-4 h-4" />
            </button>
          {/if}
        </div>
        <!-- Mobile Filter Button -->
        <button
          class="lg:hidden btn bg-surface-800 text-white border border-surface-600 hover:border-primary-500 px-4 py-3 rounded-lg flex items-center gap-2 relative"
          on:click={() => isFilterDrawerOpen.set(true)}
        >
          <LucideFilter class="w-5 h-5" />
          <span class="text-sm font-medium">Filtros</span>
          {#if $activeFilterCount > 0}
            <span class="absolute -top-2 -right-2 bg-primary-500 text-white text-xs font-bold rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1">
              {$activeFilterCount}
            </span>
          {/if}
        </button>
      </div>

      <!-- Mobile Active Filters Summary -->
      {#if !$selectedCategories.includes('all') && $selectedCategories.length > 0}
        <div class="lg:hidden mt-3 flex flex-wrap gap-2 justify-center items-center max-w-md mx-auto">
          {#each $selectedCategories as catId}
            {@const category = $categories.find(c => c.id === catId)}
            {#if category}
              <span class="badge bg-primary-500 text-white text-xs">
                {category.name}
                <button class="ml-1" on:click={() => toggleCategory(catId)}>
                  <LucideClose class="w-3 h-3" />
                </button>
              </span>
            {/if}
          {/each}
        </div>
      {/if}
    </div>

    <!-- Desktop Filter Type Tabs -->
    <div class="hidden lg:flex justify-center mb-6">
      <div class="flex bg-surface-800 p-1 rounded-lg">
        {#each [
          { type: 'general', label: 'General' },
          { type: 'team', label: 'Equipos' },
          { type: 'manufacturer', label: 'Marcas' },
          { type: 'scale', label: 'Escalas' }
        ] as tab}
          <button
            class="px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium {$activeFilterType === tab.type ? 'bg-primary-500 text-white' : 'text-surface-200 hover:text-white'}"
            on:click={() => activeFilterType.set(tab.type)}
          >
            {tab.label}
          </button>
        {/each}
      </div>
    </div>

    <!-- Desktop Category Filter Pills -->
    <div class="hidden lg:block">
      {#if $categoriesLoaded && $currentCategories.length > 0}
        <div class="text-center mb-6">
          <p class="text-surface-200 mb-4 text-sm">
            {#if $activeFilterType === 'general'}
              Explora por categorías generales
            {:else if $activeFilterType === 'team'}
              Filtra por escudería favorita
            {:else if $activeFilterType === 'manufacturer'}
              Descubre por fabricante
            {:else if $activeFilterType === 'scale'}
              Encuentra tu escala ideal
            {/if}
          </p>

          <div class="flex flex-wrap gap-2 justify-center">
            {#each $currentCategories as category, i}
              {@const IconComponent = getIconComponent(category.icon)}
              <button
                class="btn rounded-lg transition-all duration-200 font-medium px-4 py-2 text-sm
                {$selectedCategories.includes(category.id)
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-surface-800 text-surface-300 border border-surface-700 hover:border-primary-500/50 hover:text-white'}"
                on:click={() => toggleCategory(category.id)}
                in:fly={{ x: -30, duration: 300, delay: i * 50 }}
              >
                <span class="flex items-center gap-1.5">
                  {#if category.type === 'team' && category.imagePath}
                    <img
                      src={category.imagePath}
                      alt={category.name}
                      class="w-3.5 h-3.5 brightness-0 invert"
                    />
                  {:else}
                    <svelte:component
                      this={IconComponent}
                      class="w-3.5 h-3.5"
                    />
                  {/if}

                  <span>{category.name}</span>
                  {#if category.id !== 'all'}
                    <span class="text-xs opacity-70">
                      ({$categoryProductCounts(category.id)})
                    </span>
                  {/if}
                </span>
              </button>
            {/each}
          </div>

          <!-- Selected Categories Display -->
          {#if !$selectedCategories.includes('all') && $selectedCategories.length > 0}
            <div class="mt-4 flex flex-wrap gap-2 justify-center items-center">
              <span class="text-sm text-surface-300">Filtros activos:</span>
              {#each $selectedCategories as catId}
                {@const category = $categories.find(c => c.id === catId)}
                {#if category}
                  <span class="badge bg-primary-500 text-white text-xs">
                    {category.name}
                    <button class="ml-1" on:click={() => toggleCategory(catId)}>
                      <LucideClose class="w-3 h-3" />
                    </button>
                  </span>
                {/if}
              {/each}
              <button
                class="text-xs text-primary-500 hover:text-primary-400 transition-colors"
                on:click={() => selectedCategories.set(['all'])}
              >
                Limpiar todos
              </button>
            </div>
          {/if}
        </div>
      {:else if !$categoriesLoaded}
        <div class="text-center mb-6">
          <p class="text-surface-300 mb-4 text-sm">Cargando categorías...</p>
          <div class="flex flex-wrap gap-2 justify-center">
            {#each Array(6) as _, i}
              <div class="animate-pulse">
                <div class="h-9 bg-surface-800 rounded-lg w-24"></div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
</section>

<!-- Mobile Filter Drawer -->
{#if $isFilterDrawerOpen}
  <div class="fixed inset-0 z-50 lg:hidden" transition:fade={{ duration: 200 }}>
    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" on:click={() => isFilterDrawerOpen.set(false)}></div>
    <div
      class="absolute right-0 top-0 h-full w-full max-w-sm bg-surface-800 shadow-2xl border-l border-surface-700 flex flex-col"
      transition:fly={{ x: 300, duration: 300 }}
    >
      <!-- Drawer Header -->
      <div class="p-5 border-b border-surface-700 bg-surface-900 flex items-center justify-between">
        <h3 class="text-xl font-bold text-white flex items-center gap-2">
          <LucideFilter class="w-5 h-5 text-primary-500" />
          Filtros
        </h3>
        <button
          class="btn btn-sm variant-ghost-surface"
          on:click={() => isFilterDrawerOpen.set(false)}
        >
          <LucideClose class="w-5 h-5" />
        </button>
      </div>

      <!-- Drawer Body -->
      <div class="flex-1 overflow-y-auto p-5 space-y-6">
        <!-- Filter Type Tabs (grid 2x2) -->
        <div>
          <p class="text-surface-200 text-sm mb-3 font-medium">Tipo de filtro</p>
          <div class="grid grid-cols-2 gap-2">
            {#each [
              { type: 'general', label: 'General' },
              { type: 'team', label: 'Equipos' },
              { type: 'manufacturer', label: 'Marcas' },
              { type: 'scale', label: 'Escalas' }
            ] as tab}
              <button
                class="px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium text-center {$activeFilterType === tab.type ? 'bg-primary-500 text-white shadow-lg' : 'bg-surface-700 text-surface-300 border border-surface-600 hover:border-primary-500/50'}"
                on:click={() => activeFilterType.set(tab.type)}
              >
                {tab.label}
              </button>
            {/each}
          </div>
        </div>

        <!-- Categories List -->
        {#if $categoriesLoaded && $currentCategories.length > 0}
          <div>
            <p class="text-surface-200 text-sm mb-3 font-medium">
              {#if $activeFilterType === 'general'}
                Categorías generales
              {:else if $activeFilterType === 'team'}
                Escuderías
              {:else if $activeFilterType === 'manufacturer'}
                Fabricantes
              {:else if $activeFilterType === 'scale'}
                Escalas
              {/if}
            </p>
            <div class="space-y-1">
              {#each $currentCategories as category}
                {@const IconComponent = getIconComponent(category.icon)}
                <button
                  class="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 text-left
                  {$selectedCategories.includes(category.id)
                    ? 'bg-primary-500 text-white'
                    : 'bg-surface-700/50 text-surface-300 hover:bg-surface-700'}"
                  on:click={() => toggleCategory(category.id)}
                >
                  <span class="flex items-center gap-2">
                    {#if category.type === 'team' && category.imagePath}
                      <img
                        src={category.imagePath}
                        alt={category.name}
                        class="w-4 h-4 brightness-0 invert"
                      />
                    {:else}
                      <svelte:component
                        this={IconComponent}
                        class="w-4 h-4"
                      />
                    {/if}
                    <span class="text-sm font-medium">{category.name}</span>
                  </span>
                  <span class="flex items-center gap-2">
                    {#if category.id !== 'all'}
                      <span class="text-xs opacity-70">
                        {$categoryProductCounts(category.id)}
                      </span>
                    {/if}
                    {#if $selectedCategories.includes(category.id)}
                      <div class="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                      </div>
                    {/if}
                  </span>
                </button>
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <!-- Drawer Footer -->
      <div class="p-5 border-t border-surface-700 bg-surface-900 space-y-3">
        <button
          class="btn bg-primary-500 text-white w-full font-semibold py-3 uppercase tracking-wider hover:bg-primary-600 transition-colors duration-200"
          on:click={() => isFilterDrawerOpen.set(false)}
        >
          Ver {$filteredProducts.length} Resultados
        </button>
        {#if !$selectedCategories.includes('all')}
          <button
            class="btn variant-ghost-surface w-full text-sm"
            on:click={() => { selectedCategories.set(['all']); activeFilterType.set('general'); }}
          >
            Limpiar Filtros
          </button>
        {/if}
      </div>
    </div>
  </div>
{/if}

<!-- Loading State -->
{#if $isLoading}
  <div class="container mx-auto px-4 py-16 text-center" in:fade>
    <div class="flex justify-center items-center gap-3 mb-6">
      <div class="w-3 h-3 rounded-full bg-primary-500 animate-pulse"></div>
      <div class="w-3 h-3 rounded-full bg-primary-500 animate-pulse" style="animation-delay: 0.2s"></div>
      <div class="w-3 h-3 rounded-full bg-primary-500 animate-pulse" style="animation-delay: 0.4s"></div>
    </div>
    <p class="text-lg text-surface-300 font-medium">
      Cargando monoplazas legendarios...
    </p>
  </div>
{/if}

<!-- Products Grid -->
{#if !$isLoading}
  <section id="products-section" class="px-4 py-4">
    <div class="container mx-auto max-w-screen-2xl">
      {#if $filteredProducts.length === 0}
        <div class="text-center py-20" in:fade>
          <div class="text-6xl mb-6 text-surface-700 font-bold font-racing">F1</div>
          <h3 class="text-2xl font-bold mb-4 text-white">
            {$searchQuery ? 'No encontramos resultados' : 'No hay productos disponibles'}
          </h3>
          <p class="text-surface-200 mb-8 max-w-md mx-auto">
            {$searchQuery
              ? `No encontramos monoplazas que coincidan con "${$searchQuery}". Intenta con otros términos.`
              : 'Selecciona una categoría diferente para explorar nuestros increíbles monoplazas'
            }
          </p>
          <div class="flex gap-3 justify-center">
            {#if $searchQuery}
              <button
                class="btn bg-primary-500 text-white px-6 py-3 uppercase tracking-wider font-semibold"
                on:click={() => searchQuery.set('')}
              >
                <LucideClose class="mr-2 w-4 h-4" />
                Limpiar Búsqueda
              </button>
            {/if}
            <button
              class="btn bg-surface-800 text-white border border-surface-700 px-6 py-3"
              on:click={() => selectedCategories.set(['all'])}
            >
              <LucideGrid class="mr-2 w-4 h-4" />
              Ver Todos
            </button>
          </div>
        </div>
      {:else}
        <!-- Products Header -->
        <div class="text-center mb-10">
          <h2 class="text-2xl font-bold text-white mb-3">
            {$searchQuery
              ? `Resultados para "${$searchQuery}"`
              : $selectedCategories.includes('all')
                ? 'Toda la Colección'
                : 'Filtros Aplicados'
            }
          </h2>
          <div class="flex items-center justify-center gap-4 text-surface-200 text-sm">
            <div class="flex items-center gap-1.5">
              <LucidePackage class="w-4 h-4 text-primary-500" />
              <span>{$filteredProducts.length} modelos</span>
            </div>
            <div class="w-1 h-1 bg-surface-600 rounded-full"></div>
            <div class="flex items-center gap-1.5">
              <LucideTruck class="w-4 h-4 text-primary-500" />
              <span>Envíos a toda Guatemala</span>
            </div>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {#each $filteredProducts as product, i}
            <ProductCard
              {product}
              index={i}
              animationDelay={80}
              onCardClick={handleProductClick}
              on:addToCart={handleAddToCart}
              on:viewDetails={handleViewDetails}
            />
          {/each}
        </div>
      {/if}
    </div>
  </section>
{/if}

<style lang="postcss">
  .input:focus {
    box-shadow: 0 0 0 3px rgba(226, 41, 40, 0.15);
  }
</style>
