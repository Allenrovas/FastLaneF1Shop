<script lang="ts">
  import FeaturedProducts from '$lib/components/FeaturedProducts.svelte';
  import ShopByTeam from '$lib/components/ShopByTeam.svelte';
  import { base } from '$app/paths';
  import { fly } from 'svelte/transition';

  import LucideShield from '~icons/lucide/shield-check';
  import LucideTruck from '~icons/lucide/truck';
  import LucideStar from '~icons/lucide/star';
  import LucideHelmet from '~icons/lucide-lab/motor-racing-helmet';
  import LucideArrowRight from '~icons/lucide/arrow-right';

  const pageTitle = "Fast Lane F1 Shop - Colección Exclusiva de Monoplazas F1";
  const pageDescription = "Descubre la colección más completa de monoplazas de Fórmula 1 a escala. Modelos auténticos de Red Bull, Ferrari, Mercedes y más. Envíos a toda Guatemala.";
  const pageUrl = "https://fastlanef1shop.com";
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <link rel="canonical" href={pageUrl} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={pageUrl} />
  <meta property="og:image" content="{pageUrl}/F1L-full.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={pageDescription} />

  {@html `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "Fast Lane F1 Shop",
    "description": "${pageDescription}",
    "url": "${pageUrl}",
    "logo": "${pageUrl}/F1L.png",
    "image": "${pageUrl}/F1L-full.png",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "GT"
    },
    "priceRange": "Q60 - Q900"
  }
  </script>`}
</svelte:head>

<!-- Hero Banner — Kinetic Monolith -->
<section class="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-[#131313]">
  <!-- Background image -->
  <div class="absolute inset-0">
    <img src="/Fondo.jpg" alt="" class="w-full h-full object-cover opacity-20" />
  </div>
  <!-- Subtle grid pattern -->
  <div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px); background-size: 60px 60px;"></div>

  <div class="relative container mx-auto px-4 py-20 text-center">
    <div class="max-w-3xl mx-auto">
      <h1
        class="font-headline text-5xl md:text-7xl font-black mb-6 uppercase tracking-[0.08em] text-white leading-tight"
        in:fly={{ y: 40, duration: 600, delay: 100 }}
      >
        Fast Lane
        <span class="block text-primary-500">F1 Shop</span>
      </h1>

      <p
        class="text-lg md:text-xl mb-10 text-white leading-relaxed max-w-xl mx-auto"
        in:fly={{ y: 30, duration: 600, delay: 250 }}
      >
        Colecciona los monoplazas más icónicos de la Fórmula 1.
        Modelos a escala 100% auténticos.
      </p>

      <!-- Stats — Telemetry readout style -->
      <div
        class="flex justify-center gap-8 mb-10"
        in:fly={{ y: 20, duration: 600, delay: 400 }}
      >
        <div class="text-center">
          <div class="text-2xl font-headline font-bold text-white tracking-wider">100%</div>
          <div class="text-xs text-surface-100 font-headline uppercase tracking-[0.15em]">Auténticos</div>
        </div>
        <div class="w-px h-10 bg-surface-600"></div>
        <div class="text-center">
          <div class="text-2xl font-headline font-bold text-white tracking-wider">Premium</div>
          <div class="text-xs text-surface-100 font-headline uppercase tracking-[0.15em]">Calidad</div>
        </div>
        <div class="w-px h-10 bg-surface-600"></div>
        <div class="text-center">
          <div class="text-2xl font-headline font-bold text-white tracking-wider">GT</div>
          <div class="text-xs text-surface-100 font-headline uppercase tracking-[0.15em]">Envíos</div>
        </div>
      </div>

      <!-- CTA — Kinetic gradient button -->
      <div in:fly={{ y: 20, duration: 600, delay: 550 }}>
        <a
          href="{base}/catalogo"
          class="inline-flex items-center gap-3 btn-kinetic px-8 py-4 text-lg group"
        >
          <LucideHelmet class="w-5 h-5" />
          Comprar Ahora
          <LucideArrowRight class="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  </div>

  <!-- Red bottom line -->
  <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"></div>
</section>

<!-- Featured Products -->
<FeaturedProducts />

<!-- Shop By Team -->
<ShopByTeam />

<!-- Benefits Section — Carbon layer shift, no borders -->
<section class="bg-[#1c1b1b] py-16 px-4">
  <div class="container mx-auto max-w-screen-lg">
    <div class="text-center mb-10">
      <h2 class="font-headline text-2xl font-bold text-white uppercase tracking-[0.1em] mb-3">
        ¿Por qué elegirnos?
      </h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="text-center p-6 bg-[#2a2a2a] hover:bg-[#353534] transition-colors duration-200">
        <div class="w-14 h-14 bg-[#131313] flex items-center justify-center mx-auto mb-4">
          <LucideShield class="w-7 h-7 text-primary-500" />
        </div>
        <h3 class="font-headline font-bold text-white mb-2 uppercase tracking-wider text-sm">100% Auténticos</h3>
        <p class="text-surface-200 text-sm leading-relaxed">
          Todos nuestros modelos vienen con certificado de autenticidad.
        </p>
      </div>

      <div class="text-center p-6 bg-[#2a2a2a] hover:bg-[#353534] transition-colors duration-200">
        <div class="w-14 h-14 bg-[#131313] flex items-center justify-center mx-auto mb-4">
          <LucideTruck class="w-7 h-7 text-primary-500" />
        </div>
        <h3 class="font-headline font-bold text-white mb-2 uppercase tracking-wider text-sm">Envíos a toda Guatemala</h3>
        <p class="text-surface-200 text-sm leading-relaxed">
          Entrega segura a cualquier parte de Guatemala en 1-4 días hábiles.
        </p>
      </div>

      <div class="text-center p-6 bg-[#2a2a2a] hover:bg-[#353534] transition-colors duration-200">
        <div class="w-14 h-14 bg-[#131313] flex items-center justify-center mx-auto mb-4">
          <LucideStar class="w-7 h-7 text-primary-500" />
        </div>
        <h3 class="font-headline font-bold text-white mb-2 uppercase tracking-wider text-sm">Ediciones Exclusivas</h3>
        <p class="text-surface-200 text-sm leading-relaxed">
          Acceso prioritario a lanzamientos limitados y modelos exclusivos de colección.
        </p>
      </div>
    </div>
  </div>
</section>
