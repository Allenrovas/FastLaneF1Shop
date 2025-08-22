import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export interface Category {
  id: string;
  name: string;
  variant: string;
  description?: string;
}

// Categories store
export const categories: Writable<Category[]> = writable([]);
export const isLoadingCategories: Writable<boolean> = writable(true);

// GitHub Pages configuration - ajusta con tu repo
const GITHUB_REPO_URL = 'https://raw.githubusercontent.com/tu-usuario/tu-repo/main';

// Load categories from GitHub Pages
export async function loadCategories(): Promise<void> {
  try {
    isLoadingCategories.set(true);
    
    const response = await fetch(`${GITHUB_REPO_URL}/data/categories.json`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: Category[] = await response.json();
    categories.set(data);
    
  } catch (error) {
    console.error('Error loading categories:', error);
    
    // Fallback categories
    const fallbackCategories: Category[] = [
      { 
        id: 'all', 
        name: 'Todos', 
        variant: 'variant-gradient-primary-secondary',
        description: 'Toda la colección de monoplazas'
      },
      { 
        id: 'championship', 
        name: 'Campeones', 
        variant: 'variant-gradient-warning-error',
        description: 'Monoplazas campeones del mundo'
      },
      { 
        id: 'ferrari', 
        name: 'Ferrari', 
        variant: 'variant-gradient-error-primary',
        description: 'La escudería más legendaria'
      },
      { 
        id: 'mercedes', 
        name: 'Mercedes', 
        variant: 'variant-gradient-surface-primary',
        description: 'Tecnología alemana de vanguardia'
      },
      { 
        id: 'mclaren', 
        name: 'McLaren', 
        variant: 'variant-gradient-tertiary-secondary',
        description: 'Innovación británica'
      },
      { 
        id: 'aston', 
        name: 'Aston Martin', 
        variant: 'variant-gradient-success-primary',
        description: 'Elegancia y rendimiento'
      },
      { 
        id: 'alpine', 
        name: 'Alpine', 
        variant: 'variant-gradient-primary-tertiary',
        description: 'Pasión francesa'
      }
    ];
    
    categories.set(fallbackCategories);
  } finally {
    isLoadingCategories.set(false);
  }
}