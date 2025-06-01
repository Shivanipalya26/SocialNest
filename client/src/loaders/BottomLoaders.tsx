'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { IconLoader } from '@tabler/icons-react';

interface BottomLoaderProps {
  isLoading: boolean;
  title?: string;
  selectedPlatforms?: string[];
}

export default function BottomLoader({
  isLoading,
  title = 'Processing',
  selectedPlatforms = [],
}: BottomLoaderProps) {
  const [blurIntensity, setBlurIntensity] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setBlurIntensity(prev => (prev < 8 ? prev + 1 : 8));
      }, 50);
      return () => clearInterval(interval);
    } else {
      setBlurIntensity(0);
    }
  }, [isLoading]);

  const containerVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    exit: {
      y: 100,
      opacity: 0,
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
  };

  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delay: 0.5, duration: 0.5 },
    },
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center md:pb-8 pb-4 md:px-0 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            backdropFilter: `blur(${blurIntensity}px)`,
            WebkitBackdropFilter: `blur(${blurIntensity}px)`,
          }}
        >
          <motion.div
            className="w-full max-w-md bg-background/80 font-ClashDisplayMedium border border-border rounded-2xl shadow-lg overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="p-4 flex items-center space-x-2">
              <div className="flex overflow-hidden">
                {selectedPlatforms.map(platform => (
                  <Image
                    key={platform}
                    className={` ${platform === 'twitter' && 'dark:invert'}`}
                    src={`/${platform}.svg`}
                    alt={`${platform} Logo`}
                    width={40}
                    height={40}
                  />
                ))}
              </div>
              <motion.div
                className="flex-grow capitalize text-sm font-medium"
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                {title}
              </motion.div>
              <IconLoader className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
