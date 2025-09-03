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

<div class="min-h-screen bg-gradient-to-b from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
  <div class="container mx-auto px-4 py-12 max-w-7xl">
    
    <!-- Hero Section - Mejorado y centrado -->
    <div class="text-center mb-20">
      <div class="flex items-center justify-center mb-8">
        <div class="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl flex items-center justify-center shadow-2xl mr-6 transform hover:scale-105 transition-transform duration-300">
          <LucideTruck class="text-white w-10 h-10" />
        </div>
        <div>
          <h1 class="text-5xl md:text-7xl font-black bg-gradient-to-r from-secondary-600 via-primary-600 to-tertiary-600 bg-clip-text text-transparent leading-tight">
            Información de Envíos
          </h1>
        </div>
      </div>
      <div class="max-w-4xl mx-auto">
        <p class="text-xl md:text-2xl text-surface-600 dark:text-surface-300 leading-relaxed">
          Tu colección de Fórmula 1 merece llegar a ti en <span class="font-bold text-success-600 bg-success-100 dark:bg-success-900/30 px-2 py-1 rounded-lg">perfectas condiciones</span>. 
          Conoce nuestros métodos de envío y políticas de entrega.
        </p>
      </div>
    </div>

    <!-- Main Content - Reorganizado con mejor alineación -->
    <div class="space-y-16">
      
      <!-- Sección de Métodos de Envío - Centrada y balanceada -->
      <section class="max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-surface-900 dark:text-surface-50 mb-4 flex items-center justify-center">
            <LucidePackage class="mr-4 w-8 h-8 text-primary-500" />
            Métodos de Envío
          </h2>
          <div class="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Envío Nacional -->
          <div class="group hover:scale-[1.02] transition-transform duration-300">
            <div class="h-full p-8 bg-gradient-to-br from-white to-primary-50 dark:from-surface-800 dark:to-primary-900/20 rounded-2xl border-2 border-primary-200 dark:border-primary-800 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div class="flex items-center mb-6">
                <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <LucideTruck class="w-8 h-8 text-white" />
                </div>
                <div class="ml-6">
                  <h3 class="text-2xl font-bold text-primary-800 dark:text-primary-200">
                    Envío Nacional
                  </h3>
                  <p class="text-primary-600 dark:text-primary-400">Guatemala</p>
                </div>
              </div>
              
              <div class="space-y-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div class="text-center p-4 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                    <div class="font-bold text-primary-800 dark:text-primary-300 text-lg mb-1">
                      Ciudad de Guatemala y municipios aledaños
                    </div>
                    <div class="text-primary-600 dark:text-primary-400 font-semibold">
                      1-2 días hábiles
                    </div>
                  </div>
                  <div class="text-center p-4 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                    <div class="font-bold text-primary-800 dark:text-primary-300 text-lg mb-1">
                      Departamentos
                    </div>
                    <div class="text-primary-600 dark:text-primary-400 font-semibold">
                      2-4 días hábiles
                    </div>
                  </div>
                </div>
                
                <div class="text-center p-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl text-primary-500">
                  <div class="font-bold text-lg mb-1">Costo de Envío</div>
                  <div class="text-primary-900">Desde Q.25 (varía según ubicación y peso)</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Entrega Personal -->
          <div class="group hover:scale-[1.02] transition-transform duration-300">
            <div class="h-full p-8 bg-gradient-to-br from-white to-success-50 dark:from-surface-800 dark:to-success-900/20 rounded-2xl border-2 border-success-200 dark:border-success-800 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div class="flex items-center mb-6">
                <div class="w-16 h-16 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <LucideUsers class="w-8 h-8 text-white" />
                </div>
                <div class="ml-6">
                  <h3 class="text-2xl font-bold text-success-800 dark:text-success-200">
                    Entrega Personal
                  </h3>
                  <p class="text-success-600 dark:text-success-400">Área Metropolitana</p>
                </div>
              </div>
              
              <div class="space-y-6">
                <div class="text-center p-4 bg-success-100 dark:bg-success-900/30 rounded-xl">
                  <div class="font-bold text-success-800 dark:text-success-300 text-lg mb-2">
                    Coordinación Personalizada
                  </div>
                  <div class="text-success-600 dark:text-success-400">
                    Te contactamos para acordar el mejor punto de encuentro (limitado a sectores específicos y horarios). 
                  </div>
                </div>
                
                <div class="text-center p-4 bg-gradient-to-r from-success-500 to-secondary-500 rounded-xl text-success-900">
                  <div class="font-bold text-lg mb-2">Ventajas Exclusivas</div>
                  <div class="space-y-1 text-success-800">
                    <div>✓ Revisión inmediata del producto</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Sección de Métodos de Pago - Centrada -->
      <section class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-surface-900 dark:text-surface-50 mb-4 flex items-center justify-center">
            <LucideShield class="mr-4 w-8 h-8 text-secondary-500" />
            Métodos de Pago
          </h2>
          <div class="w-24 h-1 bg-gradient-to-r from-secondary-500 to-tertiary-500 mx-auto rounded-full"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="group hover:scale-[1.02] transition-transform duration-300">
            <div class="h-full p-8 bg-gradient-to-br from-white to-success-50 dark:from-surface-800 dark:to-success-900/20 rounded-2xl border-2 border-success-200 dark:border-success-800 shadow-xl text-center">
              <div class="w-20 h-20 bg-gradient-to-br from-success-500 to-success-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <TablerBrandWhatsapp class="w-10 h-10 text-white" />
              </div>
              <h3 class="text-2xl font-bold text-success-800 dark:text-success-200 mb-3">
                Pago Contra Entrega
              </h3>
              <p class="text-success-600 dark:text-success-400 text-lg">
                Paga en efectivo al recibir tu pedido de forma segura
              </p>
            </div>
          </div>

          <div class="group hover:scale-[1.02] transition-transform duration-300">
            <div class="h-full p-8 bg-gradient-to-br from-white to-primary-50 dark:from-surface-800 dark:to-primary-900/20 rounded-2xl border-2 border-primary-200 dark:border-primary-800 shadow-xl text-center">
              <div class="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <LucidePhone class="w-10 h-10 text-white" />
              </div>
              <h3 class="text-2xl font-bold text-primary-800 dark:text-primary-200 mb-3">
                Transferencia Bancaria
              </h3>
              <p class="text-primary-600 dark:text-primary-200 text-lg">
                Para pedidos con reserva y compras anticipadas
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Sección de Garantías - Reorganizada -->
      <section class="max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-surface-900 dark:text-surface-50 mb-4 flex items-center justify-center">
            <LucideShield class="mr-4 w-8 h-8 text-tertiary-500" />
            Garantías y Políticas
          </h2>
          <div class="w-24 h-1 bg-gradient-to-r from-tertiary-500 to-warning-500 mx-auto rounded-full"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Empaque Especializado -->
          <div class="group hover:scale-[1.02] transition-transform duration-300">
            <div class="h-full p-8 bg-gradient-to-br from-white to-tertiary-50 dark:from-surface-800 dark:to-tertiary-900/20 rounded-2xl border-2 border-tertiary-200 dark:border-tertiary-800 shadow-xl">
              <div class="text-center mb-6">
                <div class="w-16 h-16 bg-gradient-to-br from-tertiary-500 to-tertiary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <LucidePackage class="w-8 h-8 text-primary-500" />
                </div>
                <h3 class="text-2xl font-bold text-tertiary-800 dark:text-tertiary-200">
                  Empaque Especializado
                </h3>
              </div>
              
              <div class="space-y-4">
                <div class="flex items-center p-3 bg-tertiary-100 dark:bg-tertiary-900/30 rounded-xl">
                  <div class="w-3 h-3 bg-tertiary-500 rounded-full mr-4 flex-shrink-0"></div>
                  <span class="text-tertiary-700 dark:text-tertiary-300 font-medium">
                    Cajas reforzadas para proteger tu inversión
                  </span>
                </div>
                <div class="flex items-center p-3 bg-tertiary-100 dark:bg-tertiary-900/30 rounded-xl">
                  <div class="w-3 h-3 bg-tertiary-500 rounded-full mr-4 flex-shrink-0"></div>
                  <span class="text-tertiary-700 dark:text-tertiary-300 font-medium">
                    Material de relleno especializado
                  </span>
                </div>
                <div class="flex items-center p-3 bg-tertiary-100 dark:bg-tertiary-900/30 rounded-xl">
                  <div class="w-3 h-3 bg-tertiary-500 rounded-full mr-4 flex-shrink-0"></div>
                  <span class="text-tertiary-700 dark:text-tertiary-300 font-medium">
                    Seguro de transporte incluido
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Garantía de Satisfacción -->
          <div class="group hover:scale-[1.02] transition-transform duration-300">
            <div class="h-full p-8 bg-gradient-to-br from-white to-warning-50 dark:from-surface-800 dark:to-warning-900/20 rounded-2xl border-2 border-warning-200 dark:border-warning-800 shadow-xl">
              <div class="text-center mb-6">
                <div class="w-16 h-16 bg-gradient-to-br from-warning-500 to-warning-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <LucideHeart class="w-8 h-8 text-white" />
                </div>
                <h3 class="text-2xl font-bold text-warning-800 dark:text-warning-200">
                  Garantía de Satisfacción
                </h3>
              </div>
              
              <div class="space-y-4">
                <div class="flex items-center p-3 bg-warning-100 dark:bg-warning-900/30 rounded-xl">
                  <div class="w-3 h-3 bg-warning-500 rounded-full mr-4 flex-shrink-0"></div>
                  <span class="text-warning-700 dark:text-warning-300 font-medium">
                    Fotos del producto real antes del envío
                  </span>
                </div>
                <div class="flex items-center p-3 bg-warning-100 dark:bg-warning-900/30 rounded-xl">
                  <div class="w-3 h-3 bg-warning-500 rounded-full mr-4 flex-shrink-0"></div>
                  <span class="text-warning-700 dark:text-warning-300 font-medium">
                    Seguimiento completo del pedido
                  </span>
                </div>
                <div class="flex items-center p-3 bg-warning-100 dark:bg-warning-900/30 rounded-xl">
                  <div class="w-3 h-3 bg-warning-500 rounded-full mr-4 flex-shrink-0"></div>
                  <span class="text-warning-700 dark:text-warning-300 font-medium">
                    Atención personalizada 24/7
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Información Importante - Recentrada -->
      <section class="max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-surface-900 dark:text-surface-50 mb-4">
            Información Importante
          </h2>
          <div class="w-24 h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-tertiary-500 mx-auto rounded-full"></div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="group hover:scale-[1.05] transition-transform duration-300">
            <div class="h-full p-8 bg-gradient-to-br from-white to-primary-50 dark:from-surface-800 dark:to-primary-900/20 rounded-2xl border-2 border-primary-200 dark:border-primary-800 shadow-xl text-center">
              <div class="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <LucideClock class="w-10 h-10 text-white" />
              </div>
              <h3 class="text-2xl font-bold text-primary-800 dark:text-primary-200 mb-4">
                Procesamiento
              </h3>
              <p class="text-primary-700 dark:text-primary-300 leading-relaxed">
                Todos los pedidos se procesan dentro de 24-48 horas después de confirmado.
              </p>
            </div>
          </div>

          <div class="group hover:scale-[1.05] transition-transform duration-300">
            <div class="h-full p-8 bg-gradient-to-br from-white to-secondary-50 dark:from-surface-800 dark:to-secondary-900/20 rounded-2xl border-2 border-secondary-200 dark:border-secondary-800 shadow-xl text-center">
              <div class="w-20 h-20 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <LucideSearch class="w-10 h-10 text-primary-500" />
              </div>
              <h3 class="text-2xl font-bold text-secondary-800 dark:text-secondary-200 mb-4">
                Seguimiento
              </h3>
              <p class="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                Te proporcionamos número de guía para rastrear tu pedido en tiempo real.
              </p>
            </div>
          </div>

          <div class="group hover:scale-[1.05] transition-transform duration-300">
            <div class="h-full p-8 bg-gradient-to-br from-white to-tertiary-50 dark:from-surface-800 dark:to-tertiary-900/20 rounded-2xl border-2 border-tertiary-200 dark:border-tertiary-800 shadow-xl text-center">
              <div class="w-20 h-20 bg-gradient-to-br from-tertiary-500 to-tertiary-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <LucideHeart class="w-10 h-10 text-primary-500" />
              </div>
              <h3 class="text-2xl font-bold text-tertiary-800 dark:text-tertiary-200 mb-4">
                Cuidado Especial
              </h3>
              <p class="text-tertiary-700 dark:text-tertiary-300 leading-relaxed">
                Cada monoplaza es tratado como la obra de arte que es, con el máximo cuidado.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Cobertura Nacional - Mejorada -->
      <section class="max-w-5xl mx-auto">
        <div class="p-12 bg-gradient-to-br from-white to-success-50 dark:from-surface-800 dark:to-success-900/20 rounded-3xl border-2 border-success-200 dark:border-success-800 shadow-2xl">
          <div class="text-center mb-10">
            <h3 class="text-4xl font-bold text-surface-900 dark:text-surface-50 mb-4 flex items-center justify-center">
              <LucideMapPin class="mr-4 w-8 h-8 text-success-500" />
              Cobertura Nacional
            </h3>
            <div class="w-24 h-1 bg-gradient-to-r from-success-500 to-primary-500 mx-auto rounded-full mb-6"></div>
            <p class="text-xl text-surface-600 dark:text-surface-300 leading-relaxed max-w-3xl mx-auto">
              Llevamos tu pasión por la Fórmula 1 a cada rincón de Guatemala. Desde la capital hasta los departamentos más remotos, 
              tu colección llegará segura a tus manos.
            </p>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            {#each ['Guatemala', 'Sacatepéquez', 'Escuintla', 'Chimaltenango', 'Quetzaltenango', 'Huehuetenango', 'Petén', 'Y más...'] as department, i}
              <div class="group hover:scale-[1.05] transition-transform duration-300">
                <div class="p-4 bg-gradient-to-br from-success-100 to-primary-100 dark:from-success-900/30 dark:to-primary-900/30 rounded-xl border border-success-200 dark:border-success-700 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <span class="font-bold text-success-800 dark:text-success-300 text-lg">
                    {department}
                  </span>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </section>

      <!-- CTA Final - Centrado y mejorado -->
      <section class="max-w-4xl mx-auto">
        <div class="p-12 bg-gradient-to-br from-primary-500 via-secondary-500 to-tertiary-500 rounded-3xl shadow-2xl text-center text-white relative overflow-hidden">
          <!-- Efecto de fondo -->
          <div class="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-transparent"></div>
          
          <div class="relative z-10">
            <div class="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
              <TablerBrandWhatsapp class="w-12 h-12 text-primary-500" />
            </div>
            
            <h3 class="text-4xl text-primary-500 font-bold mb-6">
              ¿Tienes Dudas sobre tu Envío?
            </h3>
            <p class="text-xl mb-10 text-primary-500/90 leading-relaxed max-w-2xl mx-auto">
              Nuestro equipo está listo para resolver todas tus preguntas sobre envíos, tiempos de entrega y métodos de pago.
            </p>
            
            <button 
              class="group bg-white text-primary-600 font-bold text-xl px-10 py-5 rounded-2xl hover:scale-[1.05] hover:shadow-2xl transition-all duration-300 flex items-center mx-auto"
              on:click={openWhatsApp}
            >
              <TablerBrandWhatsapp class="mr-3 w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              Consultar por WhatsApp
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</div>