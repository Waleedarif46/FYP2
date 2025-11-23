import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Footer = () => {
  const { user } = useAuth();

  if (user) {
    return null;
  }

  return (
    <footer className="mt-16 bg-gradient-to-b from-white via-white to-brand-50/60 border-t border-white/60">
      <div className="page-shell pt-16 pb-10 space-y-12">
        <div className="surface-card surface-card-emphasis p-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="section-eyebrow mb-3">Join our community</p>
            <h3 className="text-2xl font-semibold text-ink">
              Become part of the most supportive sign language platform
            </h3>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/register" className="btn-primary">
              Create free account
            </Link>
            <Link to="/about" className="btn-secondary">
              Explore Signverse
            </Link>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white text-2xl shadow-glow">
                🤟
              </span>
              <div>
                <p className="text-lg font-semibold text-ink">Signverse</p>
                <p className="text-sm text-ink/60">Empathy-led technology</p>
              </div>
            </div>
            <p className="text-sm text-ink/70 leading-relaxed">
              A calm, modern home for practicing, translating, and celebrating sign language together.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ink tracking-wide uppercase mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-ink/70">
              <li>
                <Link to="/help" className="hover:text-ink">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-ink">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-ink">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ink tracking-wide uppercase mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-ink/70">
              <li>Email: hello@signverse.com</li>
              <li>Support: support@signverse.com</li>
              <li>HQ: Seattle, WA</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ink tracking-wide uppercase mb-4">Stay connected</h4>
            <p className="text-sm text-ink/70 mb-4">
              Follow our journey and learn about new releases.
            </p>
            <div className="flex gap-3 text-ink/70">
              <a
                href="https://facebook.com/signverse"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="btn-ghost"
              >
                <FaFacebook />
              </a>
              <a
                href="https://twitter.com/signverse"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="btn-ghost"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com/signverse"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="btn-ghost"
              >
                <FaInstagram />
              </a>
              <a
                href="https://linkedin.com/company/signverse"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="btn-ghost"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/70 text-center text-sm text-ink/60">
          © {new Date().getFullYear()} Signverse. Crafted with accessibility in mind.
        </div>
      </div>
    </footer>
  );
};

export default Footer;