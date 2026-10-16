export const metadata = {
  title: "Privacy Policy — Sabyy",
  description: "How Sabyy collects, uses, and protects your data.",
};

const EFFECTIVE_DATE = "1 January 2025";
const CONTACT_EMAIL = "sabbytek@gmail.com";

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="font-headline-md text-headline-md text-on-surface mb-4">{title}</h2>
      <div className="space-y-4 font-body-md text-body-md text-on-surface-variant leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-20 pb-12 px-gutter border-b border-outline-variant/30 bg-surface-container-lowest">
        <div className="max-w-3xl mx-auto">
          <p className="font-label-sm text-label-sm text-primary uppercase tracking-widest mb-3">Legal</p>
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-4">Privacy Policy</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Effective date: {EFFECTIVE_DATE}. Last updated: {EFFECTIVE_DATE}.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="py-16 px-gutter">
        <div className="max-w-3xl mx-auto space-y-12">

          <Section title="1. Who we are">
            <p>
              Sabyy Technologies (&quot;Sabyy&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the Sabyy platform — a commerce and operations platform for African businesses — accessible at sabyy.com and via our mobile applications.
            </p>
            <p>
              This Privacy Policy explains how we collect, use, store, and share information about you when you use our services. By using Sabyy, you agree to the practices described here.
            </p>
            <p>
              Questions? Email us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">{CONTACT_EMAIL}</a>.
            </p>
          </Section>

          <Section title="2. Information we collect">
            <p><strong className="text-on-surface">Account information.</strong> When you create a Sabyy account, we collect your name, email address, phone number, and business details (business name, address, and type).</p>
            <p><strong className="text-on-surface">Transaction data.</strong> We process and store records of orders, payments, invoices, and inventory movements made through your Sabyy account.</p>
            <p><strong className="text-on-surface">Customer data.</strong> When you add customers to your Sabyy account, we store the information you provide (name, email, phone, address). You are the data controller for your customers&apos; data; we process it on your behalf.</p>
            <p><strong className="text-on-surface">Usage data.</strong> We collect information about how you interact with the platform — pages visited, features used, session duration, and error logs — to improve the product.</p>
            <p><strong className="text-on-surface">Device and technical data.</strong> IP address, browser type, operating system, and device identifiers collected automatically when you access our services.</p>
            <p><strong className="text-on-surface">Communications.</strong> If you contact our support team, we retain those communications to resolve your issue and improve our service.</p>
          </Section>

          <Section title="3. How we use your information">
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Provide, operate, and maintain the Sabyy platform</li>
              <li>Process payments and send transaction confirmations</li>
              <li>Send you service-related notifications (receipts, low-stock alerts, subscription updates)</li>
              <li>Respond to your support requests</li>
              <li>Detect and prevent fraud, abuse, and security incidents</li>
              <li>Improve and develop new features based on usage patterns</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p>We do not sell your personal data to third parties. We do not use your data for advertising purposes.</p>
          </Section>

          <Section title="4. How we share your information">
            <p>We share your information only in the following circumstances:</p>
            <p><strong className="text-on-surface">Service providers.</strong> We work with trusted third-party providers to operate our platform — including cloud hosting (Render, Neon), payment processing (Paystack), email delivery, and analytics. These providers access your data only to perform services on our behalf and are bound by confidentiality obligations.</p>
            <p><strong className="text-on-surface">Legal requirements.</strong> We may disclose your information if required by law, court order, or government authority, or to protect the rights, property, or safety of Sabyy, our users, or the public.</p>
            <p><strong className="text-on-surface">Business transfers.</strong> If Sabyy is acquired or merges with another company, your information may be transferred as part of that transaction. We will notify you before your data is subject to a different privacy policy.</p>
          </Section>

          <Section title="5. Data storage and security">
            <p>Your data is stored on servers located in the European Union and the United States, operated by our cloud infrastructure providers. We use industry-standard encryption (TLS in transit, AES-256 at rest) to protect your data.</p>
            <p>We retain your account data for as long as your account is active. If you close your account, we delete or anonymise your personal data within 90 days, except where we are required to retain it for legal or regulatory purposes.</p>
            <p>No system is perfectly secure. If we become aware of a security breach that affects your data, we will notify you within 72 hours of becoming aware of it.</p>
          </Section>

          <Section title="6. Your rights">
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li><strong className="text-on-surface">Access</strong> the personal data we hold about you</li>
              <li><strong className="text-on-surface">Correct</strong> inaccurate or incomplete data</li>
              <li><strong className="text-on-surface">Delete</strong> your account and associated personal data</li>
              <li><strong className="text-on-surface">Export</strong> your data in a machine-readable format</li>
              <li><strong className="text-on-surface">Object</strong> to certain types of processing</li>
            </ul>
            <p>
              To exercise any of these rights, email us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">{CONTACT_EMAIL}</a>. We will respond within 30 days.
            </p>
          </Section>

          <Section title="7. Cookies">
            <p>We use essential cookies to keep you logged in and maintain your session. We do not use advertising or tracking cookies. You can disable cookies in your browser settings, but this will prevent you from logging in to the platform.</p>
          </Section>

          <Section title="8. Children">
            <p>Sabyy is not directed at children under 18. We do not knowingly collect personal data from anyone under 18. If you believe a minor has provided us with personal data, please contact us and we will delete it promptly.</p>
          </Section>

          <Section title="9. Changes to this policy">
            <p>We may update this Privacy Policy from time to time. When we make material changes, we will notify you by email or by displaying a notice in the platform at least 14 days before the changes take effect. Your continued use of Sabyy after the effective date constitutes acceptance of the updated policy.</p>
          </Section>

          {/* Terms of Service */}
          <div className="border-t border-outline-variant/40 pt-12">
            <p className="font-label-sm text-label-sm text-primary uppercase tracking-widest mb-3">Legal</p>
            <h1 id="terms" className="font-headline-xl text-headline-xl text-on-surface mb-4 scroll-mt-24">Terms of Service</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-10">
              Effective date: {EFFECTIVE_DATE}.
            </p>
          </div>

          <Section title="1. Acceptance">
            <p>By creating a Sabyy account or using any part of our platform, you agree to these Terms of Service (&quot;Terms&quot;). If you do not agree, do not use Sabyy.</p>
            <p>These Terms form a binding agreement between you (or the business you represent) and Sabyy Technologies.</p>
          </Section>

          <Section title="2. Your account">
            <p>You are responsible for maintaining the security of your account credentials. You must not share your password or allow unauthorised access to your account. You are responsible for all activity that occurs under your account.</p>
            <p>You must provide accurate information when creating your account. Accounts created with false information may be suspended.</p>
          </Section>

          <Section title="3. Acceptable use">
            <p>You may use Sabyy only for lawful business purposes. You must not:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Use the platform to sell illegal goods or services</li>
              <li>Attempt to reverse-engineer, hack, or disrupt the platform</li>
              <li>Use automated tools to scrape or extract data without our written permission</li>
              <li>Impersonate another person or business</li>
              <li>Violate any applicable law or regulation</li>
            </ul>
            <p>We reserve the right to suspend or terminate accounts that violate these rules without notice.</p>
          </Section>

          <Section title="4. Payments and billing">
            <p>Subscription fees are billed in advance on a monthly or annual basis. All fees are non-refundable except where required by law. We will give you at least 30 days&apos; notice before changing our pricing.</p>
            <p>If your payment fails, we will notify you and give you a grace period to update your payment method before suspending your account.</p>
          </Section>

          <Section title="5. Your data">
            <p>You own your data. We do not claim any intellectual property rights over the content you upload or the data generated by your business on Sabyy. Our Privacy Policy explains how we handle your data.</p>
            <p>You can export your data at any time from your account settings. If you close your account, you have 30 days to export your data before it is deleted.</p>
          </Section>

          <Section title="6. Uptime and support">
            <p>We aim for 99.9% uptime but do not guarantee uninterrupted service. Planned maintenance will be communicated in advance. We are not liable for losses caused by downtime beyond our reasonable control.</p>
          </Section>

          <Section title="7. Limitation of liability">
            <p>To the maximum extent permitted by law, Sabyy&apos;s total liability to you for any claim arising from these Terms or your use of the platform is limited to the fees you paid to us in the 12 months preceding the claim.</p>
            <p>We are not liable for indirect, incidental, or consequential damages, including lost profits or data loss.</p>
          </Section>

          <Section title="8. Governing law">
            <p>These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes will be resolved in the courts of Lagos State, Nigeria.</p>
          </Section>

          <Section title="9. Contact">
            <p>
              For questions about these Terms, email us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">{CONTACT_EMAIL}</a>.
            </p>
          </Section>

        </div>
      </div>
    </>
  );
}
