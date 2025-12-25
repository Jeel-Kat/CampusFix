import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import FullPageLoader from '../components/FullPageLoader';
import {
  LogIn,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader,
} from 'lucide-react';

const Login = () => {
  const { loginWithGoogle, loginWithEmail, signupWithEmail, currentUser, loading } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
  });

  if (currentUser && loading) {
    return <FullPageLoader />;
  }

  if (currentUser && !loading) {
    return <Navigate to="/" />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleGoogleLogin = async () => {
    try {
      setProcessing(true);
      setError('');
      await loginWithGoogle();
    } catch (err) {
      setError(err.message || 'Google login failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill all fields');
      return;
    }

    if (isSignup && !formData.displayName) {
      setError('Name is required');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setProcessing(true);
      if (isSignup) {
        await signupWithEmail(
          formData.email,
          formData.password,
          formData.displayName
        );
      } else {
        await loginWithEmail(formData.email, formData.password);
      }
    } catch (err) {
      let message = err.message;
      if (err.code === 'auth/user-not-found') {
        message = 'No account found with this email';
      } else if (err.code === 'auth/wrong-password') {
        message = 'Incorrect password';
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'Email already in use';
      } else if (err.code === 'auth/weak-password') {
        message = 'Password is too weak';
      }
      setError(message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      {/* Back Link */}
      <Link
        to="/"
        className="absolute top-6 left-6 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        ← Back to Home
      </Link>

      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              CampusFix
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {isSignup
                ? 'Create a new account'
                : 'Sign in to lodge or track complaints'}
            </p>
          </div>

          {error && (
            <div className="mb-4 border border-red-300 bg-red-50 text-red-700 text-sm rounded-md p-3">
              {error}
            </div>
          )}

          {/* Toggle */}
          <div className="flex mb-6 border border-gray-200 rounded-md overflow-hidden">
            <button
              onClick={() => { setIsSignup(false); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium ${
                !isSignup
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsSignup(true); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium ${
                isSignup
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
            {isSignup && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                    disabled={processing || loading}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                  disabled={processing || loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                  disabled={processing || loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={processing || loading}
              className="w-full flex items-center justify-center gap-2 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition disabled:opacity-60"
            >
              {processing ? <Loader size={18} className="animate-spin" /> : <LogIn size={18} />}
              {processing ? 'Processing...' : isSignup ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-xs text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={processing || loading}
            className="w-full border border-gray-300 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition disabled:opacity-60"
          >
            Continue with Google
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          By continuing, you agree to the Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Login;
