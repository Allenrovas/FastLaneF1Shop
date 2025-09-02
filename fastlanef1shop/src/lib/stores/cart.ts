import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import type { Writable, Readable } from 'svelte/store';

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  images: string[];
  imageFolder: string;
  specifications?: {
    engine: string;
    power: string;
    weight: string;
    topSpeed: string;
    acceleration: string;
  };
  features?: string[];
  inStock: boolean;
  limitedEdition: boolean;
  year: number;
  team: string;
}

export interface CartItem extends Product {
  quantity: number;
}

// Función para cargar el carrito desde localStorage
function loadCartFromStorage(): CartItem[] {
  if (!browser) return [];
  try {
    const stored = localStorage.getItem('f1-cart');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Cart store con persistencia
export const cart: Writable<CartItem[]> = writable(loadCartFromStorage());

// Suscribirse a cambios y guardar en localStorage
if (browser) {
  cart.subscribe(items => {
    localStorage.setItem('f1-cart', JSON.stringify(items));
  });
}

// Cart derived stores
export const cartTotal: Readable<number> = derived(
  cart,
  ($cart) => $cart.reduce((total, item) => total + (item.price * item.quantity), 0)
);

export const cartItemCount: Readable<number> = derived(
  cart,
  ($cart) => $cart.reduce((total, item) => total + item.quantity, 0)
);

export const cartItems: Readable<CartItem[]> = derived(cart, ($cart) => $cart);

// Toast notification store
export const toastNotification = writable<{
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  visible: boolean;
}>({
  message: '',
  type: 'success',
  visible: false
});

// Cart functions
export function addToCart(product: Product): void {
  cart.update(items => {
    const existingItem = items.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      items.push({ ...product, quantity: 1 });
    }
    
    // Show toast notification
    toastNotification.set({
      message: `${product.name} añadido al carrito`,
      type: 'success',
      visible: true
    });
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      toastNotification.update(toast => ({ ...toast, visible: false }));
    }, 3000);
    
    return items;
  });
}

export function removeFromCart(productId: number): void {
  cart.update(items => {
    const removedItem = items.find(item => item.id === productId);
    if (removedItem) {
      toastNotification.set({
        message: `${removedItem.name} eliminado del carrito`,
        type: 'warning',
        visible: true
      });
      
      setTimeout(() => {
        toastNotification.update(toast => ({ ...toast, visible: false }));
      }, 3000);
    }
    return items.filter(item => item.id !== productId);
  });
}

export function updateQuantity(productId: number, quantity: number): void {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  
  cart.update(items => {
    const item = items.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
    }
    return items;
  });
}

export function clearCart(): void {
  cart.set([]);
  toastNotification.set({
    message: 'Carrito vaciado',
    type: 'info',
    visible: true
  });
  
  setTimeout(() => {
    toastNotification.update(toast => ({ ...toast, visible: false }));
  }, 3000);
}

// Función para recargar el carrito desde localStorage
export function reloadCart(): void {
  cart.set(loadCartFromStorage());
}