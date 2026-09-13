import { Calendar, MapPin, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import RichText from '@/components/RichText';

export default function EventDetailsDialog({ event, open, onOpenChange }) {
  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto" data-testid="event-details-dialog">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading text-[#2D3436]">{event.title}</DialogTitle>
        </DialogHeader>
        <img src={event.image_url} alt={event.title} className="w-full h-56 object-cover rounded-2xl" />
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-[#636E72]">
            <Calendar className="w-4 h-4 text-[#4D96FF]" />
            <span>
              {new Date(event.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} - {new Date(event.end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#636E72]">
            <MapPin className="w-4 h-4 text-[#FF6B6B]" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#636E72]">
            <Users className="w-4 h-4 text-[#6BCB77]" />
            <span>{event.total_seats ?? 0} total seats</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-[#FF6B6B]">₹{event.price}</span>
          <span className="text-xs px-3 py-1 rounded-full bg-[#FFD93D] text-[#2D3436] font-semibold">Ages {event.age_group}</span>
        </div>
        <RichText text={event.description} className="text-[#636E72]" />
      </DialogContent>
    </Dialog>
  );
}
