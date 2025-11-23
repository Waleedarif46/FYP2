import React from 'react';

const sections = [
  {
    title: '1. Acceptance of Terms',
    copy: 'By accessing and using Signverse, you accept and agree to be bound by these Terms of Service. If you disagree with any part, please discontinue use.'
  },
  {
    title: '2. Use License',
    copy:
      'We grant you a limited license for personal, non-commercial use. You may not resell, reverse engineer, or remove proprietary notices from any Signverse materials.'
  },
  {
    title: '3. User Accounts',
    copy:
      'Provide accurate and current information when creating an account. You are responsible for safeguarding your password and for activities under your account.'
  },
  {
    title: '4. Privacy',
    copy: 'Your use of Signverse is also governed by our Privacy Policy, which outlines how we collect, use, and protect your data.'
  },
  {
    title: '5. Disclaimer',
    copy:
      "Signverse is provided on an 'as-is' basis. We make no warranties, expressed or implied, about the accuracy or reliability of the service."
  },
  {
    title: '6. Limitations',
    copy:
      'Signverse and its suppliers are not liable for damages arising from the use or inability to use the platform, including data loss or business interruption.'
  }
];

const Terms = () => {
  return (
    <div className="page-shell space-y-8">
      <section className="space-y-3">
        <p className="section-eyebrow w-fit">Legal</p>
        <h1 className="text-4xl font-semibold">Terms & Conditions</h1>
        <p className="text-lg text-ink/70 max-w-3xl">
          Transparency matters to us. Please review how Signverse operates so we can maintain a safe, respectful community.
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
          <h2 className="text-2xl font-semibold">7. Contact</h2>
          <p className="text-ink/70">
            For questions about these Terms, email{' '}
            <a href="mailto:legal@signverse.com" className="text-brand-600 font-semibold">
              legal@signverse.com
            </a>
            .
          </p>
          <p className="text-sm text-ink/50">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </section>
    </div>
  );
};

export default Terms;

