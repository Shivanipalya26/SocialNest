'use client';

import React, { useState } from 'react';
import { CreditCard, Home, Menu, PlusCircle, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useAuthStore } from '@/store/AuthStore/useAuthStore';
import UserProfile from '../userProfile';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from '../buttons/LogoutButton';

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuthStore();

  const menuVariant = {
    hidden: { opacity: 0, y: '-100%' },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
    exit: { opacity: 0, y: '-100%', transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  };

  const navLinks = [
    { href: '/register', title: 'Get Started' },
    { href: '/login', title: 'SignIn' },
    { href: '/upgrade', title: 'UpGrade' },
  ];

  const loggedNavBarItems = [
    { title: 'DashBoard', href: '/dashboard', icon: Home, active: pathname === '/dashboard' },
    { title: 'Create', href: '/create', icon: PlusCircle, active: pathname === '/create' },
    { title: 'Upgrade', href: '/upgrade', icon: CreditCard, active: pathname === '/upgrade' },
  ];

  const menuItems = [
    { href: '/dashboard', label: 'Connected Accounts' },
    { href: '/upgrade', label: 'Pricing' },
  ];

  return (
    <div>
      <div className="flex gap-2">
        <button className="z-[50]" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col h-screen"
            variants={menuVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {user ? (
              <div className="flex flex-col h-full py-2 dark:bg-black bg-neutral-100">
                <div className="mb-6">
                  <UserProfile />
                </div>

                <div className="mb-2 flex items-center justify-between px-4">
                  {/* <UpgradeButton /> */}
                  {/* <Guide /> */}
                </div>
                {/* <Separator className="my-2" /> */}

                <nav className="flex-1 px-4">
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    Main Navigation
                  </div>
                  <ul className="space-y-1">
                    {loggedNavBarItems.map(item => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 rounded-md px-4 py-3 text-sm transition-colors ${
                            item.active
                              ? 'bg-orange-600 text-primary-foreground'
                              : 'hover:bg-accent hover:text-accent-foreground'
                          }`}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <div className="text-sm font-medium text-muted-foreground mt-6 mb-2">Account</div>
                  <ul className="space-y-1">
                    {menuItems.map(item => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 rounded-md px-4 py-3 text-sm transition-colors ${
                            pathname === item.href
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-accent hover:text-accent-foreground'
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* <Separator className="my-4" /> */}

                <div className="mt-auto px-4 pb-4">
                  <LogoutButton />
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center h-[80%] shadow-xl dark:bg-black bg-neutral-100 rounded-b-3xl inset-0 z-50">
                <nav className="flex flex-col items-center w-full">
                  {navLinks.map(link => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      className="block w-full md:px-10 px-4 py-4 md:py-6 md:text-3xl text-xl border-b transition-colors dark:hover:bg-secondary hover:bg-white hover:text-orange-500 duration-200"
                      initial="hidden"
                      animate="visible"
                    >
                      {link.title}
                    </motion.a>
                  ))}
                </nav>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileNavbar;
