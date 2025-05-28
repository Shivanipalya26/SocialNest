import About from '@/components/about';
import FeatureSection from '@/components/featureSection';
import HomePage from '@/components/home';
import Pricing from '@/components/pricingSection';
import TargetAudience from '@/components/targetAudience';

export default function Home() {
  return (
    <div>
      <HomePage />
      <FeatureSection />
      <About />
      <TargetAudience />
      <Pricing />
    </div>
  );
}
