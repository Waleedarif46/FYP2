import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-[#050A1A] text-white overflow-hidden">
      <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.25),_transparent_55%)]" aria-hidden />
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_bottom,_rgba(6,182,212,0.3),_transparent_60%)]" aria-hidden />
      <div className="absolute inset-0 bg-grid-light bg-[length:22px_22px] opacity-10" aria-hidden />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <p className="section-eyebrow bg-white/10 text-white">Welcome back</p>
            <h1 className="text-4xl font-display font-semibold leading-tight">
              A calmer way to learn, translate, and stay connected with the Deaf community.
            </h1>
            <p className="text-base text-white/70 leading-relaxed">
              Signverse blends modern AI translation with thoughtful lessons and a supportive community.
              Pick up where you left off or start your journey in a space designed for clarity and care.
            </p>
            <div className="flex gap-4 text-sm text-white/70">
              <div>
                <p className="text-3xl font-bold text-white">20k+</p>
                <p>Signs practiced</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">120+</p>
                <p>Daily learners</p>
              </div>
            </div>
          </div>

          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;