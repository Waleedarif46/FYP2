import React from 'react';
import { Link } from 'react-router-dom';
import { rightsHighlights, quotaSnapshots, advocacyResources } from '../data/rightsData';

const Rights = () => (
  <div className="page-shell space-y-10">
    <header className="text-center space-y-4">
      <p className="section-eyebrow mx-auto">Rights & Opportunities</p>
      <h1 className="text-4xl font-semibold text-ink">Job Quotas & Deaf Rights Worldwide</h1>
      <p className="text-ink/70 max-w-3xl mx-auto">
        Understand the policies that protect deaf professionals, explore global hiring quotas, and discover
        organisations ready to support your career journey.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/learn?view=assessment" className="btn-primary">
          Build skills with Self Assessment
        </Link>
        <a
          className="btn-secondary"
          href="https://www.un.org/development/desa/disabilities/"
          target="_blank"
          rel="noreferrer"
        >
          Global disability laws
        </a>
      </div>
    </header>

    <section className="space-y-6">
      <div className="surface-card p-8 lg:p-10">
        <h2 className="text-3xl font-semibold text-ink mb-5">Your workplace rights</h2>
        <p className="text-ink/70 mb-6">
          Most countries recognise that deaf professionals deserve the same career paths, pay, and protections.
          These core rights apply no matter where you work, and you can reference them when discussing
          accommodations with an employer.
        </p>
        <div className="grid gap-5 lg:grid-cols-3">
          {rightsHighlights.map((item) => (
            <div key={item.title} className="glass-panel p-5 flex flex-col">
              <p className="text-sm font-semibold text-brand-600 mb-2">{item.title}</p>
              <p className="text-ink/70 flex-1">{item.description}</p>
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center text-brand-600 font-semibold"
              >
                {item.linkLabel}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="surface-card surface-card-emphasis p-8 lg:p-10 space-y-6">
      <div className="flex flex-col gap-2">
        <p className="section-eyebrow w-fit">Global snapshots</p>
        <h2 className="text-2xl font-semibold text-ink">Job quota policies to know</h2>
        <p className="text-ink/70">
          Many regions require public or private employers to hire a percentage of people with disabilities.
          Understanding these frameworks helps when searching and advocating for fair opportunities.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {quotaSnapshots.map((quota) => (
          <div key={quota.region} className="glass-panel p-4">
            <p className="text-sm font-semibold text-brand-600 uppercase">{quota.region}</p>
            <h3 className="text-lg font-semibold text-ink mt-1">{quota.policy}</h3>
            <p className="text-ink/70 mt-2 text-sm">{quota.detail}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="surface-card p-8 lg:p-10 space-y-5">
      <h2 className="text-2xl font-semibold text-ink">Support & advocacy partners</h2>
      <p className="text-ink/70">
        Connect with organisations and legal teams who specialise in deaf rights, accessibility, and career
        coaching. They can help you review contracts, request accommodations, and report discrimination.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {advocacyResources.map((resource) => (
          <div key={resource.title} className="glass-panel p-5 flex flex-col">
            <h3 className="text-xl font-semibold text-ink">{resource.title}</h3>
            <p className="text-ink/70 flex-1">{resource.description}</p>
            <a href={resource.link} target="_blank" rel="noreferrer" className="text-brand-600 font-semibold">
              Visit site →
            </a>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default Rights;

