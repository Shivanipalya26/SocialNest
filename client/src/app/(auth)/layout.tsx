import { ReactNode } from 'react';

export default function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <div className="relative pt-20 h-screen bg-background overflow-hidden">{children}</div>;
}
