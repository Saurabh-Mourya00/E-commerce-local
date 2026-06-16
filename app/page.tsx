'use client';

import { useState, useEffect } from 'react';
<<<<<<< HEAD
=======
import { useRouter } from 'next/navigation';
>>>>>>> ff70d80 (needed fix)
import { CATEGORIES, INITIAL_PRODUCTS } from '@/lib/data';
import { useCartStore, useCartTotal, Product } from '@/lib/store';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState(CATEGORIES);
<<<<<<< HEAD
=======
  const [isLoading, setIsLoading] = useState(true);
>>>>>>> ff70d80 (needed fix)
  
  const { items, addItem, removeItem, updateQuantity } = useCartStore();
  const total = useCartTotal();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const router = useRouter();

  useEffect(() => {
    async function fetchFromBackend() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

<<<<<<< HEAD
        // Fetch products
=======
        // Fetch products from Django
>>>>>>> ff70d80 (needed fix)
        const prodRes = await fetch(`${apiUrl}/products/`);
        if (prodRes.ok) {
          const data = await prodRes.json();
          if (data && data.length > 0) {
            const mapped: Product[] = data.map((p: any) => ({
              id: `backend-${p.id}`,
              name: p.name,
<<<<<<< HEAD
              category: p.category_name || 'Daily Essentials',
=======
              category: p.category_name || 'Uncategorized',
>>>>>>> ff70d80 (needed fix)
              price: Number(p.price),
              imageIcon: p.image_icon || '🛒',
              packSize: p.pack_size || '',
              inStock: p.in_stock !== false,
              image: p.image || undefined,
            }));
<<<<<<< HEAD
            // Merge: keep local products + add backend products (avoid duplicates by name)
=======
            // Merge: keep local + add backend (dedupe by name)
>>>>>>> ff70d80 (needed fix)
            setProducts(prev => {
              const localNames = new Set(prev.map(p => p.name.toLowerCase()));
              const newProducts = mapped.filter(p => !localNames.has(p.name.toLowerCase()));
              return [...prev, ...newProducts];
            });
          }
        }

<<<<<<< HEAD
        // Fetch categories
=======
        // Fetch categories from Django admin
>>>>>>> ff70d80 (needed fix)
        const catRes = await fetch(`${apiUrl}/categories/`);
        if (catRes.ok) {
          const catData = await catRes.json();
          if (catData && catData.length > 0) {
            const backendCats = catData.map((c: any) => ({
              name: c.name,
              icon: c.icon || '📦',
            }));
<<<<<<< HEAD
            // Merge: keep local categories + add any new ones from backend
=======
            // Merge: keep local + add any new backend categories
>>>>>>> ff70d80 (needed fix)
            setCategories(prev => {
              const localNames = new Set(prev.map(c => c.name.toLowerCase()));
              const newCats = backendCats.filter((c: any) => !localNames.has(c.name.toLowerCase()));
              return [...prev, ...newCats];
            });
          }
        }
      } catch (err) {
        console.error('Error fetching from Django backend:', err);
<<<<<<< HEAD
=======
      } finally {
        setIsLoading(false);
>>>>>>> ff70d80 (needed fix)
      }
    }
    fetchFromBackend();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full flex-1 md:h-screen md:max-h-screen bg-[#f8fafc] text-slate-900 flex flex-col p-4 md:p-6 md:overflow-hidden font-sans mx-auto max-w-7xl">
      {/* Top Navigation Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <div className="flex items-center gap-4 sm:gap-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">A</div>
            <h1 className="text-2xl font-bold tracking-tight text-emerald-900 hidden sm:block">ARMA STORE</h1>
          </div>
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-sm font-medium text-slate-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span className="whitespace-nowrap">Green Park, Sector 4</span>
          </div>
        </div>
        <div className="flex-1 w-full max-w-md mx-0 sm:mx-8">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search for groceries, snacks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-10 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            <svg className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
        </div>
        <div className="flex items-center gap-4 justify-end">
          <button className="relative p-2 text-slate-600 hover:bg-slate-50 rounded-full" onClick={() => router.push('/cart')}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-orange-500 text-white text-[10px] flex items-center justify-center rounded-full">{itemCount}</span>
            )}
          </button>
          <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
        </div>
      </header>

      {/* Main Bento Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 grid-rows-none md:grid-rows-6 gap-4 overflow-y-auto md:overflow-hidden pb-4 md:pb-0">
        
        {/* Category Sidebar */}
        <div className="col-span-1 md:col-span-3 md:row-span-6 bg-white rounded-3xl border border-slate-200 p-5 flex flex-col min-h-[300px] overflow-y-auto">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Product Categories</h3>
          <div className="space-y-1">
            <div 
              className={`flex items-center gap-3 p-3 rounded-xl font-semibold cursor-pointer transition-colors ${activeCategory === 'All' ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-slate-50 text-slate-600'}`}
              onClick={() => setActiveCategory('All')}
            >
              <span className="text-lg">🛒</span> All Products
            </div>
            {categories.map(category => (
              <div 
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`flex items-center gap-3 p-3 rounded-xl font-semibold cursor-pointer transition-colors ${activeCategory.toLowerCase() === category.name.toLowerCase() ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-slate-50 text-slate-600'}`}
              >
                <span className="text-lg">{category.icon}</span> {category.name}
              </div>
            ))}
          </div>
          <div className="mt-auto pt-6">
            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
              <p className="text-orange-800 text-sm font-bold">Member Discount</p>
              <p className="text-orange-600 text-xs mt-1">Get 15% off on your first grocery list</p>
              <button className="mt-3 w-full py-2 bg-orange-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-orange-500/20">JOIN CLUB</button>
            </div>
          </div>
        </div>

        {/* Featured Hero Promotion */}
        <div className="col-span-1 md:col-span-6 md:row-span-3 bg-emerald-900 rounded-3xl relative overflow-hidden flex flex-col justify-center p-6 sm:p-10 min-h-[250px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full -mr-20 -mt-20 blur-3xl opacity-50"></div>
          <div className="z-10">
            <span className="bg-emerald-400 text-emerald-950 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Hyperlocal Savings</span>
            <h2 className="text-white text-3xl sm:text-4xl font-bold mt-4 leading-tight">Fresh Groceries <br/> Delivered in <span className="text-emerald-400">15 Mins</span></h2>
            <p className="text-emerald-100/60 mt-2 max-w-xs text-sm">Stock up your kitchen with daily essentials at wholesale prices from Arma Store.</p>
            <button className="mt-6 px-6 py-3 bg-white text-emerald-900 font-bold rounded-xl hover:scale-105 transition-transform text-sm">Shop Essentials</button>
          </div>
          <div className="absolute bottom-6 right-6 hidden sm:flex gap-2">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl">🌾</div>
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl">🍎</div>
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl">🧴</div>
          </div>
        </div>

        {/* Checkout & Summary Card */}
        <div className="col-span-1 md:col-span-3 md:row-span-3 bg-orange-600 rounded-3xl p-6 text-white flex flex-col justify-between min-h-[250px]">
          <div>
            <h3 className="font-bold text-lg leading-tight mb-4 text-white">Ready for <br/>Secure Checkout?</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs text-orange-200">
                <span>Subtotal ({itemCount} items)</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-orange-200">
                <span>Delivery Fee</span>
                <span className="text-white font-bold">FREE</span>
              </div>
              <div className="h-px bg-white/20 my-2"></div>
              <div className="flex justify-between font-black text-xl">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <button 
            disabled={itemCount === 0}
            onClick={() => router.push('/cart')}
            className="w-full py-4 mt-6 bg-white text-orange-600 disabled:opacity-50 font-black rounded-2xl shadow-xl shadow-orange-900/20 active:scale-95 transition-transform uppercase tracking-wider text-sm"
          >
            {itemCount === 0 ? "Cart is empty" : "Proceed to Pay"}
          </button>
        </div>

        {/* Product Grid */}
        <div className="col-span-1 md:col-span-9 md:row-span-3 grid grid-cols-2 lg:grid-cols-4 gap-4 overflow-y-auto no-scrollbar pb-2">
<<<<<<< HEAD
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-3xl border border-slate-200 p-4 flex flex-col h-[200px] hover:shadow-md transition-shadow">
              <div className="bg-slate-50 rounded-2xl h-20 mb-3 flex items-center justify-center text-4xl overflow-hidden relative">
                {product.image ? (
                  <img 
                    src={product.image.startsWith('http') ? product.image : `http://127.0.0.1:8000${product.image}`} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  product.imageIcon
                )}
              </div>
              <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{product.name}</h4>
              <p className="text-[10px] text-slate-400 mt-1">{product.packSize}</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="font-bold text-sm text-emerald-600">₹{product.price}</span>
                {(() => {
                  const cartItem = items.find(item => item.id === product.id);
                  if (cartItem) {
                    return (
                      <div className="flex items-center gap-1">
                        <button 
                          className="w-6 h-6 bg-slate-200 text-slate-700 rounded-full flex items-center justify-center font-bold text-xs active:scale-90 transition-transform hover:bg-slate-300"
                          onClick={() => {
                            if (cartItem.quantity <= 1) {
                              removeItem(product.id);
                            } else {
                              updateQuantity(product.id, cartItem.quantity - 1);
                            }
                          }}
                        >
                          −
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-emerald-700">{cartItem.quantity}</span>
                        <button 
                          className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xs active:scale-90 transition-transform"
                          onClick={() => addItem(product)}
                        >
                          +
                        </button>
                      </div>
                    );
                  }
                  return (
                    <button 
                      className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold pb-0.5 active:scale-90 transition-transform"
                      onClick={() => addItem(product)}
                    >
                      +
                    </button>
                  );
                })()}
              </div>
            </div>
          ))}
=======
          {filteredProducts.map((product) => {
            const cartItem = items.find(item => item.id === product.id);
            return (
              <div key={product.id} className="bg-white rounded-3xl border border-slate-200 p-4 flex flex-col h-[200px] hover:shadow-md transition-shadow">
                <div className="bg-slate-50 rounded-2xl h-20 mb-3 flex items-center justify-center text-4xl overflow-hidden relative">
                  {product.image ? (
                    <img 
                      src={product.image.startsWith('http') ? product.image : `http://127.0.0.1:8000${product.image}`} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    product.imageIcon
                  )}
                </div>
                <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{product.name}</h4>
                <p className="text-[10px] text-slate-400 mt-1">{product.packSize}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="font-bold text-sm text-emerald-600">₹{product.price}</span>
                  {cartItem ? (
                    <div className="flex items-center gap-1">
                      <button 
                        className="w-6 h-6 bg-slate-200 text-slate-700 rounded-full flex items-center justify-center font-bold text-xs active:scale-90 transition-transform hover:bg-slate-300"
                        onClick={() => {
                          if (cartItem.quantity <= 1) {
                            removeItem(product.id);
                          } else {
                            updateQuantity(product.id, cartItem.quantity - 1);
                          }
                        }}
                      >
                        −
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-emerald-700">{cartItem.quantity}</span>
                      <button 
                        className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xs active:scale-90 transition-transform"
                        onClick={() => addItem(product)}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold pb-0.5 active:scale-90 transition-transform"
                      onClick={() => addItem(product)}
                    >
                      +
                    </button>
                  )}
                </div>
              </div>
            );
          })}
>>>>>>> ff70d80 (needed fix)
          {filteredProducts.length === 0 && (
             <div className="col-span-full h-full flex items-center justify-center text-slate-400 text-sm font-medium">
               No products found. Try a different category.
             </div>
          )}
        </div>

      </div>
    </div>
  );
}
