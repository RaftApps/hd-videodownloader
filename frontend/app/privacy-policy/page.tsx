import { SiteHeader } from "@/components/site-header";
import { AppverseFooter } from "@/components/footer";

export default function PrivacyPolicyPage() {
  return (
    <>
      <SiteHeader />
      <section className="text-black py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl border border-neutral-400 p-6 sm:p-10 shadow-xl">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(236,72,153,0.08),transparent_55%)]" />
              <div className="relative space-y-12">
                
                {/* Header */}
                <header className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight text-pink-600">
                    Privacy Policy
                  </h1>
                  <p className="text-neutral-400 text-lg">
                    This Privacy Policy explains how RaftApps LLC (“we,” “our,” or “us”) 
                    collects, uses, and protects your information when you use our HD Video Downloader website.
                  </p>
                </header>

                {/* Section 1 */}
                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-black">1. Information We Collect</h2>
                  <p className="text-neutral-600">
                    We do not require account creation. However, we may collect limited technical information 
                    such as your browser type, device information, and anonymized usage data for analytics and 
                    service improvement. We do not collect personally identifiable information unless you 
                    voluntarily provide it (e.g., contacting us via email).
                  </p>
                </section>

                {/* Section 2 */}
                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-black">2. Use of Information</h2>
                  <p className="text-neutral-600">
                    The information collected is used solely to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-neutral-400">
                    <li>Improve website performance and user experience</li>
                    <li>Maintain security and prevent abuse</li>
                    <li>Respond to inquiries and support requests</li>
                  </ul>
                </section>

                {/* Section 3 */}
                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-black">3. Cookies</h2>
                  <p className="text-neutral-600">
                    Our website may use cookies or similar technologies to enhance functionality and track 
                    usage trends. You can disable cookies in your browser settings, but some features may 
                    not work properly.
                  </p>
                </section>

                {/* Section 4 */}
                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-black">4. Third-Party Services</h2>
                  <p className="text-neutral-600">
                    We may use third-party tools (such as analytics providers or ad networks) that collect 
                    non-personal data to help us improve services and maintain free access to the website.
                  </p>
                </section>

                {/* Section 5 */}
                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-black">5. Data Security</h2>
                  <p className="text-neutral-600">
                    We take reasonable measures to protect your information from unauthorized access, 
                    disclosure, or misuse. However, no method of transmission over the internet is 
                    completely secure.
                  </p>
                </section>

                {/* Section 6 */}
                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-black">6. Changes to This Policy</h2>
                  <p className="text-neutral-600">
                    We may update this Privacy Policy from time to time. The revised version will be 
                    effective immediately upon publication on this page.
                  </p>
                </section>

                {/* Section 7 */}
                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-black">7. Contact Us</h2>
                  <p className="text-neutral-600">
                    If you have any questions about this Privacy Policy, you can contact us at:
                  </p>
                  <p className="text-neutral-600">
                    Email:{" "}
                    <a href="mailto:contact@raftapps.com" className="text-pink-600 underline">
                      contact@raftapps.com
                    </a>
                  </p>
                </section>

              </div>
            </div>
          </div>
        </div>
      </section>
      <AppverseFooter />
    </>
  );
}
