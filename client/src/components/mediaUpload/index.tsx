import { useMediaStore } from '@/store/MainStore/usePostStore';
import { useRef } from 'react';
import { Platform } from '../createPost';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { IconPhotoFilled } from '@tabler/icons-react';

interface MediaUploadProps {
  platforms?: Platform[] | null;
}

const MediaUpload = ({ platforms }: MediaUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handleFileUpload, isUploadingMedia } = useMediaStore();

  const handleClick = () => {
    if (!platforms || platforms.length === 0) {
      toast('Select a platform first.', {
        description:
          "Please select a platform before uploading media because the media upload is based on the platform's requirements.",
      });
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files, platforms || []);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/png,image/jpeg,image/gif,video/mp4"
        className="hidden"
        disabled={isUploadingMedia}
      />
      <Button type="button" variant={'outline'} onClick={handleClick} disabled={isUploadingMedia}>
        <IconPhotoFilled className="h-4 w-4" />
        {isUploadingMedia ? 'Uploading...' : 'Add Images or Video'}
      </Button>
    </div>
  );
};

export default MediaUpload;
