import { useEffect, useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaExclamationCircle, FaSpinner, FaEnvelope } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendEmail, setResendEmail] = useState('');

  useEffect(() => {
    const verifyEmailToken = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. No token provided.');
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/auth/verify-email/${token}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          setStatus('success');
          setMessage(response.data.message);
          
          // Set user in context (auto-login)
          if (response.data.user) {
            setUser(response.data.user);
          }

          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
        }
      } catch (error) {
        setStatus('error');
        setMessage(
          error.response?.data?.message || 
          'Verification failed. The link may be expired or invalid.'
        );
      }
    };

    verifyEmailToken();
  }, [searchParams, navigate, setUser]);

  const handleResendEmail = async (e) => {
    e.preventDefault();
    
    if (!resendEmail) {
      return;
    }

    setIsResending(true);

    try {
      const response = await axios.post(
        `${API_URL}/auth/resend-verification`,
        { email: resendEmail },
        { withCredentials: true }
      );

      if (response.data.success) {
        setMessage(response.data.message);
        setResendEmail('');
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || 
        'Failed to resend verification email. Please try again.'
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Status Icon */}
          <div className="flex justify-center mb-6">
            {status === 'verifying' && (
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <FaSpinner className="text-blue-600 text-4xl animate-spin" />
              </div>
            )}
            {status === 'success' && (
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                <FaCheckCircle className="text-green-600 text-4xl" />
              </div>
            )}
            {status === 'error' && (
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <FaExclamationCircle className="text-red-600 text-4xl" />
              </div>
            )}
          </div>

          {/* Status Title */}
          <h1 className="text-2xl font-bold text-center mb-4">
            {status === 'verifying' && 'Verifying Your Email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </h1>

          {/* Status Message */}
          <p className="text-gray-600 text-center mb-6">
            {message || 'Please wait while we verify your email address.'}
          </p>

          {/* Success Actions */}
          {status === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-800 text-sm text-center">
                You will be redirected to your dashboard in a few seconds...
              </p>
            </div>
          )}

          {/* Error Actions - Resend Email Form */}
          {status === 'error' && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm text-center">
                  Your verification link may have expired. Enter your email below to receive a new one.
                </p>
              </div>

              <form onSubmit={handleResendEmail} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isResending}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isResending ? (
                    <span className="flex items-center justify-center">
                      <FaSpinner className="animate-spin mr-2" />
                      Sending...
                    </span>
                  ) : (
                    'Resend Verification Email'
                  )}
                </button>
              </form>

              <div className="text-center">
                <button
                  onClick={() => navigate('/login')}
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                >
                  Back to Login
                </button>
              </div>
            </div>
          )}

          {/* Verifying State */}
          {status === 'verifying' && (
            <div className="flex justify-center">
              <div className="animate-pulse text-gray-400 text-sm">
                This may take a few moments...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
