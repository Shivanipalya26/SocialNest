'use client';

import api from '@/lib/axios';
import { useMediaStore } from '@/store/MainStore/usePostStore';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Check, Loader2 } from 'lucide-react';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useRecentSubscription } from '@/hooks/useRecentSubscription';

const EnhanceAndImageGen = ({
  caption,
  setContent,
}: {
  caption: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedCaption, setEnhancedCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const { setMedias, handleFileUpload, medias } = useMediaStore();
  const { subscriptionStatus, loading } = useRecentSubscription();

  const enhanceCaption = async (content: string) => {
    if (!content.trim()) return;

    setIsEnhancing(true);
    try {
      const response = await api.get('/api/v1/generate', {
        params: {
          content,
          tone: 'engaging',
          platform: 'twitter',
        },
      });

      if (response.data.error) {
        toast('Failed to enhance caption', {
          description: response.data.error,
        });
        setIsEnhancing(false);
        return;
      }

      const generatedContent = response.data.caption;
      setEnhancedCaption(generatedContent);
      toast('Caption Enhanced', {
        description: 'Your caption has been successfully enhanced',
      });
    } catch (error) {
      toast('Failed to enhance caption', {
        description: 'An unexpected error occurred',
      });
      console.log(error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const generateImage = async (caption: string) => {
    try {
      setIsGenerating(true);
      const res = await api.post('/api/v1/generate/image', { caption });
      const url = res.data?.images?.images?.[0]?.url;
      if (url) {
        setImageUrl(url);
        toast('Image Generated', {
          description: 'Your image has been successfully generated',
        });
      }
      if (res.data.error) {
        toast('Image Generation Failed', {
          description: res.data.error,
        });
      }
    } catch (error) {
      console.log('Error generating image:', error);
      if (error instanceof Error) {
        console.log('Error message:', error.message);
        toast('Image Generation Failed', {
          description: error.message,
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const convertUrlToImage = async (url: string): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Failed to get canvas context');
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(blob => {
            if (blob) {
              const file = new File([blob], 'generated-image.png', {
                type: 'image/png',
              });
              resolve(file);
            } else {
              reject(new Error('Failed to convert canvas to blob'));
            }
          }, 'image/png');
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = url;
    });
  };

  const handleAcceptCaption = async () => {
    if (enhancedCaption) {
      setContent(enhancedCaption);
      setEnhancedCaption('');
      toast('Caption Accepted', {
        description: 'Enhanced caption has been applied',
      });
      resetDialog();
    }
  };

  const handleAcceptImage = async () => {
    if (imageUrl) return;
    try {
      const image = await convertUrlToImage(imageUrl);
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(image);
      handleFileUpload(dataTransfer.files, ['x']);
      setMedias(medias);
      resetDialog();
    } catch (error) {
      console.error('Failed to convert image URL:', error);
      toast('Image Error', {
        description: 'Could not process the generated image',
      });
    }
  };

  const handleCancel = () => {
    resetDialog();
  };

  const resetDialog = () => {
    setIsOpen(false);
    setIsEnhancing(false);
    setImageUrl('');
    setIsGenerating(false);
    setEnhancedCaption('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="rounded-lg px-3 py-1 bg-neutral-800/30 border[1.5px] tracking-wider border-neutral-500 text-neutral-300 hover:text-neutral-200 transition duration-200 text-xs group flex items-center gap-2 hover:bg-neutral-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
          SN
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-orange-500 gap-2 tracking-wide">
            SocialNest
          </DialogTitle>
          <DialogDescription>
            Enhance your caption or bring it to life with an AI image.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="bg-neutral-900 h-full w-full rounded-2xl border">
              <Textarea
                className="border-none py-3 focus-visible:outline-none shadow-none resize-none"
                value={caption}
                placeholder="Type your caption here..."
                onChange={e => setContent(e.target.value)}
                rows={6}
              />
            </div>
          </div>

          {!imageUrl && !enhancedCaption && !isGenerating && !isEnhancing && (
            <div className="gap-2 flex justify-end">
              <button
                onClick={() => generateImage(caption.trim())}
                disabled={
                  !caption.trim() || isGenerating || loading || subscriptionStatus !== 'active'
                }
                className="rounded-3xl px-3 py-1 border-[1.2px] tracking-wide border-neutral-500 text-neutral-300 hover:text-neutral-200 transition duration-200 text-xs group flex items-center gap-2 hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed "
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Image'
                )}
              </button>
              <button
                onClick={() => enhanceCaption(caption.trim())}
                disabled={!caption.trim() || isEnhancing}
                className="rounded-3xl px-3 py-1 border-[1.2px] tracking-wide border-neutral-500 text-neutral-300 hover:text-neutral-200 transition duration-200 text-xs group flex items-center gap-2 hover:bg-neutral-600  disabled:opacity-50 disabled:cursor-not-allowed "
              >
                {isEnhancing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enhancing...
                  </>
                ) : (
                  'Enhance Caption'
                )}
              </button>
            </div>
          )}

          {(isGenerating || isEnhancing) && (
            <div className="w-full flex items-center justify-center py-8">
              <div className="inline-block">
                <div className="flex items-center px-5 justify-center gap-2 bg-secondary/50 border-2 py-2 font-ClashDisplayMedium tracking-wider rounded-lg">
                  <p className="text-muted-foreground text-sm">
                    {isEnhancing ? 'Enhancing your caption' : 'Generating your image'}
                  </p>
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              </div>
            </div>
          )}

          {imageUrl && !isGenerating && !isEnhancing && (
            <div className="space-y-2">
              <Label className="text-sm">Generated Image</Label>
              <div className="relative rounded-2xl overflow-hidden border bg-muted/20">
                <img
                  src={imageUrl || '/placeholder.svg'}
                  alt="Generated Preview"
                  className="w-full h-64 object-contain"
                />
              </div>
              <DialogFooter className="sm:justify-between mt-4 font-ClashDisplayRegular">
                <Button type="button" variant="link" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleAcceptImage} className="gap-2">
                  <Check className="h-4 w-4" />
                  Accept Image
                </Button>
              </DialogFooter>
            </div>
          )}

          {enhancedCaption && !isGenerating && !isEnhancing && (
            <div className="space-y-2">
              <Label className="text-sm">Enhanced Caption</Label>
              <div className="relative rounded-md overflow-hidden border bg-muted/20 p-4">
                <p className="text-sm">{enhancedCaption}</p>
              </div>
              <DialogFooter className="sm:justify-between mt-4 font-ClashDisplayRegular">
                <Button type="button" variant="link" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleAcceptCaption} className="gap-2">
                  <Check className="h-4 w-4" />
                  Accept Caption
                </Button>
              </DialogFooter>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhanceAndImageGen;
