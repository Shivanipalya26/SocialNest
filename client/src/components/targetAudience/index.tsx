import { cn } from '@/lib/utils';
import React from 'react';
import { IconTerminal2, IconAugmentedReality2, IconTie, IconBrandAsana } from '@tabler/icons-react';

const audiences = [
  {
    title: 'Devs Building in Public',
    description:
      'Post your project updates or side projects to Twitter, Linkedin, and more at once. Perfect for indie hackers, or open-source contributors for building in public.',
    icon: <IconTerminal2 />,
  },
  {
    title: 'Learners & Tech Enthusiasts',
    description:
      'Share your learning journey, post snippets, or share insights effortlessly across all your favorite platforms in one go.',
    icon: <IconAugmentedReality2 />,
  },
  {
    title: 'Busy Creators & Professionals',
    description:
      'Not a dev? No problem. Post your ideas, updates, or content across platforms effortlessly—more reach, less work.',
    icon: <IconTie />,
  },
  {
    title: 'Small Teams & Hustlers',
    description:
      'Manage your socials in seconds. One click sends your message everywhere, leaving you time to focus on what matters.',
    icon: <IconBrandAsana />,
  },
];

const TargetAudience = () => {
  return (
    <section>
      <div className="px-4 py-12 z-30 relative pt-28 flex flex-col items-center justify-center">
        <div className="p-6">
          <div className="flex text-5xl text-center justify-center py-2">Made Just For You...</div>
          <p className="text-center text-muted-foreground">
            Whether you&apos;re a solo creator, a busy marketer, or a growing brand — SocialNest is
            built to simplify your content game.
          </p>
        </div>

        <div className="border-t border-b border-dashed w-full">
          <div className="max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 mx-auto">
            {audiences.map((data, index) => (
              <AudienceCard key={data.title} {...data} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TargetAudience;

const AudienceCard = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        'flex flex-col lg:border-r py-10 relative group/feature border-neutral-800',
        (index === 0 || index === 4) && 'lg:border-l border-neutral-800',
        index < 4 && 'md:border-b border-neutral-800'
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-800 to-transparent pointer-events-none" />
      )}

      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-800 to-transparent pointer-events-none" />
      )}

      <div className="mb-4 relative z-10 px-10 text-neutral-400">{icon}</div>

      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-700 group-hover/feature:bg-orange-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:scale-105 transition-transform duration-200 inline-block text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-300 max-w-xs relative z-10 px-10">{description}</p>
    </div>
  );
};
