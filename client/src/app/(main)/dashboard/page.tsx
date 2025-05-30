'use client';

import ConnectAccounts from '@/components/connectAccounts';
import { useAuthStore } from '@/store/AuthStore/useAuthStore';
import { useEffect } from 'react';

export default function Dashboard() {
  const { user, fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="p-8 pt-48">
      <h1 className="flex justify-center text-2xl font-bold">Welcome, {user?.name}</h1>
      <ConnectAccounts />
    </div>
  );
}
