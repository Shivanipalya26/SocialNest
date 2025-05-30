import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuthStore } from '@/store/AuthStore/useAuthStore';

const UserProfile = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex justify-center gap-1 select-none items-center md:bg-secondary/30 md:border border-secondary/40 md:px-2 md:py-1 md:rounded-lg">
            <Avatar>
              <AvatarImage src={user.image || ''} />
              <AvatarFallback className="uppercase font-semibold">
                {user.name ? user.name[0] : 'SN'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-base text-start leading-none">{user.name || 'SocailNest'}</p>
              <p className="text-xs text-neutral-300">{user.email || 'socialnest@gamil.com'}</p>
            </div>
          </div>
          <TooltipContent>Profile</TooltipContent>
        </TooltipTrigger>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UserProfile;
