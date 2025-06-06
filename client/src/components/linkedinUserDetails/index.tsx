import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Image from 'next/image';

const linkedInProfile = {
  name: 'Shivani Palya',
  headline: 'Software Engineer',
  profileImageUrl: 'https://randomuser.me/api/portraits',
  connections: 500,
};

const LinkedinUserDetails = () => {
  return (
    <div className="relative bg-white dark:bg-secondary/30 border dark:border-secondary border-neutral-200 shadow-sm rounded-2xl p-4">
      <div className="blur-sm">
        <div className="flex items-center space-x-2 mb-2">
          <Avatar className="h-14 w-14">
            <AvatarImage src={linkedInProfile.profileImageUrl} />
            <AvatarFallback>{linkedInProfile.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg leading-none">{linkedInProfile.name}</h3>
            <p className="text-muted-foreground leading-none text-sm">{linkedInProfile.headline}</p>
          </div>
          <Image src={'/linkedin.svg'} height={70} width={70} alt="linkedin" />
        </div>
        <div className="flex gap-1 text-sm">
          <p className="font-medium">{linkedInProfile.connections}</p>
          <p className="text-muted-foreground">Connections</p>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-lg font-ClashDisplayMedium text-blue-400">
        Under Construction
      </div>
    </div>
  );
};

export default LinkedinUserDetails;
