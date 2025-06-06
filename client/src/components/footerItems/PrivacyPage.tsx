import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-14">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-neutral-400 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
          </Link>
        </div>

        <h1 className="mb-8 text-4xl font-ClashDisplayMedium text-orange-500 tracking-tight">
          Privacy Policy
        </h1>

        <div className="max-w-none">
          <p className="text-neutral-400">Last updated: June 6, 2025</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>
            SocialNest is committed to protecting your privacy. This Privacy Policy explains how we
            collect, use, and safeguard your information when you use our platform to manage social
            media posting (the &apos;Service&apos;). By using the Service, you consent to these
            practices.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
          <p>We collect the following information to provide our Service:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Account information: Name, email address, and password when you register.</li>
            <li>
              Social media access tokens: To post on your behalf to platforms like Twitter and
              LinkedIn, we securely store your access tokens.
            </li>
            <li>
              Payment information: For subscription plans, we collect payment details and billing
              information.
            </li>
            <li>Content: Posts, images, or other content you upload to share via the Service.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              Provide the Service, including posting or scheduling content to your social media
              accounts.
            </li>
            <li>Process subscription payments and manage billing.</li>
            <li>Improve the Service and respond to your support requests.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Database and Security Policies</h2>
          <p>
            At SocialNest, we take your privacy and security seriously. To post on your behalf to
            platforms like Twitter and LinkedIn, we need to store your access tokens—this is a
            standard practice for apps that manage social media posting. We store these tokens
            securely in our database using industry-standard encryption, ensuring they’re protected
            from unauthorized access. We only use your tokens to perform the actions you’ve
            authorized (like posting or scheduling), and we never share them with third parties. You
            can revoke access at any time by disconnecting your account from our app, which will
            immediately remove your tokens from our system.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Subscription-Based Policies</h2>
          <p>
            SocialNest offers subscription plans to access premium features. Your payment
            information is collected and processed securely via trusted third-party payment
            processors. We do not store full payment details in our database—only necessary
            transaction data for billing purposes. You can cancel your subscription at any time
            through your account settings, and we will stop billing you at the end of your current
            billing cycle. Refunds are subject to our refund policy, available upon request.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. How We Share Your Information</h2>
          <p>We may share your information:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>With social media platforms to post content as authorized by you.</li>
            <li>With payment processors to handle subscription transactions.</li>
            <li>If required by law or to protect our rights and users.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact Us</h2>
          <p>For questions about this Privacy Policy, contact us at:</p>
          <p>Email: shivanipalya6201@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
