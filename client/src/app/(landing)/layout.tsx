import RootStructure from '@/styles/template/RootLayout';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RootStructure>{children}</RootStructure>
    </>
  );
}
