import PricingCard from '../pricingCard';

const localPricingPlan = [
  {
    id: '1',
    title: 'Standard',
    price: 0,
    description: 'Perfect for individuals managing personal accounts with basic needs.',
    features: [
      'Connect only 2 platforms',
      '15 posts/month',
      'Basic analytics',
      'Community support',
    ],
    cta: 'Get Started',
  },
  {
    id: '2',
    title: 'Pro',
    price: 19,
    description:
      'Great for professionals managing multiple accounts and looking for advanced tools.',
    features: [
      'Connect up to 5 platforms',
      'Unlimited posts',
      'Advanced analytics',
      'Priority support',
      'Scheduling posts',
    ],
    cta: 'Upgrade to Pro',
  },
  {
    id: '3',
    title: 'Premium',
    price: 39,
    description: 'Ideal for businesses and teams requiring full flexibility and premium features.',
    features: [
      'Connect unlimited platforms',
      'Unlimited posts and scheduling',
      'Team collaboration',
      'Premium support',
      'Custom branding',
    ],
    cta: 'Go Premium',
  },
];

const Pricing = () => {
  return (
    <div className="max-w-[75rem relative mx-auto lg:px-0 px-3 pb-5">
      <div className="relative z-10">
        <div className="text-center py-16">
          <h1 className="text-lg md:text-4xl">
            &quot;We&apos;ve got a <span className="text-orange-500">Perfect Plan</span> for Your
            Needs&quot;
          </h1>
          <h3 className="md:text-base  text-xs text-neutral-400">
            Pick Your Plan and start sharing smarter today
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 justify-center gap-3 md:gap-7 max-w-6xl  mx-auto">
          {localPricingPlan.map(plan => (
            <PricingCard
              key={plan.id}
              planId={plan.id}
              {...plan}
              price={Number(plan.price)}
              className={`${plan.title === 'Pro' && 'md:scale-110 bg-orange-950 border-orange-950/20'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
