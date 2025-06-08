import { localPricingPlan } from '@/data/pricing';
import PricingCard from '../pricingCard';

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
              className={`${plan.title === 'Pro' && 'md:scale-110 bg-gradient-to-bl from-orange-700 via-orange-900 to-orange-950 border-orange-950/20'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
