'use client';

import AuthProvider from '@/components/AuthProvider';
import { useAuthStore } from '@/store/AuthStore/useAuthStore';
import RootStructure from '@/styles/template/RootLayout';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { user, fetchUser } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await fetchUser();
      setLoading(false);
    };

    init();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500" />
      </div>
    );
  }

  return (
    <AuthProvider>
      <RootStructure>{children}</RootStructure>
    </AuthProvider>
  );
}
