'use client';

import { ReactNode } from 'react';
import NavBar from '@/components/navbar';

export default function GuideLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar />
      <main>{children}</main>
    </>
  );
}
