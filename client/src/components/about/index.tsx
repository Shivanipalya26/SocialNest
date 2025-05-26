'use client';

import { AnimatePresence, motion } from 'motion/react';
import {
  IconAi,
  IconBellRinging2,
  IconClockHour10,
  IconCode,
  IconCoinRupeeFilled,
  IconLayoutDashboardFilled,
  IconPassword,
  IconPhotoEdit,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';

const About = () => {
  const features = [
    {
      icon: <IconAi />,
      title: 'AI-Generated Captions',
      description: 'Generate captions for your posts with AI.',
    },
    {
      icon: <IconPhotoEdit />,
      title: 'Inbuilt Image Editor',
      description: 'Edit images within the platform.',
    },
    {
      icon: <IconCode />,
      title: 'Code-to-Image Converter',
      description: 'Convert code snippets into images.',
    },
    {
      icon: <IconLayoutDashboardFilled />,
      title: 'Analytics',
      description: 'Track your post performance with analytics.',
    },
    {
      icon: <IconPassword />,
      title: 'Security',
      description:
        'Secure login and integrations with social media platforms to keep your accounts safe.',
    },
    {
      icon: <IconCoinRupeeFilled />,
      title: 'Affordable Pricing',
      description: 'Affordable pricing plans for all users.',
    },
    {
      icon: <IconBellRinging2 />,
      title: 'Notifications',
      description: 'Get notified about your posts and account activity.',
    },
    {
      icon: <IconClockHour10 />,
      title: 'Scheduling',
      description: 'Schedule posts for the future.',
    },
  ];
  return (
    <section>
      <div className="md:max-w-6xl mx-auto px-4 py-12 z-30 relative pt-28">
        <div className="p-6">
          <div className="flex text-5xl text-center justify-center py-2">and so much more!!</div>
          <p className="text-sm text-center text-muted-foreground">
            Managing your social platforms just got easier. SocialNest brings together all the tools
            you need — here’s what makes it truly stand out.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6 md:p-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="relative p-8 md:w-48 border-secondary flex flex-col overflow-hidden items-center group text-center shadow-sm rounded-2xl bg-primary-foreground gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative border-neutral-100/30 bg-muted p-5 flex justify-center items-center rounded-2xl">
                {feature.icon}
                <div className="absolute h-1 w-1 rounded-full left-2 top-2 bg-muted-foreground/50"></div>
                <div className="absolute h-1 w-1 rounded-full left-2 bottom-2 bg-muted-foreground/50"></div>
                <div className="absolute h-1 w-1 rounded-full right-2 top-2 bg-muted-foreground/50"></div>
                <div className="absolute h-1 w-1 rounded-full right-2 bottom-2 bg-muted-foreground/50"></div>
              </div>
              <h3 className="leading-tight md:text-base">{feature.title}</h3>

              <AnimatePresence>
                <motion.div
                  initial={{ scale: 0.98, opacity: 0, filter: 'blur(10px)' }}
                  whileHover={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 h-full w-full  bg-primary-foreground flex items-center justify-center rounded-3xl"
                >
                  <p className="text-primary text-base leading-5 p-4 flex flex-wrap gap-1 items-center justify-center">
                    {feature.description.split(' ').map((word, index) => (
                      <span key={index} className={cn(index === 0 && 'text-orange-500')}>
                        {word}
                      </span>
                    ))}
                  </p>
                  <div className="dot1 absolute top-3 left-3 rounded-full bg-muted-foreground/50 h-1.5 w-1.5"></div>
                  <div className="dot1 absolute top-3 right-3 rounded-full bg-muted-foreground/50 h-1.5 w-1.5"></div>
                  <div className="dot1 absolute bottom-3 left-3 rounded-full bg-muted-foreground/50 h-1.5 w-1.5"></div>
                  <div className="dot1 absolute bottom-3 right-3 rounded-full bg-muted-foreground/50 h-1.5 w-1.5"></div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="h-1 w-1 rounded-full bg-muted-foreground/50"></div>
      </div>
    </section>
  );
};

export default About;
