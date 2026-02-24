<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';


  // Importar iconos
  import LucideDownload from '~icons/lucide/download';
  import LucideUser from '~icons/lucide/user';
  import LucidePhone from '~icons/lucide/phone';
  import LucideMail from '~icons/lucide/mail';
  import LucideCalendar from '~icons/lucide/calendar';
  import LucideCheck from '~icons/lucide/check-circle';
  import LucideImage from '~icons/lucide/image';
  import LucideShoppingCart from '~icons/lucide/shopping-cart';
  import LucideX from '~icons/lucide/x';
  import LucidePackage from '~icons/lucide/package';
  import LucideFileText from '~icons/lucide/file-text';
  import LucidePlus from '~icons/lucide/plus';
  import LucideUpload from '~icons/lucide/upload';

  // Importar imágenes
  import logoImageSrc from '$lib/assets/F1L CON LETRAS.png';
  import instagramLogoSrc from '$lib/assets/Instagram.png';
  import tiktokLogoSrc from '$lib/assets/Tiktok.png';
  import footerImageSrc from '$lib/assets/Footer.png';

  // Tipos
  interface CustomProduct {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageDataUrl?: string; // Data URL de la imagen
  }

  // Form data
  let nombreCliente = '';
  let telefono = '';
  let email = '';
  let fechaValidez = '';
  let notaAdicional = false;
  let notaTexto = '';

  // Products data
  let products: CustomProduct[] = [];

  // Nuevo producto form
  let newProductName = '';
  let newProductPrice = '';
  let newProductQuantity = 1;
  let newProductImage: File | null = null;
  let newProductImagePreview: string | null = null;

  // Función para convertir a mayúsculas
  function toUpperCase(value: string): string {
    return value.toUpperCase();
  }

  // Manejar carga de imagen
  function handleImageUpload(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      newProductImage = file;
      const reader = new FileReader();
      reader.onload = (event) => {
        newProductImagePreview = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // Agregar producto personalizado
  function addCustomProduct(): void {
    if (!newProductName.trim() || !newProductPrice || newProductQuantity < 1) {
      alert('POR FAVOR, COMPLETA EL NOMBRE, PRECIO Y CANTIDAD DEL PRODUCTO.');
      return;
    }

    const product: CustomProduct = {
      id: `custom-${Date.now()}`,
      name: newProductName.toUpperCase(),
      price: parseFloat(newProductPrice),
      quantity: newProductQuantity,
      imageDataUrl: newProductImagePreview || undefined
    };

    products = [...products, product];

    // Limpiar formulario
    newProductName = '';
    newProductPrice = '';
    newProductQuantity = 1;
    newProductImage = null;
    newProductImagePreview = null;

    // Re-renderizar canvas
    if (imagesLoaded && canvas) {
      renderCanvas();
    }
  }

  // Eliminar producto
  function removeProduct(productId: string) {
    products = products.filter(p => p.id !== productId);
  }

  // Actualizar cantidad
  function updateQuantity(productId: string, newQuantity: number) {
    if (newQuantity < 1) {
      removeProduct(productId);
      return;
    }

    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
      products[index].quantity = newQuantity;
      products = [...products];
    }
  }

  // Totales
  function getTotalProducts(): number {
    return products.reduce((sum, p) => sum + p.quantity, 0);
  }

  function getTotalPrice(): number {
    return products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
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

  // Calcular fecha de validez por defecto (7 días desde hoy)
  function getDefaultValidityDate(): string {
    const today = new Date();
    today.setDate(today.getDate() + 7);
    return today.toISOString().split('T')[0];
  }

  onMount(async () => {
    try {
      // Establecer fecha de validez por defecto
      fechaValidez = getDefaultValidityDate();

      // Load images from static assets
      logoImage = await loadImage(logoImageSrc);
      instagramImage = await loadImage(instagramLogoSrc);
      tiktokImage = await loadImage(tiktokLogoSrc);

      // Load footer image
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

    // === HEADER COMPACTO ===

    // Logo arriba a la izquierda (pequeño)
    const logoH = 62;
    let logoW = 120;
    if (logoImage && logoImage.complete) {
      logoW = (logoImage.width / logoImage.height) * logoH;
      ctx.drawImage(logoImage, 18, 14, logoW, logoH);
    }

    // Datos del cliente — pequeños, a la par del logo
    const clientX = 18 + logoW + 18;
    let clientY = 24;
    const cFont = 15;
    const cLine = 19;

    ctx.font = `bold ${cFont}px "Bebas Neue", "Arial Black", sans-serif`;
    ctx.textAlign = 'left';

    ctx.fillStyle = '#ff3333';
    ctx.fillText('CLIENTE:', clientX, clientY);
    ctx.fillStyle = '#000000';
    ctx.fillText(nombreCliente, clientX + ctx.measureText('CLIENTE: ').width, clientY);
    clientY += cLine;

    ctx.fillStyle = '#ff3333';
    ctx.fillText('TEL:', clientX, clientY);
    ctx.fillStyle = '#000000';
    ctx.fillText(telefono, clientX + ctx.measureText('TEL: ').width, clientY);
    clientY += cLine;

    if (email.trim() !== '') {
      ctx.fillStyle = '#ff3333';
      ctx.fillText('EMAIL:', clientX, clientY);
      ctx.fillStyle = '#000000';
      ctx.fillText(email.toLowerCase(), clientX + ctx.measureText('EMAIL: ').width, clientY);
      clientY += cLine;
    }

    if (fechaValidez) {
      ctx.fillStyle = '#ff3333';
      ctx.fillText('VÁLIDA:', clientX, clientY);
      ctx.fillStyle = '#000000';
      const fechaFormateada = new Date(fechaValidez + 'T00:00:00').toLocaleDateString('es-GT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).toUpperCase();
      ctx.fillText(fechaFormateada, clientX + ctx.measureText('VÁLIDA: ').width, clientY);
    }

    // Redes sociales — derecha del header, a la par del logo y datos
    const socialIconSize = 26;
    const socialX = 525;
    const socialY1 = 22;
    const socialY2 = socialY1 + socialIconSize + 10;

    if (instagramImage && instagramImage.complete) {
      ctx.drawImage(instagramImage, socialX, socialY1, socialIconSize, socialIconSize);
    }
    ctx.fillStyle = '#ff3333';
    ctx.font = 'bold 14px "Bebas Neue", "Arial Black", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('FASTLANEF1SHOP', socialX + socialIconSize + 6, socialY1 + 19);

    if (tiktokImage && tiktokImage.complete) {
      ctx.drawImage(tiktokImage, socialX, socialY2, socialIconSize, socialIconSize);
    }
    ctx.fillText('FASTLANEF1.SHOP', socialX + socialIconSize + 6, socialY2 + 19);

    // Línea separadora
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(18, 98);
    ctx.lineTo(canvas.width - 18, 98);
    ctx.stroke();

    // Título "COTIZACIÓN"
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 50px "Bebas Neue", "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('COTIZACIÓN', canvas.width / 2, 148);

    // Start Y position for content
    let currentY = 175;

    // NOTA ADICIONAL section
    if (notaAdicional && notaTexto.trim() !== '') {
      ctx.fillStyle = '#ff3333';
      ctx.font = 'bold 26px "Bebas Neue", "Arial Black", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('NOTA:', 40, currentY);
      currentY += 18;

      ctx.fillStyle = '#000000';
      ctx.font = 'bold 22px "Bebas Neue", sans-serif';
      const notaEndY = wrapText(ctx, notaTexto, 40, currentY + 8, 720, 24);
      currentY = notaEndY + 35;
    }

    // PRODUCTOS section
    const hasProducts = products.length > 0;

    if (hasProducts) {
      ctx.fillStyle = '#ff3333';
      ctx.font = 'bold 32px "Bebas Neue", "Arial Black", sans-serif';
      ctx.fillText('PRODUCTOS:', 40, currentY);
      currentY += 35;

      // Calcular si necesitamos dos columnas
      const spaceAvailable = 750 - currentY;
      const estimatedHeightPerProduct = 75;
      const totalProductsHeight = products.length * estimatedHeightPerProduct;
      const needsTwoColumns = totalProductsHeight > spaceAvailable && products.length >= 3;

      if (needsTwoColumns) {
        // LAYOUT DE DOS COLUMNAS
        const columnWidth = 360;
        const columnGap = 40;
        const leftColumnX = 40;
        const rightColumnX = leftColumnX + columnWidth + columnGap;
        const productsPerColumn = Math.ceil(products.length / 2);

        let leftColumnY = currentY;
        let rightColumnY = currentY;

        for (let i = 0; i < products.length; i++) {
          const product = products[i];
          const isLeftColumn = i < productsPerColumn;
          const columnX = isLeftColumn ? leftColumnX : rightColumnX;
          let columnY = isLeftColumn ? leftColumnY : rightColumnY;

          if (product.imageDataUrl) {
            const img = new Image();
            img.src = product.imageDataUrl;

            const imgSize = 50;
            const imgX = columnX;
            const imgY = columnY - 5;

            ctx.fillStyle = '#f5f5f5';
            ctx.fillRect(imgX, imgY, imgSize, imgSize);

            if (img.complete) {
              ctx.drawImage(img, imgX, imgY, imgSize, imgSize);
            }

            ctx.strokeStyle = '#e0e0e0';
            ctx.lineWidth = 2;
            ctx.strokeRect(imgX, imgY, imgSize, imgSize);

            const textX = imgX + imgSize + 10;
            const maxTextWidth = columnWidth - imgSize - 10;

            ctx.fillStyle = '#000000';
            ctx.font = 'bold 18px "Bebas Neue", sans-serif';
            const productText = `${i + 1}. ${product.name}`;

            let displayName = productText;
            if (ctx.measureText(displayName).width > maxTextWidth) {
              while (ctx.measureText(displayName + '...').width > maxTextWidth && displayName.length > 10) {
                displayName = displayName.slice(0, -1);
              }
              displayName += '...';
            }
            ctx.fillText(displayName, textX, columnY + 12);

            ctx.font = '14px "Bebas Neue", sans-serif';
            const detailsText = `Q${product.price.toFixed(2)} x${product.quantity}`;
            ctx.fillText(detailsText, textX, columnY + 30);

            if (isLeftColumn) {
              leftColumnY += imgSize + 12;
            } else {
              rightColumnY += imgSize + 12;
            }
          } else {
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 18px "Bebas Neue", sans-serif';

            const productText = `${i + 1}. ${product.name}`;
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
            const detailsText = `Q${product.price.toFixed(2)} x${product.quantity}`;
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
        // LAYOUT DE UNA COLUMNA
        for (let i = 0; i < products.length; i++) {
          const product = products[i];

          if (product.imageDataUrl) {
            const img = new Image();
            img.src = product.imageDataUrl;

            const imgSize = 60;
            const imgX = 40;
            const imgY = currentY - 5;

            ctx.fillStyle = '#f5f5f5';
            ctx.fillRect(imgX, imgY, imgSize, imgSize);

            if (img.complete) {
              ctx.drawImage(img, imgX, imgY, imgSize, imgSize);
            }

            ctx.strokeStyle = '#e0e0e0';
            ctx.lineWidth = 2;
            ctx.strokeRect(imgX, imgY, imgSize, imgSize);

            const textX = imgX + imgSize + 15;

            ctx.fillStyle = '#000000';
            ctx.font = 'bold 22px "Bebas Neue", sans-serif';
            const productText = `${i + 1}. ${product.name}`;
            ctx.fillText(productText, textX, currentY + 15);

            ctx.font = '18px "Bebas Neue", sans-serif';
            const detailsText = `CANT: ${product.quantity} • Q${product.price.toFixed(2)}`;
            ctx.fillText(detailsText, textX, currentY + 38);

            currentY += imgSize + 15;
          } else {
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 24px "Bebas Neue", sans-serif';

            const productText = `${i + 1}. ${product.name}`;
            ctx.fillText(productText, 40, currentY);
            currentY += 25;

            ctx.font = '20px "Bebas Neue", sans-serif';
            const detailsText = `   CANT: ${product.quantity} • Q${product.price.toFixed(2)}`;
            ctx.fillText(detailsText, 40, currentY);
            currentY += 30;
          }
        }
      }

      currentY += 10;

      // TOTAL section
      ctx.fillStyle = '#ff3333';
      ctx.font = 'bold 40px "Bebas Neue", "Arial Black", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('TOTAL:', 40, currentY);

      ctx.fillStyle = '#000000';
      ctx.font = 'bold 40px "Bebas Neue", sans-serif';
      const totalText = `Q. ${getTotalPrice().toFixed(2)}`;
      ctx.fillText(totalText, 150, currentY);
      currentY += 50;
    }

    // Footer
    if (footerImage && footerImage.complete) {
      ctx.drawImage(footerImage, 0, 900, canvas.width, 100);
    }
  }

  async function downloadImage(): Promise<void> {
    if (!nombreCliente || !telefono) {
      alert('POR FAVOR, COMPLETA LOS CAMPOS OBLIGATORIOS: CLIENTE Y TELÉFONO.');
      return;
    }
    if (products.length === 0) {
      alert('POR FAVOR, AGREGA AL MENOS UN PRODUCTO A LA COTIZACIÓN.');
      return;
    }
    isGenerating = true;

    await new Promise(resolve => setTimeout(resolve, 300));

    const link = document.createElement('a');
    link.download = `cotizacion-fastlane-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    isGenerating = false;
  }

  // Reactive rendering
  $: if (imagesLoaded && canvas) {
    renderCanvas();
  }

  $: if (imagesLoaded && canvas && (nombreCliente || telefono || email || fechaValidez || notaAdicional || notaTexto || products.length)) {
    renderCanvas();
  }
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Archivo+Black&display=swap" rel="stylesheet">
  <title>Generar Cotización - Fast Lane F1 Shop</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-surface-900 via-surface-800 to-surface-900 p-6">
  <div class="max-w-7xl mx-auto">

    <div class="grid lg:grid-cols-2 gap-6 lg:gap-8">
      <!-- Editor Panel -->
      <div
        class="card card-hover overflow-hidden bg-surface-800 border border-surface-700
        transition-all duration-300 hover:shadow-2xl hover:border-primary-500/50"
        in:fly={{ x: -50, duration: 600, delay: 100 }}
      >
        <header class="card-header bg-gradient-to-r from-primary-500 to-primary-600 p-6">
          <h2 class="text-2xl font-bold text-white flex items-center">
            <LucideImage class="mr-3 w-6 h-6" />
            EDITOR DE COTIZACIÓN
          </h2>
        </header>

        <div class="p-6 space-y-6">
          <!-- Nombre Cliente -->
          <div class="form-group">
            <label for="nombreCliente" class="flex items-center text-surface-200 font-semibold text-sm uppercase tracking-wider mb-2">
              <LucideUser class="mr-2 w-4 h-4 text-primary-500" />
              NOMBRE DEL CLIENTE
            </label>
            <input
              id="nombreCliente"
              type="text"
              bind:value={nombreCliente}
              on:input={(e) => { nombreCliente = toUpperCase(nombreCliente); }}
              placeholder="NOMBRE O EMPRESA"
              class="input bg-surface-700 border-2 border-surface-600
              focus:border-primary-500 focus:ring-2 focus:ring-primary-900
              transition-all duration-200 text-white"
            />
          </div>

          <!-- Teléfono -->
          <div class="form-group">
            <label for="telefono" class="flex items-center text-surface-200 font-semibold text-sm uppercase tracking-wider mb-2">
              <LucidePhone class="mr-2 w-4 h-4 text-primary-500" />
              TELÉFONO
            </label>
            <input
              id="telefono"
              type="tel"
              bind:value={telefono}
              on:input={(e) => { telefono = toUpperCase(telefono); }}
              placeholder="NÚMERO DE TELÉFONO"
              class="input bg-surface-700 border-2 border-surface-600
              focus:border-primary-500 focus:ring-2 focus:ring-primary-900
              transition-all duration-200 text-white"
            />
          </div>

          <!-- Email (opcional) -->
          <div class="form-group">
            <label for="email" class="flex items-center text-surface-200 font-semibold text-sm uppercase tracking-wider mb-2">
              <LucideMail class="mr-2 w-4 h-4 text-primary-500" />
              EMAIL (OPCIONAL)
            </label>
            <input
              id="email"
              type="email"
              bind:value={email}
              placeholder="correo@ejemplo.com"
              class="input bg-surface-700 border-2 border-surface-600
              focus:border-primary-500 focus:ring-2 focus:ring-primary-900
              transition-all duration-200 text-white"
            />
          </div>

          <!-- Fecha de Validez -->
          <div class="form-group">
            <label for="fechaValidez" class="flex items-center text-surface-200 font-semibold text-sm uppercase tracking-wider mb-2">
              <LucideCalendar class="mr-2 w-4 h-4 text-primary-500" />
              VÁLIDA HASTA
            </label>
            <input
              id="fechaValidez"
              type="date"
              bind:value={fechaValidez}
              class="input bg-surface-700 border-2 border-surface-600
              focus:border-primary-500 focus:ring-2 focus:ring-primary-900
              transition-all duration-200 text-white"
            />
          </div>

          <!-- Nota Adicional -->
          <div class="form-group">
            <div class="card variant-soft-surface p-4 rounded-lg border border-surface-600">
              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  id="notaCheck"
                  type="checkbox"
                  bind:checked={notaAdicional}
                  class="checkbox scale-125 accent-primary-500"
                />
                <span class="font-semibold text-surface-100 flex items-center">
                  <LucideFileText class="mr-2 w-5 h-5 text-primary-500" />
                  NOTA ADICIONAL
                </span>
              </label>

              {#if notaAdicional}
                <div class="mt-4 pl-9" in:fly={{ y: -10, duration: 300 }}>
                  <label for="notaTexto" class="flex items-center text-surface-300 font-medium text-sm mb-2">
                    TEXTO DE LA NOTA
                  </label>
                  <textarea
                    id="notaTexto"
                    bind:value={notaTexto}
                    on:input={(e) => { notaTexto = toUpperCase(notaTexto); }}
                    placeholder="ESCRIBE TU NOTA ADICIONAL AQUÍ..."
                    rows={4}
                    class="input bg-surface-700 border-2 border-surface-600
                    focus:border-primary-500 focus:ring-2 focus:ring-primary-900
                    transition-all duration-200"
                  />
                </div>
              {/if}
            </div>
          </div>

          <!-- Productos Section -->
          <div class="form-group">
            <label class="flex items-center text-surface-200 font-semibold text-sm uppercase tracking-wider mb-2">
              <LucideShoppingCart class="mr-2 w-4 h-4 text-primary-500" />
              PRODUCTOS ({products.length})
            </label>

            <!-- Formulario para agregar producto personalizado -->
            <div class="card variant-soft-surface p-4 rounded-lg border border-surface-600 space-y-4">
              <h3 class="text-surface-100 font-semibold text-sm uppercase">Agregar Producto</h3>

              <!-- Nombre del producto -->
              <div>
                <label for="newProductName" class="text-surface-300 text-xs mb-1 block">NOMBRE DEL PRODUCTO</label>
                <input
                  id="newProductName"
                  type="text"
                  bind:value={newProductName}
                  on:input={(e) => { newProductName = toUpperCase(newProductName); }}
                  placeholder="NOMBRE DEL PRODUCTO"
                  class="input input-sm bg-surface-700 border-surface-600 text-white w-full"
                />
              </div>

              <!-- Precio y Cantidad -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label for="newProductPrice" class="text-surface-300 text-xs mb-1 block">PRECIO (Q)</label>
                  <input
                    id="newProductPrice"
                    type="number"
                    bind:value={newProductPrice}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    class="input input-sm bg-surface-700 border-surface-600 text-white w-full"
                  />
                </div>
                <div>
                  <label for="newProductQuantity" class="text-surface-300 text-xs mb-1 block">CANTIDAD</label>
                  <input
                    id="newProductQuantity"
                    type="number"
                    bind:value={newProductQuantity}
                    min="1"
                    class="input input-sm bg-surface-700 border-surface-600 text-white w-full"
                  />
                </div>
              </div>

              <!-- Imagen del producto -->
              <div>
                <label class="text-surface-300 text-xs mb-2 block">IMAGEN (OPCIONAL)</label>

                {#if newProductImagePreview}
                  <div class="relative mb-2">
                    <img
                      src={newProductImagePreview}
                      alt="Preview"
                      class="w-20 h-20 object-cover rounded border-2 border-surface-600"
                    />
                    <button
                      type="button"
                      on:click={() => {
                        newProductImage = null;
                        newProductImagePreview = null;
                      }}
                      class="absolute -top-2 -right-2 btn btn-sm variant-filled-error p-1 rounded-full"
                    >
                      <LucideX class="w-3 h-3" />
                    </button>
                  </div>
                {/if}

                <label class="btn variant-soft-surface btn-sm cursor-pointer inline-flex items-center gap-2">
                  <LucideUpload class="w-4 h-4" />
                  {newProductImagePreview ? 'CAMBIAR IMAGEN' : 'SUBIR IMAGEN'}
                  <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    on:change={handleImageUpload}
                  />
                </label>
              </div>

              <!-- Botón agregar -->
              <button
                type="button"
                on:click={addCustomProduct}
                class="btn variant-filled-primary btn-sm w-full flex items-center justify-center gap-2"
              >
                <LucidePlus class="w-4 h-4" />
                AGREGAR PRODUCTO
              </button>
            </div>

            <!-- Lista de productos agregados -->
            {#if products.length > 0}
              <div class="mt-4 space-y-2 max-h-60 overflow-y-auto">
                {#each products as product}
                  <div class="flex items-center space-x-3 p-3 bg-surface-700 rounded-lg">
                    <div class="w-10 h-10 bg-surface-600 rounded-md overflow-hidden flex-shrink-0">
                      {#if product.imageDataUrl}
                        <img
                          src={product.imageDataUrl}
                          alt={product.name}
                          class="w-full h-full object-cover"
                        />
                      {:else}
                        <div class="w-full h-full flex items-center justify-center">
                          <LucidePackage class="w-5 h-5 text-surface-300" />
                        </div>
                      {/if}
                    </div>

                    <div class="flex-1 min-w-0">
                      <h4 class="font-semibold text-sm text-white truncate">
                        {product.name}
                      </h4>
                      <div class="flex items-center justify-between mt-1">
                        <span class="text-xs text-surface-300">
                          Q{product.price.toFixed(2)} c/u
                        </span>
                        <div class="text-right">
                          <div class="text-xs text-surface-300">
                            {product.quantity} × Q{product.price.toFixed(2)}
                          </div>
                          <div class="font-semibold text-sm text-success-400">
                            Q{(product.price * product.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Control de cantidad -->
                    <div class="flex items-center space-x-2">
                      <button
                        type="button"
                        on:click={() => updateQuantity(product.id, product.quantity - 1)}
                        class="btn btn-sm variant-ghost-surface p-1 w-7 h-7"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={product.quantity}
                        on:change={(e) => updateQuantity(product.id, parseInt(e.currentTarget.value) || 1)}
                        min="1"
                        class="input w-12 h-7 text-center text-xs p-1 bg-surface-600 text-white"
                      />
                      <button
                        type="button"
                        on:click={() => updateQuantity(product.id, product.quantity + 1)}
                        class="btn btn-sm variant-ghost-surface p-1 w-7 h-7"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      on:click={() => removeProduct(product.id)}
                      class="btn btn-sm variant-ghost-error p-1"
                    >
                      <LucideX class="w-4 h-4" />
                    </button>
                  </div>
                {/each}
              </div>

              <!-- Totales -->
              <div class="mt-4 pt-4 border-t border-surface-600">
                <div class="flex justify-between text-sm">
                  <span class="text-surface-300">Total items:</span>
                  <span class="font-semibold text-white">{getTotalProducts()}</span>
                </div>
                <div class="flex justify-between text-sm mt-1">
                  <span class="text-surface-300">Total:</span>
                  <span class="font-semibold text-success-400">Q{getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            {:else}
              <p class="text-sm text-surface-200 text-center py-4 mt-4">
                No hay productos agregados. Completa el formulario arriba para agregar productos.
              </p>
            {/if}
          </div>

          <!-- Download Button -->
          <button
            on:click={downloadImage}
            disabled={isGenerating}
            class="btn variant-filled-primary w-full font-bold text-lg shadow-lg hover:shadow-xl
            hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
            {isGenerating ? 'animate-pulse' : ''}"
          >
            <LucideDownload class="mr-2 w-5 h-5" />
            {isGenerating ? 'GENERANDO...' : 'DESCARGAR COTIZACIÓN PNG'}
          </button>
        </div>
      </div>

      <!-- Preview Panel -->
      <div
        class="preview-panel lg:sticky lg:top-6"
        in:fly={{ x: 50, duration: 600, delay: 200 }}
      >
        <!-- Header — racing livery stripe + sector label -->
        <div class="preview-header">
          <div class="flex items-center gap-3">
            <div class="sector-tag">
              <span class="sector-tag-inner">P</span>
            </div>
            <span class="preview-title">VISTA PREVIA</span>
          </div>
          <div class="flex items-center gap-2">
            {#if products.length > 0}
              <span class="preview-chip">{products.length} ITEM{products.length !== 1 ? 'S' : ''}</span>
              <span class="preview-chip preview-chip--total">Q{getTotalPrice().toFixed(2)}</span>
            {:else}
              <span class="preview-chip preview-chip--empty">VACÍO</span>
            {/if}
          </div>
        </div>

        <!-- Canvas stage — asphalt surface with dot grid -->
        <div class="canvas-stage">
          <div class="canvas-frame">
            <span class="corner corner--tl"></span>
            <span class="corner corner--tr"></span>
            <span class="corner corner--bl"></span>
            <span class="corner corner--br"></span>
            <canvas bind:this={canvas} class="canvas-render" />
          </div>
        </div>

        <!-- Footer status bar -->
        <div class="preview-footer">
          <div class="flex items-center gap-2">
            <span class="status-dot {isGenerating ? 'status-dot--live' : ''}"></span>
            <span class="preview-status-text">
              {#if isGenerating}GENERANDO IMAGEN...{:else if nombreCliente && products.length > 0}LISTO PARA EXPORTAR{:else}COMPLETA EL FORMULARIO{/if}
            </span>
          </div>
          {#if nombreCliente}
            <span class="preview-client-tag">{nombreCliente}</span>
          {/if}
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

  input[type="email"] {
    text-transform: none;
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
    @apply bg-primary-500 border-primary-500;
  }

  /* ─── Preview Panel ─────────────────────────── */

  .preview-panel {
    overflow: hidden;
    border-radius: 12px;
    background: #0f0f0f;
    border: 1px solid rgba(255, 255, 255, 0.06);
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.04) inset,
      0 24px 64px rgba(0, 0, 0, 0.6);
  }

  /* Racing livery stripe via left border */
  .preview-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: #141414;
    border-left: 3px solid #ff3333;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  /* Sector label tag — clipped like F1 broadcast sector T1/T2/T3 */
  .sector-tag {
    position: relative;
    width: 24px;
    height: 24px;
    background: #ff3333;
    clip-path: polygon(0 0, 100% 0, 100% 65%, 78% 100%, 0 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .sector-tag-inner {
    font-family: "Bebas Neue", "Arial Black", sans-serif;
    font-size: 13px;
    color: white;
    line-height: 1;
    margin-top: -3px;
  }

  .preview-title {
    font-family: "Bebas Neue", "Arial Black", sans-serif;
    font-size: 20px;
    letter-spacing: 0.12em;
    color: rgba(255, 255, 255, 0.9);
  }

  /* Status chips */
  .preview-chip {
    font-family: "Bebas Neue", sans-serif;
    font-size: 11px;
    letter-spacing: 0.08em;
    padding: 3px 8px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .preview-chip--total {
    background: rgba(255, 51, 51, 0.1);
    color: #ff7070;
    border-color: rgba(255, 51, 51, 0.2);
  }

  .preview-chip--empty {
    background: transparent;
    color: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.05);
    letter-spacing: 0.12em;
  }

  /* Asphalt stage with subtle dot grid */
  .canvas-stage {
    padding: 28px 24px;
    background: #080808;
    background-image: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.035) 1px,
      transparent 1px
    );
    background-size: 20px 20px;
  }

  /* Frame with corner bracket reticles */
  .canvas-frame {
    position: relative;
    display: block;
    width: 100%;
    padding: 8px;
  }

  .corner {
    position: absolute;
    width: 18px;
    height: 18px;
    z-index: 2;
    pointer-events: none;
  }

  .corner--tl { top: 0; left: 0; border-top: 2px solid #ff3333; border-left: 2px solid #ff3333; }
  .corner--tr { top: 0; right: 0; border-top: 2px solid #ff3333; border-right: 2px solid #ff3333; }
  .corner--bl { bottom: 0; left: 0; border-bottom: 2px solid #ff3333; border-left: 2px solid #ff3333; }
  .corner--br { bottom: 0; right: 0; border-bottom: 2px solid #ff3333; border-right: 2px solid #ff3333; }

  .canvas-render {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 2px;
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.07),
      0 4px 8px rgba(0, 0, 0, 0.4),
      0 20px 48px rgba(0, 0, 0, 0.7),
      0 40px 80px rgba(0, 0, 0, 0.35);
  }

  /* Footer status bar */
  .preview-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    background: #0b0b0b;
    border-top: 1px solid rgba(255, 255, 255, 0.04);
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    transition: background 0.3s ease;
    flex-shrink: 0;
  }

  .status-dot--live {
    background: #ff3333;
    box-shadow: 0 0 8px rgba(255, 51, 51, 0.5);
    animation: dot-pulse 1.2s ease-in-out infinite;
  }

  .preview-status-text {
    font-family: "Bebas Neue", sans-serif;
    font-size: 11px;
    letter-spacing: 0.15em;
    color: rgba(255, 255, 255, 0.25);
  }

  .preview-client-tag {
    font-family: "Bebas Neue", sans-serif;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.35);
  }

  @keyframes dot-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
</style>
