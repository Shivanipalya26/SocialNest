'use client';

import { motion } from 'motion/react';
import { useTheme } from 'next-themes';
import Aurora from '../background/Aurora';
import Liquid from '../background/Liquid';
import { Button } from '../ui/button';
import Link from 'next/link';

const HomePage = () => {
  const { theme } = useTheme();
  return (
    <section className="pt-16 px-6 xl:px-0">
      <div className="flex relative flex-col rounded-[30px] md:max-w-6xl mx-auto my-5 gap-10 md:gap-[100px] pb-[50px] px- md:pb-0 md:flex-row items-center justify-center flex-grow bg-transparent dark:overflow-hidden">
        <div className="z-10 relative text-white flex flex-col items-center justify-center w-full px-4 md:px-0">
          <div className=" max-w-4xl text-center leading-none pt-10 md:pt-20">
            <div className="border inline-block px-4 py-2 backdrop-blur-xl border-primary/30 text-xs md:text-sm mb-8 rounded-full">
              <span>Craft Once, Publish Everywhere🎉</span>
            </div>
            <h1 className="text-[40px] leading-none sm:text-[80px] lg:text-[80px]">
              Craft, Schedule, and <span className="text-orange-500">Publish</span> - All in One
              Hub, Just a Click Away!
            </h1>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center px-4 md:text-xl dark:text-neutral-300 my-10"
          >
            With No Hassle share content to Twitter, LinkedIn, Instagram and more{' '}
            <span className="text-orange-500">- all at once.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-row gap-4 py-12"
          >
            <Link href="/signin">
              <Button variant="default" className="rounded-full" size={'lg'}>
                Get Started
              </Button>
            </Link>
            <Link href="">
              <Button variant="outline" className="rounded-full" size={'lg'}>
                Login
              </Button>
            </Link>
          </motion.div>
        </div>

        {theme === 'dark' ? (
          <div className="absolute top-0 left-0 w-full h-full">
            <Aurora colorStops={['#FF3C3C', '#FFD700', '#FF3C3C']} />
          </div>
        ) : (
          <div className="absolute rounded-[30px] border-secondary/80 overflow-hidden opacity-50 border-t-[7px] border-x-[7px] top-0 left-0 w-full h-full">
            <Liquid color={[1, 1, 1]} mouseReact={false} amplitude={0.1} speed={1.0} />
            <div className="sticky -bottom-10 blur-xl left-0 h-32 w-full bg-white"></div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomePage;
