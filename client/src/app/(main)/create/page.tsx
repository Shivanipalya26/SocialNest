import CreatePost from '@/components/createPost';
import { IconLoader } from '@tabler/icons-react';
import { Suspense } from 'react';

export default function Create() {
  return (
    <div className="max-w-6xl overflow-hidden mx-auto sm:px-6 lg:px-8 py-24 md:py-32 pb-6">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <IconLoader className="animate-spin" />
          </div>
        }
      >
        <CreatePost />
      </Suspense>
    </div>
  );
}
