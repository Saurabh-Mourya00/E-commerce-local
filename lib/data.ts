import { Product } from './store';

export const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Pillsbury Chakki Atta', category: 'Daily Essentials', price: 450, packSize: '10 kg Pack', imageIcon: '🌾', inStock: true },
  { id: '2', name: 'India Gate Basmati', category: 'Daily Essentials', price: 620, packSize: '5 kg Pack', imageIcon: '🍚', inStock: true },
  { id: '3', name: 'Fortune Soya Oil', category: 'Daily Essentials', price: 145, packSize: '1 L Pouch', imageIcon: '🍶', inStock: true },
  { id: '4', name: 'Fresh Apples (Kashmir)', category: 'Fruits & Vegetables', price: 180, packSize: '1 kg', imageIcon: '🍎', inStock: true },
  { id: '5', name: 'Tata Salt', category: 'Daily Essentials', price: 24, packSize: '1 kg', imageIcon: '🧂', inStock: true },
  { id: '6', name: 'Amul Taaza Milk', category: 'Dairy & Eggs', price: 68, packSize: '1 L', imageIcon: '🥛', inStock: true },
];

export const CATEGORIES = [
  { name: 'Daily Essentials', icon: '🌾' },
  { name: 'Beverages & Drinks', icon: '🥤' },
  { name: 'Masala & Spices', icon: '🌶️' },
  { name: 'Snacks & Bakery', icon: '🍫' },
  { name: 'Dairy & Eggs', icon: '🧀' },
  { name: 'Fruits & Vegetables', icon: '🍎' },
  { name: 'Bulk Items', icon: '📦' }
];
