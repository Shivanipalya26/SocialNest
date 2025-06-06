import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function RefundCancellationPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 ">
      <div className="my-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-neutral-400 hover:text-orange-500 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
        </Link>
      </div>
      <h1 className="mb-8 text-4xl font-ClashDisplayMedium tracking-wide text-orange-500">
        Refund and Cancellation Policy
      </h1>
      <div className="prose max-w-none">
        <p className="mb-6">
          At SocialNest, we offer subscription-based services that users can cancel at any time.
          However, refunds are not possible once a subscription has been initiated.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Cancellation Policy</h2>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>Users can cancel their subscription at any time through their account settings.</li>
          <li>
            Upon cancellation, the service will remain active until the end of the current billing
            cycle.
          </li>
          <li>
            No further charges will be made after cancellation, but past payments are
            non-refundable.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Refund Policy</h2>
        <div className="bg-muted p-4 rounded-md mb-6">
          <h3 className="font-medium mb-2">Important Note:</h3>
          <p>
            All subscription sales are final. Refunds are not available once a subscription has been
            processed.
          </p>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact for Cancellation Requests</h2>
        <p className="mb-6">
          If you have any questions regarding cancellations, please contact us at:
          <span className="font-medium">shivanipalya6201@gmail.com</span>
        </p>

        <div className="mt-10 border-t pt-6">
          <p className="text-center text-muted-foreground">
            Merchant Legal Entity Name: SHIVANI PALYA
          </p>
        </div>
      </div>
    </div>
  );
}
