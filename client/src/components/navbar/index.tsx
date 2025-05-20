import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';
import MobileNavbar from './mobileNavbar';

const NavBar = () => {
  return (
    <header className="flex fixed p-4 z-40 w-full items-center justify-between mx-auto sm:px-6 backdrop-blur-lg">
      <Link href="/">SocialNest</Link>
      <div className="space-x-4 flex">
        <Link href="/signin">
          <Button variant={'default'} size={'sm'}>
            SignIn
          </Button>
        </Link>
        <Link href="/guide">
          <Button variant={'outline'} size={'sm'}>
            Guide
          </Button>
        </Link>
        <div className="md:hidden ">
          <MobileNavbar />
        </div>
      </div>
    </header>
  );
};

export default NavBar;
