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

<div class="min-h-screen bg-surface-900">
  <div class="container mx-auto px-4 py-16 max-w-7xl">

    <!-- Hero Section -->
    <div class="text-center mb-20">
      <div class="inline-flex items-center justify-center mb-8">
        <div class="w-20 h-20 bg-primary-500 rounded-3xl flex items-center justify-center shadow-xl mr-6">
          <Formula1Icon class="text-white w-10 h-10" />
        </div>
        <h1 class="text-5xl md:text-7xl font-black text-surface-50">
          Contáctanos
        </h1>
      </div>
      <div class="max-w-4xl mx-auto">
        <p class="text-xl md:text-2xl text-surface-300 leading-relaxed mb-4">
          ¿No encuentras el monoplaza que buscas en nuestro catálogo?
        </p>
        <p class="text-lg md:text-xl text-surface-200 leading-relaxed">
          <span class="font-semibold text-primary-400">¡No te preocupes!</span>
          Podemos conseguir cualquier modelo que desees. Contáctanos y lo haremos realidad.
        </p>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-20">

      <!-- Contact Information -->
      <div class="xl:col-span-2">
        <div class="p-8 bg-surface-800 rounded-2xl border border-surface-700 shadow-lg h-full">
          <div class="flex items-center mb-8">
            <LucideHelmet class="mr-4 w-8 h-8 text-primary-500" />
            <h2 class="text-3xl font-bold text-surface-50">
              Información de Contacto
            </h2>
          </div>

          <!-- WhatsApp -->
          <div class="mb-8">
            <div class="bg-surface-700/50 rounded-2xl border border-success-700 p-6">
              <div class="flex items-start space-x-6">
                <div class="w-16 h-16 bg-success-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <TablerBrandWhatsapp class="w-8 h-8 text-white" />
                </div>
                <div class="flex-1">
                  <div class="flex items-center mb-2">
                    <h3 class="text-xl font-bold text-success-200">WhatsApp</h3>
                    <span class="ml-3 px-3 py-1 bg-success-800 text-success-200 text-xs font-semibold rounded-full">Principal</span>
                  </div>
                  <p class="text-2xl font-bold text-success-300 mb-3">+502 4939-5444</p>
                  <div class="flex flex-wrap gap-2 mb-4">
                    <span class="px-3 py-1 bg-surface-600/50 text-surface-300 text-sm rounded-full">Atención personalizada</span>
                    <span class="px-3 py-1 bg-surface-600/50 text-surface-300 text-sm rounded-full">Respuesta inmediata</span>
                    <span class="px-3 py-1 bg-surface-600/50 text-surface-300 text-sm rounded-full">Pedidos especiales</span>
                  </div>
                  <button
                    class="btn variant-filled-success btn-lg font-semibold"
                    on:click={openWhatsApp}
                  >
                    <TablerBrandWhatsapp class="mr-3 w-5 h-5" />
                    Enviar Mensaje
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Other Contact Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Location -->
            <div class="flex items-start space-x-4 p-6 bg-surface-700/50 rounded-xl">
              <div class="w-12 h-12 bg-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <LucideMapPin class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-surface-50 mb-2">Ubicación</h3>
                <p class="text-surface-300 font-semibold">Guatemala, Guatemala</p>
                <p class="text-sm text-surface-200">Envíos a toda Guatemala</p>
              </div>
            </div>

            <!-- Schedule -->
            <div class="flex items-start space-x-4 p-6 bg-surface-700/50 rounded-xl">
              <div class="w-12 h-12 bg-tertiary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <LucideClock class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-surface-50 mb-2">Horario de Atención</h3>
                <p class="text-surface-300 text-sm font-semibold">Lunes a Sábado: 9:00 AM - 7:00 PM</p>
                <p class="text-surface-300 text-sm font-semibold">Domingo: 10:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Social Media - Sidebar -->
      <div class="xl:col-span-1">
        <div class="p-8 bg-surface-800 rounded-2xl border border-surface-700 shadow-lg h-full">
          <div class="flex items-center mb-6">
            <LucideInstagram class="mr-3 w-6 h-6 text-secondary-500" />
            <h3 class="text-2xl font-bold text-surface-50">Redes Sociales</h3>
          </div>

          <p class="text-surface-300 mb-6">Síguenos para ver las últimas novedades y modelos exclusivos</p>

          <div class="space-y-4">
            <button
              class="w-full btn variant-soft-primary p-4 h-auto flex items-center justify-start space-x-4 transition-colors duration-300"
              on:click={() => openSocialMedia('facebook')}
            >
              <LucideFacebook class="w-6 h-6" />
              <div class="text-left">
                <div class="font-semibold">Facebook</div>
                <div class="text-xs opacity-70">Noticias y actualizaciones</div>
              </div>
            </button>

            <button
              class="w-full btn variant-soft-success p-4 h-auto flex items-center justify-start space-x-4 transition-colors duration-300"
              on:click={() => openSocialMedia('instagram')}
            >
              <LucideInstagram class="w-6 h-6" />
              <div class="text-left">
                <div class="font-semibold">Instagram</div>
                <div class="text-xs opacity-70">Fotos de productos</div>
              </div>
            </button>

            <button
              class="w-full btn variant-soft-primary p-4 h-auto flex items-center justify-start space-x-4 transition-colors duration-300"
              on:click={() => openSocialMedia('tiktok')}
            >
              <IcTwotoneTiktok class="w-6 h-6" />
              <div class="text-left">
                <div class="font-semibold">TikTok</div>
                <div class="text-xs opacity-70">Videos y reviews</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Services Section -->
    <div class="mb-20">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-surface-50 mb-4">
          ¿Qué Podemos Hacer por Ti?
        </h2>
        <p class="text-lg text-surface-300 max-w-3xl mx-auto">
          Nuestro compromiso es hacer realidad la colección de tus sueños
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="p-8 bg-surface-800 rounded-2xl border border-surface-700 shadow-lg text-center">
          <div class="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <LucideShoppingCart class="w-8 h-8 text-white" />
          </div>
          <h3 class="text-xl font-bold text-surface-50 mb-4">Pedidos Especiales</h3>
          <p class="text-surface-300 leading-relaxed">
            ¿Buscas un modelo específico? Podemos conseguir cualquier monoplaza de F1, desde ediciones limitadas hasta modelos vintage.
          </p>
        </div>

        <div class="p-8 bg-surface-800 rounded-2xl border border-surface-700 shadow-lg text-center">
          <div class="w-16 h-16 bg-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <LucideHeart class="w-8 h-8 text-white" />
          </div>
          <h3 class="text-xl font-bold text-surface-50 mb-4">Atención Personalizada</h3>
          <p class="text-surface-300 leading-relaxed">
            Cada coleccionista es único. Te asesoramos personalmente para encontrar el monoplaza perfecto según tus gustos.
          </p>
        </div>

        <div class="p-8 bg-surface-800 rounded-2xl border border-surface-700 shadow-lg text-center md:col-span-2 lg:col-span-1">
          <div class="w-16 h-16 bg-tertiary-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <LucideTruck class="w-8 h-8 text-white" />
          </div>
          <h3 class="text-xl font-bold text-surface-50 mb-4">Envíos Seguros</h3>
          <p class="text-surface-300 leading-relaxed">
            Empaque especializado para proteger tu inversión. Seguimiento completo desde que sale hasta que llega a ti.
          </p>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="mb-20">
      <div class="p-12 bg-primary-500 rounded-3xl shadow-xl text-center">
        <div class="max-w-3xl mx-auto">
          <h3 class="text-4xl font-bold mb-6 text-white">¿Listo para Ampliar tu Colección?</h3>
          <p class="text-xl mb-8 text-primary-100 leading-relaxed">
            No dejes que el monoplaza de tus sueños se te escape. Contáctanos ahora y descubre cómo podemos hacer realidad tu colección ideal.
          </p>
          <button
            class="bg-white text-primary-600 font-bold px-12 py-4 text-lg rounded-2xl hover:bg-primary-50 transition-colors duration-300 shadow-lg"
            on:click={openWhatsApp}
          >
            <TablerBrandWhatsapp class="mr-3 w-6 h-6 inline-block" />
            Contactar Ahora
          </button>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="p-10 bg-surface-800 rounded-2xl border border-surface-700 shadow-lg">
      <h2 class="text-4xl font-bold text-center text-surface-50 mb-4">Preguntas Frecuentes</h2>
      <p class="text-center text-surface-300 mb-12 max-w-2xl mx-auto">
        Resolvemos las dudas más comunes de nuestros coleccionistas
      </p>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <div class="p-8 bg-surface-700/50 rounded-2xl border border-surface-600">
          <h3 class="text-lg font-bold text-surface-50 mb-3">¿Qué tiempo toma conseguir un pedido especial?</h3>
          <p class="text-surface-300 leading-relaxed">
            Dependiendo del modelo, puede tomar entre 2-6 semanas. Te mantendremos informado del progreso en todo momento.
          </p>
        </div>

        <div class="p-8 bg-surface-700/50 rounded-2xl border border-surface-600">
          <h3 class="text-lg font-bold text-surface-50 mb-3">¿Manejan modelos de todas las escalas?</h3>
          <p class="text-surface-300 leading-relaxed">
            Sí, trabajamos con 1:43, 1:24, 1:18 y otras escalas especiales. Solo dinos qué buscas y lo conseguimos.
          </p>
        </div>

        <div class="p-8 bg-surface-700/50 rounded-2xl border border-surface-600">
          <h3 class="text-lg font-bold text-surface-50 mb-3">¿Puedo ver el producto antes de comprarlo?</h3>
          <p class="text-surface-300 leading-relaxed">
            Te enviamos fotos detalladas del producto real antes del envío para tu completa satisfacción.
          </p>
        </div>
      </div>
    </div>

  </div>
</div>