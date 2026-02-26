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

      // Esperar a que las fuentes web estén disponibles en el canvas
      await document.fonts.ready;
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

    const W   = 800;
    const PAD = 40;

    // ── Paleta ──────────────────────────────────────────────
    const RED    = '#CC0000';
    const DARK   = '#111111';
    const GRAY   = '#666666';
    const BGLT   = '#F5F5F5';
    const RULE   = '#E0E0E0';
    const WHITE  = '#FFFFFF';
    const STRIPE = '#FAFAFA';

    // ── Fuentes ─────────────────────────────────────────────
    const HF = '"Bebas Neue", "Arial Black", sans-serif';
    const BF = '"Inter", "Segoe UI", Helvetica, Arial, sans-serif';

    // ── Constantes de layout ─────────────────────────────────
    const TOPBAR  = 6;
    const HDR_H   = 118;
    const REDSEP  = 2;
    const CLI_H   = 78;
    const TBL_HDR = 36;
    const ROW_H   = 50;
    const IMG_ROW = 96;
    const TOT_H   = 54;
    const FTR_H   = 100;

    // ── Cálculo dinámico de altura ───────────────────────────
    const noteText = (notaAdicional && notaTexto.trim()) ? notaTexto : '';
    const noteLineCount = noteText
      ? Math.max(Math.ceil(noteText.length / 65), noteText.split('\n').length)
      : 0;
    const NOTE_SEC = noteLineCount > 0 ? (80 + noteLineCount * 24) : 0;

    let rowsH = 0;
    for (const p of products) rowsH += p.imageDataUrl ? IMG_ROW : ROW_H;
    const PROD_SEC = products.length > 0 ? (32 + TBL_HDR + rowsH + TOT_H) : 0;

    const H = Math.max(
      TOPBAR + HDR_H + REDSEP + CLI_H + 1 + NOTE_SEC + PROD_SEC + 44 + FTR_H,
      940
    );

    canvas.width  = W;
    canvas.height = H;

    // ── Fondo blanco ────────────────────────────────────────
    ctx.fillStyle = WHITE;
    ctx.fillRect(0, 0, W, H);

    let y = 0;

    // ════════════════════════════════════════════════════════
    // BARRA ROJA SUPERIOR
    // ════════════════════════════════════════════════════════
    ctx.fillStyle = RED;
    ctx.fillRect(0, 0, W, TOPBAR);
    y += TOPBAR;

    // ════════════════════════════════════════════════════════
    // HEADER: logo | redes | título | fechas
    // ════════════════════════════════════════════════════════
    const hTop = y;

    // Logo — izquierda
    const LOGO_H = 70;
    let logoW = 130;
    if (logoImage && logoImage.complete) {
      logoW = (logoImage.width / logoImage.height) * LOGO_H;
      ctx.drawImage(logoImage, PAD, hTop + (HDR_H - LOGO_H) / 2, logoW, LOGO_H);
    }

    // Redes sociales — junto al logo
    const SOC_X = PAD + logoW + 26;
    const ICN   = 20;
    const soc1Y = hTop + 30;
    const soc2Y = soc1Y + ICN + 9;

    if (instagramImage && instagramImage.complete) {
      ctx.drawImage(instagramImage, SOC_X, soc1Y, ICN, ICN);
    }
    ctx.font      = `500 12px ${BF}`;
    ctx.fillStyle = GRAY;
    ctx.textAlign = 'left';
    ctx.fillText('@fastlanef1shop', SOC_X + ICN + 7, soc1Y + 14);

    if (tiktokImage && tiktokImage.complete) {
      ctx.drawImage(tiktokImage, SOC_X, soc2Y, ICN, ICN);
    }
    ctx.fillText('@fastlanef1.shop', SOC_X + ICN + 7, soc2Y + 14);

    // "COTIZACIÓN" — derecha
    ctx.font      = `bold 58px ${HF}`;
    ctx.fillStyle = DARK;
    ctx.textAlign = 'right';
    ctx.fillText('COTIZACIÓN', W - PAD, hTop + 68);

    // Fechas — derecha, bajo el título
    const fmtDate = (d: Date): string =>
      d.toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();

    ctx.font      = `400 11px ${BF}`;
    ctx.fillStyle = GRAY;
    ctx.fillText(`EMITIDA: ${fmtDate(new Date())}`, W - PAD, hTop + 87);
    if (fechaValidez) {
      ctx.fillText(
        `VÁLIDA HASTA: ${fmtDate(new Date(fechaValidez + 'T00:00:00'))}`,
        W - PAD, hTop + 104
      );
    }

    y += HDR_H;

    // ════════════════════════════════════════════════════════
    // SEPARADOR ROJO
    // ════════════════════════════════════════════════════════
    ctx.fillStyle = RED;
    ctx.fillRect(0, y, W, REDSEP);
    y += REDSEP;

    // ════════════════════════════════════════════════════════
    // BLOQUE DE CLIENTE
    // ════════════════════════════════════════════════════════
    ctx.fillStyle = BGLT;
    ctx.fillRect(0, y, W, CLI_H);

    const LBL_Y = y + 24;
    const VAL_Y = y + 50;

    // Construir campos según qué datos existen
    const cFields = [] as Array<{ label: string; value: string; small?: boolean }>;
    cFields.push({ label: 'PARA', value: nombreCliente });
    if (telefono.trim()) cFields.push({ label: 'TELÉFONO', value: telefono });
    if (email.trim()) cFields.push({ label: 'EMAIL', value: email.toLowerCase(), small: true });

    const slotW = (W - PAD * 2) / cFields.length;
    for (let fi = 0; fi < cFields.length; fi++) {
      const f = cFields[fi];
      const fx = PAD + fi * slotW;
      const maxW = slotW - 16;

      ctx.font      = `700 9px ${BF}`;
      ctx.fillStyle = RED;
      ctx.textAlign = 'left';
      ctx.fillText(f.label, fx, LBL_Y);

      ctx.font      = f.small ? `400 12px ${BF}` : `600 15px ${BF}`;
      ctx.fillStyle = DARK;
      let v = f.value || '—';
      while (ctx.measureText(v).width > maxW && v.length > 3) v = v.slice(0, -1);
      if (v !== (f.value || '—')) v += '…';
      ctx.fillText(v, fx, VAL_Y);
    }

    y += CLI_H;

    // Línea separadora
    ctx.strokeStyle = RULE;
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
    y += 1;

    // ════════════════════════════════════════════════════════
    // NOTA ADICIONAL
    // ════════════════════════════════════════════════════════
    if (noteText) {
      y += 22;
      ctx.font      = `700 9px ${BF}`;
      ctx.fillStyle = RED;
      ctx.textAlign = 'left';
      ctx.fillText('NOTA ADICIONAL', PAD, y);
      y += 18;

      ctx.font      = `400 13px ${BF}`;
      ctx.fillStyle = DARK;
      const endNY = wrapText(ctx, noteText, PAD, y, W - PAD * 2, 22);
      y = endNY + 28;

      ctx.strokeStyle = RULE;
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.moveTo(PAD, y);
      ctx.lineTo(W - PAD, y);
      ctx.stroke();
      y += 1;
    }

    // ════════════════════════════════════════════════════════
    // TABLA DE PRODUCTOS
    // ════════════════════════════════════════════════════════
    if (products.length > 0) {
      y += 32;

      // Referencias de columnas
      const CX_NAME = PAD;
      const CX_QTY  = W - 252;   // cantidad centrada aquí
      const CX_UPR  = W - 136;   // precio unitario alineado a la derecha aquí
      const CX_TOT  = W - PAD;   // total alineado a la derecha aquí

      // ── Encabezado de tabla ──────────────────────────────
      ctx.fillStyle = '#1A1A1A';
      ctx.fillRect(PAD, y, W - PAD * 2, TBL_HDR);

      ctx.font      = `700 10px ${BF}`;
      ctx.fillStyle = WHITE;
      ctx.textAlign = 'left';
      ctx.fillText('PRODUCTO', CX_NAME + 12, y + 23);
      ctx.textAlign = 'center';
      ctx.fillText('CANT.', CX_QTY, y + 23);
      ctx.textAlign = 'right';
      ctx.fillText('P. UNIT.', CX_UPR, y + 23);
      ctx.fillText('TOTAL', CX_TOT, y + 23);

      y += TBL_HDR;

      // ── Filas de productos ──────────────────────────────
      for (let i = 0; i < products.length; i++) {
        const p  = products[i];
        const rH = p.imageDataUrl ? IMG_ROW : ROW_H;

        ctx.fillStyle = i % 2 === 0 ? WHITE : STRIPE;
        ctx.fillRect(PAD, y, W - PAD * 2, rH);

        // Borde inferior de fila
        ctx.strokeStyle = '#EBEBEB';
        ctx.lineWidth   = 0.5;
        ctx.beginPath();
        ctx.moveTo(PAD, y + rH);
        ctx.lineTo(W - PAD, y + rH);
        ctx.stroke();

        const mY   = y + rH / 2 + 5;
        let nameX  = CX_NAME + 12;

        // Imagen de producto prominente
        if (p.imageDataUrl) {
          const SZ  = 78;
          const iX  = PAD + 9;
          const iY  = y + (rH - SZ) / 2;
          const img = new Image();
          img.src   = p.imageDataUrl;

          ctx.save();
          ctx.beginPath();
          ctx.rect(iX, iY, SZ, SZ);
          ctx.clip();
          if (img.complete && img.naturalWidth > 0) {
            ctx.drawImage(img, iX, iY, SZ, SZ);
          } else {
            ctx.fillStyle = '#E8E8E8';
            ctx.fill();
          }
          ctx.restore();

          // Borde sutil
          ctx.strokeStyle = RULE;
          ctx.lineWidth   = 1;
          ctx.strokeRect(iX, iY, SZ, SZ);

          nameX = iX + SZ + 14;
        }

        // Nombre del producto
        const maxNW = CX_QTY - 40 - nameX;
        ctx.font      = `600 13px ${BF}`;
        ctx.fillStyle = DARK;
        ctx.textAlign = 'left';
        let pName = p.name;
        while (ctx.measureText(pName).width > maxNW && pName.length > 4) {
          pName = pName.slice(0, -1);
        }
        if (pName.length < p.name.length) pName += '…';
        ctx.fillText(pName, nameX, mY);

        // Cantidad
        ctx.font      = `400 13px ${BF}`;
        ctx.fillStyle = GRAY;
        ctx.textAlign = 'center';
        ctx.fillText(`${p.quantity}`, CX_QTY, mY);

        // Precio unitario
        ctx.textAlign = 'right';
        ctx.fillText(`Q ${p.price.toFixed(2)}`, CX_UPR, mY);

        // Total de línea
        ctx.font      = `600 13px ${BF}`;
        ctx.fillStyle = DARK;
        ctx.fillText(`Q ${(p.price * p.quantity).toFixed(2)}`, CX_TOT, mY);

        y += rH;
      }

      // ── Barra de total ───────────────────────────────────
      ctx.fillStyle = RED;
      ctx.fillRect(PAD, y, W - PAD * 2, TOT_H);

      // Conteo de ítems (izquierda, sutil)
      const nItems = getTotalProducts();
      ctx.font      = `400 10px ${BF}`;
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.textAlign = 'left';
      ctx.fillText(
        `${nItems} PRODUCTO${nItems !== 1 ? 'S' : ''}`,
        CX_NAME + 12,
        y + TOT_H / 2 + 4
      );

      // Etiqueta + monto (derecha)
      ctx.font      = `bold 32px ${HF}`;
      ctx.fillStyle = WHITE;
      ctx.textAlign = 'right';
      ctx.fillText(`TOTAL   Q ${getTotalPrice().toFixed(2)}`, CX_TOT, y + TOT_H / 2 + 13);

      y += TOT_H;
    }

    // ════════════════════════════════════════════════════════
    // FOOTER
    // ════════════════════════════════════════════════════════
    if (footerImage && footerImage.complete) {
      ctx.drawImage(footerImage, 0, H - FTR_H, W, FTR_H);
    }
  }

  async function downloadImage(): Promise<void> {
    if (!nombreCliente) {
      alert('POR FAVOR, COMPLETA EL NOMBRE DEL CLIENTE.');
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
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
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
              TELÉFONO <span class="ml-1 text-surface-400 normal-case font-normal">(opcional)</span>
            </label>
            <input
              id="telefono"
              type="tel"
              bind:value={telefono}
              on:input={(e) => { telefono = toUpperCase(telefono); }}
              placeholder="NÚMERO DE TELÉFONO (OPCIONAL)"
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
