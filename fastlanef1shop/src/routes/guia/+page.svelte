<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  
  // Importar Autocomplete y popup de Skeleton
  import { Autocomplete, popup } from '@skeletonlabs/skeleton';
  import type { AutocompleteOption, PopupSettings } from '@skeletonlabs/skeleton';
  
  // Importar iconos
  import LucideDownload from '~icons/lucide/download';
  import LucideMapPin from '~icons/lucide/map-pin';
  import LucideUser from '~icons/lucide/user';
  import LucidePhone from '~icons/lucide/phone';
  import LucideDollarSign from '~icons/lucide/dollar-sign';
  import LucideCheck from '~icons/lucide/check-circle';
  import LucideImage from '~icons/lucide/image';
  import LucideFileText from '~icons/lucide/file-text';
  import LucideShoppingCart from '~icons/lucide/shopping-cart';
  import LucideX from '~icons/lucide/x';
  import LucidePackage from '~icons/lucide/package';

  // Importar imágenes
  import logoImageSrc from '$lib/assets/Logo.png';
  import instagramLogoSrc from '$lib/assets/Instagram.png';
  import tiktokLogoSrc from '$lib/assets/Tiktok.png';
  import footerImageSrc from '$lib/assets/Footer.png';

  // Tipos (igual que tu estructura)
  interface Product {
    id: number;
    name: string;
    description: string;
    categories: string[];
    price: number;
    originalPrice?: number;
    images: string[];
    imageFolder: string;
    specifications?: Record<string, string>;
    features?: string[];
    inStock: boolean;
    limitedEdition: boolean;
    year: number;
    team: string;
    manufacturer: string;
    scale: string;
    driver?: string;
  }

  interface SelectedProduct {
    product: Product;
    quantity: number;
  }

  // GitHub Pages configuration (igual que tu catálogo)
  const GITHUB_REPO_URL = 'https://raw.githubusercontent.com/Allenrovas/Datos_Catalogo/main';

  // Form data
  let direccion = '';
  let nombre = '';
  let telefono = '';
  let pagoContraEntrega = true;
  let monto = '';
  let notaAdicional = false;
  let notaTexto = '';

  // Products data
  let allProducts: Product[] = [];
  let selectedProducts: SelectedProduct[] = [];
  let inputProductSearch = '';
  
  // Autocomplete options para Skeleton
  let autocompleteOptions: AutocompleteOption<number>[] = [];

  // Popup settings para Autocomplete
  let popupSettings: PopupSettings = {
    event: 'focus-click',
    target: 'popupAutocompleteProducts',
    placement: 'bottom'
  };

  // Función para crear opciones de autocomplete desde productos
  function createAutocompleteOptions(): void {
    autocompleteOptions = allProducts.map(product => ({
      label: product.name,
      value: product.id,
      keywords: `${product.name} ${product.team} ${product.scale} ${product.manufacturer} ${product.driver || ''}`,
      meta: {
        team: product.team,
        scale: product.scale,
        price: product.price,
        imageUrl: `${GITHUB_REPO_URL}/${product.imageFolder}${product.images[0]}`
      }
    }));
  }

  // Manejar selección de producto desde Autocomplete
  async function onProductSelection(event: CustomEvent<AutocompleteOption<number>>): Promise<void> {
    const productId = event.detail.value;
    const product = allProducts.find(p => p.id === productId);
    
    if (!product) return;

    // Verificar si ya existe
    const existingIndex = selectedProducts.findIndex(sp => sp.product.id === productId);
    
    if (existingIndex !== -1) {
      // Si existe, incrementar cantidad
      selectedProducts[existingIndex].quantity += 1;
      selectedProducts = [...selectedProducts];
    } else {
      // Si no existe, agregar con cantidad 1
      selectedProducts = [...selectedProducts, { product, quantity: 1 }];
      
      // Cargar imagen del producto en segundo plano
      loadProductImage(product).then(() => {
        // Re-renderizar cuando la imagen esté lista
        if (imagesLoaded && canvas) {
          renderCanvas();
        }
      });
    }
    
    // Limpiar el input
    inputProductSearch = '';
  }

  // Función para convertir a mayúsculas
  function toUpperCase(value: string): string {
    return value.toUpperCase();
  }

  // Canvas reference
  let canvas: HTMLCanvasElement;
  
  // Images
  let logoImage: HTMLImageElement | null = null;
  let instagramImage: HTMLImageElement | null = null;
  let tiktokImage: HTMLImageElement | null = null;
  let footerImage: HTMLImageElement | null = null;
  let imagesLoaded = false;
  let isGenerating = false;

  // Product images cache
  let productImagesCache: Map<number, HTMLImageElement> = new Map();

  // Función para cargar imagen de producto
  async function loadProductImage(product: Product): Promise<HTMLImageElement | null> {
    // Verificar si ya está en caché
    if (productImagesCache.has(product.id)) {
      return productImagesCache.get(product.id)!;
    }

    try {
      const imageUrl = getProductImageUrl(product);
      const img = await loadImage(imageUrl);
      productImagesCache.set(product.id, img);
      return img;
    } catch (error) {
      console.error(`Error loading image for product ${product.id}:`, error);
      return null;
    }
  }

  // Cargar productos desde GitHub (igual que tu catálogo)
  async function loadProducts(): Promise<void> {
    try {
      const response = await fetch(`${GITHUB_REPO_URL}/data/products.json`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: Product[] = await response.json();
      allProducts = data;
      
      // Crear opciones de autocomplete después de cargar productos
      createAutocompleteOptions();
      
    } catch (error) {
      console.error('Error loading products:', error);
      // Fallback con productos de ejemplo
      allProducts = [];
      createAutocompleteOptions();
    }
  }

  // Eliminar producto
  function removeProduct(productId: number) {
    selectedProducts = selectedProducts.filter(sp => sp.product.id !== productId);
  }

  // Actualizar cantidad
  function updateQuantity(productId: number, newQuantity: number) {
    if (newQuantity < 1) {
      removeProduct(productId);
      return;
    }
    
    const index = selectedProducts.findIndex(sp => sp.product.id === productId);
    if (index !== -1) {
      selectedProducts[index].quantity = newQuantity;
      selectedProducts = [...selectedProducts];
    }
  }

  // Obtener URL de imagen del producto
  function getProductImageUrl(product: Product): string {
    return `${GITHUB_REPO_URL}/${product.imageFolder}${product.images[0]}`;
  }

  // Totales
  function getTotalProducts(): number {
    return selectedProducts.reduce((sum, sp) => sum + sp.quantity, 0);
  }

  function getTotalPrice(): number {
    return selectedProducts.reduce((sum, sp) => sum + (sp.product.price * sp.quantity), 0);
  }

  onMount(async () => {
    try {
      // Cargar productos
      await loadProducts();
      
      // Load images from static assets
      logoImage = await loadImage(logoImageSrc);
      instagramImage = await loadImage(instagramLogoSrc);
      tiktokImage = await loadImage(tiktokLogoSrc);
      
      // Load footer image and extract center portion
      const footerSourceImg = await loadImage(footerImageSrc);
      const footerCanvas = document.createElement('canvas');
      const footerWidth = 800;
      const footerHeight = 100;
      footerCanvas.width = footerWidth;
      footerCanvas.height = footerHeight;
      const footerCtx = footerCanvas.getContext('2d');
      
      if (footerCtx) {
        const sourceY = footerSourceImg.height * 0;
        const sourceHeight = footerSourceImg.height * 0.45;
        
        footerCtx.drawImage(
          footerSourceImg,
          0, sourceY, footerSourceImg.width, sourceHeight,
          0, 0, footerWidth, footerHeight
        );
        
        footerImage = new Image();
        footerImage.src = footerCanvas.toDataURL();
        await waitForImage(footerImage);
      }

      imagesLoaded = true;
      renderCanvas();
    } catch (error) {
      console.error('Error loading images:', error);
    }
  });

  function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  function waitForImage(img: HTMLImageElement | null): Promise<void> {
    return new Promise((resolve) => {
      if (!img) {
        resolve();
        return;
      }
      if (img.complete) {
        resolve();
      } else {
        img.onload = () => resolve();
      }
    });
  }

  function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number {
    if (!text || text.trim() === '') {
      return y;
    }
    
    let yPos = y;
    const paragraphs = text.split('\n');
    
    for (let p = 0; p < paragraphs.length; p++) {
      const paragraph = paragraphs[p];
      
      if (paragraph.trim() === '') {
        yPos += lineHeight;
        continue;
      }
      
      const words = paragraph.split(' ');
      let line = '';

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && line !== '') {
          ctx.fillText(line.trim(), x, yPos);
          line = words[i] + ' ';
          yPos += lineHeight;
        } else {
          line = testLine;
        }
      }
      
      if (line.trim() !== '') {
        ctx.fillText(line.trim(), x, yPos);
        yPos += lineHeight;
      }
    }
    
    return yPos - lineHeight;
  }

  function renderCanvas(): void {
    if (!canvas || !imagesLoaded) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size for 4:5 aspect ratio
    canvas.width = 800;
    canvas.height = 1000;

    // Clear canvas first
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw logo at top (centered)
    if (logoImage && logoImage.complete) {
      const logoHeight = 110;
      const logoWidth = (logoImage.width / logoImage.height) * logoHeight;
      const logoX = (canvas.width - logoWidth) / 2;
      ctx.drawImage(logoImage, logoX, 30, logoWidth, logoHeight);
    }

    // "¡GRACIAS POR TU COMPRA!" text
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 56px "Bebas Neue", "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('¡GRACIAS POR', canvas.width / 2, 200);
    ctx.fillText('TU COMPRA!', canvas.width / 2, 260);

    // Start Y position for content
    let currentY = 300;

    // DIRECCIÓN section
    ctx.fillStyle = '#ff3333';
    ctx.font = 'bold 32px "Bebas Neue", "Arial Black", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('DIRECCIÓN:', 40, currentY);
    currentY += 20;

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 32px "Bebas Neue", sans-serif';
    const direccionEndY = wrapText(ctx, direccion, 40, currentY + 28, 720, 26);
    currentY = direccionEndY + 45;

    // NOMBRE section
    ctx.fillStyle = '#ff3333';
    ctx.font = 'bold 32px "Bebas Neue", "Arial Black", sans-serif';
    ctx.fillText('NOMBRE:', 40, currentY);
    
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 32px "Bebas Neue", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(nombre, 150, currentY);
    currentY += 45;

    // TELÉFONO section
    ctx.fillStyle = '#ff3333';
    ctx.font = 'bold 32px "Bebas Neue", "Arial Black", sans-serif';
    ctx.fillText('TELÉFONO:', 40, currentY);
    
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 32px "Bebas Neue", sans-serif';
    ctx.fillText(telefono, 150, currentY);
    currentY += 45;

    // PAGO CONTRA ENTREGA section
    ctx.fillStyle = '#ff3333';
    ctx.font = 'bold 32px "Bebas Neue", "Arial Black", sans-serif';
    ctx.fillText('PAGO CONTRA ENTREGA:', 40, currentY);
    
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 32px "Bebas Neue", sans-serif';
    const pagoText = pagoContraEntrega ? (monto ? `Q${monto}` : '') : 'SIN COBRO';
    ctx.fillText(pagoText, 275, currentY);
    currentY += 45;

    // NOTA ADICIONAL section
    if (notaAdicional && notaTexto.trim() !== '') {
      ctx.fillStyle = '#ff3333';
      ctx.font = 'bold 32px "Bebas Neue", "Arial Black", sans-serif';
      ctx.fillText('NOTA ADICIONAL:', 40, currentY);
      currentY += 20;
      
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 32px "Bebas Neue", sans-serif';
      const notaEndY = wrapText(ctx, notaTexto, 40, currentY + 10, 720, 26);
      currentY = notaEndY + 40;
    }

    // PRODUCTOS section
    let productsStartY = currentY;
    const hasProducts = selectedProducts.length > 0;
    
    if (hasProducts) {
      ctx.fillStyle = '#ff3333';
      ctx.font = 'bold 32px "Bebas Neue", "Arial Black", sans-serif';
      ctx.fillText('PRODUCTOS:', 40, currentY);
      currentY += 35;

      // Calcular si necesitamos dos columnas
      const spaceAvailable = 750 - currentY; // Espacio hasta donde empieza footer/social
      const estimatedHeightPerProduct = 75; // ~60px imagen + 15px margen
      const totalProductsHeight = selectedProducts.length * estimatedHeightPerProduct;
      const needsTwoColumns = totalProductsHeight > spaceAvailable && selectedProducts.length >= 3;

      if (needsTwoColumns) {
        // LAYOUT DE DOS COLUMNAS
        const columnWidth = 360;
        const columnGap = 40;
        const leftColumnX = 40;
        const rightColumnX = leftColumnX + columnWidth + columnGap;
        const productsPerColumn = Math.ceil(selectedProducts.length / 2);
        
        let leftColumnY = currentY;
        let rightColumnY = currentY;

        for (let i = 0; i < selectedProducts.length; i++) {
          const sp = selectedProducts[i];
          const isLeftColumn = i < productsPerColumn;
          const columnX = isLeftColumn ? leftColumnX : rightColumnX;
          let columnY = isLeftColumn ? leftColumnY : rightColumnY;
          
          const productImg = productImagesCache.get(sp.product.id);
          
          if (productImg && productImg.complete) {
            const imgSize = 50; // Más pequeño para dos columnas
            const imgX = columnX;
            const imgY = columnY - 5;
            
            ctx.fillStyle = '#f5f5f5';
            ctx.fillRect(imgX, imgY, imgSize, imgSize);
            ctx.drawImage(productImg, imgX, imgY, imgSize, imgSize);
            ctx.strokeStyle = '#e0e0e0';
            ctx.lineWidth = 2;
            ctx.strokeRect(imgX, imgY, imgSize, imgSize);
            
            const textX = imgX + imgSize + 10;
            const maxTextWidth = columnWidth - imgSize - 10;
            
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 18px "Bebas Neue", sans-serif';
            const productText = `${i + 1}. ${sp.product.name}`;
            
            // Truncar nombre si es muy largo
            let displayName = productText;
            if (ctx.measureText(displayName).width > maxTextWidth) {
              while (ctx.measureText(displayName + '...').width > maxTextWidth && displayName.length > 10) {
                displayName = displayName.slice(0, -1);
              }
              displayName += '...';
            }
            ctx.fillText(displayName, textX, columnY + 12);
            
            ctx.font = '14px "Bebas Neue", sans-serif';
            const detailsText = `${sp.product.scale} • Q${sp.product.price.toFixed(2)} x${sp.quantity}`;
            ctx.fillText(detailsText, textX, columnY + 30);
            
            if (isLeftColumn) {
              leftColumnY += imgSize + 12;
            } else {
              rightColumnY += imgSize + 12;
            }
          } else {
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 18px "Bebas Neue", sans-serif';
            
            const productText = `${i + 1}. ${sp.product.name}`;
            let displayName = productText;
            const maxTextWidth = columnWidth;
            
            if (ctx.measureText(displayName).width > maxTextWidth) {
              while (ctx.measureText(displayName + '...').width > maxTextWidth && displayName.length > 10) {
                displayName = displayName.slice(0, -1);
              }
              displayName += '...';
            }
            ctx.fillText(displayName, columnX, columnY);
            columnY += 20;
            
            ctx.font = '14px "Bebas Neue", sans-serif';
            const detailsText = `${sp.product.scale} • Q${sp.product.price.toFixed(2)} x${sp.quantity}`;
            ctx.fillText(detailsText, columnX, columnY);
            
            if (isLeftColumn) {
              leftColumnY += 35;
            } else {
              rightColumnY += 35;
            }
          }
        }
        
        currentY = Math.max(leftColumnY, rightColumnY) + 15;
      } else {
        // LAYOUT DE UNA COLUMNA (original)
        for (let i = 0; i < selectedProducts.length; i++) {
          const sp = selectedProducts[i];
          const productImg = productImagesCache.get(sp.product.id);
          
          if (productImg && productImg.complete) {
            const imgSize = 60;
            const imgX = 40;
            const imgY = currentY - 5;
            
            ctx.fillStyle = '#f5f5f5';
            ctx.fillRect(imgX, imgY, imgSize, imgSize);
            ctx.drawImage(productImg, imgX, imgY, imgSize, imgSize);
            ctx.strokeStyle = '#e0e0e0';
            ctx.lineWidth = 2;
            ctx.strokeRect(imgX, imgY, imgSize, imgSize);
            
            const textX = imgX + imgSize + 15;
            
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 22px "Bebas Neue", sans-serif';
            const productText = `${i + 1}. ${sp.product.name}`;
            ctx.fillText(productText, textX, currentY + 15);
            
            ctx.font = '18px "Bebas Neue", sans-serif';
            const detailsText = `${sp.product.team} • ${sp.product.scale} • CANT: ${sp.quantity} • Q${sp.product.price.toFixed(2)}`;
            ctx.fillText(detailsText, textX, currentY + 38);
            
            currentY += imgSize + 15;
          } else {
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 24px "Bebas Neue", sans-serif';
            
            const productText = `${i + 1}. ${sp.product.name}`;
            ctx.fillText(productText, 40, currentY);
            currentY += 25;
            
            ctx.font = '20px "Bebas Neue", sans-serif';
            const detailsText = `   ${sp.product.team} • ${sp.product.scale} • CANT: ${sp.quantity} • Q${sp.product.price.toFixed(2)}`;
            ctx.fillText(detailsText, 40, currentY);
            currentY += 30;
          }
        }
      }

      currentY += 10;
    }

    // Determinar si mostrar footer y redes sociales
    const spaceRemaining = 1000 - currentY;
    const needsFooter = spaceRemaining >= 140; // Espacio mínimo para footer (100) + redes (55) + margen

    if (needsFooter) {
      // Ensure there's space before social media section
      const minYBeforeSocial = 750;
      if (currentY < minYBeforeSocial) {
        currentY = minYBeforeSocial;
      }

      // Social media icons and handles
      const socialY = currentY;
      
      // Instagram
      if (instagramImage && instagramImage.complete) {
        ctx.drawImage(instagramImage, 100, socialY, 55, 55);
      }
      ctx.fillStyle = '#ff3333';
      ctx.font = 'bold 30px "Bebas Neue", "Arial Black", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('FASTLANEF1SHOP', 165, socialY + 38);

      // TikTok
      if (tiktokImage && tiktokImage.complete) {
        ctx.drawImage(tiktokImage, 450, socialY, 55, 55);
      }
      ctx.fillText('FASTLANEF1.SHOP', 515, socialY + 38);

      // Draw footer
      if (footerImage && footerImage.complete) {
        ctx.drawImage(footerImage, 0, 900, canvas.width, 100);
      }
    } else {
      // Si no hay espacio para footer, solo mostrar redes sociales más arriba si hay espacio
      if (spaceRemaining >= 65) {
        const socialY = currentY + 10;
        
        if (instagramImage && instagramImage.complete) {
          ctx.drawImage(instagramImage, 100, socialY, 45, 45);
        }
        ctx.fillStyle = '#ff3333';
        ctx.font = 'bold 24px "Bebas Neue", "Arial Black", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('FASTLANEF1SHOP', 155, socialY + 30);

        if (tiktokImage && tiktokImage.complete) {
          ctx.drawImage(tiktokImage, 450, socialY, 45, 45);
        }
        ctx.fillText('FASTLANEF1.SHOP', 505, socialY + 30);
      }
      // Si tampoco hay espacio para redes, simplemente no las mostramos
    }
  }

  async function downloadImage(): Promise<void> {
    if (!direccion || !nombre || !telefono) { 
      alert('POR FAVOR, COMPLETA LOS CAMPOS OBLIGATORIOS: DIRECCIÓN, NOMBRE Y TELÉFONO.');
      return;
    }
    isGenerating = true;
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const link = document.createElement('a');
    link.download = `orden-fastlane-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    isGenerating = false;
  }

  // Reactive rendering
  $: if (imagesLoaded && canvas) {
    renderCanvas();
  }
  
  $: if (imagesLoaded && canvas && (direccion || nombre || telefono || pagoContraEntrega || monto || notaAdicional || notaTexto || selectedProducts.length)) {
    renderCanvas();
  }
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Archivo+Black&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-surface-900 via-surface-800 to-surface-900 dark:from-surface-950 dark:via-surface-900 dark:to-surface-950 p-6">
  <div class="max-w-7xl mx-auto">

    <div class="grid lg:grid-cols-2 gap-6 lg:gap-8">
      <!-- Editor Panel -->
      <div 
        class="card card-hover overflow-hidden bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 
        transition-all duration-300 hover:shadow-2xl hover:border-error-300 dark:hover:border-error-600"
        in:fly={{ x: -50, duration: 600, delay: 100 }}
      >
        <header class="card-header bg-gradient-to-r from-error-500 to-error-600 p-6">
          <h2 class="text-2xl font-bold text-white flex items-center">
            <LucideImage class="mr-3 w-6 h-6" />
            EDITOR DE ORDEN
          </h2>
        </header>

        <div class="p-6 space-y-6">
          <!-- Dirección -->
          <div class="form-group">
            <label for="direccion" class="flex items-center text-surface-700 dark:text-surface-200 font-semibold text-sm uppercase tracking-wider mb-2">
              <LucideMapPin class="mr-2 w-4 h-4 text-error-500" />
              DIRECCIÓN
            </label>
            <textarea
              id="direccion"
              bind:value={direccion}
              on:input={(e) => { direccion = toUpperCase(direccion); }}
              placeholder="INGRESA LA DIRECCIÓN COMPLETA"
              rows="3"
              class="textarea bg-surface-100 dark:bg-surface-700 border-2 border-surface-300 dark:border-surface-600 
              focus:border-error-500 dark:focus:border-error-400 focus:ring-2 focus:ring-error-200 dark:focus:ring-error-900 
              transition-all duration-200 resize-none"
            />
          </div>

          <!-- Nombre -->
          <div class="form-group">
            <label for="nombre" class="flex items-center text-surface-700 dark:text-surface-200 font-semibold text-sm uppercase tracking-wider mb-2">
              <LucideUser class="mr-2 w-4 h-4 text-error-500" />
              NOMBRE
            </label>
            <input
              id="nombre"
              type="text"
              bind:value={nombre}
              on:input={(e) => { nombre = toUpperCase(nombre); }}
              placeholder="NOMBRE DEL CLIENTE"
              class="input bg-surface-100 dark:bg-surface-700 border-2 border-surface-300 dark:border-surface-600 
              focus:border-error-500 dark:focus:border-error-400 focus:ring-2 focus:ring-error-200 dark:focus:ring-error-900 
              transition-all duration-200"
            />
          </div>

          <!-- Teléfono -->
          <div class="form-group">
            <label for="telefono" class="flex items-center text-surface-700 dark:text-surface-200 font-semibold text-sm uppercase tracking-wider mb-2">
              <LucidePhone class="mr-2 w-4 h-4 text-error-500" />
              TELÉFONO
            </label>
            <input
              id="telefono"
              type="tel"
              bind:value={telefono}
              on:input={(e) => { telefono = toUpperCase(telefono); }}
              placeholder="NÚMERO DE TELÉFONO"
              class="input bg-surface-100 dark:bg-surface-700 border-2 border-surface-300 dark:border-surface-600 
              focus:border-error-500 dark:focus:border-error-400 focus:ring-2 focus:ring-error-200 dark:focus:ring-error-900 
              transition-all duration-200"
            />
          </div>

          <!-- Pago contra entrega -->
          <div class="form-group">
            <div class="card variant-soft-surface p-4 rounded-lg border border-surface-300 dark:border-surface-600">
              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  id="pagoCheck"
                  type="checkbox"
                  bind:checked={pagoContraEntrega}
                  class="checkbox scale-125 accent-error-500"
                />
                <span class="font-semibold text-surface-800 dark:text-surface-100 flex items-center">
                  <LucideDollarSign class="mr-2 w-5 h-5 text-error-500" />
                  PAGO CONTRA ENTREGA
                </span>
              </label>

              {#if pagoContraEntrega}
                <div class="mt-4 pl-9" in:fly={{ y: -10, duration: 300 }}>
                  <label for="monto" class="flex items-center text-surface-600 dark:text-surface-300 font-medium text-sm mb-2">
                    MONTO (Q)
                  </label>
                  <input
                    id="monto"
                    type="number"
                    bind:value={monto}
                    placeholder="INGRESA EL MONTO"
                    min="0"
                    step="0.01"
                    class="input bg-surface-100 dark:bg-surface-700 border-2 border-surface-300 dark:border-surface-600 
                    focus:border-error-500 dark:focus:border-error-400 focus:ring-2 focus:ring-error-200 dark:focus:ring-error-900 
                    transition-all duration-200"
                  />
                </div>
              {/if}
            </div>
          </div>

          <!-- Nota Adicional -->
          <div class="form-group">
            <div class="card variant-soft-surface p-4 rounded-lg border border-surface-300 dark:border-surface-600">
              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  id="notaCheck"
                  type="checkbox"
                  bind:checked={notaAdicional}
                  class="checkbox scale-125 accent-error-500"
                />
                <span class="font-semibold text-surface-800 dark:text-surface-100 flex items-center">
                  <LucideFileText class="mr-2 w-5 h-5 text-error-500" />
                  NOTA ADICIONAL
                </span>
              </label>

              {#if notaAdicional}
                <div class="mt-4 pl-9" in:fly={{ y: -10, duration: 300 }}>
                  <label for="notaTexto" class="flex items-center text-surface-600 dark:text-surface-300 font-medium text-sm mb-2">
                    TEXTO DE LA NOTA
                  </label>
                  <textarea
                    id="notaTexto"
                    bind:value={notaTexto}
                    on:input={(e) => { notaTexto = toUpperCase(notaTexto); }}
                    placeholder="ESCRIBE TU NOTA ADICIONAL AQUÍ..."
                    rows={4}
                    class="input bg-surface-100 dark:bg-surface-700 border-2 border-surface-300 dark:border-surface-600 
                    focus:border-error-500 dark:focus:border-error-400 focus:ring-2 focus:ring-error-200 dark:focus:ring-error-900 
                    transition-all duration-200"
                  />
                </div>
              {/if}
            </div>
          </div>

          <!-- Productos Section -->
          <div class="form-group">
            <label class="flex items-center text-surface-700 dark:text-surface-200 font-semibold text-sm uppercase tracking-wider mb-2">
              <LucideShoppingCart class="mr-2 w-4 h-4 text-error-500" />
              PRODUCTOS ({selectedProducts.length})
            </label>
            
            <!-- Autocomplete de Skeleton con Popup -->
            <div class="autocomplete-wrapper">
              <input
                class="input autocomplete bg-surface-100 dark:bg-surface-700 border-2 border-surface-300 dark:border-surface-600 
                focus:border-error-500 dark:focus:border-error-400 focus:ring-2 focus:ring-error-200 dark:focus:ring-error-900 
                transition-all duration-200"
                type="search"
                name="autocomplete-products"
                bind:value={inputProductSearch}
                placeholder="BUSCAR PRODUCTO POR NOMBRE, ESCUDERÍA, PILOTO..."
                use:popup={popupSettings}
              />
              <div data-popup="popupAutocompleteProducts" class="card w-full max-w-full max-h-80 p-4 overflow-y-auto z-50">
                <Autocomplete
                  bind:input={inputProductSearch}
                  options={autocompleteOptions}
                  on:selection={onProductSelection}
                />
              </div>
            </div>

            <!-- Lista de productos seleccionados -->
            {#if selectedProducts.length > 0}
              <div class="mt-4 space-y-2 max-h-60 overflow-y-auto">
                {#each selectedProducts as sp}
                  <div class="flex items-center space-x-3 p-3 bg-surface-100 dark:bg-surface-700 rounded-lg">
                    <div class="w-10 h-10 bg-surface-200 dark:bg-surface-600 rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src={getProductImageUrl(sp.product)} 
                        alt={sp.product.name}
                        class="w-full h-full object-cover"
                        on:error={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div class="w-full h-full hidden items-center justify-center">
                        <LucidePackage class="w-5 h-5 text-surface-500" />
                      </div>
                    </div>
                    
                    <div class="flex-1 min-w-0">
                      <h4 class="font-semibold text-sm text-surface-900 dark:text-surface-50 truncate">
                        {sp.product.name}
                      </h4>
                      <div class="flex items-center justify-between mt-1">
                        <span class="text-xs text-surface-600 dark:text-surface-300">
                          {sp.product.scale} • {sp.product.team}
                        </span>
                        <div class="text-right">
                          <div class="text-xs text-surface-600 dark:text-surface-300">
                            {sp.quantity} × Q{sp.product.price.toFixed(2)}
                          </div>
                          <div class="font-semibold text-sm text-success-600 dark:text-success-400">
                            Q{(sp.product.price * sp.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Control de cantidad -->
                    <div class="flex items-center space-x-2">
                      <button
                        type="button"
                        on:click={() => updateQuantity(sp.product.id, sp.quantity - 1)}
                        class="btn btn-sm variant-ghost-surface p-1 w-7 h-7"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={sp.quantity}
                        on:change={(e) => updateQuantity(sp.product.id, parseInt(e.currentTarget.value) || 1)}
                        min="1"
                        class="input w-12 h-7 text-center text-xs p-1 bg-surface-50 dark:bg-surface-600"
                      />
                      <button
                        type="button"
                        on:click={() => updateQuantity(sp.product.id, sp.quantity + 1)}
                        class="btn btn-sm variant-ghost-surface p-1 w-7 h-7"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      on:click={() => removeProduct(sp.product.id)}
                      class="btn btn-sm variant-ghost-error p-1"
                    >
                      <LucideX class="w-4 h-4" />
                    </button>
                  </div>
                {/each}
              </div>

              <!-- Totales -->
              <div class="mt-4 pt-4 border-t border-surface-200 dark:border-surface-600">
                <div class="flex justify-between text-sm">
                  <span class="text-surface-600 dark:text-surface-300">Total items:</span>
                  <span class="font-semibold text-surface-900 dark:text-surface-50">{getTotalProducts()}</span>
                </div>
                <div class="flex justify-between text-sm mt-1">
                  <span class="text-surface-600 dark:text-surface-300">Total:</span>
                  <span class="font-semibold text-success-600 dark:text-success-400">Q{getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            {:else}
              <p class="text-sm text-surface-500 dark:text-surface-400 text-center py-4 mt-4">
                No hay productos agregados. Busca y selecciona productos arriba.
              </p>
            {/if}
          </div>

          <!-- Download Button -->
          <button
            on:click={downloadImage}
            disabled={isGenerating}
            class="btn variant-filled-error w-full font-bold text-lg shadow-lg hover:shadow-xl 
            hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
            {isGenerating ? 'animate-pulse' : ''}"
          >
            <LucideDownload class="mr-2 w-5 h-5" />
            {isGenerating ? 'GENERANDO...' : 'DESCARGAR PNG'}
          </button>
        </div>
      </div>

      <!-- Preview Panel -->
      <div 
        class="card card-hover overflow-hidden bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 
        transition-all duration-300 hover:shadow-2xl hover:border-error-300 dark:hover:border-error-600 lg:sticky lg:top-6"
        in:fly={{ x: 50, duration: 600, delay: 200 }}
      >
        <header class="card-header bg-gradient-to-r from-surface-100 to-surface-50 dark:from-surface-700 dark:to-surface-800 p-6 border-b-2 border-surface-200 dark:border-surface-600">
          <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-50 flex items-center">
            <LucideCheck class="mr-3 w-6 h-6 text-success-500" />
            VISTA PREVIA
          </h2>
        </header>

        <div class="p-6">
          <div class="bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-950 
          rounded-xl p-4 shadow-inner border-2 border-surface-200 dark:border-surface-700">
            <canvas
              bind:this={canvas}
              class="w-full h-auto rounded-lg shadow-2xl border border-surface-300 dark:border-surface-600"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  .card-hover {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .card-hover:hover {
    transform: translateY(-4px);
  }

  .form-group {
    @apply relative;
  }

  .input,
  .textarea {
    text-transform: uppercase;
  }

  @keyframes pulse-error {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  .animate-pulse {
    animation: pulse-error 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  input:focus,
  textarea:focus {
    @apply outline-none;
  }

  .checkbox {
    @apply cursor-pointer transition-all duration-200;
  }

  .checkbox:checked {
    @apply bg-error-500 border-error-500;
  }

  /* Estilos personalizados para Autocomplete de Skeleton con Popup */
  .autocomplete-wrapper [data-popup] {
    @apply bg-surface-50 dark:bg-surface-800 border-2 border-error-300 dark:border-error-600 shadow-2xl;
  }

  .autocomplete-wrapper :global(.autocomplete-list) {
    @apply max-h-72 overflow-y-auto;
  }

  .autocomplete-wrapper :global(.autocomplete-list-item) {
    @apply p-3 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors cursor-pointer;
  }

  .autocomplete-wrapper :global(.autocomplete-list-item[aria-selected="true"]) {
    @apply bg-error-50 dark:bg-error-900/20;
  }

  .autocomplete-input,
  .autocomplete {
    text-transform: uppercase;
  }
</style>