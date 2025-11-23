import React from 'react';

const Dictionary = () => {
  return (
    <div className="page-shell space-y-10 text-center">
      <section className="space-y-4">
        <p className="section-eyebrow mx-auto">Signverse Library</p>
        <h1 className="text-4xl font-semibold">Sign Language Dictionary</h1>
        <p className="text-lg text-ink/70 max-w-3xl mx-auto">
          We’re carefully curating thousands of ASL gestures with notes from Deaf mentors, pronunciation tips, and looping clips.
        </p>
      </section>

      <section className="surface-card surface-card-emphasis py-16 px-8">
        <div className="text-6xl mb-6">📚</div>
        <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
        <p className="text-ink/70 max-w-3xl mx-auto">
          Our team is polishing a beautiful dictionary experience with smart search, saved decks, and multi-angle video captures.
          Stay tuned—the wait will be worth it.
        </p>
      </section>
    </div>
  );
};

export default Dictionary;

