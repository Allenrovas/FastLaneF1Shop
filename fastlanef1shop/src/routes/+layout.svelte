<script lang="ts">
  import '../app.postcss';
  import { AppShell, AppBar, Toast, Modal, initializeStores } from '@skeletonlabs/skeleton';
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
  import { storePopup } from '@skeletonlabs/skeleton';
  import Formula1Icon from '~icons/arcticons/formula-1'
  import TwitterIcon from 'virtual:icons/mdi/twitter';
  import InstagramIcon from 'virtual:icons/mdi/instagram';
  import YoutubeIcon from 'virtual:icons/mdi/youtube';
  import FacebookIcon from 'virtual:icons/mdi/facebook';

  // Initialize Skeleton stores
  initializeStores();
  
  // Configure floating UI
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
</script>

<!-- App Shell -->
<AppShell>
  <svelte:fragment slot="header">
    <AppBar 
      background="bg-surface-50-900-token backdrop-blur-md dark:bg-surface-900-50-token" 
      border="border-b border-surface-300-600-token dark:border-surface-600-300-token"
      padding="p-4"
      shadow="shadow-lg"
    >
      <svelte:fragment slot="lead">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-lg">
            <Formula1Icon class="text-white text-xl" />
          </div>
          <div class="flex flex-col">
            <h1 class="text-xl font-bold bg-gradient-to-br from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              Fast Lane F1 Shop
            </h1>
            </div>
        </div>
      </svelte:fragment>
      
      <svelte:fragment slot="trail">
        <div class="flex items-center space-x-4">
          <!-- Navegación puede ir aquí -->
        </div>
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>
  
  <!-- Page Content -->
  <slot />

  <!-- Footer -->
  <svelte:fragment slot="pageFooter">
    <footer class="bg-surface-100-800-token dark:bg-surface-800-100-token py-16 mt-20 border-t border-surface-300-600-token dark:border-surface-600-300-token">
      <div class="container mx-auto px-4">
        <!-- Footer Content -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <!-- Brand -->
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <Formula1Icon class="text-white text-lg" />
              </div>
              <span class="text-xl font-bold">Fast Lane F1 Shop</span>
            </div>
            <p class="text-surface-600-300-token dark:text-surface-300-600-token mb-4 max-w-md">
              La colección más completa de monoplazas de Fórmula 1. Desde los campeones del mundo hasta las máquinas más icónicas de la parrilla.
            </p>
            <div class="flex space-x-4">
              <TwitterIcon class="text-2xl text-surface-400-500-token hover:text-primary-500 cursor-pointer transition-colors" />
              <InstagramIcon class="text-2xl text-surface-400-500-token hover:text-secondary-500 cursor-pointer transition-colors" />
              <YoutubeIcon class="text-2xl text-surface-400-500-token hover:text-error-500 cursor-pointer transition-colors" />
              <FacebookIcon class="text-2xl text-surface-400-500-token hover:text-primary-600 cursor-pointer transition-colors" />
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="font-bold text-lg mb-4">Categorías</h3>
            <ul class="space-y-2 text-surface-600-300-token dark:text-surface-300-600-token">
              <li><a href="/categoria/championship" class="hover:text-primary-500 transition-colors">Campeones</a></li>
              <li><a href="/categoria/ferrari" class="hover:text-secondary-500 transition-colors">Ferrari</a></li>
              <li><a href="/categoria/mercedes" class="hover:text-surface-500 transition-colors">Mercedes</a></li>
              <li><a href="/categoria/mclaren" class="hover:text-tertiary-500 transition-colors">McLaren</a></li>
              <li><a href="/categoria/aston" class="hover:text-success-500 transition-colors">Aston Martin</a></li>
            </ul>
          </div>

          <!-- Info -->
          <div>
            <h3 class="font-bold text-lg mb-4">Información</h3>
            <ul class="space-y-2 text-surface-600-300-token dark:text-surface-300-600-token">
              <li><a href="#about" class="hover:text-primary-500 transition-colors">Acerca de</a></li>
              <li><a href="#shipping" class="hover:text-primary-500 transition-colors">Envíos</a></li>
              <li><a href="#returns" class="hover:text-primary-500 transition-colors">Devoluciones</a></li>
              <li><a href="#contact" class="hover:text-primary-500 transition-colors">Contacto</a></li>
              <li><a href="#faq" class="hover:text-primary-500 transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>

        <!-- Racing Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-t border-surface-300-600-token dark:border-surface-600-300-token">
          <div class="text-center">
            <div class="text-3xl font-bold text-primary-500">10+</div>
            <div class="text-sm text-surface-600-300-token dark:text-surface-300-600-token">Escuderías</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-secondary-500">23</div>
            <div class="text-sm text-surface-600-300-token dark:text-surface-300-600-token">Circuitos</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-warning-500">350+</div>
            <div class="text-sm text-surface-600-300-token dark:text-surface-300-600-token">km/h</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-success-500">100%</div>
            <div class="text-sm text-surface-600-300-token dark:text-surface-300-600-token">Adrenalina</div>
          </div>
        </div>

        <!-- Bottom -->
        <div class="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-surface-300-600-token dark:border-surface-600-300-token text-sm text-surface-600-300-token dark:text-surface-300-600-token">
          <div class="flex flex-wrap items-center gap-4 mb-4 md:mb-0">
            <span>Entrega Mundial</span>
            <span>Calidad Premium</span>
            <span>Compra Segura</span>
          </div>
		  <div>
			© {new Date().getFullYear()} Fast Lane F1 Shop. Hecho con pasión para los fanáticos de la F1.
		  </div>
        </div>
      </div>
    </footer>
  </svelte:fragment>
</AppShell>

<!-- Global Components -->
<Toast />
<Modal />