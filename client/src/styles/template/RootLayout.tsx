import Footer from '@/components/footer';
import NavBar from '@/components/navbar';
import { FC, ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const RootStructure: FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <NavBar />
      {children}
      <Footer />
    </div>
  );
};

export default RootStructure;
