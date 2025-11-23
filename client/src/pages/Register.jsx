import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'deaf'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(registerData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        setRegisteredEmail(formData.email);
        setFormData({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'deaf'
        });
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="surface-card rounded-[32px] p-8 shadow-soft">
      <div className="text-center space-y-3 mb-8">
        <p className="section-eyebrow mx-auto">Create your space</p>
        <h2 className="text-3xl font-semibold text-ink">Sign up for Signverse</h2>
        <p className="text-sm text-ink/60">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 font-semibold hover:text-brand-500">
            Sign in
          </Link>
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-2xl border border-green-100 bg-green-50 px-4 py-4 text-left">
          <p className="text-sm font-semibold text-green-700">{success}</p>
          <p className="text-sm text-green-700/80 mt-2">
            We emailed a verification link to <strong>{registeredEmail}</strong>.
          </p>
          <p className="text-xs text-green-700/70 mt-1">Check your inbox to activate your profile.</p>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium text-ink">
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Taylor Morgan"
            required
            value={formData.fullName}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-ink">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@email.com"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-ink">
            Password (min. 6 characters)
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="input-field pr-24"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 text-sm font-semibold text-ink/60 hover:text-ink"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-ink">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="Repeat your password"
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center disabled:opacity-60"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="text-xs text-ink/50 text-center mt-6">
        By creating an account you agree to our{' '}
        <Link to="/terms" className="text-brand-600 font-medium">
          Terms
        </Link>{' '}
        and{' '}
        <Link to="/privacy" className="text-brand-600 font-medium">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
};

export default Register;
