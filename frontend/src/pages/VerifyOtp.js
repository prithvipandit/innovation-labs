import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { BACKEND_URL } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [username, setUsername] = useState(location.state?.username || '');
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);

  const handleOtpChange = (value) => {
    setOtp(value);
    if (otpError) setOtpError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error('Enter the 6-digit OTP sent to your email');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/verify-registration-otp`, {
        username: username.trim(),
        email: email.trim(),
        otp,
      });
      // The backend always answers 200 here, even for a wrong/expired OTP — it only
      // signals failure via a null token and a message like "Invalid or expired OTP".
      // So success has to be judged by "did we actually get a token", not by the
      // request not throwing.
      if (!response.data?.token) {
        toast.error(response.data?.message || 'Invalid OTP. Please try again.');
        setOtp('');
        setOtpError(true);
        setShakeCount((count) => count + 1);
        return;
      }
      // Verification logs the account straight in — no separate login step needed.
      login({
        token: response.data.token,
        refreshToken: response.data.refreshToken,
        username: username.trim(),
      });
      toast.success(response.data?.message || 'Account verified!');
      navigate('/account');
    } catch (error) {
      // Wrong/expired OTP: stay put, flag the field, and let them try again
      // rather than bouncing them out of the flow.
      toast.error(error.response?.data?.detail || error.response?.data?.message || 'Invalid OTP. Please try again.');
      setOtp('');
      setOtpError(true);
      setShakeCount((count) => count + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF6B6B] via-[#FFD93D] to-[#4D96FF] flex items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-3xl p-8 shadow-2xl bg-white">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-heading text-[#2D3436]">Verify Your Email</h1>
          <p className="text-[#636E72] mt-2">Enter the OTP sent to your email to activate your account</p>
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
                required
                data-testid="verify-otp-username-input"
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
                required
                data-testid="verify-otp-email-input"
              />
            </div>
          </div>

          <div key={shakeCount} className={otpError ? 'animate-shake' : ''}>
            <label className="block text-sm font-medium mb-2 text-[#2D3436]">OTP Code</label>
            <InputOTP maxLength={6} value={otp} onChange={handleOtpChange} data-testid="verify-otp-code-input">
              <InputOTPGroup>
                <InputOTPSlot index={0} className={otpError ? 'border-red-500 text-red-600' : ''} />
                <InputOTPSlot index={1} className={otpError ? 'border-red-500 text-red-600' : ''} />
                <InputOTPSlot index={2} className={otpError ? 'border-red-500 text-red-600' : ''} />
                <InputOTPSlot index={3} className={otpError ? 'border-red-500 text-red-600' : ''} />
                <InputOTPSlot index={4} className={otpError ? 'border-red-500 text-red-600' : ''} />
                <InputOTPSlot index={5} className={otpError ? 'border-red-500 text-red-600' : ''} />
              </InputOTPGroup>
            </InputOTP>
            {otpError && (
              <p className="text-sm text-red-600 mt-2" data-testid="verify-otp-error">
                Incorrect OTP. Please check your email and try again.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full py-6 text-lg font-bold bg-[#FF6B6B] hover:bg-[#FF5252] text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="verify-otp-submit-btn"
          >
            {loading ? 'Verifying...' : 'Verify Account'}
          </button>
        </form>

        <div className="flex justify-between text-sm mt-6">
          <Link to="/register" className="font-semibold text-[#4D96FF] hover:underline" data-testid="verify-otp-register-different-link">
            Create a different account
          </Link>
          <Link to="/login" className="font-semibold text-[#4D96FF] hover:underline" data-testid="verify-otp-back-to-login-link">
            Back to login
          </Link>
        </div>
      </Card>
    </div>
  );
}
