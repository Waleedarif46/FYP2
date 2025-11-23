import React from 'react';
import { Link } from 'react-router-dom';
import { FiActivity, FiBookOpen, FiCamera, FiHeart } from 'react-icons/fi';
import deafUserSigning from '../assets/images/deaf-user-signing.png';
import learnerMimicking from '../assets/images/learner-mimicking.jpg';

const features = [
  {
    title: 'Realtime Sign Capture',
    description: 'Crystal-clear webcam streaming with instant AI-powered translations and confidence scoring.',
    icon: <FiCamera className="text-2xl" />
  },
  {
    title: 'Guided Learning Paths',
    description: 'Follow calming practice flows for alphabets, phrases, and expressive signing at your own pace.',
    icon: <FiBookOpen className="text-2xl" />
  },
  {
    title: 'Progress Insights',
    description: 'Celebrate milestones with visual streaks, session summaries, and gentle reminders.',
    icon: <FiActivity className="text-2xl" />
  },
  {
    title: 'Community Warmth',
    description: 'Connect with Deaf mentors and fellow learners through curated practice circles.',
    icon: <FiHeart className="text-2xl" />
  }
];

const journeySteps = [
  {
    label: '01',
    title: 'Translate naturally',
    copy: 'Switch between realtime camera mode or upload snapshots. Get confident predictions with practical tips.'
  },
  {
    label: '02',
    title: 'Practice with purpose',
    copy: 'Curated decks for alphabets, digits, and everyday words keep your hands relaxed and learning playful.'
  },
  {
    label: '03',
    title: 'Stay in rhythm',
    copy: 'Automatic practice logs, streak tracking, and mindful nudges help you make gradual, meaningful progress.'
  }
];

const Home = () => {
  return (
    <div className="page-shell space-y-20">
      {/* Hero */}
      <section className="section-shell pt-6">
        <div className="surface-card surface-card-emphasis overflow-hidden">
          <div className="grid gap-10 lg:grid-cols-2 p-10 lg:p-14">
            <div className="space-y-6">
              <p className="section-eyebrow w-fit">Modern sign experience</p>
              <h1 className="text-4xl md:text-5xl font-display font-semibold leading-tight">
                A softer, smarter way to translate and learn sign language.
              </h1>
              <p className="text-lg text-ink/70 leading-relaxed">
                Signverse blends realtime AI translation with guided lessons so Deaf individuals and allies can
                communicate clearly, comfortably, and consistently. One calm interface for everything you need.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link to="/register?role=deaf" className="btn-primary">
                  Get started
                </Link>
                <Link to="/learn" className="btn-secondary">
                  Browse lessons
                </Link>
              </div>
              <div className="flex gap-8 text-sm text-ink/70">
                <div>
                  <p className="text-3xl font-semibold text-ink">12k+</p>
                  <p>Translations this month</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-ink">98%</p>
                  <p>Avg. accuracy confidence</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-200/30 to-accent-200/40 blur-3xl" aria-hidden />
              <div className="relative grid gap-6">
                <div className="glass-panel p-4">
                  <p className="text-sm text-ink/60 mb-3">Realtime session</p>
                  <div className="relative rounded-3xl overflow-hidden border border-white/70 shadow-card">
                    <img
                      src={deafUserSigning}
                      alt="Deaf user signing in front of webcam"
                      className="h-52 w-full object-cover"
                    />
                    <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 text-sm font-semibold shadow-card">
                      Live confidence • 97%
                    </span>
                  </div>
                </div>

                <div className="glass-panel p-4">
                  <p className="text-sm text-ink/60 mb-3">Learner feedback</p>
                  <div className="rounded-3xl overflow-hidden border border-white/70 shadow-card">
                    <img
                      src={learnerMimicking}
                      alt="Learner mimicking sign"
                      className="h-48 w-full object-cover"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div>
                      <p className="font-semibold text-ink">Session streak</p>
                      <p className="text-ink/60">8 days in flow</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-brand-600 font-semibold">
                      • Steady rhythm
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-shell">
        <div className="text-center mb-12">
          <p className="section-eyebrow">Designed for comfort</p>
          <h2 className="text-3xl font-semibold mb-4">Everything you need, in one calming space</h2>
          <p className="text-ink/70 text-lg max-w-3xl mx-auto">
            We polish every interaction—from the glow of buttons to the pacing of tips—so practicing feels effortless.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <div key={feature.title} className="surface-card p-6 flex gap-4">
              <div className="h-12 w-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center text-xl">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-ink/70">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Journey */}
      <section className="section-shell">
        <div className="surface-card p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-3">
            {journeySteps.map((step) => (
              <div key={step.label} className="space-y-4">
                <span className="text-sm font-semibold text-brand-600">{step.label}</span>
                <h3 className="text-2xl font-semibold">{step.title}</h3>
                <p className="text-ink/70 leading-relaxed">{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-shell">
        <div className="surface-card surface-card-emphasis p-10 text-center">
          <p className="section-eyebrow mx-auto mb-3">Ready when you are</p>
          <h3 className="text-3xl font-semibold mb-4">Signverse adapts to you—no pressure, just gentle progress.</h3>
          <p className="text-lg text-ink/70 max-w-3xl mx-auto mb-8">
            Start translating instantly, explore the learning studio, and keep your practice journey in a cozy, modern interface.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary">
              Create your Signverse profile
            </Link>
            <Link to="/translate" className="btn-secondary">
              Try the translator
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;