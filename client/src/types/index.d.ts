export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  image: string;

  accounts: Account[];
  plans: Plan[];
  posts: Post[];
  plansId: string;

  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Account {
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string;
  access_token: string;
  expires_at: number;
  token_type: string;
  scope: string;
  id_token: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum STATUS {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export interface Post {
  id?: string;
  text?: string;
  userId: string;
  mediaKeys?: string[];
  scheduledFor?: Date;
  isScheduled?: boolean;
  status?: STATUS;
  provider?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ConnectedApp {
  userId: string;
  type?: string;
  provider?: string;
  providerAccountId?: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

export interface TwitterUser {
  id: string;
  name: string;
  screen_name: string;
  location: string;
  description: string;
  url: string | null;
  profile_image_url: string;
  followers_count: number;
  friends_count: number;
  createdAt: string;
  verified: boolean;
  profile_image_url_https: string;
  profile_banner_url?: string;
  profile_background_color?: string;
}

export type Providers = 'x' | 'linkedin' | 'instagram' | 'threads';

export interface NotificationType {
  id: number;
  message: string;
  type: 'POST_STATUS_PROCESSING' | 'POST_STATUS_SUCCESS' | 'POST_STATUS_FAILED' | 'SYSTEM_ALERT';
  userId: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostsResponse {
  ScheduledPosts: Post[];
  PendingPosts: Post[];
  FailedPosts: Post[];
  SuccessPosts: Post[];
}
