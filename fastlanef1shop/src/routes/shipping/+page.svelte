<script lang="ts">
  import { onMount } from 'svelte';

  // Iconos
  import Formula1Icon from '~icons/arcticons/formula-1';
  import LucidePhone from '~icons/lucide/phone';
  import LucideEmail from '~icons/lucide/mail';
  import LucideMapPin from '~icons/lucide/map-pin';
  import LucideClock from '~icons/lucide/clock';
  import LucideFacebook from '~icons/lucide/facebook';
  import LucideInstagram from '~icons/lucide/instagram';
  import TablerBrandWhatsapp from '~icons/tabler/brand-whatsapp';
  import IcTwotoneTiktok from '~icons/ic/twotone-tiktok';
  import LucideHelmet from '~icons/lucide-lab/motor-racing-helmet';
  import LucideShoppingCart from '~icons/lucide/shopping-cart';
  import LucideHeart from '~icons/lucide/heart';
  import LucideSearch from '~icons/lucide/search';
  import LucideTruck from '~icons/lucide/truck';
  import LucideShield from '~icons/lucide/shield-check';
  import LucideUsers from '~icons/lucide/users';
  import LucidePackage from '~icons/lucide/package';

  const pageTitle = "Información de Envíos - Fast Lane F1 Shop";
  const pageDescription = "Conoce nuestras políticas de envío, tiempos de entrega y métodos de pago para tu colección de monoplazas de Fórmula 1.";

  onMount(() => {
    document.title = pageTitle;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', pageDescription);
    }
  });

  function openWhatsApp() {
    const message = "¡Hola! Necesito información sobre envíos y métodos de pago.";
    window.open(`https://wa.me/+50249395444?text=${encodeURIComponent(message)}`, '_blank');
  }
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
</svelte:head>

<div class="min-h-screen bg-surface-900">
  <div class="container mx-auto px-4 py-12 max-w-7xl">

    <!-- Hero Section -->
    <div class="text-center mb-20">
      <div class="flex items-center justify-center mb-8">
        <div class="w-20 h-20 bg-primary-500 rounded-3xl flex items-center justify-center shadow-xl mr-6">
          <LucideTruck class="text-white w-10 h-10" />
        </div>
        <div>
          <h1 class="text-5xl md:text-7xl font-black text-surface-50 leading-tight">
            Información de Envíos
          </h1>
        </div>
      </div>
      <div class="max-w-4xl mx-auto">
        <p class="text-xl md:text-2xl text-surface-300 leading-relaxed">
          Tu colección de Fórmula 1 merece llegar a ti en <span class="font-bold text-success-500">perfectas condiciones</span>.
          Conoce nuestros métodos de envío y políticas de entrega.
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="space-y-16">

      <!-- Sección de Métodos de Envío -->
      <section class="max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-surface-50 mb-4 flex items-center justify-center">
            <LucidePackage class="mr-4 w-8 h-8 text-primary-500" />
            Métodos de Envío
          </h2>
          <div class="w-24 h-1 bg-primary-500 mx-auto rounded-full"></div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Envío Nacional -->
          <div class="h-full p-8 bg-surface-800 rounded-2xl border border-surface-700 shadow-lg">
            <div class="flex items-center mb-6">
              <div class="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <LucideTruck class="w-8 h-8 text-white" />
              </div>
              <div class="ml-6">
                <h3 class="text-2xl font-bold text-primary-200">
                  Envío Nacional
                </h3>
                <p class="text-primary-400">Guatemala</p>
              </div>
            </div>

            <div class="space-y-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div class="text-center p-4 bg-surface-700/50 rounded-xl">
                  <div class="font-bold text-surface-200 text-lg mb-1">
                    Ciudad de Guatemala y municipios aledaños
                  </div>
                  <div class="text-primary-400 font-semibold">
                    1-2 días hábiles
                  </div>
                </div>
                <div class="text-center p-4 bg-surface-700/50 rounded-xl">
                  <div class="font-bold text-surface-200 text-lg mb-1">
                    Departamentos
                  </div>
                  <div class="text-primary-400 font-semibold">
                    2-4 días hábiles
                  </div>
                </div>
              </div>

              <div class="text-center p-4 bg-primary-500 rounded-xl">
                <div class="font-bold text-lg mb-1 text-white">Costo de Envío</div>
                <div class="text-primary-100">Desde Q.25 (varía según ubicación y peso)</div>
              </div>
            </div>
          </div>

          <!-- Entrega Personal -->
          <div class="h-full p-8 bg-surface-800 rounded-2xl border border-surface-700 shadow-lg">
            <div class="flex items-center mb-6">
              <div class="w-16 h-16 bg-success-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <LucideUsers class="w-8 h-8 text-white" />
              </div>
              <div class="ml-6">
                <h3 class="text-2xl font-bold text-success-200">
                  Entrega Personal
                </h3>
                <p class="text-success-400">Área Metropolitana</p>
              </div>
            </div>

            <div class="space-y-6">
              <div class="text-center p-4 bg-surface-700/50 rounded-xl">
                <div class="font-bold text-surface-200 text-lg mb-2">
                  Coordinación Personalizada
                </div>
                <div class="text-surface-200">
                  Te contactamos para acordar el mejor punto de encuentro (limitado a sectores específicos y horarios).
                </div>
              </div>

              <div class="text-center p-4 bg-success-500 rounded-xl">
                <div class="font-bold text-lg mb-2 text-white">Ventajas Exclusivas</div>
                <div class="text-success-100">
                  <div>✓ Revisión inmediata del producto</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Sección de Métodos de Pago -->
      <section class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-surface-50 mb-4 flex items-center justify-center">
            <LucideShield class="mr-4 w-8 h-8 text-secondary-500" />
            Métodos de Pago
          </h2>
          <div class="w-24 h-1 bg-secondary-500 mx-auto rounded-full"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="h-full p-8 bg-surface-800 rounded-2xl border border-surface-700 shadow-lg text-center">
            <div class="w-20 h-20 bg-success-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <TablerBrandWhatsapp class="w-10 h-10 text-white" />
            </div>
            <h3 class="text-2xl font-bold text-surface-100 mb-3">
              Pago Contra Entrega
            </h3>
            <p class="text-surface-200 text-lg">
              Paga en efectivo al recibir tu pedido de forma segura
            </p>
          </div>

          <div class="h-full p-8 bg-surface-800 rounded-2xl border border-surface-700 shadow-lg text-center">
            <div class="w-20 h-20 bg-primary-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <LucidePhone class="w-10 h-10 text-white" />
            </div>
            <h3 class="text-2xl font-bold text-surface-100 mb-3">
              Transferencia Bancaria
            </h3>
            <p class="text-surface-200 text-lg">
              Para pedidos con reserva y compras anticipadas
            </p>
          </div>
        </div>
      </section>

      <!-- Sección de Garantías -->
      <section class="max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-surface-50 mb-4 flex items-center justify-center">
            <LucideShield class="mr-4 w-8 h-8 text-tertiary-500" />
            Garantías y Políticas
          </h2>
          <div class="w-24 h-1 bg-tertiary-500 mx-auto rounded-full"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Empaque Especializado -->
          <div class="h-full p-8 bg-surface-800 rounded-2xl border border-surface-700 shadow-lg">
            <div class="text-center mb-6">
              <div class="w-16 h-16 bg-tertiary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <LucidePackage class="w-8 h-8 text-white" />
              </div>
              <h3 class="text-2xl font-bold text-surface-100">
                Empaque Especializado
              </h3>
            </div>

            <div class="space-y-4">
              <div class="flex items-center p-3 bg-surface-700/50 rounded-xl">
                <div class="w-3 h-3 bg-tertiary-500 rounded-full mr-4 flex-shrink-0"></div>
                <span class="text-surface-300 font-medium">
                  Cajas reforzadas para proteger tu inversión
                </span>
              </div>
              <div class="flex items-center p-3 bg-surface-700/50 rounded-xl">
                <div class="w-3 h-3 bg-tertiary-500 rounded-full mr-4 flex-shrink-0"></div>
                <span class="text-surface-300 font-medium">
                  Material de relleno especializado
                </span>
              </div>
              <div class="flex items-center p-3 bg-surface-700/50 rounded-xl">
                <div class="w-3 h-3 bg-tertiary-500 rounded-full mr-4 flex-shrink-0"></div>
                <span class="text-surface-300 font-medium">
                  Seguro de transporte incluido
                </span>
              </div>
            </div>
          </div>

          <!-- Garantía de Satisfacción -->
          <div class="h-full p-8 bg-surface-800 rounded-2xl border border-surface-700 shadow-lg">
            <div class="text-center mb-6">
              <div class="w-16 h-16 bg-warning-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <LucideHeart class="w-8 h-8 text-white" />
              </div>
              <h3 class="text-2xl font-bold text-surface-100">
                Garantía de Satisfacción
              </h3>
            </div>

            <div class="space-y-4">
              <div class="flex items-center p-3 bg-surface-700/50 rounded-xl">
                <div class="w-3 h-3 bg-warning-500 rounded-full mr-4 flex-shrink-0"></div>
                <span class="text-surface-300 font-medium">
                  Fotos del producto real antes del envío
                </span>
              </div>
              <div class="flex items-center p-3 bg-surface-700/50 rounded-xl">
                <div class="w-3 h-3 bg-warning-500 rounded-full mr-4 flex-shrink-0"></div>
                <span class="text-surface-300 font-medium">
                  Seguimiento completo del pedido
                </span>
              </div>
              <div class="flex items-center p-3 bg-surface-700/50 rounded-xl">
                <div class="w-3 h-3 bg-warning-500 rounded-full mr-4 flex-shrink-0"></div>
                <span class="text-surface-300 font-medium">
                  Atención personalizada 24/7
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Información Importante -->
      <section class="max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-surface-50 mb-4">
            Información Importante
          </h2>
          <div class="w-24 h-1 bg-primary-500 mx-auto rounded-full"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="h-full p-8 bg-surface-800 rounded-2xl border border-surface-700 shadow-lg text-center">
            <div class="w-20 h-20 bg-primary-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <LucideClock class="w-10 h-10 text-white" />
            </div>
            <h3 class="text-2xl font-bold text-surface-100 mb-4">
              Procesamiento
            </h3>
            <p class="text-surface-300 leading-relaxed">
              Todos los pedidos se procesan dentro de 24-48 horas después de confirmado.
            </p>
          </div>

          <div class="h-full p-8 bg-surface-800 rounded-2xl border border-surface-700 shadow-lg text-center">
            <div class="w-20 h-20 bg-secondary-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <LucideSearch class="w-10 h-10 text-white" />
            </div>
            <h3 class="text-2xl font-bold text-surface-100 mb-4">
              Seguimiento
            </h3>
            <p class="text-surface-300 leading-relaxed">
              Te proporcionamos número de guía para rastrear tu pedido en tiempo real.
            </p>
          </div>

          <div class="h-full p-8 bg-surface-800 rounded-2xl border border-surface-700 shadow-lg text-center">
            <div class="w-20 h-20 bg-tertiary-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <LucideHeart class="w-10 h-10 text-white" />
            </div>
            <h3 class="text-2xl font-bold text-surface-100 mb-4">
              Cuidado Especial
            </h3>
            <p class="text-surface-300 leading-relaxed">
              Cada monoplaza es tratado como la obra de arte que es, con el máximo cuidado.
            </p>
          </div>
        </div>
      </section>

      <!-- Cobertura Nacional -->
      <section class="max-w-5xl mx-auto">
        <div class="p-12 bg-surface-800 rounded-3xl border border-surface-700 shadow-xl">
          <div class="text-center mb-10">
            <h3 class="text-4xl font-bold text-surface-50 mb-4 flex items-center justify-center">
              <LucideMapPin class="mr-4 w-8 h-8 text-success-500" />
              Cobertura Nacional
            </h3>
            <div class="w-24 h-1 bg-success-500 mx-auto rounded-full mb-6"></div>
            <p class="text-xl text-surface-300 leading-relaxed max-w-3xl mx-auto">
              Llevamos tu pasión por la Fórmula 1 a cada rincón de Guatemala. Desde la capital hasta los departamentos más remotos,
              tu colección llegará segura a tus manos.
            </p>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            {#each ['Guatemala', 'Sacatepéquez', 'Escuintla', 'Chimaltenango', 'Quetzaltenango', 'Huehuetenango', 'Petén', 'Y más...'] as department, i}
              <div class="p-4 bg-surface-700/50 rounded-xl border border-surface-600 text-center">
                <span class="font-bold text-surface-200 text-lg">
                  {department}
                </span>
              </div>
            {/each}
          </div>
        </div>
      </section>

      <!-- CTA Final -->
      <section class="max-w-4xl mx-auto">
        <div class="p-12 bg-primary-500 rounded-3xl shadow-xl text-center">
          <div class="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <TablerBrandWhatsapp class="w-12 h-12 text-white" />
          </div>

          <h3 class="text-4xl font-bold mb-6 text-white">
            ¿Tienes Dudas sobre tu Envío?
          </h3>
          <p class="text-xl mb-10 text-primary-100 leading-relaxed max-w-2xl mx-auto">
            Nuestro equipo está listo para resolver todas tus preguntas sobre envíos, tiempos de entrega y métodos de pago.
          </p>

          <button
            class="bg-white text-primary-600 font-bold text-xl px-10 py-5 rounded-2xl hover:bg-primary-50 transition-colors duration-300 flex items-center mx-auto"
            on:click={openWhatsApp}
          >
            <TablerBrandWhatsapp class="mr-3 w-6 h-6" />
            Consultar por WhatsApp
          </button>
        </div>
      </section>
    </div>
  </div>
</div>