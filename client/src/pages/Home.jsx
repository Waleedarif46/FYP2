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
    <div className="page-shell space-y-8 lg:space-y-10">
      {/* Hero */}
      <section className="section-shell pt-4 md:pt-6 pb-6">
        <div className="surface-card surface-card-emphasis">
          <div className="grid gap-8 lg:grid-cols-2 p-8 lg:p-12">
            <div className="space-y-5">
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
              <div className="flex gap-6 text-sm text-ink/70">
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
              <div className="relative grid gap-5">
                <div className="glass-panel p-4">
                  <p className="text-sm text-ink/60 mb-3">Realtime session</p>
                  <div className="relative rounded-3xl border border-white/70 shadow-card bg-white/80 p-3">
                    <img
                      src={deafUserSigning}
                      alt="Deaf user signing in front of webcam"
                      className="w-full max-h-64 object-contain rounded-2xl"
                    />
                    <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 text-sm font-semibold shadow-card">
                      Live confidence • 97%
                    </span>
                  </div>
                </div>

                <div className="glass-panel p-4">
                  <p className="text-sm text-ink/60 mb-3">Learner feedback</p>
                  <div className="rounded-3xl border border-white/70 shadow-card bg-white/80 p-3">
                    <img
                      src={learnerMimicking}
                      alt="Learner mimicking sign"
                      className="w-full max-h-60 object-contain rounded-2xl"
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
      <section className="section-shell py-6 md:py-8">
        <div className="text-center mb-8">
          <p className="section-eyebrow">Designed for comfort</p>
          <h2 className="text-3xl font-semibold mb-4">Everything you need, in one calming space</h2>
          <p className="text-ink/70 text-lg max-w-3xl mx-auto">
            We polish every interaction—from the glow of buttons to the pacing of tips—so practicing feels effortless.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
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
      <section className="section-shell py-6 md:py-8">
        <div className="surface-card p-8 lg:p-9">
          <div className="grid gap-6 lg:grid-cols-3">
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

      {/* Rights & Opportunities */}
      <section className="section-shell py-6 md:py-8">
        <div className="surface-card p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <p className="section-eyebrow w-fit">Rights & opportunities</p>
              <h3 className="text-3xl font-semibold text-ink">Champion your career with clear protections</h3>
              <p className="text-ink/70">
                From workplace accommodations to hiring quotas, Signverse keeps you informed about the policies
                that protect deaf professionals around the globe. Explore practical guides and connect with advocates
                who can stand beside you.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/rights" className="btn-primary">
                  Explore rights & quotas
                </Link>
                <Link to="/learn?view=assessment" className="btn-secondary">
                  Prepare with Self Assessment
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="glass-panel p-4">
                <p className="text-sm text-ink/60 uppercase tracking-wide">Workplace accommodations</p>
                <p className="text-ink/70">
                  Request interpreters, captioning, and adaptive tooling—employers are required to respond unless it
                  causes undue hardship.
                </p>
              </div>
              <div className="glass-panel p-4">
                <p className="text-sm text-ink/60 uppercase tracking-wide">Global hiring quotas</p>
                <p className="text-ink/70">
                  India’s RPWD Act, Brazil’s Lei de Cotas, and EU incentives all reserve roles for deaf talent. Know
                  which programs apply to you.
                </p>
              </div>
              <div className="glass-panel p-4">
                <p className="text-sm text-ink/60 uppercase tracking-wide">Support networks</p>
                <p className="text-ink/70">
                  Legal helplines and NGOs worldwide can help you file complaints, draft letters, and celebrate career
                  wins.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;