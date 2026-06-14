import { ReactNode } from 'react';
import Link from 'next/link';
import { ShoppingCart, LogIn, User, Store, Package } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-center">
      <div className="container max-w-7xl flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Store className="h-6 w-6 text-green-600" />
          <span className="font-bold text-xl inline-block tracking-tight text-green-700">ARMA Store</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/orders">
              <Package className="h-5 w-5" />
              <span className="sr-only">Orders</span>
            </Link>
          </Button>
          <Button variant="outline" className="relative" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart
              {itemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 px-2 py-0.5 min-w-[20px] h-5 flex items-center justify-center rounded-full text-xs">
                  {itemCount}
                </Badge>
              )}
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/login">
              <User className="h-5 w-5" />
              <span className="sr-only">Login</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
