import api from '@/lib/axios';
import { ConnectedApp, TwitterUser } from '@/types';
import { create } from 'zustand';

type monthlyData = {
  month: string;
  x: number;
  linkedin: number;
  instagram: number;
};

export type DashboardDataType = {
  twitterUserDetails: TwitterUser;
  monthlyData: monthlyData[];
};

interface DashboardStoreProps {
  isFetchingApps: boolean;
  connectedApps: ConnectedApp[];
  fetchConnectedApps: () => Promise<void>;

  // dashboardData: DashboardDataType | null
  // fetchDashboardData: VoidFunction
  // isFetchingDashboardData: boolean

  //fetching post details - later
  // userPosts: PostResponse
  // fetchPosts: ({ limit, offset }: FetchPostsParams) => Promise<void>
}

// interface FetchPostsParams {
//   limit?: number;
//   offset?: number;
// }

export const useDashboardStore = create<DashboardStoreProps>(set => ({
  isFetchingApps: true,
  connectedApps: [],
  fetchConnectedApps: async () => {
    try {
      const response = await api.get('/api/v1/user/apps');
      const data = response.data;

      console.log('apps: ', data);

      set({ connectedApps: data.connectedApps, isFetchingApps: false });
    } catch (error) {
      console.error('Fetch Connected Apps Error ', error);
    }
  },
}));
