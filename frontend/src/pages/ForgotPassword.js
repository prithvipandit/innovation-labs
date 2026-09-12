import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { BACKEND_URL } from '@/lib/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() && !email.trim()) {
      toast.error('Enter your username or email');
      return;
    }

    setLoading(true);
    try {
      const payload = {};
      if (username.trim()) payload.username = username.trim();
      if (email.trim()) payload.email = email.trim();

      const response = await axios.post(`${BACKEND_URL}/forgot-password`, payload);
      toast.success(response.data?.message || 'OTP sent to your email');
      navigate('/reset-password', { state: { username: username.trim() } });
    } catch (error) {
      toast.error(error.response?.data?.detail || error.response?.data?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF6B6B] via-[#FFD93D] to-[#4D96FF] flex items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-3xl p-8 shadow-2xl bg-white">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-heading text-[#2D3436]">Forgot Password</h1>
          <p className="text-[#636E72] mt-2">We'll email you an OTP to reset your password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-[#2D3436]">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#636E72]" />
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 rounded-xl border-2"
                placeholder="Your username"
                data-testid="forgot-password-username-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#2D3436]">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#636E72]" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 rounded-xl border-2"
                placeholder="Your email"
                data-testid="forgot-password-email-input"
              />
            </div>
            <p className="text-xs text-[#636E72] mt-1">Username or email is enough — you don't need both.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full py-6 text-lg font-bold bg-[#FF6B6B] hover:bg-[#FF5252] text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="forgot-password-submit-btn"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

        <p className="text-center text-sm text-[#636E72] mt-6">
          <Link to="/admin/login" className="font-semibold text-[#4D96FF] hover:underline">
            Back to login
          </Link>
        </p>
      </Card>
    </div>
  );
}
