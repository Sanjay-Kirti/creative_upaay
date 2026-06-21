import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import UnderlineInput from '../components/UnderlineInput';
import toast from 'react-hot-toast';
import { appIcon } from '../assets/images';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(loginData.email, loginData.password);
    } catch {
      // error handled in hook
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!signupData.name || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await signup(signupData.name, signupData.email, signupData.password);
    } catch {
      // error handled in hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-page-bg flex flex-col items-center px-4 pt-20 pb-10">
      {/* App Icon */}
      <div className="flex items-center gap-1 mb-5">
        <img src={appIcon} alt="Creative Upaay" className="w-10 h-10 object-contain" />
      </div>

      {/* Title */}
      <h1 className="text-xl font-bold text-text-primary text-center">Creative Upaay</h1>
      <h2 className="text-xl font-bold text-text-primary text-center mb-10">Hiring Assignment</h2>

      {/* Tab Toggle */}
      <div className="flex w-full max-w-[280px] bg-gray-200 rounded-full p-1 mb-10">
        <button
          id="login-tab"
          onClick={() => setActiveTab('login')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-full transition-colors ${activeTab === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
        >
          Login
        </button>
        <button
          id="signup-tab"
          onClick={() => setActiveTab('signup')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-full transition-colors ${activeTab === 'signup' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
        >
          Sign Up
        </button>
      </div>

      {/* Login Form */}
      {activeTab === 'login' && (
        <form onSubmit={handleLogin} className="w-full space-y-6 flex-1 flex flex-col">
          <div className="space-y-6 flex-1">
            <UnderlineInput
              id="login-email"
              type="email"
              placeholder="Email ID"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            />
            <UnderlineInput
              id="login-password"
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />
            <p className="text-xs text-gray-400 mt-2">Demo: demo@movieapp.com / demo1234</p>
          </div>
          <div className="mt-auto pt-10">
            <button
              id="login-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      )}

      {/* Sign Up Form */}
      {activeTab === 'signup' && (
        <form onSubmit={handleSignup} className="w-full space-y-6 flex-1 flex flex-col">
          <div className="space-y-6 flex-1">
            <UnderlineInput
              id="signup-name"
              type="text"
              placeholder="Name"
              value={signupData.name}
              onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
            />
            <UnderlineInput
              id="signup-email"
              type="email"
              placeholder="Email ID"
              value={signupData.email}
              onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
            />
            <UnderlineInput
              id="signup-password"
              type="password"
              placeholder="Password"
              value={signupData.password}
              onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
            />
            <UnderlineInput
              id="signup-confirm"
              type="password"
              placeholder="Confirm Password"
              value={signupData.confirmPassword}
              onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
            />
          </div>
          <div className="mt-auto pt-10">
            <button
              id="signup-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default LoginPage;
