import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DOMAIN = 'https://fastlanef1shop.com';
const GITHUB_REPO_URL = 'https://raw.githubusercontent.com/Allenrovas/Datos_Catalogo/main';

// Páginas estáticas principales
const staticPages = [
  { url: '/', priority: 1.0, changefreq: 'weekly' },
  { url: '/catalogo', priority: 0.9, changefreq: 'weekly' },
  { url: '/productos', priority: 0.9, changefreq: 'weekly' },
  { url: '/about', priority: 0.7, changefreq: 'monthly' },
  { url: '/contact', priority: 0.7, changefreq: 'monthly' },
  { url: '/shipping', priority: 0.6, changefreq: 'monthly' },
];

async function getProductIds() {
  try {
    console.log('📥 Obteniendo productos desde GitHub...');
    const response = await fetch(`${GITHUB_REPO_URL}/data/products.json`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const products = await response.json();
    console.log(`✅ Se encontraron ${products.length} productos`);
    return products.map(p => p.id);
  } catch (error) {
    console.error('❌ Error obteniendo productos:', error.message);
    console.log('⚠️  Usando array vacío de productos');
    return [];
  }
}

async function getCategories() {
  try {
    console.log('📥 Obteniendo categorías desde GitHub...');
    const response = await fetch(`${GITHUB_REPO_URL}/data/categories.json`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const categories = await response.json();
    console.log(`✅ Se encontraron ${categories.length} categorías`);
    return categories;
  } catch (error) {
    console.error('❌ Error obteniendo categorías:', error.message);
    console.log('⚠️  Usando array vacío de categorías');
    return [];
  }
}

async function generateSitemap() {
  try {
    const productIds = await getProductIds();
    const categoriesData = await getCategories();
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    const lastmod = new Date().toISOString().split('T')[0];

    // Añadir páginas estáticas
    staticPages.forEach(({ url, priority, changefreq }) => {
      xml += `  <url>\n`;
      xml += `    <loc>${DOMAIN}${url}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += `    <changefreq>${changefreq}</changefreq>\n`;
      xml += `    <priority>${priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    // Añadir páginas de categorías dinámicamente desde el JSON
    if (categoriesData && categoriesData.length > 0) {
      console.log('📁 Añadiendo categorías al sitemap...');
      categoriesData.forEach((category) => {
        // Determinar prioridad según el tipo
        let priority = 0.6;
        let changefreq = 'weekly';
        
        if (category.type === 'team') {
          priority = 0.8;
        } else if (category.type === 'general' && category.id !== 'all') {
          priority = 0.7;
        } else if (category.type === 'manufacturer') {
          priority = 0.7;
        } else if (category.type === 'scale') {
          priority = 0.6;
        }

        xml += `  <url>\n`;
        xml += `    <loc>${DOMAIN}/categoria/${category.id}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += `    <changefreq>${changefreq}</changefreq>\n`;
        xml += `    <priority>${priority}</priority>\n`;
        xml += `  </url>\n`;
      });
    }

    // Añadir productos dinámicos
    if (productIds && productIds.length > 0) {
      console.log('🏎️  Añadiendo productos al sitemap...');
      productIds.forEach((id) => {
        xml += `  <url>\n`;
        xml += `    <loc>${DOMAIN}/producto/${id}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.6</priority>\n`;
        xml += `  </url>\n`;
      });
    }

    xml += '</urlset>';

    // Determinar dónde guardar el archivo
    let outputPath = path.join(__dirname, '../build/sitemap.xml');
    
    const fastlanePath = path.join(__dirname, 'fastlanef1shop/build/sitemap.xml');
    if (fs.existsSync(path.dirname(fastlanePath))) {
      outputPath = fastlanePath;
    }

    // Crear directorio si no existe
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, xml, 'utf-8');
    
    const totalUrls = staticPages.length + (categoriesData?.length || 0) + productIds.length;
    console.log(`\nSitemap generado exitosamente`);
    console.log(`Ubicación: ${outputPath}`);
    console.log(`Total de URLs: ${totalUrls}`);
    console.log(`   - Páginas estáticas: ${staticPages.length}`);
    console.log(`   - Categorías dinámicas: ${categoriesData?.length || 0}`);
    console.log(`   - Productos dinámicos: ${productIds.length}`);
  } catch (error) {
    console.error('❌ Error generando sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();