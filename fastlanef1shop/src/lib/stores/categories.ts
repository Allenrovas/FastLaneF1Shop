// src/lib/stores/categories.ts
import { writable } from 'svelte/store';

export interface Category {
  id: string;
  name: string;
  description?: string;
  variant: string;
  icon: string;
  type: 'general' | 'team' | 'manufacturer' | 'scale' | 'driver';
}

export const categories = writable<Category[]>([]);

export function loadCategories(): void {
  const categoryList: Category[] = [
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

    // Equipos/Escuderías
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
    { 
      id: 'aston-martin', 
      name: 'Aston Martin Aramco', 
      description: 'El verde británico de Silverstone',
      variant: 'variant-filled-success', 
      icon: 'lucide:shield',
      type: 'team'
    },
    { 
      id: 'alpine', 
      name: 'BWT Alpine F1 Team', 
      description: 'El azul francés de Enstone',
      variant: 'variant-filled-secondary', 
      icon: 'lucide:mountain',
      type: 'team'
    },

    // Marcas/Fabricantes
    { 
      id: 'burago', 
      name: 'Bburago', 
      description: 'Modelos de calidad italiana desde 1974',
      variant: 'variant-filled-tertiary', 
      icon: 'lucide:factory',
      type: 'manufacturer'
    },
    { 
      id: 'minichamps', 
      name: 'Minichamps', 
      description: 'Precisión alemana en cada detalle',
      variant: 'variant-filled-secondary', 
      icon: 'lucide:gem',
      type: 'manufacturer'
    },
    { 
      id: 'spark', 
      name: 'Spark Model', 
      description: 'Excelencia francesa en modelismo',
      variant: 'variant-filled-primary', 
      icon: 'lucide:sparkles',
      type: 'manufacturer'
    },
    { 
      id: 'amalgam', 
      name: 'Amalgam Collection', 
      description: 'Artesanía británica de lujo',
      variant: 'variant-filled-warning', 
      icon: 'lucide:crown',
      type: 'manufacturer'
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
    },
    { 
      id: 'scale-1-64', 
      name: '1:64', 
      description: 'Escala compacta perfecta para displays',
      variant: 'variant-soft-secondary', 
      icon: 'lucide:minimize',
      type: 'scale'
    },
    { 
      id: 'scale-1-8', 
      name: '1:8', 
      description: 'Escala exclusiva de alta gama',
      variant: 'variant-soft-warning', 
      icon: 'lucide:maximize-2',
      type: 'scale'
    },

    // Pilotos destacados
    { 
      id: 'verstappen', 
      name: 'Max Verstappen', 
      description: 'El campeón dominante de Red Bull',
      variant: 'variant-soft-primary', 
      icon: 'lucide:user',
      type: 'driver'
    },
    { 
      id: 'leclerc', 
      name: 'Charles Leclerc', 
      description: 'El predestinado de Ferrari',
      variant: 'variant-soft-error', 
      icon: 'lucide:user',
      type: 'driver'
    },
    { 
      id: 'hamilton', 
      name: 'Lewis Hamilton', 
      description: 'La leyenda de Mercedes',
      variant: 'variant-soft-surface', 
      icon: 'lucide:user',
      type: 'driver'
    }
  ];

  categories.set(categoryList);
}

// Helper functions para filtrar categorías por tipo
export function getCategoriesByType(type: Category['type']): Category[] {
  let categoryList: Category[] = [];
  categories.subscribe(cats => categoryList = cats)();
  return categoryList.filter(cat => cat.type === type);
}

export function getTeamCategories(): Category[] {
  return getCategoriesByType('team');
}

export function getManufacturerCategories(): Category[] {
  return getCategoriesByType('manufacturer');
}

export function getScaleCategories(): Category[] {
  return getCategoriesByType('scale');
}

export function getDriverCategories(): Category[] {
  return getCategoriesByType('driver');
}

export function getGeneralCategories(): Category[] {
  return getCategoriesByType('general');
}