'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trash2, Plus, Minus, ArrowRight, CreditCard, Banknote } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();
  const { user, userData } = useAuth();
  const router = useRouter();
  const [address, setAddress] = useState(userData?.savedAddresses?.[0] || '');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('cod');

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please login to checkout');
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    if (!address.trim()) {
      toast.error('Please enter a delivery address');
      return;
    }

    setIsCheckingOut(true);
    try {
      const orderData = {
        userId: user.uid,
        storeId: items[0].storeId, // assuming single store for MVP
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        total,
        status: 'pending',
        deliveryAddress: address,
        paymentMethod,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'orders'), orderData);
      
      clearCart();
      toast.success('Order placed successfully!');
      router.push('/orders');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container max-w-4xl px-4 py-12 mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
        <p className="text-muted-foreground mb-8">Your cart is currently empty.</p>
        <Button onClick={() => router.push('/')} size="lg">Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl px-4 py-8 mx-auto">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="flex flex-col sm:flex-row overflow-hidden">
              <div className="relative w-full sm:w-32 h-32 bg-muted flex-shrink-0">
                <Image 
                  src={item.image} 
                  alt={item.name}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
                    <p className="text-muted-foreground text-sm">{item.category}</p>
                  </div>
                  <span className="font-bold text-lg">₹{item.price * item.quantity}</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive h-8 px-2" onClick={() => removeItem(item.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Checkout Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} items)</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="text-green-600">Free</span>
              </div>
              {userData && (
                <div className="flex justify-between text-green-600">
                  <span>Member Discount (10%)</span>
                  <span>-₹{Math.round(total * 0.1)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{userData ? Math.round(total * 0.9) : total}</span>
              </div>
              
              <div className="pt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address</Label>
                  <Input 
                    id="address" 
                    placeholder="Enter your full address" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant={paymentMethod === 'cod' ? 'default' : 'outline'}
                      onClick={() => setPaymentMethod('cod')}
                      className="w-full"
                    >
                      <Banknote className="mr-2 h-4 w-4" />
                      COD
                    </Button>
                    <Button 
                      variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                      onClick={() => setPaymentMethod('upi')}
                      className="w-full"
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      UPI
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size="lg" 
                onClick={handleCheckout} 
                disabled={isCheckingOut}
              >
                {isCheckingOut ? 'Processing...' : (user ? 'Place Order' : 'Login to Checkout')}
                {!isCheckingOut && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
