import { useContext, useState } from 'react';
import { FaEnvelope, FaLock, FaKey, FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import { authAPI } from '../services/api';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
    setPasswordError('');
    setPasswordSuccess('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError('New password must be different from current password');
      return;
    }

    setIsChangingPassword(true);
    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordSuccess('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'Failed to change password. Please check your current password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const fields = [
    { id: 'currentPassword', label: 'Current password', icon: <FaKey />, key: 'current' },
    { id: 'newPassword', label: 'New password', icon: <FaLock />, key: 'new' },
    { id: 'confirmPassword', label: 'Confirm new password', icon: <FaLock />, key: 'confirm' }
  ];

  return (
    <div className="page-shell space-y-10">
      <div className="text-center space-y-3">
        <p className="section-eyebrow mx-auto">Profile</p>
        <h1 className="text-4xl font-semibold text-ink">Your Signverse Space</h1>
        <p className="text-lg text-ink/70">Review personal details and keep your account secure.</p>
      </div>

      <div className="space-y-8">
        <div className="surface-card p-8 space-y-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-brand-500 to-accent-500 text-white text-4xl font-semibold flex items-center justify-center shadow-glow">
              {user?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-ink">{user?.fullName || 'User'}</h2>
              <p className="text-ink/60 flex items-center gap-2 mt-2">
                <FaEnvelope className="text-brand-500" />
                {user?.email}
              </p>
            </div>
          </div>

          <div className="grid gap-4 mt-4 md:grid-cols-2">
            <div className="glass-panel p-4">
              <p className="text-sm text-ink/60">Full name</p>
              <p className="text-lg font-semibold text-ink mt-1">{user?.fullName || 'Not set'}</p>
            </div>
            <div className="glass-panel p-4">
              <p className="text-sm text-ink/60">Email address</p>
              <p className="text-lg font-semibold text-ink mt-1">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="surface-card p-8">
          <div className="flex items-center gap-2 mb-6">
            <FaLock className="text-brand-500" />
            <h2 className="text-xl font-semibold text-ink">Change password</h2>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            {passwordSuccess && (
              <div className="glass-panel border border-green-200 text-green-800 flex items-center gap-3 px-4 py-3 text-sm">
                <FaCheckCircle />
                {passwordSuccess}
              </div>
            )}

            {passwordError && (
              <div className="glass-panel border border-red-200 text-red-700 px-4 py-3 text-sm">
                {passwordError}
              </div>
            )}

            {fields.map(({ id, label, icon, key }) => (
              <div key={id}>
                <label htmlFor={id} className="text-sm font-medium text-ink mb-2 block">
                  {label}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-ink/30">
                    {icon}
                  </div>
                  <input
                    type={showPasswords[key] ? 'text' : 'password'}
                    id={id}
                    name={id}
                    value={passwordData[id]}
                    onChange={handlePasswordChange}
                    className="input-field pl-12"
                    placeholder={label}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility(key)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-ink/40"
                  >
                    {showPasswords[key] ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {id === 'newPassword' && (
                  <p className="text-xs text-ink/50 mt-1">Must be at least 6 characters long.</p>
                )}
              </div>
            ))}

            <div className="flex justify-end">
              <button type="submit" disabled={isChangingPassword} className="btn-primary px-8 disabled:opacity-60">
                {isChangingPassword ? 'Updating…' : 'Update password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
