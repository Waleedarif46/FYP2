import React from 'react';
import { Link } from 'react-router-dom';

const pillars = [
  {
    icon: '🎯',
    title: 'Vision',
    copy: 'A world where sign language feels natural, modern, and celebrated everywhere.'
  },
  {
    icon: '💡',
    title: 'Innovation',
    copy: 'Realtime AI translation, guided curricula, and sensory-friendly UI choices.'
  },
  {
    icon: '🤝',
    title: 'Community',
    copy: 'Bridging Deaf and hearing communities with trust, empathy, and shared growth.'
  }
];

const About = () => {
  return (
    <div className="page-shell space-y-12">
      <section className="surface-card surface-card-emphasis p-10 text-center space-y-6">
        <p className="section-eyebrow mx-auto">About Signverse</p>
        <h1 className="text-4xl font-semibold">
          We craft calm technology so sign language feels even more human.
        </h1>
        <p className="text-lg text-ink/70 max-w-3xl mx-auto">
          Signverse started with a simple idea: the tools we use to communicate should be as kind as the people using them.
          Our platform blends thoughtful design, inclusive community building, and expressive AI translation.
        </p>
      </section>

      <section className="surface-card p-10 space-y-6">
        <h2 className="text-3xl font-semibold">Our mission</h2>
        <p className="text-lg text-ink/70 leading-relaxed">
          We are committed to breaking down communication barriers between Deaf and hearing communities
          by making sign language discovery more accessible, playful, and dignified. Every pixel, animation,
          and prompt inside Signverse is tuned to reduce anxiety and keep learners motivated.
        </p>
        <p className="text-lg text-ink/70 leading-relaxed">
          From realtime webcam translations to curated practice decks, we prioritize tools that amplify
          connection, protect privacy, and celebrate the beauty of signing.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {pillars.map((pillar) => (
          <div key={pillar.title} className="surface-card p-6 text-center space-y-3">
            <div className="text-4xl">{pillar.icon}</div>
            <h3 className="text-xl font-semibold">{pillar.title}</h3>
            <p className="text-ink/70">{pillar.copy}</p>
          </div>
        ))}
      </section>

    </div>
  );
};

export default About;

