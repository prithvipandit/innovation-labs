import { useNavigate } from 'react-router-dom';
import { UserPlus, LogIn, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export default function OnboardingDialog({ open, onOpenChange }) {
  const navigate = useNavigate();

  const go = (path) => {
    onOpenChange(false);
    navigate(path);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="onboarding-dialog">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading text-[#2D3436]">
            Welcome to Little Wings!
          </DialogTitle>
          <DialogDescription className="text-[#636E72]">
            Create an account to wishlist products, book event seats, and track your orders —
            or continue browsing as a guest.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-2">
          <Button
            className="w-full rounded-full bg-[#FF6B6B] hover:bg-[#FF5252] font-semibold"
            onClick={() => go('/register')}
            data-testid="onboarding-create-account-btn"
          >
            <UserPlus className="mr-2 w-4 h-4" /> Create Account
          </Button>
          <Button
            variant="outline"
            className="w-full rounded-full border-2 border-[#4D96FF] text-[#4D96FF] hover:bg-[#4D96FF] hover:text-white font-semibold"
            onClick={() => go('/login')}
            data-testid="onboarding-login-btn"
          >
            <LogIn className="mr-2 w-4 h-4" /> Login
          </Button>
          <Button
            variant="ghost"
            className="w-full rounded-full text-[#636E72]"
            onClick={() => onOpenChange(false)}
            data-testid="onboarding-continue-btn"
          >
            <Compass className="mr-2 w-4 h-4" /> Continue Browsing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
