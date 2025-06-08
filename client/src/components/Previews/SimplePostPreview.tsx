'use client';

import React, { memo } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useMediaStore } from '@/store/MainStore/usePostStore';
import { IconCircleXFilled } from '@tabler/icons-react';

// Separate component for rendering content
const ContentPreview = memo(({ content }: { content: string }) => {
  const [expanded, setExpanded] = React.useState(false);
  const contentIsLong = content.length > 280;

  return (
    <div className="px-3 pb-1">
      <div
        className={`whitespace-pre-wrap text-sm overflow-hidden ${!expanded && contentIsLong ? 'line-clamp-4' : ''}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {contentIsLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm font-medium text-neutral-500"
        >
          {expanded ? <>...less</> : <>...more</>}
        </button>
      )}
    </div>
  );
});
ContentPreview.displayName = 'ContentPreview';

const MediaPreview = memo(({ medias }: { medias: File[] }) => {
  return medias.length > 0 ? (
    <Carousel className="w-full max-w-xs mx-auto">
      <CarouselContent>
        {medias.map((file, index) => (
          <CarouselItem key={index}>
            {file.type.startsWith('image/') ? (
              <div className="relative">
                <Image
                  height={100}
                  width={100}
                  src={URL.createObjectURL(file) || '/placeholder.svg'}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-contain rounded"
                />
                <div
                  onClick={() => {
                    useMediaStore.getState().removeMedia(file.name);
                  }}
                  className="absolute top-2 right-2 cursor-pointer opacity-50 hover:opacity-100 transition duration-200 ease-in-out"
                >
                  <IconCircleXFilled />
                </div>
              </div>
            ) : file.type.startsWith('video/') ? (
              <video controls className="w-full h-full object-contain rounded">
                <source src={URL.createObjectURL(file)} type={file.type} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary/50 rounded">
                <p className="text-sm text-muted-foreground">Unsupported file type</p>
              </div>
            )}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className={`${medias.length > 1 ? 'flex' : 'hidden'}`} />
      <CarouselNext className={`${medias.length > 1 ? 'flex' : 'hidden'}`} />
    </Carousel>
  ) : null;
});
MediaPreview.displayName = 'MediaPreview';

const CircularProgress = ({ value }: { value: number }) => {
  const circumference = 2 * Math.PI * 40; // 40 is the radius
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <motion.div className="relative h-10 w-10 flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          className="text-muted-foreground/20"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r="40"
          cx="50"
          cy="50"
        />
        {/* Progress circle */}
        <circle
          className="text-primary transition-all duration-300 ease-in-out"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="40"
          cx="50"
          cy="50"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] text-muted-foreground font-ClashDisplayRegular">{value}%</span>
      </div>
    </motion.div>
  );
};

// Upload progress item component
const UploadProgressItem = memo(
  ({ fileName, progress }: { fileName: string; progress: number }) => {
    const [isHovering, setIsHovering] = React.useState(false);

    return (
      <div
        className="space-y-1"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="relative flex items-center justify-between border border-emerald-900 bg-emerald-950 rounded-xl p-3">
          <div className="flex items-center text-sm">
            <span className="max-w-[300px] font-ClashDisplayRegular">{fileName}</span>
          </div>

          <motion.div animate={{ opacity: isHovering ? 0 : 1 }} transition={{ duration: 0.2 }}>
            <CircularProgress value={progress} />
          </motion.div>

          <motion.button
            className="absolute top-1/2 -translate-y-1/2 right-3 p-2 flex items-center justify-center rounded-full bg-secondary/50 hover:bg-secondary/70 transition duration-200 ease-in-out"
            onClick={() => useMediaStore.getState().cancelUpload(fileName)}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovering ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <IconCircleXFilled color="red" />
          </motion.button>
        </div>
      </div>
    );
  }
);
UploadProgressItem.displayName = 'UploadProgressItem';

interface SimplePostPreviewProps {
  content: string;
  medias: File[];
  isUploading?: boolean;
}

export const SimplePostPreview = memo(function SimplePostPreview({
  content,
  medias,
  isUploading,
}: SimplePostPreviewProps) {
  const { uploadProgress } = useMediaStore();
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween' }}
      className="w-full shadow-none md:border-l border-t-0 border-b-0 border-r-0 rounded-none max-w-sm mx-auto"
    >
      {isUploading ? (
        <div className="w-96 select-none md:flex flex-col justify-center md:border-l h-full">
          <div className="p-3">
            <div className="mb-4 text-center">
              <h2 className="font-ClashDisplayMedium text-base">Uploading Media...</h2>
              <p className="text-xs text-muted-foreground font-ClashDisplayRegular">
                please wait while your files are being uploaded
              </p>
            </div>

            <div className="space-y-2 mt-2">
              {uploadProgress.map((item, index) => (
                <UploadProgressItem
                  key={`${item.fileName}-${index}`}
                  fileName={item.fileName}
                  progress={item.progress}
                />
              ))}
            </div>
          </div>
        </div>
      ) : !content && medias.length === 0 ? (
        <div className="w-96 px-2 select-none md:flex hidden md:border-l h-full items-center justify-center">
          <h2 className="font-ClashDisplayMedium bg-secondary/50 rounded-xl leading-none border border-secondary px-7 py-3 text-base">
            Post Preview
          </h2>
        </div>
      ) : (
        <>
          <ContentPreview content={content} />
          <MediaPreview medias={medias} />
        </>
      )}
    </motion.div>
  );
});
