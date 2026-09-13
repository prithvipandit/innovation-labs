import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { BACKEND_URL } from '@/lib/api';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState(location.state?.username || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/reset-password`, {
        username: username.trim(),
        otp,
        newPassword,
      });
      // The backend always answers 200 here, even for a wrong/expired OTP — this
      // endpoint never returns a token to check, so the only signal available is the
      // message text. Every failure message from this endpoint ("Invalid or expired
      // OTP", "User not found", "New password cannot be empty") lacks the word
      // "successfully", which only the real success message contains.
      const succeeded = response.data?.message?.toLowerCase().includes('successfully');
      if (!succeeded) {
        toast.error(response.data?.message || 'Invalid OTP. Please try again.');
        setOtp('');
        setOtpError(true);
        setShakeCount((count) => count + 1);
        return;
      }
      toast.success(response.data?.message || 'Password reset successful! Please log in.');
      navigate('/login');
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
          <h1 className="text-3xl font-bold font-heading text-[#2D3436]">Reset Password</h1>
          <p className="text-[#636E72] mt-2">Enter the OTP from your email and choose a new password</p>
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
                data-testid="reset-password-username-input"
              />
            </div>
          </div>

          <div key={shakeCount} className={otpError ? 'animate-shake' : ''}>
            <label className="block text-sm font-medium mb-2 text-[#2D3436]">OTP Code</label>
            <InputOTP maxLength={6} value={otp} onChange={handleOtpChange} data-testid="reset-password-otp-input">
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
              <p className="text-sm text-red-600 mt-2" data-testid="reset-password-otp-error">
                Incorrect OTP. Please check your email and try again.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#2D3436]">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#636E72]" />
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-10 rounded-xl border-2"
                placeholder="New password"
                required
                minLength={8}
                data-testid="reset-password-new-password-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#2D3436]">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#636E72]" />
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 rounded-xl border-2"
                placeholder="Re-enter new password"
                required
                data-testid="reset-password-confirm-password-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full py-6 text-lg font-bold bg-[#FF6B6B] hover:bg-[#FF5252] text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="reset-password-submit-btn"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="flex justify-between text-sm mt-6">
          <Link to="/forgot-password" className="font-semibold text-[#4D96FF] hover:underline" data-testid="reset-password-restart-link">
            Use a different account
          </Link>
          <Link to="/login" className="font-semibold text-[#4D96FF] hover:underline" data-testid="reset-password-back-to-login-link">
            Back to login
          </Link>
        </div>
      </Card>
    </div>
  );
}
