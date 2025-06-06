import api from '@/lib/axios';
import { PaymentType, Plan, SubscriptionType } from '@/types';
import { create } from 'zustand';

interface SubscriptionStoreProps {
  fetchPricingPlans: VoidFunction;
  isFetchingPlans: boolean;
  pricingPlans: Plan[] | null;
  fetchPayments: VoidFunction;
  isFetchingPayments: boolean;
  payments: PaymentType[] | null;
  subscription: SubscriptionType[] | null;
  fetchSinglePayment: (order_id: string) => Promise<void>;
  isFetchingSinglePayment: boolean;
  singlePayment: PaymentType[] | null;
  creditCount: number;
  setCreditCount: (count: number) => void;
}

export const useSubscriptionStore = create<SubscriptionStoreProps>(set => ({
  isFetchingPlans: true,
  pricingPlans: null,
  fetchPricingPlans: async () => {
    try {
      const { data } = await api.get('/api/v1/payment/pricing');
      set({ pricingPlans: data.pricingPlan });
    } catch (error) {
      console.error('Fetch Pricing Plan Error: ', error);
    } finally {
      set({ isFetchingPlans: false });
    }
  },
  isFetchingPayments: true,
  payments: null,
  subscription: null,
  fetchPayments: async () => {
    try {
      const { data } = await api.get('/api/v1/payment/');
      set({
        payments: data.payments,
        subscription: data.subscriptions[0],
      });
    } catch (error) {
      console.error('Fetch Payment Error: ', error);
    } finally {
      set({ isFetchingPayments: false });
    }
  },
  isFetchingSinglePayment: false,
  singlePayment: null,
  fetchSinglePayment: async (order_id: string) => {
    set({ isFetchingSinglePayment: true });
    try {
      const { data } = await api.post('/api/v1/payment/', { order_id });
      set({ singlePayment: data.payment });
    } catch (error) {
      console.error('Fetch Single Payment Error: ', error);
    } finally {
      set({ isFetchingSinglePayment: false });
    }
  },
  creditCount: 30,
  setCreditCount: (count: number) => set({ creditCount: count }),
}));
