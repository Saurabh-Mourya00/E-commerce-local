'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Store } from 'lucide-react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  // If already logged in, redirect
  if (user) {
    router.push('/');
    return null;
  }

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success('Successfully logged in!');
      router.push('/');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <Store className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to ARMA Store</CardTitle>
          <CardDescription>
            Sign in to access your saved addresses, track orders, and get exclusive member discounts.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pt-4">
          <Button 
            variant="default" 
            size="lg" 
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
          <p className="text-sm text-center text-muted-foreground mt-4">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
