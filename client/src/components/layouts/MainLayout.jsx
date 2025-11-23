import React from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#f7f9ff] via-white to-[#eef2ff] text-ink overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-hero-gradient opacity-80" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-grid-light bg-[length:22px_22px] opacity-20" aria-hidden />

      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;

