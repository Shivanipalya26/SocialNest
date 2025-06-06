import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Image from 'next/image';
import { CalendarDays, Link, MapPin, VerifiedIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import { DashboardDataType } from '@/store/DashboardStore/useDashboardStore';

const XUserDetails = ({ dashboardData }: { dashboardData: DashboardDataType }) => {
  const createdDate = dashboardData?.xUserDetails.createdAt
    ? new Date(dashboardData.xUserDetails.createdAt)
    : null;

  const accountAge = createdDate ? formatDistanceToNow(createdDate, { addSuffix: true }) : null;

  return (
    <div className="bg-white dark:bg-secondary/30 border dark:border-secondary border-neutral-200 shadow-sm rounded-2xl p-4">
      {dashboardData?.xUserDetails.profile_banner_url && (
        <div className="h-32 -mx-4 -mt-4 mb-4 relative overflow-hidden rounded-t-2xl">
          <Image
            src={dashboardData.xUserDetails.profile_banner_url || '/placeholder.svg'}
            alt="Profile banner"
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="flex items-center space-x-2 mb-2">
        <Avatar className="h-14 w-14 border-2 border-background">
          <AvatarImage
            src={dashboardData?.xUserDetails.profile_image_url_https || '/placeholder.svg'}
          />
          <AvatarFallback>{dashboardData?.xUserDetails.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <h3 className="text-xl leading-none">{dashboardData?.xUserDetails.name}</h3>
            {dashboardData?.xUserDetails.verified && (
              <VerifiedIcon className="h-4 w-4 text-blue-500" />
            )}
          </div>
          <p className="text-muted-foreground">@{dashboardData?.xUserDetails.screen_name}</p>
        </div>
        <Image className="dark:invert-[1]" src={'/x.svg'} height={50} width={50} alt="Twitter" />
      </div>

      {dashboardData?.xUserDetails.description && (
        <p className="text-sm mb-4">
          {dashboardData.xUserDetails.description
            .split(/https?:\/\/\S+/)
            .map((text, index, array) => (
              <React.Fragment key={index}>
                {text}
                {index < array.length - 1 &&
                  dashboardData.xUserDetails.description.match(/https?:\/\/\S+/g)?.[index] && (
                    <a
                      href={
                        dashboardData.xUserDetails.description.match(/https?:\/\/\S+/g)?.[index] ||
                        '#'
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {dashboardData.xUserDetails.description
                        .match(/https?:\/\/\S+/g)
                        ?.[index].replace(/https?:\/\/(www\.)?|\/$/g, '')}
                    </a>
                  )}
              </React.Fragment>
            ))}
        </p>
      )}

      <div className="grid grid-cols-1 gap-1 mb-4 text-sm">
        {dashboardData?.xUserDetails.location && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{dashboardData.xUserDetails.location}</span>
          </div>
        )}

        {dashboardData?.xUserDetails.url && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Link className="h-4 w-4" />
            <a
              href={dashboardData.xUserDetails.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {dashboardData.xUserDetails.url.replace(/^https?:\/\/(www\.)?/, '')}
            </a>
          </div>
        )}

        {createdDate && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>
              Joined {createdDate.toLocaleDateString()} ({accountAge})
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm border-t pt-4 dark:border-secondary border-neutral-200">
        <div>
          <span className="font-medium text-base">
            {dashboardData?.xUserDetails.followers_count.toLocaleString()}{' '}
            <span className="text-muted-foreground">Followers</span>
          </span>
        </div>
        <div>
          <span className="font-medium text-base">
            {dashboardData?.xUserDetails.friends_count.toLocaleString()}{' '}
            <span className="text-muted-foreground">Following</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default XUserDetails;
