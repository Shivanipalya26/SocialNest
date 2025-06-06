'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MessageCircle, Share2, Send, ThumbsUp, MoreHorizontal, Globe } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';

interface LinkedInPreviewProps {
  content: string;
  medias: File[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
}

export function LinkedInPreview({ content, medias, user }: LinkedInPreviewProps) {
  const [expanded, setExpanded] = useState(false);
  const contentIsLong = content.length > 280;

  return (
    <div className="max-w-[550px] bg-white rounded-lg border border-neutral-200 font-sans">
      {/* Header */}
      <div className="p-3 flex items-start justify-between">
        <div className="flex gap-2">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.image || ''} />
            <AvatarFallback className="uppercase">{user?.name ? user.name[0] : 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-black text-[15px]">
                {user?.name || 'SocialNest.'}
              </span>
              <span className="text-neutral-500 text-sm">• Following</span>
            </div>
            <p className="text-neutral-600 text-[13px] leading-tight">
              SocialNest. is a platform that allows you to cross-post content to multiple social
              media platforms.
            </p>
            <div className="flex items-center gap-1 text-neutral-600 text-[13px]">
              <span>2h</span>
              <span>•</span>
              <Globe className="h-3 w-3" />
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-neutral-100 rounded-full">
          <MoreHorizontal className="h-5 w-5 text-neutral-600" />
        </button>
      </div>

      {/* Content */}
      <div className="px-3 pb-1">
        <div
          className={`whitespace-pre-wrap text-black text-sm overflow-hidden ${
            !expanded && contentIsLong ? 'line-clamp-4' : ''
          }`}
          dangerouslySetInnerHTML={{ __html: content }}
        />
        {contentIsLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-neutral-500 text-sm flex items-center mt-1"
          >
            {expanded ? <>...less</> : <>...more</>}
          </button>
        )}
      </div>

      {/* Image */}
      {medias?.length > 0 && medias !== null && (
        <div className="relative w-full">
          <Carousel className="w-full mx-auto">
            <CarouselContent>
              {medias.map((file, index) => (
                <CarouselItem key={index}>
                  {file.type.startsWith('image/') ? (
                    <Image
                      src={URL.createObjectURL(file) || '/placeholder.svg'}
                      alt={`Preview ${index + 1}`}
                      className="w-full object-contain rounded"
                      width={700}
                      height={435}
                      style={{
                        aspectRatio: '5/3',
                        height: 'auto',
                      }}
                    />
                  ) : file.type.startsWith('video/') ? (
                    <video controls className="w-full object-contain rounded">
                      <source src={URL.createObjectURL(file)} type={file.type} />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="w-full flex items-center justify-center bg-secondary/50 rounded">
                      <p className="text-sm text-muted-foreground">Unsupported file type</p>
                    </div>
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>
            {medias?.length > 1 && medias !== null && (
              <>
                <CarouselPrevious className="absolute left-2" />
                <CarouselNext className="absolute right-2" />
              </>
            )}
          </Carousel>
        </div>
      )}

      {/* Engagement Stats */}
      <div className="px-3 py-2 flex items-center justify-between text-[13px] text-neutral-500">
        <div className="flex items-center gap-1">
          <div className="flex -space-x-1">
            <div className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center">
              <ThumbsUp className="h-2.5 w-2.5 text-white" />
            </div>
            <div className="h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-[10px] text-white">❤️</span>
            </div>
            <div className="h-4 w-4 rounded-full bg-yellow-500 flex items-center justify-center">
              <span className="text-[10px] text-white">🎯</span>
            </div>
          </div>
          <span>415</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="hover:text-neutral-700 hover:underline">11 comments</button>
          <span>•</span>
          <button className="hover:text-neutral-700 hover:underline">1 repost</button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-1 py-1 border-t border-neutral-200 flex items-center justify-between">
        <button className="flex items-center gap-2 p-3 hover:bg-neutral-100 rounded-lg flex-1">
          <ThumbsUp className="h-5 w-5 text-neutral-600" />
          <span className="text-[14px] text-neutral-600 font-medium">Like</span>
        </button>
        <button className="flex items-center gap-2 p-3 hover:bg-neutral-100 rounded-lg flex-1">
          <MessageCircle className="h-5 w-5 text-neutral-600" />
          <span className="text-[14px] text-neutral-600 font-medium">Comment</span>
        </button>
        <button className="flex items-center gap-2 p-3 hover:bg-neutral-100 rounded-lg flex-1">
          <Share2 className="h-5 w-5 text-neutral-600" />
          <span className="text-[14px] text-neutral-600 font-medium">Repost</span>
        </button>
        <button className="flex items-center gap-2 p-3 hover:bg-neutral-100 rounded-lg flex-1">
          <Send className="h-5 w-5 text-neutral-600" />
          <span className="text-[14px] text-neutral-600 font-medium">Send</span>
        </button>
      </div>
    </div>
  );
}
