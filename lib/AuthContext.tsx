'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface UserData {
  uid: string;
  email: string | null;
  name: string | null;
  role: 'customer' | 'store_owner' | 'admin';
  savedAddresses: string[];
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  logout: () => Promise<void>;
  updateAddresses: (addresses: string[]) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  logout: async () => {},
  updateAddresses: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          } else {
            // Create user profile if none exists
            const newUser: UserData = {
              uid: currentUser.uid,
              email: currentUser.email,
              name: currentUser.displayName || 'User',
              role: 'customer',
              savedAddresses: [],
            };
            await setDoc(doc(db, 'users', currentUser.uid), {
              ...newUser,
              createdAt: new Date().toISOString(),
            });
            setUserData(newUser);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  const updateAddresses = async (addresses: string[]) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid), { savedAddresses: addresses }, { merge: true });
      if (userData) {
        setUserData({ ...userData, savedAddresses: addresses });
      }
    } catch (error) {
      console.error("Error updating addresses", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, logout, updateAddresses }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
