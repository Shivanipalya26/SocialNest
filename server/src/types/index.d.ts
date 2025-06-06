import { Request } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
}

export interface XUser {
  id: string;
  name: string;
  screen_name: string;
  location: string;
  description: string;
  url: string | null;
  profile_image_url: string;
  followers_count: number;
  friends_count: number;
  createdAt: string; // Twitter uses ISO strings for dates
  verified: boolean;
  profile_image_url_https: string;
  profile_banner_url?: string;
  profile_background_color?: string;
}

export interface PostsResponse {
  ScheduledPosts: Post[];
  PendingPosts: Post[];
  FailedPosts: Post[];
  SuccessPosts: Post[];
}
