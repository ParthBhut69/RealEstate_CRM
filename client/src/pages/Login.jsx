import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);
  const { login, verifyOTP } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (requires2FA) {
      const result = await verifyOTP(email, otp);
      setLoading(false);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
      return;
    }

    const result = await login(email, password);
    setLoading(false);
    if (result.requires2FA) {
      setRequires2FA(true);
    } else if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <span className="text-white font-bold text-xl">B</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
          {requires2FA ? 'Verify it\'s you' : 'Sign in to your account'}
        </h2>
        {!requires2FA && (
          <p className="mt-2 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">Create one</Link>
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            {requires2FA ? (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-slate-700">
                  Verification Code
                </label>
                <p className="mt-1 text-xs text-slate-500">Enter the 6-digit code sent to your email.</p>
                <div className="mt-2">
                  <input
                    id="otp" name="otp" type="text" required maxLength="6"
                    value={otp} onChange={(e) => setOtp(e.target.value)}
                    className="block w-full text-center text-2xl tracking-widest appearance-none rounded-xl border border-slate-200 px-3 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    placeholder="000000"
                  />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email" name="email" type="email" autoComplete="email" required
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      className="block w-full appearance-none rounded-xl border border-slate-200 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password" name="password" type="password" autoComplete="current-password" required
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      className="block w-full appearance-none rounded-xl border border-slate-200 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me" name="remember-me" type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link to="/forgot-password" size="sm" className="font-medium text-blue-600 hover:text-blue-500">
                      Forgot your password?
                    </Link>
                  </div>
                </div>
              </>
            )}

            <div>
              <button
                type="submit" disabled={loading}
                className="flex w-full justify-center rounded-xl border border-transparent bg-blue-600 py-2.5 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-60"
              >
                {loading ? (requires2FA ? 'Verifying...' : 'Signing in...') : (requires2FA ? 'Verify Code' : 'Sign in')}
              </button>
            </div>
            
            {requires2FA && (
              <button
                type="button"
                onClick={() => setRequires2FA(false)}
                className="w-full text-center text-sm text-slate-500 hover:text-slate-700"
              >
                Back to sign in
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
