import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { BACKEND_URL } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Landing on the login page means any previous session is no longer
    // usable — drop it so a stale/expired token can't leak into later calls.
    logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Plain axios, not the api instance — its interceptor would attach
      // a stored token automatically, and login must go out unauthenticated.
      const response = await axios.post(`${BACKEND_URL}/login`, credentials);
      login({
        token: response.data.token,
        refreshToken: response.data.refreshToken,
        username: credentials.username,
      });
      toast.success(response.data.message || 'Login successful!');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 500);
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.detail || error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF6B6B] via-[#FFD93D] to-[#4D96FF] flex items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-3xl p-8 shadow-2xl bg-white">
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <img 
              src="https://customer-assets.emergentagent.com/job_dfb65b39-8dbe-4dfd-94f2-b15734a08e64/artifacts/rx6a5jtl_little_wings_logo.jpeg" 
              alt="Little Wings Logo" 
              className="h-16 w-auto mx-auto"
            />
          </div>
          <h1 className="text-3xl font-bold font-heading text-[#2D3436]">Admin Login</h1>
          <p className="text-[#636E72] mt-2">Access the dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-[#2D3436]">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#636E72]" />
              <Input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="pl-10 rounded-xl border-2"
                placeholder="Enter username"
                required
                data-testid="admin-username-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#2D3436]">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#636E72]" />
              <Input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="pl-10 rounded-xl border-2"
                placeholder="Enter password"
                required
                data-testid="admin-password-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full py-6 text-lg font-bold bg-[#FF6B6B] hover:bg-[#FF5252] text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="admin-login-btn"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="flex justify-between text-sm">
            <Link to="/forgot-password" className="text-[#4D96FF] hover:underline" data-testid="forgot-password-link">
              Forgot password?
            </Link>
            <Link to="/register" className="text-[#4D96FF] hover:underline" data-testid="register-link">
              Create an account
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
