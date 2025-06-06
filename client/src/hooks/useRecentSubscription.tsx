import api from '@/lib/axios';
import { SubscriptionType } from '@/types';
import React from 'react';

export const useRecentSubscription = () => {
  const [subscription, setSubscription] = React.useState<SubscriptionType | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = React.useState<string | null>(null);

  const fetchSubscription = async () => {
    try {
      const { data } = await api.get('/api/v1/payment/subscription');
      setSubscriptionStatus(data.status);
      setSubscription(data.subscription);
      setLoading(false);
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  React.useEffect(() => {
    fetchSubscription();
  }, []);

  return { subscription, loading, subscriptionStatus };
};
