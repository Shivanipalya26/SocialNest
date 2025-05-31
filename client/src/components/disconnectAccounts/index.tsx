import { useEffect, useRef, useState } from 'react';
import { SocialAccounts } from '../connectAccounts';
import { animate, AnimatePresence, motion, useIsPresent, useMotionValue } from 'motion/react';
import { Badge } from '../ui/badge';
import { useDashboardStore } from '@/store/DashboardStore/useDashboardStore';
import { toast } from 'sonner';
import api from '@/lib/axios';

const DisconnectAccount = ({ app }: { app: SocialAccounts }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setSize({
      width: ref.current?.clientWidth || 0,
      height: ref.current?.clientHeight || 0,
    });
  }, [ref]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const deform = useMotionValue(0);

  const handleOpenOverlay = () => {
    setIsDeleteModalOpen(true);
    animate([
      [deform, 1, { duration: 0.3, ease: [0.65, 0, 0.35, 1] }],
      [deform, 0, { duration: 1.5, ease: [0.22, 1, 0.36, 1] }],
    ]);
  };

  const closeModal = () => setIsDeleteModalOpen(false);

  return (
    <div>
      <div ref={ref} className="relative">
        <Badge variant="destructive" onClick={handleOpenOverlay}>
          Disconnect
        </Badge>
      </div>

      <AnimatePresence>
        {isDeleteModalOpen && <ImmersiveOverlay close={closeModal} app={app} size={size} />}
      </AnimatePresence>
    </div>
  );
};

export default DisconnectAccount;

function GradientOverlay({ size }: { size: { width: number; height: number } }) {
  const breathe = useMotionValue(0);
  const isPresent = useIsPresent();

  useEffect(() => {
    if (!isPresent) {
      animate(breathe, 0, { duration: 0.5, ease: 'easeInOut' });
    }

    async function playBreathingAnimation() {
      await animate(breathe, 1, {
        duration: 0.5,
        delay: 0.35,
        ease: [0, 0.55, 0.45, 1],
      });

      animate(breathe, [null, 0.7, 1], {
        duration: 15,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
      });
    }

    playBreathingAnimation();
  }, [isPresent]);

  const enterDuration = 0.75;
  const exitDuration = 0.5;
  const expandingCircleRadius = size.width / 3;

  return (
    <div className="absolute inset-0 z-[1001]">
      <motion.div
        className="absolute rounded-full bg-[#E9A7A0] blur-[15px]"
        initial={{
          scale: 0,
          opacity: 1,
          backgroundColor: 'rgb(233, 167, 160)',
        }}
        animate={{
          scale: 10,
          opacity: 0.2,
          backgroundColor: 'rgb(246, 63, 42)',
          transition: {
            duration: enterDuration,
            opacity: { duration: enterDuration, ease: 'easeInOut' },
          },
        }}
        exit={{
          scale: 0,
          opacity: 1,
          backgroundColor: 'rgb(233, 167, 160)',
          transition: { duration: exitDuration },
        }}
        style={{
          left: `calc(50% - ${expandingCircleRadius / 2}px)`,
          top: '100%',
          width: expandingCircleRadius,
          height: expandingCircleRadius,
          originX: 0.5,
          originY: 1,
        }}
      />

      <motion.div
        className="absolute rounded-full bg-red-600/90 blur-[100px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9, transition: { duration: enterDuration } }}
        exit={{ opacity: 0, transition: { duration: exitDuration } }}
        style={{
          scale: breathe,
          width: size.width * 2,
          height: size.width * 2,
          top: -size.width,
          left: -size.width,
        }}
      />

      <motion.div
        className="absolute rounded-full bg-red-600/90 blur-[100px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9, transition: { duration: enterDuration } }}
        exit={{ opacity: 0, transition: { duration: exitDuration } }}
        style={{
          scale: breathe,
          width: size.width * 2,
          height: size.width * 2,
          top: size.height - size.width,
          left: 0,
        }}
      />
    </div>
  );
}

function ImmersiveOverlay({
  close,
  app,
  size,
}: {
  close: () => void;
  app: SocialAccounts;
  size: { width: number; height: number };
}) {
  const transition = {
    duration: 0.35,
    ease: [0.59, 0, 0.35, 1],
  };

  const enteringState = {
    rotateX: 0,
    skewY: 0,
    scaleY: 1,
    scaleX: 1,
    y: 0,
    transition: {
      ...transition,
      y: { type: 'spring', visualDuration: 0.7, bounce: 0.2 },
    },
  };

  const exitingState = {
    rotateX: -5,
    skewY: -1.5,
    scaleY: 2,
    scaleX: 0.4,
    y: 100,
  };

  const apps = useDashboardStore();
  const [disconnectedAppName, setDisconnectedAppName] = useState<string | null>(null);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const handleDisconnect = async (app: SocialAccounts) => {
    const connectedApp = apps.connectedApps.find(ca => ca.provider === app.provider);
    if (connectedApp) {
      setDisconnectedAppName(connectedApp.provider!);
      try {
        setIsDisconnecting(true);
        await api.delete('/api/v1/user/disconnect', {
          data: {
            provider: connectedApp.provider,
            providerAccountId: connectedApp.providerAccountId,
          },
        });
        toast(
          `${app.name} Disconnected`
          //   description: `Your ${app.name} account has been disconnected successfully.`,
        );
        apps.fetchConnectedApps();
      } catch {
        setDisconnectedAppName(null);
        toast(
          `Error disconnecting from ${app.name}`
          //   description: 'An unexpected error occurred',
          //   variant: 'destructive',
        );
      } finally {
        setIsDisconnecting(false);
        close();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] overflow-hidden" onClick={close}>
      <GradientOverlay size={size} />
      <motion.div
        className="absolute inset-0 bg-red-600/20 backdrop-blur-sm flex items-center justify-center z-[1001]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={transition}
      >
        <motion.div
          className="w-3/4 flex flex-col justify-center items-center gap-8"
          onClick={e => e.stopPropagation()}
          initial={exitingState}
          animate={enteringState}
          exit={exitingState}
          transition={transition}
          style={{
            transformPerspective: 1000,
            originX: 0.5,
            originY: 0,
          }}
        >
          <div className="md:max-w-2xl w-full">
            <p className="md:text-lg text-center font-ClashDisplayMedium tracking-wide">
              Are you sure you want to disconnect this{' '}
              <span className="bg-red-800 text-red-100 px-4 md:py-2 py-1 rounded-full">
                {app.name}
              </span>{' '}
              account?
              <br /> This action cannot be undone.
            </p>
          </div>

          {disconnectedAppName && isDisconnecting && (
            <p className="text-sm text-white font-mono opacity-75">
              Disconnecting <strong>{disconnectedAppName}</strong>...
            </p>
          )}

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => handleDisconnect(app)}
              className="bg-primary text-primary-foreground rounded-full px-6 py-2 font-medium disabled:bg-muted/50 disabled:text-muted-foreground/50 transition-colors"
              disabled={isDisconnecting}
            >
              {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
            </button>
            <button onClick={close} className="text-white underline underline-offset-4">
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
