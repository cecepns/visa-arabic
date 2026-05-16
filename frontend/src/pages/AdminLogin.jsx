import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Moon, Sun } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
export default function AdminLogin() {
  const [email, setEmail] = useState('admin@ksa.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ksa-dark-blue via-ksa-navy to-ksa-purple flex items-center justify-center p-4">
      <button onClick={toggleTheme} className="absolute top-4 right-4 text-white icon-btn">
        {darkMode ? <Sun /> : <Moon />}
      </button>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 text-white">
            <span className="text-4xl">🇸🇦</span>
            <div>
              <h1 className="text-2xl font-bold">KSA VISA</h1>
              <p className="text-white/70 text-sm">Admin Portal</p>
            </div>
          </Link>
        </div>
        <div className="card">
          <h2 className="text-2xl font-bold text-center mb-6 text-ksa-dark-blue dark:text-white">Admin Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pl-10" required />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              <LogIn className="w-5 h-5" />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            <Link to="/" className="text-ksa-purple hover:underline">Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
