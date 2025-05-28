'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

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
    { href: '/dashboard', title: 'Get Started' },
    { href: '/login', title: 'SignIn' },
    { href: '/upgrade', title: 'UpGrade' },
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileNavbar;
