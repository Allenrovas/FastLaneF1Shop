<script lang="ts">
  import { onMount } from 'svelte';
  import { goto, afterNavigate } from '$app/navigation';
  import { cart, cartTotal, cartItemCount, clearCart, type CartItem } from '$lib/stores/cart';
  import { fly } from 'svelte/transition';
  import { base } from '$app/paths';
  // Iconos
  import LucideUser from '~icons/lucide/user';
  import LucidePhone from '~icons/lucide/phone';
  import LucideMapPin from '~icons/lucide/map-pin';
  import LucideShoppingCart from '~icons/lucide/shopping-cart';
  import LucidePackage from '~icons/lucide/package';
  import LucideCalculator from '~icons/lucide/calculator';
  import TablerBrandWhatsapp from '~icons/tabler/brand-whatsapp';
  import LucideArrowLeft from '~icons/lucide/arrow-left';
  import LucideCheck from '~icons/lucide/check';
  import LucideAlertCircle from '~icons/lucide/alert-circle';
  import LucideF1 from '~icons/lucide/car-front';
  import LucideChevronRight from '~icons/lucide/chevron-right';

  // Datos del formulario
  let formData = {
    name: '',
    phone: '',
    address: '',
    city: '',
    department: '',
    reference: ''
  };

  // Estados del formulario
  let isSubmitting = false;
  let errors: Record<string, string> = {};
  let currentStep = 1;

  // Departamentos de Guatemala
  const guatemalanDepartments = [
    'Guatemala', 'Sacatepéquez', 'Chimaltenango', 'Escuintla', 'Santa Rosa',
    'Sololá', 'Totonicapán', 'Quetzaltenango', 'Suchitepéquez', 'Retalhuleu',
    'San Marcos', 'Huehuetenango', 'Quiché', 'Baja Verapaz', 'Alta Verapaz',
    'Petén', 'Izabal', 'Zacapa', 'Chiquimula', 'Jalapa', 'Jutiapa', 'El Progreso'
  ];

  const GITHUB_REPO_URL = 'https://raw.githubusercontent.com/Allenrovas/Datos_Catalogo/main';
  const WHATSAPP_PHONE = '+50249395444';

  function getProductImageUrl(product: CartItem, imageIndex: number = 0): string {
    return `${GITHUB_REPO_URL}/${product.imageFolder}${product.images[imageIndex]}`;
  }

  // Validación del formulario
  function validateForm(): boolean {
    errors = {};

    if (!formData.name.trim()) {
      errors.name = 'El nombre es obligatorio';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'El teléfono es obligatorio';
    } else if (!/^[0-9+\-\s\(\)]+$/.test(formData.phone.trim())) {
      errors.phone = 'El teléfono debe contener solo números y caracteres válidos';
    } else if (formData.phone.trim().length < 8) {
      errors.phone = 'El teléfono debe tener al menos 8 dígitos';
    }

    if (!formData.address.trim()) {
      errors.address = 'La dirección es obligatoria';
    } else if (formData.address.trim().length < 5) {
      errors.address = 'La dirección debe ser más específica';
    }

    if (!formData.city.trim()) {
      errors.city = 'La ciudad es obligatoria';
    }

    if (!formData.department) {
      errors.department = 'El departamento es obligatorio';
    }

    return Object.keys(errors).length === 0;
  }

  // Generar mensaje de WhatsApp
  function generateWhatsAppMessage(): string {
    const orderSummary = $cart.map(item =>
      `• ${item.name}\n  - Escudería: ${item.team}\n  - Escala: ${item.scale}\n  - Fabricante: ${item.manufacturer}\n  - Cantidad: ${item.quantity}\n  - Precio unitario: Q. ${item.price.toFixed(2)}\n  - Subtotal: Q. ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n\n');

    const message = `*NUEVO PEDIDO - FAST LANE F1 SHOP*

 *DATOS DEL CLIENTE:*
• Nombre: ${formData.name}
• Teléfono: ${formData.phone}
• Dirección: ${formData.address}
• Ciudad: ${formData.city}
• Departamento: ${formData.department}
${formData.reference ? `• Referencia: ${formData.reference}` : ''}

 *PRODUCTOS SOLICITADOS:*
${orderSummary}

 *RESUMEN DEL PEDIDO:*
• Total de artículos: ${$cartItemCount}
• Total a pagar: Q. ${$cartTotal.toFixed(2)}

---
¡Gracias por elegir Fast Lane F1 Shop!`;

    return encodeURIComponent(message);
  }

  // Enviar pedido por WhatsApp
  async function submitOrder() {
    if (!validateForm()) {
      return;
    }

    if ($cart.length === 0) {
      errors.general = 'No hay productos en el carrito';
      return;
    }

    isSubmitting = true;

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const whatsappMessage = generateWhatsAppMessage();
      const whatsappURL = `https://wa.me/${WHATSAPP_PHONE}?text=${whatsappMessage}`;

      window.open(whatsappURL, '_blank');

      setTimeout(() => {
        clearCart();
        goto(base || '/');
      }, 2000);

    } catch (error) {
      errors.general = 'Error al procesar el pedido. Por favor intenta de nuevo.';
    } finally {
      isSubmitting = false;
    }
  }

  // Verificar si hay productos en el carrito al cargar
  onMount(() => {
    if ($cart.length === 0) {
      goto(base || '/');
      return;
    }
    window.scrollTo(0, 0);
  });

  afterNavigate(() => {
    if ($cart.length === 0) {
      goto(base || '/');
      return;
    }
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 0);
  });

  function goBack() {
    if (currentStep > 1) {
      currentStep--;
    } else {
      history.back();
    }
  }
</script>

<svelte:head>
  <title>Checkout - Fast Lane F1 Shop</title>
  <meta name="description" content="Finaliza tu compra de monoplazas de Fórmula 1" />
</svelte:head>

<!-- Hero Header -->
<section class="relative overflow-hidden bg-surface-900 pt-8 pb-12">
  <!-- Background gradient overlay matching homepage -->
  <div class="absolute inset-0 bg-gradient-to-br from-surface-900 via-surface-900/95 to-primary-900/20"></div>

  <!-- Subtle grid pattern -->
  <div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px); background-size: 60px 60px;"></div>

  <div class="relative container mx-auto px-4 max-w-6xl">
    <!-- Back button -->
    <button
      class="group inline-flex items-center gap-2 text-surface-300 hover:text-white transition-colors duration-200 mb-8"
      on:click={goBack}
    >
      <LucideArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
      <span class="text-sm uppercase tracking-wider font-medium">Volver</span>
    </button>

    <!-- Title -->
    <div class="text-center mb-10" in:fly={{ y: 30, duration: 600, delay: 100 }}>
      <h1 class="text-4xl md:text-5xl font-black font-headline uppercase tracking-[0.08em] text-white mb-4">
        Finalizar
        <span class="text-primary-500">Pedido</span>
      </h1>
      <p class="text-surface-300 text-lg max-w-md mx-auto">
        Completa tus datos para procesar tu pedido vía WhatsApp
      </p>
    </div>

    <!-- Progress Stepper -->
    <div class="flex justify-center" in:fly={{ y: 20, duration: 600, delay: 250 }}>
      <div class="flex items-center gap-3">
        <!-- Step 1 -->
        <button
          class="flex items-center gap-3 px-5 py-3 transition-all duration-300
            {currentStep >= 1
              ? 'bg-[#1c1b1b]'
              : 'bg-[#1c1b1b]/40'}"
          on:click={() => { if (currentStep > 1) currentStep = 1; }}
        >
          <div class="w-8 h-8 flex items-center justify-center text-sm font-headline font-bold transition-all duration-300
            {currentStep >= 1
              ? 'bg-primary-500 text-white'
              : 'bg-[#2a2a2a] text-surface-400'}">
            {#if currentStep > 1}
              <LucideCheck class="w-4 h-4" />
            {:else}
              1
            {/if}
          </div>
          <div class="text-left">
            <div class="text-xs font-headline uppercase tracking-[0.1em] {currentStep >= 1 ? 'text-primary-400' : 'text-surface-500'}">Paso 1</div>
            <div class="text-sm font-headline font-semibold {currentStep >= 1 ? 'text-white' : 'text-surface-400'}">Datos de Entrega</div>
          </div>
        </button>

        <!-- Connector -->
        <div class="flex items-center gap-1">
          <div class="w-6 h-0.5 {currentStep >= 2 ? 'bg-primary-500' : 'bg-[#2a2a2a]'}"></div>
          <LucideChevronRight class="w-4 h-4 {currentStep >= 2 ? 'text-primary-500' : 'text-surface-600'}" />
          <div class="w-6 h-0.5 {currentStep >= 2 ? 'bg-primary-500' : 'bg-[#2a2a2a]'}"></div>
        </div>

        <!-- Step 2 -->
        <button
          class="flex items-center gap-3 px-5 py-3 transition-all duration-300
            {currentStep >= 2
              ? 'bg-[#1c1b1b]'
              : 'bg-[#1c1b1b]/40'}"
          disabled={currentStep < 2}
        >
          <div class="w-8 h-8 flex items-center justify-center text-sm font-headline font-bold transition-all duration-300
            {currentStep >= 2
              ? 'bg-primary-500 text-white'
              : 'bg-[#2a2a2a] text-surface-400'}">
            2
          </div>
          <div class="text-left">
            <div class="text-xs font-headline uppercase tracking-[0.1em] {currentStep >= 2 ? 'text-primary-400' : 'text-surface-500'}">Paso 2</div>
            <div class="text-sm font-headline font-semibold {currentStep >= 2 ? 'text-white' : 'text-surface-400'}">Confirmar</div>
          </div>
        </button>
      </div>
    </div>
  </div>

  <!-- Red bottom line -->
  <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"></div>
</section>

<!-- Main Content -->
<section class="bg-surface-900 py-10 px-4">
  <div class="container mx-auto max-w-6xl">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

      <!-- Form Area -->
      <div class="lg:col-span-2 space-y-6">

        {#if currentStep === 1}
          <!-- Step 1: Customer Data -->
          <div
            class="bg-[#1c1b1b] overflow-hidden"
            in:fly={{ x: -20, duration: 400 }}
          >
            <!-- Section header -->
            <div class="px-8 pt-8 pb-6 bg-[#131313]">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-[#2a2a2a] flex items-center justify-center">
                  <LucideUser class="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <h2 class="font-headline text-xl font-bold text-white uppercase tracking-[0.1em]">
                    Datos del Cliente
                  </h2>
                  <p class="text-surface-300 text-sm mt-0.5">
                    Información necesaria para la entrega
                  </p>
                </div>
              </div>
            </div>

            <!-- Form -->
            <form on:submit|preventDefault={() => { if (validateForm()) currentStep = 2; }} class="p-8 space-y-6">
              <!-- Nombre completo -->
              <div>
                <label for="name" class="flex items-center gap-2 text-sm font-semibold text-surface-200 uppercase tracking-wider mb-2">
                  <LucideUser class="w-3.5 h-3.5 text-primary-500" />
                  Nombre completo <span class="text-primary-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  bind:value={formData.name}
                  class="checkout-input {errors.name ? 'checkout-input-error' : ''}"
                  placeholder="Ejemplo: Juan Pérez"
                  required
                />
                {#if errors.name}
                  <div class="text-error-500 text-sm mt-2 flex items-center gap-1.5" in:fly={{ y: -4, duration: 200 }}>
                    <LucideAlertCircle class="w-3.5 h-3.5" />
                    {errors.name}
                  </div>
                {/if}
              </div>

              <!-- Teléfono -->
              <div>
                <label for="phone" class="flex items-center gap-2 text-sm font-semibold text-surface-200 uppercase tracking-wider mb-2">
                  <LucidePhone class="w-3.5 h-3.5 text-primary-500" />
                  Teléfono <span class="text-primary-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  bind:value={formData.phone}
                  class="checkout-input {errors.phone ? 'checkout-input-error' : ''}"
                  placeholder="Ejemplo: +502 1234-5678"
                  required
                />
                {#if errors.phone}
                  <div class="text-error-500 text-sm mt-2 flex items-center gap-1.5" in:fly={{ y: -4, duration: 200 }}>
                    <LucideAlertCircle class="w-3.5 h-3.5" />
                    {errors.phone}
                  </div>
                {/if}
              </div>

              <!-- Dirección -->
              <div>
                <label for="address" class="flex items-center gap-2 text-sm font-semibold text-surface-200 uppercase tracking-wider mb-2">
                  <LucideMapPin class="w-3.5 h-3.5 text-primary-500" />
                  Dirección completa <span class="text-primary-500">*</span>
                </label>
                <textarea
                  id="address"
                  bind:value={formData.address}
                  class="checkout-input min-h-[80px] resize-y {errors.address ? 'checkout-input-error' : ''}"
                  rows="3"
                  placeholder="Ejemplo: 19 Avenida 12-25, Zona 13"
                  required
                ></textarea>
                {#if errors.address}
                  <div class="text-error-500 text-sm mt-2 flex items-center gap-1.5" in:fly={{ y: -4, duration: 200 }}>
                    <LucideAlertCircle class="w-3.5 h-3.5" />
                    {errors.address}
                  </div>
                {/if}
              </div>

              <!-- Ciudad y Departamento -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="city" class="flex items-center gap-2 text-sm font-semibold text-surface-200 uppercase tracking-wider mb-2">
                    Ciudad/Municipio <span class="text-primary-500">*</span>
                  </label>
                  <input
                    id="city"
                    type="text"
                    bind:value={formData.city}
                    class="checkout-input {errors.city ? 'checkout-input-error' : ''}"
                    placeholder="Ejemplo: Guatemala"
                    required
                  />
                  {#if errors.city}
                    <div class="text-error-500 text-sm mt-2 flex items-center gap-1.5" in:fly={{ y: -4, duration: 200 }}>
                      <LucideAlertCircle class="w-3.5 h-3.5" />
                      {errors.city}
                    </div>
                  {/if}
                </div>

                <div>
                  <label for="department" class="flex items-center gap-2 text-sm font-semibold text-surface-200 uppercase tracking-wider mb-2">
                    Departamento <span class="text-primary-500">*</span>
                  </label>
                  <div class="relative">
                    <select
                      id="department"
                      bind:value={formData.department}
                      class="checkout-input appearance-none cursor-pointer pr-10 {errors.department ? 'checkout-input-error' : ''}"
                      required
                    >
                      <option value="">Selecciona un departamento</option>
                      {#each guatemalanDepartments as dept}
                        <option value={dept}>{dept}</option>
                      {/each}
                    </select>
                    <LucideChevronRight class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 rotate-90 pointer-events-none" />
                  </div>
                  {#if errors.department}
                    <div class="text-error-500 text-sm mt-2 flex items-center gap-1.5" in:fly={{ y: -4, duration: 200 }}>
                      <LucideAlertCircle class="w-3.5 h-3.5" />
                      {errors.department}
                    </div>
                  {/if}
                </div>
              </div>

              <!-- Referencia (opcional) -->
              <div>
                <label for="reference" class="flex items-center gap-2 text-sm font-semibold text-surface-200 uppercase tracking-wider mb-2">
                  Punto de referencia
                  <span class="text-surface-500 normal-case tracking-normal font-normal">(opcional)</span>
                </label>
                <input
                  id="reference"
                  type="text"
                  bind:value={formData.reference}
                  class="checkout-input"
                  placeholder="Ejemplo: Frente a la gasolinera Shell"
                />
              </div>

              <!-- Continue button -->
              <div class="flex justify-end pt-4">
                <button
                  type="submit"
                  class="inline-flex items-center gap-2 btn-kinetic px-8 py-3.5 disabled:opacity-40 disabled:cursor-not-allowed"
                  disabled={!formData.name || !formData.phone || !formData.address || !formData.city || !formData.department}
                >
                  Continuar al Resumen
                  <LucidePackage class="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

        {:else}
          <!-- Step 2: Order Confirmation -->
          <div
            class="bg-[#1c1b1b] overflow-hidden"
            in:fly={{ x: 20, duration: 400 }}
          >
            <!-- Section header -->
            <div class="px-8 pt-8 pb-6 bg-[#131313]">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-[#2a2a2a] flex items-center justify-center">
                  <LucideCheck class="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <h2 class="font-headline text-xl font-bold text-white uppercase tracking-[0.1em]">
                    Confirmar Pedido
                  </h2>
                  <p class="text-surface-300 text-sm mt-0.5">
                    Revisa los datos antes de enviar a WhatsApp
                  </p>
                </div>
              </div>
            </div>

            <div class="p-8">
              <!-- Delivery data summary -->
              <div class="bg-[#131313] p-6 mb-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="font-headline font-bold text-sm uppercase tracking-[0.1em] flex items-center gap-2 text-white">
                    <LucideUser class="w-4 h-4 text-primary-500" />
                    Datos de Entrega
                  </h3>
                  <button
                    class="text-xs text-primary-400 hover:text-primary-300 uppercase tracking-wider font-semibold transition-colors"
                    on:click={() => currentStep = 1}
                  >
                    Editar
                  </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-surface-400 text-xs uppercase tracking-wider">Nombre</span>
                    <p class="font-semibold text-white mt-0.5">{formData.name}</p>
                  </div>
                  <div>
                    <span class="text-surface-400 text-xs uppercase tracking-wider">Teléfono</span>
                    <p class="font-semibold text-white mt-0.5">{formData.phone}</p>
                  </div>
                  <div class="md:col-span-2">
                    <span class="text-surface-400 text-xs uppercase tracking-wider">Dirección</span>
                    <p class="font-semibold text-white mt-0.5">{formData.address}</p>
                  </div>
                  <div>
                    <span class="text-surface-400 text-xs uppercase tracking-wider">Ciudad</span>
                    <p class="font-semibold text-white mt-0.5">{formData.city}</p>
                  </div>
                  <div>
                    <span class="text-surface-400 text-xs uppercase tracking-wider">Departamento</span>
                    <p class="font-semibold text-white mt-0.5">{formData.department}</p>
                  </div>
                  {#if formData.reference}
                    <div class="md:col-span-2">
                      <span class="text-surface-400 text-xs uppercase tracking-wider">Referencia</span>
                      <p class="font-semibold text-white mt-0.5">{formData.reference}</p>
                    </div>
                  {/if}
                </div>
              </div>

              <!-- Products list (visible in step 2) -->
              <div class="bg-[#131313] p-6 mb-6">
                <h3 class="font-headline font-bold text-sm uppercase tracking-[0.1em] flex items-center gap-2 text-white mb-4">
                  <LucideShoppingCart class="w-4 h-4 text-primary-500" />
                  Productos ({$cartItemCount})
                </h3>
                <div class="space-y-3">
                  {#each $cart as item}
                    <div class="flex items-center gap-3 p-3 bg-[#1c1b1b]">
                      <div class="w-14 h-14 bg-[#2a2a2a] overflow-hidden flex-shrink-0">
                        <img
                          src={getProductImageUrl(item, 0)}
                          alt={item.name}
                          class="w-full h-full object-cover"
                          on:error={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.nextElementSibling) e.currentTarget.nextElementSibling.style.display = 'flex';
                          }}
                        />
                        <div class="w-full h-full hidden items-center justify-center">
                          <LucideF1 class="w-6 h-6 text-surface-400" />
                        </div>
                      </div>
                      <div class="flex-1 min-w-0">
                        <h4 class="font-semibold text-sm text-white line-clamp-1">{item.name}</h4>
                        <span class="text-xs text-surface-400">{item.scale} · {item.team}</span>
                      </div>
                      <div class="text-right flex-shrink-0">
                        <div class="text-xs text-surface-400">{item.quantity} × Q. {item.price.toFixed(2)}</div>
                        <div class="font-bold text-sm text-white">Q. {(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    </div>
                  {/each}
                </div>
              </div>

              <!-- Error general -->
              {#if errors.general}
                <div class="flex items-center gap-3 p-4 bg-error-500/10 border border-error-500/30 rounded-lg mb-6" in:fly={{ y: -8, duration: 200 }}>
                  <LucideAlertCircle class="w-5 h-5 text-error-500 flex-shrink-0" />
                  <span class="text-error-400 text-sm">{errors.general}</span>
                </div>
              {/if}

              <!-- Action buttons -->
              <div class="flex flex-col sm:flex-row gap-4 justify-between pt-2">
                <button
                  class="inline-flex items-center gap-2 text-surface-300 hover:text-white font-medium text-sm uppercase tracking-wider transition-colors duration-200"
                  on:click={() => currentStep = 1}
                  disabled={isSubmitting}
                >
                  <LucideArrowLeft class="w-4 h-4" />
                  Volver a Datos
                </button>

                <button
                  class="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-headline font-bold px-8 py-3.5 uppercase tracking-wider hover:bg-[#20bd5a] transition-all duration-200 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                  on:click={submitOrder}
                  disabled={isSubmitting}
                >
                  {#if isSubmitting}
                    <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Enviando...
                  {:else}
                    <TablerBrandWhatsapp class="w-5 h-5" />
                    Enviar Pedido por WhatsApp
                  {/if}
                </button>
              </div>
            </div>
          </div>
        {/if}
      </div>

      <!-- Order Summary Sidebar -->
      <div class="lg:col-span-1">
        <div class="sticky top-8 space-y-6">
          <!-- Cart summary card -->
          <div class="bg-[#1c1b1b] overflow-hidden">
            <div class="px-6 pt-6 pb-4 bg-[#131313]">
              <h3 class="font-headline font-bold text-sm uppercase tracking-[0.1em] flex items-center gap-2 text-white">
                <LucideShoppingCart class="w-4 h-4 text-primary-500" />
                Resumen del Pedido
              </h3>
            </div>

            <!-- Products -->
            <div class="p-4 space-y-3 max-h-80 overflow-y-auto">
              {#each $cart as item}
                <div class="flex items-center gap-3 p-2.5 bg-[#2a2a2a]/50">
                  <div class="w-11 h-11 bg-[#2a2a2a] overflow-hidden flex-shrink-0">
                    <img
                      src={getProductImageUrl(item, 0)}
                      alt={item.name}
                      class="w-full h-full object-cover"
                      on:error={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextElementSibling) e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div class="w-full h-full hidden items-center justify-center">
                      <LucideF1 class="w-5 h-5 text-surface-400" />
                    </div>
                  </div>

                  <div class="flex-1 min-w-0">
                    <h4 class="font-semibold text-xs text-white line-clamp-2">
                      {item.name}
                    </h4>
                    <div class="flex items-center justify-between mt-1">
                      <span class="text-[10px] text-surface-400 uppercase tracking-wider">
                        {item.scale} · {item.team}
                      </span>
                    </div>
                  </div>

                  <div class="text-right flex-shrink-0">
                    <div class="text-[10px] text-surface-400">
                      {item.quantity} × Q. {item.price.toFixed(2)}
                    </div>
                    <div class="font-bold text-xs text-white">
                      Q. {(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              {/each}
            </div>

            <!-- Totals -->
            <div class="px-6 py-4 bg-[#131313] space-y-3">
              <div class="flex justify-between items-center text-sm">
                <span class="text-surface-400 flex items-center gap-1.5">
                  <LucideCalculator class="w-3.5 h-3.5" />
                  Subtotal ({$cartItemCount} items)
                </span>
                <span class="font-headline font-semibold text-white">
                  Q. {$cartTotal.toFixed(2)}
                </span>
              </div>

              <div class="bg-[#0e0e0e] p-3">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-headline font-bold text-white uppercase tracking-[0.1em]">Total</span>
                  <span class="text-xl font-headline font-black text-primary-500">
                    Q. {$cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- WhatsApp info card -->
          <div class="bg-[#1c1b1b] p-5">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 bg-[#2a2a2a] flex items-center justify-center flex-shrink-0">
                <TablerBrandWhatsapp class="w-5 h-5 text-[#25D366]" />
              </div>
              <div>
                <p class="font-bold text-white text-sm mb-1">
                  Pago contra entrega
                </p>
                <p class="text-surface-400 text-xs leading-relaxed">
                  Tu pedido será enviado por WhatsApp para coordinar la entrega y el pago.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  /* Telemetry-style inputs — ghost border, bottom-edge focus */
  .checkout-input {
    width: 100%;
    background-color: #0e0e0e;
    border: none;
    border-bottom: 2px solid rgba(94, 63, 58, 0.15);
    border-radius: 0;
    padding: 0.75rem 1rem;
    color: white;
    font-size: 0.875rem;
    transition: border-color 0.2s;
  }

  .checkout-input::placeholder {
    color: rgb(var(--color-surface-300));
  }

  .checkout-input:focus {
    outline: none;
    border-bottom-color: rgb(225, 6, 0);
    box-shadow: none;
  }

  .checkout-input-error {
    border-bottom-color: rgb(var(--color-error-500));
  }

  .checkout-input-error:focus {
    border-bottom-color: rgb(var(--color-error-500));
    box-shadow: none;
  }

  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>