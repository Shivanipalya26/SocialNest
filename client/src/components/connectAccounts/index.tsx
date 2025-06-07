'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { IconLoader } from '@tabler/icons-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { useAuthStore } from '@/store/AuthStore/useAuthStore';
import { useDashboardStore } from '@/store/DashboardStore/useDashboardStore';
import { Skeleton } from '../ui/skeleton';
import { AnimatePresence, motion } from 'motion/react';
import { Badge } from '../ui/badge';
import DisconnectAccount from '../disconnectAccounts';

export interface SocialAccounts {
  name: string;
  icon: string;
  provider: string;
}

const socialApps: SocialAccounts[] = [
  { name: 'X', icon: '/x.svg', provider: 'x' },
  { name: 'Linkedin', icon: '/linkedin.svg', provider: 'linkedin' },
  { name: 'Instagram', icon: '/instagram.svg', provider: 'instagram' },
  { name: 'Threads', icon: '/threads.svg', provider: 'threads' },
];

const ConnectAccounts = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);
  const { user } = useAuthStore();
  const { connectedApps, fetchConnectedApps, isFetchingApps } = useDashboardStore();

  useEffect(() => {
    fetchConnectedApps();
  }, [fetchConnectedApps]);

  const handleConnect = async (app: SocialAccounts) => {
    setLoading(app.provider);
    try {
      const userId = user?.id;
      console.log('userId', userId);

      window.location.href = `https://server.shivanipalya.tech/api/${app.provider}/request-token?userId=${userId}`;
    } catch (error) {
      console.log(error);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="w-full relative h-full">
      <Card className="w-full max-w-2xl z-20 relative bg-transparent border-none shadow-none mx-auto  ">
        <CardHeader className="space-y-0 text-center">
          <CardTitle className="md:text-2xl text-xl tracking-wide">Connect Social Media</CardTitle>
          <CardDescription className="md:text-base text-xs">
            Link your social media accounts to share your posts
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {isFetchingApps
            ? Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="w-full h-16 rounded-xl" />
              ))
            : socialApps.map(app => (
                <div
                  key={app.provider}
                  className="flex relative items-center overflow-hidden justify-between w-full border rounded-xl p-3 hover:bg-secondary/80 transition-colors"
                  onMouseEnter={() => setHoveredApp(app.provider)} // Track hover start
                  onMouseLeave={() => setHoveredApp(null)}
                >
                  {/* {(app.provider === "instagram" || app.provider === "threads")  && (
                    <div className="absolute inset-0 bg-secondary/95 flex items-center justify-center z-10">
                      <h2 className="font-ClashDisplayMedium md:text-base text-sm">
                        Coming Soon...
                      </h2>
                      <IconLockFilled className="h-5 w-5 ml-2" />
                    </div>
                )} */}
                  <div className="flex items-center space-x-4">
                    <Image
                      height={45}
                      width={45}
                      src={app.icon}
                      alt={`${app.name} logo`}
                      className={`${
                        app.provider === 'x' || app.provider === 'threads' ? 'dark:invert-[1]' : ''
                      }`}
                    />
                    <span className="font-medium">{app.name}</span>
                  </div>
                  {connectedApps.some(ca => ca.provider === app.provider) ? (
                    <div className="flex items-center justify-center space-x-2">
                      <AnimatePresence mode="wait">
                        {hoveredApp !== app.provider ? (
                          <motion.div
                            className="cursor-pointer"
                            key="badge"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Badge variant="success">Connected</Badge>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="disconnect"
                            className="cursor-pointer"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <DisconnectAccount app={app} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Button
                      className="rounded-full"
                      size="sm"
                      onClick={() => handleConnect(app)}
                      disabled={loading === app.provider}
                    >
                      {loading === app.provider ? (
                        <IconLoader className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        'Connect'
                      )}
                    </Button>
                  )}
                </div>
              ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectAccounts;
