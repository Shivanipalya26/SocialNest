import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-20">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-neutral-400 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
          </Link>
        </div>

        <h1 className="mb-8 text-4xl font-ClashDisplayMedium tracking-wide text-orange-500">
          Terms of Service
        </h1>

        <div className="prose prose-invert prose-orange max-w-none">
          <p className="text-neutral-400">Last updated: JUNE 6, 2025</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>
            Welcome to SocialNest (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). These Terms
            of Service (&quot;Terms&quot;) govern your access to and use of the SocialNest platform,
            including any associated mobile applications, websites, and services (collectively, the
            &quot;Service&quot;).
          </p>
          <p>
            By accessing or using the Service, you agree to be bound by these Terms. If you do not
            agree to these Terms, you may not access or use the Service.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Description of Service</h2>
          <p>
            SocialNest is a social media management platform that allows users to create, schedule,
            and share content across multiple social media platforms from a single interface. Our
            Service provides tools for content planning, scheduling, analytics, and team
            collaboration.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Account Registration</h2>
          <p>
            To use certain features of the Service, you must register for an account. When you
            register, you agree to provide accurate, current, and complete information about
            yourself and to update this information to maintain its accuracy.
          </p>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and
            for all activities that occur under your account. You agree to notify us immediately of
            any unauthorized use of your account.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Subscription and Payments</h2>
          <p>
            SocialNest offers various subscription plans. By selecting a subscription plan, you
            agree to pay the applicable fees as they become due. All payments are non-refundable
            except as expressly stated in these Terms or as required by applicable law.
          </p>
          <p>
            We may change our subscription fees at any time. We will give you reasonable notice of
            any such changes. If you do not agree to a fee change, you must cancel your subscription
            before the change takes effect.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. User Content</h2>
          <p>
            You retain all rights to any content you submit, post, or display on or through the
            Service (&quot;User Content&quot;). By submitting User Content to the Service, you grant
            us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt,
            publish, and display such User Content for the purpose of providing and improving the
            Service.
          </p>
          <p>
            You are solely responsible for your User Content and the consequences of posting it. You
            represent and warrant that you have all necessary rights to submit your User Content and
            that it does not violate any third-party rights or applicable laws.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Acceptable Use</h2>
          <p>You agree not to use the Service to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe upon the rights of others</li>
            <li>Post or transmit unauthorized commercial communications</li>
            <li>Upload viruses or other malicious code</li>
            <li>Attempt to access accounts or data not belonging to you</li>
            <li>Interfere with or disrupt the Service or servers</li>
            <li>Engage in any activity that could disable, overburden, or impair the Service</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Third-Party Services</h2>
          <p>
            The Service may integrate with third-party services, such as social media platforms.
            Your use of such third-party services is subject to their respective terms and privacy
            policies. We are not responsible for the content, privacy practices, or policies of
            these third-party services.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are owned by
            SocialNest and are protected by international copyright, trademark, patent, trade
            secret, and other intellectual property laws.
          </p>
          <p>
            You may not copy, modify, create derivative works, publicly display, publicly perform,
            republish, or transmit any material from the Service without our prior written consent.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Termination</h2>
          <p>
            We may terminate or suspend your account and access to the Service immediately, without
            prior notice or liability, for any reason, including if you breach these Terms.
          </p>
          <p>
            Upon termination, your right to use the Service will immediately cease. All provisions
            of these Terms that by their nature should survive termination shall survive, including
            ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Disclaimer of Warranties</h2>
          <p>
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT
            WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO,
            IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
            NON-INFRINGEMENT.
          </p>
          <p>
            WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS
            WILL BE CORRECTED, OR THAT THE SERVICE OR THE SERVERS THAT MAKE IT AVAILABLE ARE FREE OF
            VIRUSES OR OTHER HARMFUL COMPONENTS.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">11. Limitation of Liability</h2>
          <p>
            IN NO EVENT SHALL SocialNest, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE
            FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING
            LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR IN CONNECTION WITH THESE TERMS OR THE
            SERVICE, WHETHER BASED ON CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY, OR OTHERWISE.
          </p>
          <p>
            OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING UNDER THESE TERMS SHALL NOT EXCEED THE AMOUNT
            YOU PAID TO US FOR THE SERVICE DURING THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING
            RISE TO THE LIABILITY.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">12. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless SocialNest and its officers,
            directors, employees, and agents from and against any claims, liabilities, damages,
            losses, and expenses, including reasonable attorneys&quot; fees, arising out of or in
            any way connected with your access to or use of the Service or your violation of these
            Terms.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">13. Changes to Terms</h2>
          <p>
            We may modify these Terms at any time. We will provide notice of any material changes by
            posting the updated Terms on the Service or by sending you an email. Your continued use
            of the Service after such modifications constitutes your acceptance of the modified
            Terms.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">14. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of [Your
            Jurisdiction], without regard to its conflict of law provisions.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">15. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at:</p>
          <p>Email: shivanipalya6201@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
