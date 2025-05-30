import { ReactNode } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <div>{children}</div>;
}
