'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { useDashboardStore } from '@/store/DashboardStore/useDashboardStore';
import BottomLoader from '@/loaders/BottomLoaders';
import NoAppButton from '../buttons/NoAppButton';
import PlatformSelector from '../platformSelector';
import { Checkbox } from '../ui/checkbox';
import SchedulePost from '../schedulePost';
import { Button } from '../ui/button';
import { IconLoader } from '@tabler/icons-react';
import MediaUpload from '../mediaUpload';
import { useMediaStore } from '@/store/MainStore/usePostStore';
import { toast } from 'sonner';
import { format } from 'date-fns';
import axios from 'axios';
import PostPreview from '../postPreview';
import { AnimatePresence } from 'motion/react';
import { SimplePostPreview } from '../Previews/SimplePostPreview';
import AIAssist from '../aiAssist';
import EnhanceAndImageGen from '../enhance&ImageGen';
import { useNotificationStore } from '@/store/NotificationStore/useNotificationStore';
import { useSubscriptionStore } from '@/store/SubscriptionStore/useSubscription';

export type Platform = 'x' | 'linkedin' | 'instagram' | 'threads';

export function customToast({ title, description }: { title: string; description: string }) {
  toast(title, {
    description,
  });
}

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSinglePreview, setIsSinglePreview] = useState(true);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
  const [scheduleTime, setScheduleTime] = useState<string | null>(null);
  const [isPollingNotifications, setIsPollingNotifications] = useState(false);
  const { fetchConnectedApps, connectedApps, isFetchingApps, hasFetched } = useDashboardStore();
  const { medias, isUploadingMedia, resetMedias } = useMediaStore();
  const { fetchNotifications, notifications } = useNotificationStore();
  const { setCreditCount } = useSubscriptionStore();

  const memoizedMedia = useMemo(() => medias.files || [], [medias.files]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleAIAssist = (generatedContent: string) => {
    setContent(prevContent => prevContent + (prevContent ? '\n\n' : '') + generatedContent);
  };

  const POLLING_DURATION = 3000;
  const POLLING_INTERVAL = 3000;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    let timeout: ReturnType<typeof setTimeout> | null = null;

    if (isPollingNotifications) {
      interval = setInterval(async () => {
        try {
          await fetchNotifications();

          const recentPublishedPostNotification = notifications.find(
            notification =>
              (notification.type === 'POST_STATUS_FAILED' ||
                notification.type === 'POST_STATUS_SUCCESS') &&
              new Date(notification.createdAt).getTime() > Date.now() - 30000
          );

          if (recentPublishedPostNotification) {
            setIsPollingNotifications(false);
            if (recentPublishedPostNotification.type === 'POST_STATUS_SUCCESS') {
              toast('Post Published', {
                description: 'Your post has been published successfully',
              });
            } else {
              toast('Post Failed', {
                description: 'Your post failed to publish. Please try again.',
              });
            }
          }
        } catch (error) {
          console.error('Polling error: ', error);
          toast('Polling Error', {
            description: 'An error occurred while checking for updates.',
          });
        }
      }, POLLING_INTERVAL);
      timeout = setTimeout(() => {
        setIsPollingNotifications(false);
        toast('Notification Polling Stopped', {
          description: 'Stopped checking for notifications. You can check manually if needed.',
        });
      }, POLLING_DURATION);
    }
    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [isPollingNotifications, notifications]);

  const handlePublishPost = async () => {
    if (selectedPlatforms.length === 0) {
      toast('Platform Selection Required', {
        description:
          'Please select at least one platform to publish your post. You can choose from Instagram, Twitter, or LinkedIn.',
      });
      return;
    }

    if (!content.trim() && (!medias.files || medias.files.length === 0)) {
      toast('Content Required', {
        description: 'Please enter some content or upload media to publish your post.',
      });
      return;
    }

    if (isScheduled && !scheduleDate && !scheduleTime) {
      toast('Schedule Date and Time Required', {
        description: 'Please select a date and time for scheduling your post.',
      });
      return;
    }

    if (
      (selectedPlatforms.includes('x') && content.length > 275) ||
      (selectedPlatforms.includes('linkedin') && content.length > 2900)
    ) {
      customToast({
        title: selectedPlatforms.includes('x')
          ? 'Twitter Character Limit Exceeded'
          : 'LinkedIn Character Limit Exceeded',
        description: selectedPlatforms.includes('x')
          ? 'Twitter posts cannot exceed 275 characters.'
          : 'LinkedIn posts cannot exceed 2900 characters.',
      });
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append('postText', content);
      formData.append('providers', JSON.stringify(selectedPlatforms));
      if (isScheduled && scheduleDate && scheduleTime) {
        const scheduleDateTime = new Date(
          `${format(scheduleDate, 'yyyy-MM-dd')}T${scheduleTime}`
        ).toISOString();
        formData.append('scheduleAt', scheduleDateTime);
      }
      formData.append('mediaKeys', medias.mediaKeys ? JSON.stringify(medias.mediaKeys) : '[]');
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      customToast({
        title: isScheduled ? 'Post Scheduled for Processing' : 'Post Sent for Processing',
        description: 'Your post is being processed. You will be notified once it is published.',
      });

      if (selectedPlatforms.length !== 1) {
        setContent('');
        setSelectedPlatforms([]);
        resetMedias();
        setIsScheduled(false);
        setScheduleDate(null);
        setScheduleTime('');
      }

      setCreditCount(Number(useSubscriptionStore.getState().creditCount) - 1);
      setIsPollingNotifications(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('CreatePost Error:', error);
      customToast({
        title: 'Post Creation Failed',
        description: error.response?.data?.error || 'An error occurred while creating the post.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchConnectedApps(); // Will only run if `hasFetched` is false
  }, [fetchConnectedApps]);

  return (
    <section className="md:flex relative block gap-4 w-full">
      <BottomLoader
        isLoading={isLoading}
        title={`Creating post to ${selectedPlatforms.join(', ')}`}
        selectedPlatforms={selectedPlatforms}
      />
      {isFetchingApps && !hasFetched ? (
        <div className="flex justify-center w-full pt-20">
          <IconLoader className="animate-spin h-8 w-8 text-muted-foreground" />
        </div>
      ) : connectedApps.length === 0 ? (
        <NoAppButton />
      ) : (
        <>
          <Card className="w-full border-none shadow-none md:mx-auto">
            <CardContent className="p-6">
              <Tabs defaultValue="edit" className="space-y-4">
                <TabsList>
                  <TabsTrigger onClick={() => setIsSinglePreview(true)} value="edit">
                    Edit
                  </TabsTrigger>
                  <TabsTrigger onClick={() => setIsSinglePreview(false)} value="preview">
                    Platform Preview
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="edit" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg leading-none">Post Content</h2>
                    </div>

                    <div className="bg-neutral-900 h-full w-full rounded-2xl border">
                      <Textarea
                        className="boder-none py-3 focus-visible:ring-0 focus-visible:outline-none shadow-none resize-none"
                        placeholder="What's on Your Mind?"
                        value={content}
                        onChange={handleContentChange}
                        rows={6}
                      />
                      <div className="flex justify-end gap-2 items-center p-2 rounded-2xl">
                        <EnhanceAndImageGen setContent={setContent} caption={content} />
                        <AIAssist onGenerate={handleAIAssist} />
                      </div>
                    </div>
                  </div>
                  <MediaUpload platforms={selectedPlatforms} />
                  <PlatformSelector
                    selectedPlatforms={selectedPlatforms}
                    setSelectedPlatforms={setSelectedPlatforms}
                  />
                  <div className="flex items-center space-x-2">
                    <label htmlFor="schedule" className="text-lg leading-none">
                      Schedule this post
                    </label>
                    <Checkbox
                      id="schedule"
                      checked={isScheduled}
                      onCheckedChange={checked => setIsScheduled(checked as boolean)}
                    />
                  </div>
                  {isScheduled && (
                    <SchedulePost
                      scheduleDate={scheduleDate}
                      setScheduleDate={setScheduleDate}
                      scheduleTime={scheduleTime}
                      setScheduleTime={setScheduleTime}
                    />
                  )}
                </TabsContent>
                <TabsContent value="preview">
                  <PostPreview content={content} medias={memoizedMedia} />
                </TabsContent>
              </Tabs>
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  disabled={isLoading}
                  variant={'default'}
                  className="rounded-full"
                  onClick={handlePublishPost}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-1">
                      <IconLoader className="animate-spin" />
                      Publishing
                    </span>
                  ) : isUploadingMedia ? (
                    <span className="flex items-center gap-1">
                      <IconLoader className="animate-spin" />
                      Uploading Media
                    </span>
                  ) : isScheduled ? (
                    'Schedule a Post'
                  ) : (
                    'Publish Post'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          <AnimatePresence>
            {isSinglePreview && (
              <SimplePostPreview
                isUploading={isUploadingMedia}
                content={content}
                medias={medias.files || []}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </section>
  );
};

export default CreatePost;
