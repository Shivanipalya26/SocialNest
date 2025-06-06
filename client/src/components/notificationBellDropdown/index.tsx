'use client';

import { useNotificationStore } from '@/store/NotificationStore/useNotificationStore';
import { Check, MoreVertical, Trash, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from '../ui/button';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { dateFormat } from '@/lib/dateFormat';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationBellDropdown = ({ isOpen, onClose }: NotificationDropdownProps) => {
  const { notifications, markAsRead, markAllAsRead, removeNotification, clearAll } =
    useNotificationStore();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 md:top-10 top-6 z-50 md:w-[380px] w-[300px] overflow-hidden rounded-3xl bg-primary-foreground shadow-lg border"
        >
          <div className="relative md:max-h-[600px] max-h-[450px] flex flex-col">
            {/* Header */}
            <div className="md:p-4 p-3 border-b sticky top-0 rounded-t-2xl z-10">
              <div className="flex items-center justify-between md:mb-1">
                <h2 className="md:text-xl text-lg font-ClashDisplayMedium text-orange-600">
                  Notifications
                </h2>
                <button
                  onClick={onClose}
                  className="rounded-full p-1 bg-muted font-semibold transition-colors"
                >
                  <X className="md:h-5 md:w-5 w-3 h-3 text-neutral-500 font-semibold" />
                </button>
              </div>
              <p className="text-sm text-neutral-500">
                You have {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
              </p>
            </div>

            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="m-8 text-center text-neutral-500 font-ClashDisplayMedium ">
                  No notifications yet
                </div>
              ) : (
                <div className="md:p-4 p-3 space-y-1">
                  {notifications.map(notification => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`group relative rounded-lg border md:p-4 p-2 transition-colors ${
                        notification.read ? 'bg-muted' : 'bg-primary'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="flex items-start justify-start h-14 w-14">
                          <Image
                            src={
                              notification.message.includes('linkedin')
                                ? '/linkedin.svg'
                                : notification.message.includes('x')
                                  ? '/x.svg'
                                  : '/instagramIcon.svg'
                            }
                            height={40}
                            width={40}
                            alt="provider"
                          />
                        </div>
                        <div className="flex justify-between items-start gap-4 relative flex-1">
                          <div className="space-y-0.5 flex-1">
                            <p
                              className={`text-sm ${
                                notification.read
                                  ? 'text-neutral-500'
                                  : 'text-primary-foreground font-medium'
                              }`}
                            >
                              {notification.message}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {dateFormat(notification.createdAt)}
                            </p>
                          </div>
                          {/* Dropdown Menu */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical
                                  className={`h-4 w-4 ${
                                    notification.read ? 'text-primary' : ' text-black'
                                  }`}
                                />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" sideOffset={5}>
                              {!notification.read && (
                                <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                  <Check className="h-4 w-4 mr-2" /> Mark as read
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => removeNotification(notification.id)}>
                                <Trash className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-4 border-t sticky bottom-0 bg-primary-foreground rounded-2xl flex gap-2">
                {unreadCount > 0 && (
                  <Button onClick={markAllAsRead} variant="outline" className="flex-1">
                    Mark all as read
                  </Button>
                )}
                <Button onClick={clearAll} variant="destructive" className="flex-1">
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationBellDropdown;
