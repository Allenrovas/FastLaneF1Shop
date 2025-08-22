import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import type { Writable, Readable } from 'svelte/store';

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  images: string[];
  imageFolder: string;
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

// Cart functions
export function addToCart(product: Product): void {
  cart.update(items => {
    const existingItem = items.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
      return items;
    } else {
      return [...items, { ...product, quantity: 1 }];
    }
  });
}

export function removeFromCart(productId: number): void {
  cart.update(items => items.filter(item => item.id !== productId));
}

export function updateQuantity(productId: number, quantity: number): void {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  cart.update(items => {
    const item = items.find(item => item.id !== productId);
    if (item) item.quantity = quantity;
    return items;
  });
}

export function clearCart(): void {
  cart.set([]);
}

// Función para recargar el carrito desde localStorage
export function reloadCart(): void {
  cart.set(loadCartFromStorage());
}