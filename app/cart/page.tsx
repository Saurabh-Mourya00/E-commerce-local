'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore, useCartTotal } from '@/lib/store';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const total = useCartTotal();
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('upi');

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Load Razorpay script dynamically
  const loadRazorpay = (src: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayCheckout = async () => {
    if (items.length === 0) {
      alert('Cart is empty');
      return;
    }

    setIsCheckingOut(true);
    try {
      // 1. Load Razorpay SDK
      const loaded = await loadRazorpay('https://checkout.razorpay.com/v1/checkout.js');
      if (!loaded) {
        alert('Razorpay SDK failed to load. Check your internet connection.');
        setIsCheckingOut(false);
        return;
      }

      // 2. Create order on Django backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const orderRes = await fetch(`${apiUrl}/create-order/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(total) }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        alert(`Error creating order: ${err.error || 'Unknown error'}`);
        setIsCheckingOut(false);
        return;
      }

      const orderData = await orderRes.json();

      // 3. Open Razorpay checkout modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'ARMA Store',
        description: `Grocery Order — ${itemCount} items`,
        order_id: orderData.order_id,
        handler: async function (response: any) {
          // Payment successful
          alert(
            `Payment Successful!\n\nPayment ID: ${response.razorpay_payment_id}\nOrder ID: ${response.razorpay_order_id}`
          );
          clearCart();
          router.push('/');
        },
        prefill: {
          name: 'Customer',
          contact: '',
        },
        theme: {
          color: '#059669', // Matches Emerald-600
        },
        modal: {
          ondismiss: () => {
            setIsCheckingOut(false);
          },
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleCheckout = async () => {
    if (paymentMethod === 'upi') {
      await handleRazorpayCheckout();
    } else {
      // Cash on Delivery
      if (items.length === 0) {
        alert('Cart is empty');
        return;
      }
      if (!address.trim()) {
        alert('Please enter a delivery address');
        return;
      }
      alert('Order placed with Cash on Delivery! Your order will be delivered soon.');
      clearCart();
      router.push('/');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Your Cart is Empty</h1>
          <p className="text-slate-500 mb-8">Looks like you haven&apos;t added any items yet.</p>
          <button 
            onClick={() => router.push('/')} 
            className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.push('/')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <h1 className="text-3xl font-bold text-slate-800">Shopping Cart</h1>
          <span className="bg-emerald-100 text-emerald-700 text-sm font-bold px-3 py-1 rounded-full">{itemCount} items</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-4 hover:shadow-sm transition-shadow">
                {/* Product Image/Icon */}
                <div className="w-20 h-20 bg-slate-50 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden">
                  {item.image ? (
                    <img 
                      src={item.image.startsWith('http') ? item.image : `http://127.0.0.1:8000${item.image}`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    item.imageIcon
                  )}
                </div>
                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-slate-800">{item.name}</h3>
                      <p className="text-slate-400 text-xs mt-0.5">{item.category} · {item.packSize}</p>
                    </div>
                    <span className="font-bold text-lg text-slate-800">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 bg-slate-50 rounded-full p-1">
                      <button 
                        className="w-7 h-7 bg-white border border-slate-200 text-slate-600 rounded-full flex items-center justify-center font-bold text-sm hover:bg-slate-100 transition-colors"
                        onClick={() => {
                          if (item.quantity <= 1) removeItem(item.id);
                          else updateQuantity(item.id, item.quantity - 1);
                        }}
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                      <button 
                        className="w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm hover:bg-emerald-700 transition-colors"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button 
                      className="text-red-400 hover:text-red-600 text-xs font-medium flex items-center gap-1 transition-colors"
                      onClick={() => removeItem(item.id)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-8">
              <h2 className="font-bold text-lg text-slate-800 mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="font-semibold">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Fee</span>
                  <span className="text-emerald-600 font-semibold">Free</span>
                </div>
                <div className="h-px bg-slate-100 my-3"></div>
                <div className="flex justify-between font-bold text-lg text-slate-800">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Delivery Address */}
              <div className="mt-6 space-y-2">
                <label className="text-sm font-semibold text-slate-700">Delivery Address</label>
                <input 
                  type="text"
                  placeholder="Enter your full address" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Payment Method */}
              <div className="mt-5 space-y-2">
                <label className="text-sm font-semibold text-slate-700">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-2.5 rounded-xl text-sm font-semibold transition-colors border ${paymentMethod === 'upi' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                  >
                    💳 UPI / Card
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('cod')}
                    className={`py-2.5 rounded-xl text-sm font-semibold transition-colors border ${paymentMethod === 'cod' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                  >
                    💵 Cash on Delivery
                  </button>
                </div>
              </div>

              {/* Checkout Button */}
              <button 
                className="w-full mt-6 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-600/20 active:scale-95 transition-transform uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-700"
                onClick={handleCheckout} 
                disabled={isCheckingOut}
              >
                {isCheckingOut ? 'Processing...' : paymentMethod === 'upi' ? `Pay ₹${total.toFixed(2)} via Razorpay` : `Place COD Order — ₹${total.toFixed(2)}`}
              </button>

              {paymentMethod === 'upi' && (
                <p className="text-[10px] text-slate-400 text-center mt-2">Secured by Razorpay • UPI, Cards, Net Banking</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
