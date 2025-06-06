'use client';

import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';
import MobileNavbar from './MobileNavbar';
import LogoutButton from '../buttons/LogoutButton';
import { useAuthStore } from '@/store/AuthStore/useAuthStore';
import NotificationBell from '../notificationBell';
import { Profile } from '../profile';

const loggedNavBarItem = [
  { title: 'DashBoard', href: '/dashboard' },
  { title: 'Create', href: '/create' },
  { title: 'Upgrade', href: '/upgrade' },
];

const NavBar = () => {
  const { user } = useAuthStore();

  return (
    <header className="flex fixed p-4 z-40 w-full items-center justify-between mx-auto sm:px-6 backdrop-blur-lg border-b">
      <Link href="/">SocialNest</Link>
      <div className="space-x-4 flex items-center">
        {user ? (
          <>
            <div className="hidden lg:flex gap-10 text-sm font-semibold items-center tracking-wide">
              {loggedNavBarItem.map(item => (
                <div className="hover:text-orange-400" key={item.title}>
                  <Link href={item.href}>{item.title}</Link>
                </div>
              ))}
              <NotificationBell />
            </div>

            <Profile />
            <LogoutButton />
          </>
        ) : (
          <Link href="/login">
            <Button variant={'default'} size={'sm'}>
              SignIn
            </Button>
          </Link>
        )}
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
