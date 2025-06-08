'use client';

import type React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface GlowingButtonProps {
  children: React.ReactNode | string;
  href?: string;
  className?: string;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'indigo' | 'emerald';
}

const colorMap = {
  blue: { rgb: '59, 130, 246', class: 'blue' },
  green: { rgb: '34, 197, 94', class: 'green' },
  red: { rgb: '239, 68, 68', class: 'red' },
  yellow: { rgb: '234, 179, 8', class: 'yellow' },
  indigo: { rgb: '168, 85, 247', class: 'indigo' },
  emerald: { rgb: '16, 185, 129', class: 'emerald' },
};

export function GlowingButton({
  children,
  href,
  className,
  color = 'emerald',
}: GlowingButtonProps) {
  const buttonColor = colorMap[color];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'inline-block font-ClashDisplayMedium rounded-xl',
        'transition-colors duration-300 backdrop-blur-sm ease-in-out px-4 py-1 relative group',
        `bg-${color}-500/10 border border-${color}-500 text-${color}-500`,
        `hover:bg-${color}-400/10 hover:border-${color}-400 hover:text-${color}-400`,
        className
      )}
    >
      <Link href={href || ''} className="text-sm relative z-10">
        {children}
      </Link>
      <motion.span
        className={cn(
          'absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 ease-in-out',
          `bg-${color}-500`
        )}
        animate={{
          boxShadow: [
            `0 0 0 0 rgba(${buttonColor.rgb}, 0)`,
            `0 0 0 10px rgba(${buttonColor.rgb}, 0.3)`,
            `0 0 0 20px rgba(${buttonColor.rgb}, 0)`,
          ],
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: 'loop',
        }}
      />
    </motion.div>
  );
}
