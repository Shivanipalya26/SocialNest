import api from '@/lib/axios';
import { User } from '@/types';
import { toast } from 'sonner';
import { create } from 'zustand';

interface registerAccountProps {
  email: string;
  password: string;
  name: string;
}

interface loginAccountProps {
  email: string;
  password: string;
}

interface AuthStore {
  isLoading: boolean;
  error: string | null;
  registerAccount: (props: registerAccountProps, onSuccess: () => void) => Promise<void>;
  loginAccount: (props: loginAccountProps, onSuccess: () => void) => Promise<void>;
  logout: VoidFunction;

  user: User | null;
  fetchUser: VoidFunction;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  error: null,
  isLoading: false,
  registerAccount: async (props, onSuccess) => {
    set({ isLoading: true });
    try {
      await api.post('/api/v1/auth/register', props, { withCredentials: true });
      await get().fetchUser(); // fetch user after register
      toast.success('Registered!');
      onSuccess();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ error: error?.response?.data?.error || 'Something went wrong' });
      toast.error('Registration failed', {
        description: error?.response?.data?.error,
      });
    } finally {
      set({ isLoading: false });
    }
  },
  loginAccount: async (props, onSuccess) => {
    set({ isLoading: true });
    try {
      console.log('login started');
      await api.post('/api/v1/auth/login', props);
      await get().fetchUser(); // fetch user after login
      toast.success('Logged in!');
      onSuccess();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ error: error?.response?.data?.error || 'Invalid credentials' });
      toast.error('Login failed', {
        description: error?.response?.data?.error,
      });
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    try {
      await api.post('/api/v1/auth/logout');
      set({ user: null });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  },
  user: null,
  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/api/v1/user/me');
      set({ user: data.user });
      console.log('user: ', data.user);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Fetch User Error: ', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
