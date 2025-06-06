// components/AuthProvider.tsx
'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/AuthStore/useAuthStore';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const fetchUser = useAuthStore(state => state.fetchUser);

  useEffect(() => {
    fetchUser(); // Only runs once if cookie is valid
  }, [fetchUser]);

  return <>{children}</>;
};

export default AuthProvider;
