import React from 'react';

const sections = [
  {
    title: '1. Information We Collect',
    copy: 'We collect data you share directly with us, such as your name, email address, practice preferences, and optional profile fields.'
  },
  {
    title: '2. Real-time Processing',
    copy:
      'When you use the translator, frames are processed locally and sent securely to our models. Frames are discarded immediately unless you explicitly save them.'
  },
  {
    title: '3. How We Use Data',
    copy:
      'We use your information to operate Signverse, improve translation accuracy, send essential notifications, and personalize learning content.'
  },
  {
    title: '4. Data Security',
    copy: 'We apply encryption in transit and at rest, limit employee access, and monitor for unauthorized usage. No internet service is 100% secure, but we act quickly if an issue arises.'
  },
  {
    title: '5. Your Choices',
    copy:
      'You can access, update, or request deletion of your personal data at any time. Opt out of marketing emails via the unsubscribe link or by contacting us.'
  },
  {
    title: '6. Cookies & Analytics',
    copy:
      'We use cookies to remember preferences and lightweight analytics to understand which features are helpful. You can disable cookies in your browser if you prefer.'
  },
  {
    title: '7. Third Parties',
    copy:
      'Trusted vendors help us send emails, analyze anonymized usage, and host infrastructure. They may only use your data to perform contracted services.'
  }
];

const Privacy = () => {
  return (
    <div className="page-shell space-y-8">
      <section className="space-y-3">
        <p className="section-eyebrow w-fit">Privacy</p>
        <h1 className="text-4xl font-semibold">Privacy Policy</h1>
        <p className="text-lg text-ink/70 max-w-3xl">
          We treat your sign sessions, profile, and progress with the care they deserve. Here’s how we protect your data.
        </p>
      </section>

      <section className="surface-card p-8 space-y-8">
        {sections.map((section) => (
          <div key={section.title} className="space-y-3">
            <h2 className="text-2xl font-semibold">{section.title}</h2>
            <p className="text-ink/70">{section.copy}</p>
          </div>
        ))}

        <div className="space-y-3 pt-4 border-t border-white/60">
          <h2 className="text-2xl font-semibold">Contact & Updates</h2>
          <p className="text-ink/70">
            Questions? Email{' '}
            <a href="mailto:privacy@signverse.com" className="text-brand-600 font-semibold">
              privacy@signverse.com
            </a>
            . We will post any policy changes here and update the date below.
          </p>
          <p className="text-sm text-ink/50">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </section>
    </div>
  );
};

export default Privacy;

