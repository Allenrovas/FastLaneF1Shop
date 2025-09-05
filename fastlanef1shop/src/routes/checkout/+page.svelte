<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { cart, cartTotal, cartItemCount, clearCart, type CartItem } from '$lib/stores/cart';
  import { fade, fly } from 'svelte/transition';
  
  // Iconos
  import LucideUser from '~icons/lucide/user';
  import LucidePhone from '~icons/lucide/phone';
  import LucideMapPin from '~icons/lucide/map-pin';
  import LucideShoppingCart from '~icons/lucide/shopping-cart';
  import LucideCreditCard from '~icons/lucide/credit-card';
  import LucidePackage from '~icons/lucide/package';
  import LucideCalculator from '~icons/lucide/calculator';
  import TablerBrandWhatsapp from '~icons/tabler/brand-whatsapp';
  import LucideArrowLeft from '~icons/lucide/arrow-left';
  import LucideCheck from '~icons/lucide/check';
  import LucideAlertCircle from '~icons/lucide/alert-circle';
  import LucideF1 from '~icons/lucide/car-front';

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
      // Simular delay para UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      const whatsappMessage = generateWhatsAppMessage();
      const whatsappURL = `https://wa.me/${WHATSAPP_PHONE}?text=${whatsappMessage}`;
      
      // Abrir WhatsApp
      window.open(whatsappURL, '_blank');
      
      // Limpiar carrito después de enviar
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
    }
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

<div class="min-h-screen bg-gradient-to-br from-surface-50 via-surface-25 to-surface-100 dark:from-surface-900 dark:via-surface-925 dark:to-surface-800 py-8">
  <div class="container mx-auto px-4 max-w-6xl">
    
    <!-- Header -->
    <div class="mb-8">
      <button 
        class="btn variant-ghost-surface mb-4 hover:variant-soft-surface transition-all duration-300"
        on:click={goBack}
      >
        <LucideArrowLeft class="w-4 h-4 mr-2" />
        Volver
      </button>
      
      <div class="text-center">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-secondary-800 to-secondary-600 bg-clip-text text-transparent mb-4">
          Finalizar Pedido
        </h1>
        <p class="text-surface-600 dark:text-surface-300 text-lg">
          Completa tus datos para procesar tu pedido vía WhatsApp
        </p>
      </div>
    </div>

    <!-- Progress Indicator -->
    <div class="flex justify-center mb-8">
      <div class="flex items-center space-x-4">
        <div class="flex items-center {currentStep >= 1 ? 'text-secondary-800' : 'text-surface-400'}">
          <div class="w-8 h-8 rounded-full {currentStep >= 1 ? 'bg-secondary-800 text-white' : 'bg-surface-300 text-surface-600'} flex items-center justify-center font-semibold text-sm">
            {#if currentStep > 1}
              <LucideCheck class="w-4 h-4" />
            {:else}
              1
            {/if}
          </div>
          <span class="ml-2 font-medium">Datos</span>
        </div>
        
        <div class="w-16 h-0.5 {currentStep >= 2 ? 'bg-secondary-800' : 'bg-surface-300'}"></div>
        
        <div class="flex items-center {currentStep >= 2 ? 'text-secondary-800' : 'text-surface-400'}">
          <div class="w-8 h-8 rounded-full {currentStep >= 2 ? 'bg-secondary-800 text-white' : 'bg-surface-300 text-surface-600'} flex items-center justify-center font-semibold text-sm">
            2
          </div>
          <span class="ml-2 font-medium">Resumen</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Formulario -->
      <div class="lg:col-span-2 space-y-6">
        
        {#if currentStep === 1}
          <!-- Paso 1: Datos del Cliente -->
          <div 
            class="card variant-ghost-surface border border-surface-200 dark:border-surface-600 p-8"
            in:fly={{ x: -20, duration: 400 }}
          >
            <div class="flex items-center mb-6">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mr-4">
                <LucideUser class="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-50">
                  Datos del Cliente
                </h2>
                <p class="text-surface-600 dark:text-surface-300">
                  Información necesaria para la entrega
                </p>
              </div>
            </div>

            <form on:submit|preventDefault={() => currentStep = 2} class="space-y-6">
              <!-- Nombre completo -->
              <div>
                <label for="name" class="label font-semibold mb-2 flex items-center">
                  <LucideUser class="w-4 h-4 mr-2 text-primary-500" />
                  Nombre completo *
                </label>
                <input
                  id="name"
                  type="text"
                  bind:value={formData.name}
                  class="input rounded-lg {errors.name ? 'input-error' : ''}"
                  placeholder="Ejemplo: Juan Carlos Pérez"
                  required
                />
                {#if errors.name}
                  <div class="text-error-500 text-sm mt-1 flex items-center">
                    <LucideAlertCircle class="w-4 h-4 mr-1" />
                    {errors.name}
                  </div>
                {/if}
              </div>

              <!-- Teléfono -->
              <div>
                <label for="phone" class="label font-semibold mb-2 flex items-center">
                  <LucidePhone class="w-4 h-4 mr-2 text-primary-500" />
                  Teléfono *
                </label>
                <input
                  id="phone"
                  type="tel"
                  bind:value={formData.phone}
                  class="input rounded-lg {errors.phone ? 'input-error' : ''}"
                  placeholder="Ejemplo: +502 1234-5678"
                  required
                />
                {#if errors.phone}
                  <div class="text-error-500 text-sm mt-1 flex items-center">
                    <LucideAlertCircle class="w-4 h-4 mr-1" />
                    {errors.phone}
                  </div>
                {/if}
              </div>

              <!-- Dirección -->
              <div>
                <label for="address" class="label font-semibold mb-2 flex items-center">
                  <LucideMapPin class="w-4 h-4 mr-2 text-primary-500" />
                  Dirección completa *
                </label>
                <textarea
                  id="address"
                  bind:value={formData.address}
                  class="textarea rounded-lg {errors.address ? 'input-error' : ''}"
                  rows="3"
                  placeholder="Ejemplo: 15 Avenida 20-25, Zona 13, Colonia Aurora I"
                  required
                ></textarea>
                {#if errors.address}
                  <div class="text-error-500 text-sm mt-1 flex items-center">
                    <LucideAlertCircle class="w-4 h-4 mr-1" />
                    {errors.address}
                  </div>
                {/if}
              </div>

              <!-- Ciudad y Departamento -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="city" class="label font-semibold mb-2">
                    Ciudad/Municipio *
                  </label>
                  <input
                    id="city"
                    type="text"
                    bind:value={formData.city}
                    class="input rounded-lg {errors.city ? 'input-error' : ''}"
                    placeholder="Ejemplo: Guatemala"
                    required
                  />
                  {#if errors.city}
                    <div class="text-error-500 text-sm mt-1 flex items-center">
                      <LucideAlertCircle class="w-4 h-4 mr-1" />
                      {errors.city}
                    </div>
                  {/if}
                </div>

                <div>
                  <label for="department" class="label font-semibold mb-2">
                    Departamento *
                  </label>
                  <select
                    id="department"
                    bind:value={formData.department}
                    class="select rounded-lg {errors.department ? 'input-error' : ''}"
                    required
                  >
                    <option value="">Selecciona un departamento</option>
                    {#each guatemalanDepartments as dept}
                      <option value={dept}>{dept}</option>
                    {/each}
                  </select>
                  {#if errors.department}
                    <div class="text-error-500 text-sm mt-1 flex items-center">
                      <LucideAlertCircle class="w-4 h-4 mr-1" />
                      {errors.department}
                    </div>
                  {/if}
                </div>
              </div>

              <!-- Referencia (opcional) -->
              <div>
                <label for="reference" class="label font-semibold mb-2">
                  Punto de referencia (opcional)
                </label>
                <input
                  id="reference"
                  type="text"
                  bind:value={formData.reference}
                  class="input rounded-lg"
                  placeholder="Ejemplo: Frente a la gasolinera Shell"
                />
              </div>

              <!-- Botón continuar -->
              <div class="flex justify-end pt-4">
                <button 
                  type="submit"
                  class="btn variant-filled-primary text-lg px-8 py-3 hover:scale-105 transition-transform duration-200"
                  disabled={!formData.name || !formData.phone || !formData.address || !formData.city || !formData.department}
                >
                  Continuar al Resumen
                  <LucidePackage class="ml-2 w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

        {:else}
          <!-- Paso 2: Resumen del Pedido -->
          <div 
            class="card variant-ghost-surface border border-surface-200 dark:border-surface-600 p-8"
            in:fly={{ x: 20, duration: 400 }}
          >
            <div class="flex items-center mb-6">
              <div class="w-10 h-10 bg-gradient-to-br from-success-500 to-primary-500 rounded-xl flex items-center justify-center mr-4">
                <LucideCheck class="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-50">
                  Confirmar Pedido
                </h2>
                <p class="text-surface-600 dark:text-surface-300">
                  Revisa los datos antes de enviar a WhatsApp
                </p>
              </div>
            </div>

            <!-- Resumen de datos -->
            <div class="space-y-4 mb-8">
              <div class="card variant-ghost-primary p-4">
                <h3 class="font-bold text-lg mb-3 flex items-center text-surface-900 dark:text-surface-50">
                  <LucideUser class="mr-2 w-5 h-5 text-primary-500" />
                  Datos de Entrega
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-surface-600 dark:text-surface-300">Nombre:</span>
                    <p class="font-semibold text-surface-900 dark:text-surface-50">{formData.name}</p>
                  </div>
                  <div>
                    <span class="text-surface-600 dark:text-surface-300">Teléfono:</span>
                    <p class="font-semibold text-surface-900 dark:text-surface-50">{formData.phone}</p>
                  </div>
                  <div class="md:col-span-2">
                    <span class="text-surface-600 dark:text-surface-300">Dirección:</span>
                    <p class="font-semibold text-surface-900 dark:text-surface-50">{formData.address}</p>
                  </div>
                  <div>
                    <span class="text-surface-600 dark:text-surface-300">Ciudad:</span>
                    <p class="font-semibold text-surface-900 dark:text-surface-50">{formData.city}</p>
                  </div>
                  <div>
                    <span class="text-surface-600 dark:text-surface-300">Departamento:</span>
                    <p class="font-semibold text-surface-900 dark:text-surface-50">{formData.department}</p>
                  </div>
                  {#if formData.reference}
                    <div class="md:col-span-2">
                      <span class="text-surface-600 dark:text-surface-300">Referencia:</span>
                      <p class="font-semibold text-surface-900 dark:text-surface-50">{formData.reference}</p>
                    </div>
                  {/if}
                </div>
              </div>

              <button 
                class="btn variant-soft-surface text-sm"
                on:click={() => currentStep = 1}
              >
                Editar datos
              </button>
            </div>

            <!-- Error general -->
            {#if errors.general}
              <div class="alert variant-filled-error mb-6">
                <LucideAlertCircle class="w-5 h-5" />
                <span>{errors.general}</span>
              </div>
            {/if}

            <!-- Botones de acción -->
            <div class="flex flex-col sm:flex-row gap-4 justify-between">
              <button 
                class="btn variant-soft-surface"
                on:click={() => currentStep = 1}
                disabled={isSubmitting}
              >
                <LucideArrowLeft class="mr-2 w-4 h-4" />
                Volver a Datos
              </button>
              
              <button 
                class="btn variant-filled-success text-lg px-8 py-3 hover:scale-105 transition-transform duration-200"
                on:click={submitOrder}
                disabled={isSubmitting}
              >
                {#if isSubmitting}
                  <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Enviando...
                {:else}
                  <TablerBrandWhatsapp class="mr-2 w-5 h-5" />
                  Enviar Pedido por WhatsApp
                {/if}
              </button>
            </div>
          </div>
        {/if}
      </div>

      <!-- Resumen del Carrito (Sidebar) -->
      <div class="lg:col-span-1">
        <div class="sticky top-8">
          <div class="card variant-ghost-surface border border-surface-200 dark:border-surface-600 p-6">
            <h3 class="text-xl font-bold mb-6 flex items-center text-surface-900 dark:text-surface-50">
              <LucideShoppingCart class="mr-2 w-5 h-5 text-primary-200" />
              Resumen del Pedido
            </h3>
            
            <!-- Productos -->
            <div class="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {#each $cart as item}
                <div class="flex items-center space-x-3 p-3 bg-surface-100 dark:bg-surface-700 rounded-lg">
                  <div class="w-12 h-12 bg-surface-200 dark:bg-surface-600 rounded-md overflow-hidden flex-shrink-0">
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
                      <LucideF1 class="w-6 h-6 text-surface-500" />
                    </div>
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <h4 class="font-semibold text-sm text-surface-900 dark:text-surface-50 line-clamp-2">
                      {item.name}
                    </h4>
                    <div class="flex items-center justify-between mt-1">
                      <span class="text-xs text-surface-600 dark:text-surface-300">
                        {item.scale} • {item.team}
                      </span>
                      <div class="text-right">
                        <div class="text-xs text-surface-600 dark:text-surface-300">
                          {item.quantity} × Q. {item.price.toFixed(2)}
                        </div>
                        <div class="font-semibold text-sm text-success-600 dark:text-success-400">
                          Q. {(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
            
            <!-- Totales -->
            <div class="border-t border-surface-200 dark:border-surface-600 pt-4 space-y-3">
              <div class="flex justify-between items-center">
                <span class="flex items-center text-surface-600 dark:text-surface-300">
                  <LucideCalculator class="mr-2 w-4 h-4" />
                  Subtotal ({$cartItemCount} items):
                </span>
                <span class="font-semibold text-surface-900 dark:text-surface-50">
                  Q. {$cartTotal.toFixed(2)}
                </span>
              </div>
              
              <div class="border-t border-surface-200 dark:border-surface-600 pt-3">
                <div class="flex justify-between items-center">
                  <span class="text-xl font-bold text-surface-900 dark:text-surface-50">Total:</span>
                  <span class="text-2xl font-bold text-success-600 dark:text-success-400">
                    Q. {$cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <!-- Información adicional -->
            <div class="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <div class="flex items-start">
                <TablerBrandWhatsapp class="w-5 h-5 text-success-600 mr-2 mt-0.5 flex-shrink-0" />
                <div class="text-sm">
                  <p class="font-semibold text-surface-900 dark:text-surface-50 mb-1">
                    Pago contra entrega
                  </p>
                  <p class="text-surface-600 dark:text-surface-300">
                    Tu pedido será enviado por WhatsApp para coordinar la entrega y el pago.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>