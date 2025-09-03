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

  const pageTitle = "Contacto - Fast Lane F1 Shop";
  const pageDescription = "¿No encuentras el monoplaza que buscas? Contáctanos y lo conseguimos para ti. Atención personalizada para coleccionistas exigentes.";

  onMount(() => {
    document.title = pageTitle;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', pageDescription);
    }
  });

  function openWhatsApp() {
    const message = "¡Hola! Me interesa conocer más sobre los monoplazas de F1 que tienen disponibles.";
    window.open(`https://wa.me/+50249395444?text=${encodeURIComponent(message)}`, '_blank');
  }

  function openSocialMedia(platform: string) {
    const urls = {
      facebook: 'https://www.facebook.com/share/1GkYFBVWRQ/?mibextid=wwXIfr',
      instagram: 'https://www.instagram.com/fastlanef1shop/',
      tiktok: 'https://www.tiktok.com/@fastlanef1.shop'
    };
    window.open(urls[platform], '_blank');
  }
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-surface-50 via-surface-100 to-surface-50 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900">
  <div class="container mx-auto px-4 py-16 max-w-7xl">
    
    <!-- Hero Section - Centrado y balanceado -->
    <div class="text-center mb-20">
      <div class="inline-flex items-center justify-center mb-8">
        <div class="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl flex items-center justify-center shadow-2xl mr-6 rotate-3 hover:rotate-0 transition-transform duration-300">
          <Formula1Icon class="text-white w-10 h-10" />
        </div>
        <h1 class="text-5xl md:text-7xl font-black bg-gradient-to-r from-primary-600 via-secondary-600 to-tertiary-600 bg-clip-text text-transparent">
          Contáctanos
        </h1>
      </div>
      <div class="max-w-4xl mx-auto">
        <p class="text-xl md:text-2xl text-surface-600 dark:text-surface-300 leading-relaxed mb-4">
          ¿No encuentras el monoplaza que buscas en nuestro catálogo?
        </p>
        <p class="text-lg md:text-xl text-surface-500 dark:text-surface-400 leading-relaxed">
          <span class="font-semibold text-primary-600 dark:text-primary-400">¡No te preocupes!</span> 
          Podemos conseguir cualquier modelo que desees. Contáctanos y lo haremos realidad.
        </p>
      </div>
    </div>

    <!-- Main Content Grid - Mejorada la distribución -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-20">
      
      <!-- Contact Information - Ocupa 2 columnas en xl -->
      <div class="xl:col-span-2">
        <div class="card variant-ghost-primary p-8 border-l-4 border-primary-500 h-full">
          <div class="flex items-center mb-8">
            <LucideHelmet class="mr-4 w-8 h-8 text-primary-500" />
            <h2 class="text-3xl font-bold text-surface-900 dark:text-surface-50">
              Información de Contacto
            </h2>
          </div>

          <!-- WhatsApp - Destacado y mejorado -->
          <div class="mb-8">
            <div class="bg-gradient-to-r from-success-50 to-success-100 dark:from-success-900/30 dark:to-success-800/30 rounded-2xl border-2 border-success-200 dark:border-success-700 p-6 hover:shadow-xl transition-all duration-300">
              <div class="flex items-start space-x-6">
                <div class="w-16 h-16 bg-success-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <TablerBrandWhatsapp class="w-8 h-8 text-primary-500" />
                </div>
                <div class="flex-1">
                  <div class="flex items-center mb-2">
                    <h3 class="text-xl font-bold text-success-800 dark:text-success-200">WhatsApp</h3>
                    <span class="ml-3 px-3 py-1 bg-success-200 dark:bg-success-800 text-success-800 dark:text-success-200 text-xs font-semibold rounded-full">Principal</span>
                  </div>
                  <p class="text-2xl font-bold text-success-700 dark:text-success-300 mb-3">+502 4939-5444</p>
                  <div class="flex flex-wrap gap-2 mb-4">
                    <span class="px-3 py-1 bg-success-100 dark:bg-success-800/50 text-success-700 dark:text-success-300 text-sm rounded-full">Atención personalizada</span>
                    <span class="px-3 py-1 bg-success-100 dark:bg-success-800/50 text-success-700 dark:text-success-300 text-sm rounded-full">Respuesta inmediata</span>
                    <span class="px-3 py-1 bg-success-100 dark:bg-success-800/50 text-success-700 dark:text-success-300 text-sm rounded-full">Pedidos especiales</span>
                  </div>
                  <button 
                    class="btn variant-filled-success btn-lg font-semibold hover:scale-105 transition-transform duration-200"
                    on:click={openWhatsApp}
                  >
                    <TablerBrandWhatsapp class="mr-3 w-5 h-5" />
                    Enviar Mensaje
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Other Contact Info - Mejor organizada -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Location -->
            <div class="flex items-start space-x-4 p-6 bg-surface-50 dark:bg-surface-800 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-750 transition-colors duration-200">
              <div class="w-12 h-12 bg-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <LucideMapPin class="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-surface-900 dark:text-surface-50 mb-2">Ubicación</h3>
                <p class="text-surface-600 dark:text-surface-300 font-semibold">Guatemala, Guatemala</p>
                <p class="text-sm text-surface-500 dark:text-surface-400">Envíos a toda Guatemala</p>
              </div>
            </div>

            <!-- Schedule -->
            <div class="flex items-start space-x-4 p-6 bg-surface-50 dark:bg-surface-800 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-750 transition-colors duration-200">
              <div class="w-12 h-12 bg-tertiary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <LucideClock class="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-surface-900 dark:text-surface-50 mb-2">Horario de Atención</h3>
                <p class="text-surface-600 dark:text-surface-300 text-sm font-semibold">Lunes a Sábado: 9:00 AM - 7:00 PM</p>
                <p class="text-surface-600 dark:text-surface-300 text-sm font-semibold">Domingo: 10:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Social Media - Sidebar -->
      <div class="xl:col-span-1">
        <div class="card variant-ghost-secondary p-8 border-l-4 border-secondary-500 h-full">
          <div class="flex items-center mb-6">
            <LucideInstagram class="mr-3 w-6 h-6 text-secondary-500" />
            <h3 class="text-2xl font-bold text-surface-900 dark:text-surface-50">Redes Sociales</h3>
          </div>
          
          <p class="text-surface-600 dark:text-surface-300 mb-6">Síguenos para ver las últimas novedades y modelos exclusivos</p>
          
          <div class="space-y-4">
            <button 
              class="w-full btn variant-soft-primary p-4 h-auto flex items-center justify-start space-x-4 hover:variant-filled-primary transition-all duration-300 group"
              on:click={() => openSocialMedia('facebook')}
            >
              <LucideFacebook class="w-6 h-6 group-hover:scale-110 transition-transform" />
              <div class="text-left">
                <div class="font-semibold">Facebook</div>
                <div class="text-xs opacity-70">Noticias y actualizaciones</div>
              </div>
            </button>
            
            <button 
              class="w-full btn variant-soft-success p-4 h-auto flex items-center justify-start space-x-4 hover:variant-filled-success transition-all duration-300 group"
              on:click={() => openSocialMedia('instagram')}
            >
              <LucideInstagram class="w-6 h-6 group-hover:scale-110 transition-transform" />
              <div class="text-left">
                <div class="font-semibold">Instagram</div>
                <div class="text-xs opacity-70">Fotos de productos</div>
              </div>
            </button>
            
            <button 
              class="w-full btn variant-soft-error p-4 h-auto flex items-center justify-start space-x-4 hover:variant-filled-error transition-all duration-300 group"
              on:click={() => openSocialMedia('tiktok')}
            >
              <IcTwotoneTiktok class="w-6 h-6 group-hover:scale-110 transition-transform" />
              <div class="text-left">
                <div class="font-semibold">TikTok</div>
                <div class="text-xs opacity-70">Videos y reviews</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Services Section - Mejor distribuida -->
    <div class="mb-20">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-surface-900 dark:text-surface-50 mb-4">
          ¿Qué Podemos Hacer por Ti?
        </h2>
        <p class="text-lg text-surface-600 dark:text-surface-300 max-w-3xl mx-auto">
          Nuestro compromiso es hacer realidad la colección de tus sueños
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="card variant-ghost-primary p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
          <div class="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <LucideShoppingCart class="w-8 h-8 text-white" />
          </div>
          <h3 class="text-xl font-bold text-surface-900 dark:text-surface-50 mb-4">Pedidos Especiales</h3>
          <p class="text-surface-600 dark:text-surface-300 leading-relaxed">
            ¿Buscas un modelo específico? Podemos conseguir cualquier monoplaza de F1, desde ediciones limitadas hasta modelos vintage.
          </p>
        </div>

        <div class="card variant-ghost-secondary p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
          <div class="w-16 h-16 bg-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <LucideHeart class="w-8 h-8 text-primary-500" />
          </div>
          <h3 class="text-xl font-bold text-surface-900 dark:text-surface-50 mb-4">Atención Personalizada</h3>
          <p class="text-surface-600 dark:text-surface-300 leading-relaxed">
            Cada coleccionista es único. Te asesoramos personalmente para encontrar el monoplaza perfecto según tus gustos.
          </p>
        </div>

        <div class="card variant-ghost-tertiary p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 md:col-span-2 lg:col-span-1">
          <div class="w-16 h-16 bg-tertiary-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <LucideTruck class="w-8 h-8 text-primary-500" />
          </div>
          <h3 class="text-xl font-bold text-surface-900 dark:text-surface-50 mb-4">Envíos Seguros</h3>
          <p class="text-surface-600 dark:text-surface-300 leading-relaxed">
            Empaque especializado para proteger tu inversión. Seguimiento completo desde que sale hasta que llega a ti.
          </p>
        </div>
      </div>
    </div>

    <!-- CTA Section - Centralizada y mejorada -->
    <div class="mb-20">
      <div class="card variant-gradient-primary-secondary p-12 text-center text-white rounded-3xl shadow-2xl">
        <div class="max-w-3xl mx-auto">
          <h3 class="text-4xl font-bold mb-6">¿Listo para Ampliar tu Colección?</h3>
          <p class="text-xl mb-8 text-primary-100 leading-relaxed">
            No dejes que el monoplaza de tus sueños se te escape. Contáctanos ahora y descubre cómo podemos hacer realidad tu colección ideal.
          </p>
          <button 
            class="btn variant-filled-surface text-primary-600 font-bold px-12 py-4 text-lg hover:scale-105 transition-transform duration-200 shadow-xl"
            on:click={openWhatsApp}
          >
            <TablerBrandWhatsapp class="mr-3 w-6 h-6" />
            Contactar Ahora
          </button>
        </div>
      </div>
    </div>

    <!-- FAQ Section - Mejor organizada -->
    <div class="card variant-ghost-surface p-10">
      <h2 class="text-4xl font-bold text-center text-surface-900 dark:text-surface-50 mb-4">Preguntas Frecuentes</h2>
      <p class="text-center text-surface-600 dark:text-surface-300 mb-12 max-w-2xl mx-auto">
        Resolvemos las dudas más comunes de nuestros coleccionistas
      </p>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <div class="p-8 bg-gradient-to-br from-secondary-50 to-tertiary-50 dark:from-secondary-900/20 dark:to-tertiary-900/20 rounded-2xl border-2 border-secondary-200 dark:border-secondary-700 hover:shadow-lg transition-shadow duration-300">
          <h3 class="text-lg font-bold text-surface-900 dark:text-surface-50 mb-3">¿Qué tiempo toma conseguir un pedido especial?</h3>
          <p class="text-surface-600 dark:text-surface-300 leading-relaxed">
            Dependiendo del modelo, puede tomar entre 2-6 semanas. Te mantendremos informado del progreso en todo momento.
          </p>
        </div>

        <div class="p-8 bg-gradient-to-br from-tertiary-50 to-warning-50 dark:from-tertiary-900/20 dark:to-warning-900/20 rounded-2xl border-2 border-tertiary-200 dark:border-tertiary-700 hover:shadow-lg transition-shadow duration-300">
          <h3 class="text-lg font-bold text-surface-900 dark:text-surface-50 mb-3">¿Manejan modelos de todas las escalas?</h3>
          <p class="text-surface-600 dark:text-surface-300 leading-relaxed">
            Sí, trabajamos con 1:43, 1:24, 1:18 y otras escalas especiales. Solo dinos qué buscas y lo conseguimos.
          </p>
        </div>

        <div class="p-8 bg-gradient-to-br from-error-50 to-primary-50 dark:from-error-900/20 dark:to-primary-900/20 rounded-2xl border-2 border-error-200 dark:border-error-700 hover:shadow-lg transition-shadow duration-300">
          <h3 class="text-lg font-bold text-surface-900 dark:text-surface-50 mb-3">¿Puedo ver el producto antes de comprarlo?</h3>
          <p class="text-surface-600 dark:text-surface-300 leading-relaxed">
            Te enviamos fotos detalladas del producto real antes del envío para tu completa satisfacción.
          </p>
        </div>
      </div>
    </div>

  </div>
</div>