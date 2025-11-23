import React from 'react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: 'How do I use the translator?',
    answer:
      'Head to the Translate page, enable camera access, and hold your hand in the frame. You can also upload a still image if you prefer. Ambient lighting and a clear background always improve accuracy.'
  },
  {
    question: 'Do I need an account?',
    answer:
      'You can explore the translator without logging in, but creating a profile lets you save history, track streaks, and access personalized lessons.'
  },
  {
    question: 'Which sign languages are supported?',
    answer: 'We currently support ASL and are working with Deaf linguists to expand into more sign languages soon.'
  },
  {
    question: 'Is my video data stored?',
    answer: (
      <>
        No. Frames are processed in realtime and discarded unless you explicitly save a session. Learn more in our{' '}
        <Link to="/privacy" className="text-brand-600 font-semibold">
          Privacy Policy
        </Link>
        .
      </>
    )
  }
];

const troubleshooting = [
  'Face a window or soft light source',
  'Keep your palm inside the frame',
  'Use a calm background for contrast',
  'Hold the sign steady for two seconds',
  'Check that camera permissions are granted'
];

const Help = () => {
  return (
    <div className="page-shell space-y-10">
      <section className="space-y-4 text-center">
        <p className="section-eyebrow mx-auto">Help Center</p>
        <h1 className="text-4xl font-semibold">Answers, tips, and friendly support</h1>
        <p className="text-lg text-ink/70 max-w-3xl mx-auto">
          From setup to advanced practice, here is everything you need to keep your signing sessions flowing smoothly.
        </p>
      </section>

      <section className="surface-card p-10 space-y-8">
        {faqs.map((faq) => (
          <div key={faq.question} className="text-left space-y-2">
            <h3 className="text-xl font-semibold text-ink">{faq.question}</h3>
            <p className="text-ink/70 leading-relaxed">{faq.answer}</p>
          </div>
        ))}

        <div className="border border-white/60 rounded-3xl p-6">
          <h3 className="text-xl font-semibold mb-3">Troubleshooting realtime translation</h3>
          <ul className="list-disc list-inside text-ink/70 space-y-1">
            {troubleshooting.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="surface-card surface-card-emphasis text-center p-10 space-y-4">
        <h2 className="text-3xl font-semibold">Still need help?</h2>
        <p className="text-ink/70 max-w-2xl mx-auto">
          Email us anytime at{' '}
          <a href="mailto:support@signverse.com" className="text-brand-600 font-semibold">
            support@signverse.com
          </a>
          . We usually respond within 24–48 hours.
        </p>
      </section>
    </div>
  );
};

export default Help;

