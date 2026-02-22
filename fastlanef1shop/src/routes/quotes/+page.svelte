<script lang="ts">
  import { onMount } from 'svelte';
  import { goto, afterNavigate } from '$app/navigation';
  import { cart, cartTotal, cartItemCount, type CartItem } from '$lib/stores/cart';
  import { fly } from 'svelte/transition';
  import { base } from '$app/paths';

  // Iconos
  import LucideFileText from '~icons/lucide/file-text';
  import LucideShoppingCart from '~icons/lucide/shopping-cart';
  import LucidePackage from '~icons/lucide/package';
  import LucideCalendar from '~icons/lucide/calendar';
  import LucideDollarSign from '~icons/lucide/circle-dollar-sign';
  import TablerBrandWhatsapp from '~icons/tabler/brand-whatsapp';
  import LucideArrowLeft from '~icons/lucide/arrow-left';
  import LucideDownload from '~icons/lucide/download';
  import LucideF1 from '~icons/lucide/car-front';
  import LucidePrinter from '~icons/lucide/printer';

  const GITHUB_REPO_URL = 'https://raw.githubusercontent.com/Allenrovas/Datos_Catalogo/main';
  const WHATSAPP_PHONE = '+50249395444';

  // Configuración de tiempos de entrega
  const DELIVERY_TIME_DAYS = 15; // Días estimados de entrega
  const quoteDate = new Date();
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + DELIVERY_TIME_DAYS);

  function getProductImageUrl(product: CartItem, imageIndex: number = 0): string {
    return `${GITHUB_REPO_URL}/${product.imageFolder}${product.images[imageIndex]}`;
  }

  function formatDate(date: Date): string {
    return date.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Generar mensaje de WhatsApp con cotización
  function generateWhatsAppQuote(): string {
    const quoteItems = $cart.map(item =>
      `• ${item.name}\n  - Escudería: ${item.team}\n  - Escala: ${item.scale}\n  - Fabricante: ${item.manufacturer}\n  - Cantidad: ${item.quantity}\n  - Precio unitario: Q. ${item.price.toFixed(2)}\n  - Subtotal: Q. ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n\n');

    const message = `*COTIZACIÓN - FAST LANE F1 SHOP*

📅 *Fecha de Cotización:* ${formatDate(quoteDate)}
🚚 *Fecha Estimada de Entrega:* ${formatDate(deliveryDate)}
⏱️ *Tiempo de Entrega:* ${DELIVERY_TIME_DAYS} días hábiles

*PRODUCTOS COTIZADOS:*
${quoteItems}

*RESUMEN:*
• Total de artículos: ${$cartItemCount}
• *TOTAL A PAGAR: Q. ${$cartTotal.toFixed(2)}*

---
Cotización válida por 7 días
¡Gracias por elegir Fast Lane F1 Shop! 🏎️`;

    return encodeURIComponent(message);
  }

  // Enviar cotización por WhatsApp
  function sendQuoteViaWhatsApp() {
    const whatsappMessage = generateWhatsAppQuote();
    const whatsappURL = `https://wa.me/${WHATSAPP_PHONE}?text=${whatsappMessage}`;
    window.open(whatsappURL, '_blank');
  }

  // Imprimir cotización
  function printQuote() {
    window.print();
  }

  // Descargar cotización como texto
  function downloadQuote() {
    const quoteContent = generateQuoteText();
    const blob = new Blob([quoteContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cotizacion_FastLaneF1Shop_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function generateQuoteText(): string {
    let text = `COTIZACIÓN - FAST LANE F1 SHOP\n`;
    text += `${'='.repeat(60)}\n\n`;
    text += `Fecha de Cotización: ${formatDate(quoteDate)}\n`;
    text += `Fecha Estimada de Entrega: ${formatDate(deliveryDate)}\n`;
    text += `Tiempo de Entrega: ${DELIVERY_TIME_DAYS} días hábiles\n\n`;
    text += `PRODUCTOS COTIZADOS:\n`;
    text += `${'-'.repeat(60)}\n\n`;

    $cart.forEach((item, index) => {
      text += `${index + 1}. ${item.name}\n`;
      text += `   Escudería: ${item.team}\n`;
      text += `   Escala: ${item.scale}\n`;
      text += `   Fabricante: ${item.manufacturer}\n`;
      text += `   Cantidad: ${item.quantity}\n`;
      text += `   Precio unitario: Q. ${item.price.toFixed(2)}\n`;
      text += `   Subtotal: Q. ${(item.price * item.quantity).toFixed(2)}\n\n`;
    });

    text += `${'-'.repeat(60)}\n`;
    text += `RESUMEN:\n`;
    text += `Total de artículos: ${$cartItemCount}\n`;
    text += `TOTAL A PAGAR: Q. ${$cartTotal.toFixed(2)}\n\n`;
    text += `${'-'.repeat(60)}\n`;
    text += `Cotización válida por 7 días\n`;
    text += `Contacto WhatsApp: ${WHATSAPP_PHONE}\n`;

    return text;
  }

  // Verificar si hay productos en el carrito
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
    history.back();
  }
</script>

<svelte:head>
  <title>Cotización - Fast Lane F1 Shop</title>
  <meta name="description" content="Genera tu cotización de monoplazas de Fórmula 1" />
</svelte:head>

<!-- Hero Header -->
<section class="relative overflow-hidden bg-surface-900 pt-8 pb-12 print:pb-6">
  <div class="absolute inset-0 bg-gradient-to-br from-surface-900 via-surface-900/95 to-primary-900/20 print:hidden"></div>
  <div class="absolute inset-0 opacity-[0.03] print:hidden" style="background-image: linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px); background-size: 60px 60px;"></div>

  <div class="relative container mx-auto px-4 max-w-6xl">
    <!-- Back button -->
    <button
      class="group inline-flex items-center gap-2 text-surface-300 hover:text-white transition-colors duration-200 mb-8 print:hidden"
      on:click={goBack}
    >
      <LucideArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
      <span class="text-sm uppercase tracking-wider font-medium">Volver</span>
    </button>

    <!-- Title -->
    <div class="text-center mb-8" in:fly={{ y: 30, duration: 600, delay: 100 }}>
      <h1 class="text-4xl md:text-5xl font-black font-racing uppercase tracking-wider text-white mb-4">
        Tu
        <span class="text-primary-500">Cotización</span>
      </h1>
      <p class="text-surface-300 text-lg max-w-md mx-auto">
        Revisa los detalles y comparte tu cotización
      </p>
      <div class="w-16 h-0.5 bg-primary-500 mx-auto mt-6"></div>
    </div>
  </div>

  <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 print:hidden"></div>
</section>

<!-- Main Content -->
<section class="bg-surface-900 py-10 px-4 print:py-4">
  <div class="container mx-auto max-w-6xl">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 print:gap-4">

      <!-- Main Quote Area -->
      <div class="lg:col-span-2 space-y-6 print:space-y-3">

        <!-- Quote Info Card -->
        <div class="bg-surface-800 border border-surface-700 rounded-lg overflow-hidden print:border-gray-300">
          <div class="px-8 pt-8 pb-6 border-b border-surface-700 print:px-4 print:py-3 print:border-gray-300">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-surface-700 border border-surface-600 rounded-lg flex items-center justify-center print:hidden">
                <LucideFileText class="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h2 class="text-xl font-bold text-white uppercase tracking-wider print:text-black">
                  Información de la Cotización
                </h2>
                <p class="text-surface-300 text-sm mt-0.5 print:text-gray-600">
                  Válida por 7 días
                </p>
              </div>
            </div>
          </div>

          <div class="p-8 space-y-4 print:p-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-surface-900/60 border border-surface-700 rounded-lg p-4 print:bg-white print:border-gray-300">
                <div class="flex items-center gap-3 mb-2">
                  <LucideCalendar class="w-5 h-5 text-primary-500 print:text-red-600" />
                  <span class="text-surface-400 text-xs uppercase tracking-wider print:text-gray-600">Fecha de Cotización</span>
                </div>
                <p class="font-bold text-white text-lg print:text-black">{formatDate(quoteDate)}</p>
              </div>

              <div class="bg-surface-900/60 border border-surface-700 rounded-lg p-4 print:bg-white print:border-gray-300">
                <div class="flex items-center gap-3 mb-2">
                  <LucidePackage class="w-5 h-5 text-primary-500 print:text-red-600" />
                  <span class="text-surface-400 text-xs uppercase tracking-wider print:text-gray-600">Entrega Estimada</span>
                </div>
                <p class="font-bold text-white text-lg print:text-black">{formatDate(deliveryDate)}</p>
                <p class="text-surface-500 text-xs mt-1 print:text-gray-500">
                  Aproximadamente {DELIVERY_TIME_DAYS} días hábiles
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Products List -->
        <div class="bg-surface-800 border border-surface-700 rounded-lg overflow-hidden print:border-gray-300">
          <div class="px-8 pt-8 pb-6 border-b border-surface-700 print:px-4 print:py-3 print:border-gray-300">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-surface-700 border border-surface-600 rounded-lg flex items-center justify-center print:hidden">
                <LucideShoppingCart class="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h2 class="text-xl font-bold text-white uppercase tracking-wider print:text-black">
                  Productos Cotizados
                </h2>
                <p class="text-surface-300 text-sm mt-0.5 print:text-gray-600">
                  {$cartItemCount} {$cartItemCount === 1 ? 'artículo' : 'artículos'}
                </p>
              </div>
            </div>
          </div>

          <div class="p-8 space-y-4 print:p-4">
            {#each $cart as item, index}
              <div class="bg-surface-900/60 border border-surface-700 rounded-lg overflow-hidden print:bg-white print:border-gray-300">
                <div class="flex gap-4 p-4">
                  <!-- Product Image -->
                  <div class="w-24 h-24 bg-surface-700 rounded-lg overflow-hidden flex-shrink-0 print:w-20 print:h-20">
                    <img
                      src={getProductImageUrl(item, 0)}
                      alt={item.name}
                      class="w-full h-full object-cover"
                      on:error={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextElementSibling) e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div class="w-full h-full hidden items-center justify-center bg-surface-700">
                      <LucideF1 class="w-8 h-8 text-surface-400" />
                    </div>
                  </div>

                  <!-- Product Details -->
                  <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-start gap-4 mb-3">
                      <div class="flex-1">
                        <h3 class="font-bold text-white text-lg mb-1 print:text-black">{item.name}</h3>
                        <div class="flex flex-wrap gap-2 text-xs">
                          <span class="px-2 py-1 bg-surface-700 text-surface-200 rounded print:bg-gray-200 print:text-gray-700">
                            {item.team}
                          </span>
                          <span class="px-2 py-1 bg-surface-700 text-surface-200 rounded print:bg-gray-200 print:text-gray-700">
                            {item.scale}
                          </span>
                          <span class="px-2 py-1 bg-surface-700 text-surface-200 rounded print:bg-gray-200 print:text-gray-700">
                            {item.manufacturer}
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Pricing -->
                    <div class="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-surface-700 print:border-gray-300">
                      <div>
                        <span class="text-surface-400 text-xs uppercase tracking-wider block mb-1 print:text-gray-600">Precio Unit.</span>
                        <span class="font-semibold text-white print:text-black">Q. {item.price.toFixed(2)}</span>
                      </div>
                      <div>
                        <span class="text-surface-400 text-xs uppercase tracking-wider block mb-1 print:text-gray-600">Cantidad</span>
                        <span class="font-semibold text-white print:text-black">{item.quantity}</span>
                      </div>
                      <div>
                        <span class="text-surface-400 text-xs uppercase tracking-wider block mb-1 print:text-gray-600">Subtotal</span>
                        <span class="font-bold text-primary-500 text-lg print:text-red-600">
                          Q. {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>

        <!-- Action Buttons (only visible on screen, not print) -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center print:hidden">
          <button
            class="inline-flex items-center justify-center gap-2 bg-primary-500 text-white font-bold px-6 py-3.5 uppercase tracking-wider rounded-lg hover:bg-primary-600 transition-colors duration-200 shadow-lg"
            on:click={printQuote}
          >
            <LucidePrinter class="w-5 h-5" />
            Imprimir Cotización
          </button>

          <button
            class="inline-flex items-center justify-center gap-2 bg-surface-700 text-white font-bold px-6 py-3.5 uppercase tracking-wider rounded-lg hover:bg-surface-600 transition-colors duration-200 shadow-lg"
            on:click={downloadQuote}
          >
            <LucideDownload class="w-5 h-5" />
            Descargar
          </button>

          <button
            class="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3.5 uppercase tracking-wider rounded-lg hover:bg-[#20bd5a] transition-colors duration-200 shadow-lg"
            on:click={sendQuoteViaWhatsApp}
          >
            <TablerBrandWhatsapp class="w-5 h-5" />
            Enviar por WhatsApp
          </button>
        </div>
      </div>

      <!-- Summary Sidebar -->
      <div class="lg:col-span-1">
        <div class="sticky top-8 space-y-6 print:space-y-3">
          <!-- Total Summary Card -->
          <div class="bg-surface-800 border border-surface-700 rounded-lg overflow-hidden print:border-gray-300">
            <div class="px-6 pt-6 pb-4 border-b border-surface-700 print:px-4 print:py-3 print:border-gray-300">
              <h3 class="font-bold text-sm uppercase tracking-wider flex items-center gap-2 text-white print:text-black">
                <LucideDollarSign class="w-4 h-4 text-primary-500 print:text-red-600" />
                Resumen de Cotización
              </h3>
            </div>

            <div class="px-6 py-6 space-y-4 print:px-4 print:py-3">
              <div class="flex justify-between items-center text-sm">
                <span class="text-surface-400 print:text-gray-600">Total de artículos</span>
                <span class="font-semibold text-white print:text-black">{$cartItemCount}</span>
              </div>

              <div class="border-t border-surface-700 pt-4 print:border-gray-300">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-bold text-white uppercase tracking-wider print:text-black">Total</span>
                  <span class="text-2xl font-black text-primary-500 print:text-red-600">
                    Q. {$cartTotal.toFixed(2)}
                  </span>
                </div>
                <p class="text-xs text-surface-500 print:text-gray-500">
                  IVA incluido
                </p>
              </div>

              <div class="bg-surface-900/60 border border-surface-700 rounded-lg p-4 print:bg-gray-50 print:border-gray-300">
                <div class="flex items-start gap-2">
                  <LucideCalendar class="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0 print:text-red-600" />
                  <div>
                    <p class="text-xs font-semibold text-white mb-1 print:text-black">
                      Tiempo de Entrega
                    </p>
                    <p class="text-xs text-surface-400 print:text-gray-600">
                      {DELIVERY_TIME_DAYS} días hábiles aproximadamente
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Info Card -->
          <div class="bg-surface-800 border border-surface-700 rounded-lg p-5 print:hidden">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 bg-surface-700 border border-surface-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <LucideFileText class="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <p class="font-bold text-white text-sm mb-1">
                  Cotización Personalizada
                </p>
                <p class="text-surface-400 text-xs leading-relaxed">
                  Esta cotización es válida por 7 días. Envíala por WhatsApp para confirmar tu pedido.
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
  @media print {
    :global(body) {
      background: white !important;
    }

    :global(.bg-surface-900),
    :global(.bg-surface-800),
    :global(.bg-surface-700) {
      background: white !important;
    }

    :global(.text-white) {
      color: black !important;
    }

    :global(.border-surface-700),
    :global(.border-surface-600) {
      border-color: #d1d5db !important;
    }
  }
</style>
