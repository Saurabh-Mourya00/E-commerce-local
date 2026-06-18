'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Clock, CheckCircle2, TrendingUp, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'delivered';
  deliveryAddress: string;
  paymentMethod: string;
  createdAt: Timestamp;
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/login');
      return;
    }

    async function loadOrders() {
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user!.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const loadedOrders: Order[] = [];
        querySnapshot.forEach((doc) => {
          loadedOrders.push({ id: doc.id, ...doc.data() } as Order);
        });
        setOrders(loadedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [user, authLoading, router]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" /> Delivered</Badge>;
      case 'confirmed':
        return <Badge className="bg-blue-500"><TrendingUp className="w-3 h-3 mr-1" /> Confirmed</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
    }
  };

  const formatDate = (timestamp: Timestamp | any) => {
    if (!timestamp) return 'Just now';
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleString();
    }
    return new Date(timestamp).toLocaleString();
  };

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container max-w-4xl px-4 py-12 mx-auto text-center">
        <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h1 className="text-3xl font-bold mb-4">No Orders Yet</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven&apos;t placed any orders yet.</p>
        <Button onClick={() => router.push('/')} size="lg">Start Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl px-4 py-8 mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Orders</h1>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50 pb-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <CardTitle className="text-lg">Order #{order.id.slice(-6).toUpperCase()}</CardTitle>
                  <CardDescription>Placed on {formatDate(order.createdAt)}</CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="font-bold text-lg">₹{order.total}</p>
                  </div>
                  <div>{getStatusBadge(order.status)}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {order.items.map((item, index) => (
                  <div key={index} className="flex p-4 items-center gap-4">
                    <div className="relative w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                      <Image 
                        src={item.image || 'https://picsum.photos/seed/placeholder/100/100'} 
                        alt={item.name}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium line-clamp-1">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                    <div className="font-semibold text-right">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="h-px bg-border" />
            <div className="p-4 bg-muted/20 text-sm flex flex-col sm:flex-row justify-between text-muted-foreground gap-2">
              <p><span className="font-medium text-foreground">Delivering to:</span> {order.deliveryAddress}</p>
              <p><span className="font-medium text-foreground">Payment:</span> {order.paymentMethod.toUpperCase()}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
