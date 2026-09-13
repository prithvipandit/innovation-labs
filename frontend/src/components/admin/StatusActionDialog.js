import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Reusable confirm-with-note dialog for admin actions that should always be a
// deliberate choice (rejecting a request, cancelling a booking) and may carry
// an explanation back to the customer.
export default function StatusActionDialog({
  triggerLabel,
  triggerVariant = 'outline',
  triggerTestId,
  title,
  description,
  confirmLabel = 'Confirm',
  onConfirm,
}) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm(note);
      setOpen(false);
      setNote('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant={triggerVariant} className="rounded-full" data-testid={triggerTestId}>
          {triggerLabel}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <Textarea
          placeholder="Optional note to send to the customer..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          data-testid="status-action-note"
        />
        <AlertDialogFooter>
          <AlertDialogCancel disabled={submitting}>Back</AlertDialogCancel>
          <Button onClick={handleConfirm} disabled={submitting} data-testid="status-action-confirm">
            {submitting ? 'Saving...' : confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
