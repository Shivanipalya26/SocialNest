'use client';

import { useAuthStore } from '@/store/AuthStore/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useEffect } from 'react';
import { TwitterPreview } from '../Previews/TwitterPreview';
import { LinkedInPreview } from '../Previews/LinkedInPreview';

interface PostPreviewProps {
  content: string;
  medias: File[];
}

const PostPreview = ({ content, medias }: PostPreviewProps) => {
  const { user, fetchUser } = useAuthStore();
  const platforms = ['Linkedin', 'X'];

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user, fetchUser]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {platforms.map(platform => (
        <Card className="border-none shadow-none rounded-none p-0" key={platform}>
          <CardHeader className="px-1 py-3">
            <CardTitle className="font-ClashDisplayRegular">{platform}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {platform === 'Linkedin' ? (
              <LinkedInPreview content={content} medias={medias} user={user} />
            ) : // ) : platform === 'Instagram' ? (
            //   <InstagramPreview content={content} medias={medias} user={user} />
            platform === 'X' ? (
              <TwitterPreview content={content} medias={medias} user={user} />
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PostPreview;
