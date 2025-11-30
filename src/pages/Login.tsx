import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { Lock, Mail, AlertCircle, Radio } from 'lucide-react';

const Login: React.FC = () => {
  const { login, error } = useStore();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (!email || !password) {
      setLoginError('Please enter both email and password');
      return;
    }

    setIsLoggingIn(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setLoginError(err.message || 'Invalid email or password');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Radio className="w-8 h-8 text-slate-900" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">TeleFlow</h1>
          <p className="text-slate-600">Enterprise Telecom Infrastructure Management</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>

          {/* Error Alert */}
          {(loginError || error) && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-rose-500 font-medium">Authentication Error</p>
                <p className="text-xs text-rose-400 mt-1">{loginError || error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-11 pr-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="superadmin@teleflow.com"
                  disabled={isLoggingIn}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-600 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-11 pr-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Enter your password"
                  disabled={isLoggingIn}
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-xs text-blue-400 font-medium mb-2">Demo Credentials:</p>
            <p className="text-xs text-slate-600">
              Email: <span className="text-blue-400 font-mono">superadmin@teleflow.com</span>
            </p>
            <p className="text-xs text-slate-600">
              Password: <span className="text-blue-400 font-mono">SuperAdmin@2024!</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-slate-500">
          v2.0.0 | Secure JWT Authentication
        </div>
      </div>
    </div>
  );
};

export default Login;
