import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Phone, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { BACKEND_URL } from '@/lib/api';

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { firstName, lastName, username, email, phone, password } = form;
      const response = await axios.post(`${BACKEND_URL}/register`, {
        firstName,
        lastName,
        username,
        email,
        phone,
        password,
      });
      toast.success(response.data?.message || 'Registration successful! Check your email for the OTP.');
      navigate('/verify-otp', { state: { username, email } });
    } catch (error) {
      toast.error(error.response?.data?.detail || error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF6B6B] via-[#FFD93D] to-[#4D96FF] flex items-center justify-center p-4 py-10">
      <Card className="w-full max-w-md rounded-3xl p-8 shadow-2xl bg-white">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-heading text-[#2D3436]">Create Account</h1>
          <p className="text-[#636E72] mt-2">Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-[#2D3436]">First Name</label>
              <Input
                type="text"
                value={form.firstName}
                onChange={update('firstName')}
                className="rounded-xl border-2"
                placeholder="First name"
                required
                data-testid="register-firstname-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-[#2D3436]">Last Name</label>
              <Input
                type="text"
                value={form.lastName}
                onChange={update('lastName')}
                className="rounded-xl border-2"
                placeholder="Last name"
                required
                data-testid="register-lastname-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#2D3436]">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#636E72]" />
              <Input
                type="text"
                value={form.username}
                onChange={update('username')}
                className="pl-10 rounded-xl border-2"
                placeholder="Choose a username"
                required
                data-testid="register-username-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#2D3436]">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#636E72]" />
              <Input
                type="email"
                value={form.email}
                onChange={update('email')}
                className="pl-10 rounded-xl border-2"
                placeholder="you@example.com"
                required
                data-testid="register-email-input"
              />
            </div>
            <p className="text-xs text-[#636E72] mt-1">We'll send a verification OTP to this email.</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#2D3436]">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#636E72]" />
              <Input
                type="tel"
                value={form.phone}
                onChange={update('phone')}
                className="pl-10 rounded-xl border-2"
                placeholder="Phone number"
                required
                data-testid="register-phone-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#2D3436]">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#636E72]" />
              <Input
                type="password"
                value={form.password}
                onChange={update('password')}
                className="pl-10 rounded-xl border-2"
                placeholder="Create a password"
                required
                minLength={8}
                data-testid="register-password-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#2D3436]">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#636E72]" />
              <Input
                type="password"
                value={form.confirmPassword}
                onChange={update('confirmPassword')}
                className="pl-10 rounded-xl border-2"
                placeholder="Re-enter your password"
                required
                data-testid="register-confirm-password-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full py-6 text-lg font-bold bg-[#FF6B6B] hover:bg-[#FF5252] text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="register-submit-btn"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-[#636E72] mt-6">
          Already have an account?{' '}
          <Link to="/admin/login" className="font-semibold text-[#4D96FF] hover:underline">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}
