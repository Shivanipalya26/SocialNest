import api from '@/lib/axios';
import { ConnectedApp, PostsResponse, TwitterUser } from '@/types';
import { create } from 'zustand';

type monthlyData = {
  month: string;
  x: number;
  linkedin: number;
  instagram: number;
};

export type DashboardDataType = {
  xUserDetails: TwitterUser;
  monthlyData: monthlyData[];
};

interface DashboardStoreProps {
  isFetchingApps: boolean;
  connectedApps: ConnectedApp[];
  hasFetched: boolean;
  fetchConnectedApps: () => Promise<void>;

  dashboardData: DashboardDataType | null;
  fetchDashboardData: VoidFunction;
  isFetchingDashboardData: boolean;

  // fetching post details - later
  userPosts: PostsResponse;
  fetchPosts: ({ limit, offset }: FetchPostsParams) => Promise<void>;
}

interface FetchPostsParams {
  limit?: number;
  offset?: number;
}

export const useDashboardStore = create<DashboardStoreProps>((set, get) => ({
  isFetchingApps: false,
  connectedApps: [],
  hasFetched: false,
  fetchConnectedApps: async () => {
    const { hasFetched } = get();
    if (hasFetched) return;

    set({ isFetchingApps: true });
    try {
      const response = await api.get('/api/v1/user/apps');
      const data = response.data;

      set({ connectedApps: data.connectedApps, isFetchingApps: false, hasFetched: true });
    } catch (error) {
      console.error('Fetch Connected Apps Error ', error);
      set({ isFetchingApps: false });
    }
  },
  isFetchingDashboardData: true,
  dashboardData: null,
  fetchDashboardData: async () => {
    try {
      const response = await api.get('/api/v1/user/dashboard');
      const data = response.data.dashboardData;

      set({ dashboardData: data, isFetchingDashboardData: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Fetch Dashboard Data Error:', error);
    } finally {
      set({ isFetchingDashboardData: false });
    }
  },
  userPosts: {
    ScheduledPosts: [],
    PendingPosts: [],
    SuccessPosts: [],
    FailedPosts: [],
  },
  fetchPosts: async ({ limit = 10, offset = 0 }: FetchPostsParams) => {
    try {
      const query = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      }).toString();

      const response = await api.get(`api/v1/post?${query}`);
      set({ userPosts: response.data });
    } catch (error) {
      console.error('Fetch posts failed:', error);
    }
  },
}));
