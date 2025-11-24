import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const guestLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Rights', to: '/rights' },
  { label: 'Help', to: '/help' }
];

const authLinks = [
  { label: 'Translate', to: '/translate' },
  { label: 'Learn', to: '/learn' },
  { label: 'Self Assessment', to: '/learn?view=assessment' },
  { label: 'Rights', to: '/rights' },
  { label: 'Profile', to: '/profile' }
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = user ? authLinks : guestLinks;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsMenuOpen(false);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const linkClasses = ({ isActive }) =>
    `text-xs sm:text-sm font-semibold tracking-wide uppercase px-3.5 py-1.5 rounded-full border border-transparent transition-all duration-200 ${
      isActive
        ? 'text-white bg-gradient-to-r from-brand-500 to-accent-500 shadow-card'
        : 'text-ink/70 hover:text-ink hover:border-white/60 hover:bg-white/70'
    }`;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-4 py-5">
        <nav className="glass-panel px-5 py-3.5 flex items-center justify-between relative overflow-visible">
          <Link to="/" className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white text-2xl shadow-glow">
              🤟
            </span>
            <div>
              <p className="text-base font-semibold text-ink">Signverse</p>
              <p className="text-xs text-ink/60">Inclusive communication</p>
            </div>
          </Link>

          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-ink/70 hover:text-ink"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            <span className="text-2xl">{isMenuOpen ? '✕' : '☰'}</span>
          </button>

          <div
            className={`${
              isMenuOpen ? 'flex' : 'hidden'
            } absolute left-4 right-4 top-[76px] flex-col gap-4 rounded-2xl border border-white/60 bg-white/90 p-4 shadow-soft md:static md:flex md:flex-row md:items-center md:gap-6 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={linkClasses}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            {user ? (
              <button
                onClick={handleLogout}
                className="btn-ghost text-sm font-semibold text-red-600 hover:text-white hover:bg-red-500/90"
              >
                Logout
              </button>
            ) : (
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <Link
                  to="/login"
                  className="btn-ghost"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create account
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

