'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MessageCircle, Repeat2, Heart, BarChart2, Bookmark, Share } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';

interface PreviewUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface TwitterPreviewProps {
  content: string;
  medias: File[];
  user: PreviewUser | null;
}

export function TwitterPreview({ content, medias, user }: TwitterPreviewProps) {
  const [expanded, setExpanded] = useState(false);
  const contentIsLong = content.length > 280;

  return (
    <div className="max-w-xl bg-black text-white rounded-xl p-4 font-sans">
      <div className="flex gap-2">
        <div>
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.image || ''} />
            <AvatarFallback className="uppercase">{user?.name ? user.name[0] : 'U'}</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-1 mb-1">
            <span className="font-semibold">{user?.name}</span>
            <span className="text-neutral-500">@{user?.email?.split('@')[0]}</span>
            <span className="text-neutral-500">· 9h</span>
          </div>

          <div>
            <div
              className={`whitespace-pre-wrap text-sm overflow-hidden ${
                !expanded && contentIsLong ? 'line-clamp-4' : ''
              }`}
              dangerouslySetInnerHTML={{ __html: content }}
            />
            {contentIsLong && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-sm font-medium flex items-center mt-1 text-neutral-500"
              >
                {expanded ? <>...less</> : <>...more</>}
              </button>
            )}
          </div>

          {medias?.length > 0 && medias !== null && (
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
              {medias?.length > 0 && medias !== null && (
                <>
                  <CarouselPrevious className="absolute left-2" />
                  <CarouselNext className="absolute right-2" />
                </>
              )}
            </Carousel>
          )}

          <div className="flex items-center justify-between text-neutral-500 max-w-md mt-3">
            <button className="flex items-center gap-2 hover:text-blue-400 group">
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm group-hover:text-blue-400">20K</span>
            </button>
            <button className="flex items-center gap-2 hover:text-green-400 group">
              <Repeat2 className="h-5 w-5" />
              <span className="text-sm group-hover:text-green-400">19K</span>
            </button>
            <button className="flex items-center gap-2 hover:text-pink-400 group">
              <Heart className="h-5 w-5" />
              <span className="text-sm group-hover:text-pink-400">195K</span>
            </button>
            <button className="flex items-center gap-2 hover:text-blue-400 group">
              <BarChart2 className="h-5 w-5" />
              <span className="text-sm group-hover:text-blue-400">35M</span>
            </button>
            <div className="flex items-center gap-4">
              <button className="hover:text-blue-400">
                <Bookmark className="h-5 w-5" />
              </button>
              <button className="hover:text-blue-400">
                <Share className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
