'use client';

import { ArrowUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const FooterLinks = [
  { href: 'https://github.com/Shivanipalya26', label: 'Github' },
  { href: 'https://www.linkedin.com/in/shivani-palya/', label: 'Linkedin' },
  { href: 'https://x.com/shivani62_ace', label: 'Twitter' },
];

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <footer className="w-full md:mt-30 mt-20 border-t py-16 px-10 bg-background/80 backdrop-blur-sm">
      <div>
        <div className="flex flex-col">
          <div className="flex gap-2 items-center">
            <Image src="/logo.png" alt="logo" width={30} height={30} />
            <h2 className="text-2xl font-semibold leading-none">SocialNest</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground dark:text-neutral-400">
            One Hub. Every Platform. Endless Possibilities.
          </p>
        </div>

        <div className="border-t mt-6 md:mt-8 flex flex-col md:flex-row justify-center md:justify-between items-center">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4 mt-4">
            <p className="text-sm text-muted-foreground dark:text-neutral-400 text-center">
              © 2025 SocialNest. All rights reserved.
            </p>
          </div>

          <button
            className="absolute bg-primary-foreground hover:bg-muted transition-colors md:right-8 right-5 md:top-24 top-[9.5rem] flex items-center justify-center md:rounded-lg rounded-full border border-border w-14 h-14"
            onClick={scrollToTop}
          >
            <ArrowUp className="h-7 w-7" />
          </button>
        </div>

        <div className="text-xs md:text-sm dark:text-neutral-400 flex flex-col md:flex-row gap-2 md:gap-0 items-center justify-between ">
          <div className="flex flex-wrap justify-center md:justify-start gap-3 text-neutral-400">
            <Link href="/contact" className="hover:text-orange-400">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-orange-400">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-orange-400">
              Terms of Service
            </Link>
            <Link href="/refund-cancellation" className="hover:text-orange-400">
              Refund & Cancellation
            </Link>
          </div>

          <div className="space-y-2">
            <Link href="https://shivanipalya.tech/" target="_blank" rel="noopener noreferrer">
              <p>
                Made by{' '}
                <span className="underline font-bold text-orange-400 hover:text-orange-500">
                  Shivani
                </span>
              </p>
            </Link>
          </div>

          <div className="flex gap-2 items-center">
            <p>Reach Out:</p>
            {FooterLinks.map(link => (
              <Link
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-gray-100 hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
