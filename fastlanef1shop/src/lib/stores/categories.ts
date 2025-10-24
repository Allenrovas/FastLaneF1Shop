// src/lib/stores/categories.ts
import { writable, get } from 'svelte/store';

export interface Category {
  id: string;
  name: string;
  description?: string;
  variant: string;
  icon: string;
  type: 'general' | 'team' | 'manufacturer' | 'scale' | 'driver';
}

export const categories = writable<Category[]>([]);
export const categoriesLoading = writable<boolean>(false);
export const categoriesError = writable<string | null>(null);

// GitHub configuration
const GITHUB_REPO_URL = 'https://raw.githubusercontent.com/Allenrovas/Datos_Catalogo/main';

/**
 * Carga las categorías desde GitHub
 * Si falla, usa un fallback con categorías por defecto
 */
export async function loadCategories(): Promise<void> {
  try {
    categoriesLoading.set(true);
    categoriesError.set(null);
    
    const response = await fetch(`${GITHUB_REPO_URL}/data/categories.json`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: Category[] = await response.json();
    categories.set(data);
    
    console.log(`✓ ${data.length} categorías cargadas desde GitHub`);
    
  } catch (error) {
    console.error('Error loading categories:', error);
    categoriesError.set('Error al cargar categorías, usando fallback');
    
    // Fallback a categorías por defecto mínimas
    const fallbackCategories: Category[] = [
      // Categorías generales
      { 
        id: 'all', 
        name: 'Todos los Productos', 
        variant: 'variant-filled-primary', 
        icon: 'lucide:grid-3x3',
        type: 'general'
      },
      { 
        id: 'championship', 
        name: 'Campeones del Mundo', 
        description: 'Los monoplazas que conquistaron el título mundial',
        variant: 'variant-filled-warning', 
        icon: 'lucide:trophy',
        type: 'general'
      },
      { 
        id: 'limited', 
        name: 'Ediciones Limitadas', 
        description: 'Modelos exclusivos de colección',
        variant: 'variant-filled-error', 
        icon: 'lucide:star',
        type: 'general'
      },
      
      // Equipos principales
      { 
        id: 'red-bull', 
        name: 'Red Bull Racing', 
        description: 'Los toros voladores de Milton Keynes',
        variant: 'variant-filled-primary', 
        icon: 'lucide:zap',
        type: 'team'
      },
      { 
        id: 'ferrari', 
        name: 'Scuderia Ferrari', 
        description: 'El cavallino rampante de Maranello',
        variant: 'variant-filled-error', 
        icon: 'lucide:heart',
        type: 'team'
      },
      { 
        id: 'mercedes', 
        name: 'Mercedes-AMG Petronas', 
        description: 'Las flechas plateadas de Brackley',
        variant: 'variant-filled-surface', 
        icon: 'lucide:star',
        type: 'team'
      },
      { 
        id: 'mclaren', 
        name: 'McLaren F1 Team', 
        description: 'El naranja papaya de Woking',
        variant: 'variant-filled-warning', 
        icon: 'lucide:rocket',
        type: 'team'
      },
      
      // Escalas
      { 
        id: 'scale-1-43', 
        name: '1:43', 
        description: 'Escala clásica de colección',
        variant: 'variant-soft-primary', 
        icon: 'lucide:ruler',
        type: 'scale'
      },
      { 
        id: 'scale-1-18', 
        name: '1:18', 
        description: 'Escala premium con detalles excepcionales',
        variant: 'variant-soft-success', 
        icon: 'lucide:maximize',
        type: 'scale'
      }
    ];
    
    categories.set(fallbackCategories);
    console.warn('⚠ Usando categorías fallback');
    
  } finally {
    categoriesLoading.set(false);
  }
}

/**
 * Obtiene una categoría específica por su ID
 */
export function getCategoryById(id: string): Category | undefined {
  const cats = get(categories);
  return cats.find(cat => cat.id === id);
}

/**
 * Filtra categorías por tipo
 */
export function getCategoriesByType(type: Category['type']): Category[] {
  const cats = get(categories); 
  return cats.filter(cat => cat.type === type);
}

/**
 * Obtiene todas las categorías de equipos
 */
export function getTeamCategories(): Category[] {
  return getCategoriesByType('team');
}

/**
 * Obtiene todas las categorías de fabricantes
 */
export function getManufacturerCategories(): Category[] {
  return getCategoriesByType('manufacturer');
}

/**
 * Obtiene todas las categorías de escalas
 */
export function getScaleCategories(): Category[] {
  return getCategoriesByType('scale');
}

/**
 * Obtiene todas las categorías de pilotos
 */
export function getDriverCategories(): Category[] {
  return getCategoriesByType('driver');
}

/**
 * Obtiene todas las categorías generales
 */
export function getGeneralCategories(): Category[] {
  return getCategoriesByType('general');
}

/**
 * Verifica si una categoría existe
 */
export function categoryExists(id: string): boolean {
  return getCategoryById(id) !== undefined;
}

/**
 * Obtiene el conteo de categorías por tipo
 */
export function getCategoriesCountByType(): Record<Category['type'], number> {
  const cats = get(categories);
  const counts: Record<Category['type'], number> = {
    general: 0,
    team: 0,
    manufacturer: 0,
    scale: 0,
    driver: 0
  };
  
  cats.forEach(cat => {
    counts[cat.type]++;
  });
  
  return counts;
}