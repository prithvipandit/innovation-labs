import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Users, Minus, Plus as PlusIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import WhatsAppButton from '@/components/WhatsAppButton';
import RichText from '@/components/RichText';
import SearchBar from '@/components/SearchBar';
import OnboardingDialog from '@/components/OnboardingDialog';
import { api, BACKEND_URL } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const API = `${BACKEND_URL}/api`;

const AGE_GROUPS = ['All', '5-7', '8-10', '11-14'];

export default function Events() {
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedAge, setSelectedAge] = useState('All');
  const [query, setQuery] = useState('');
  const [seats, setSeats] = useState({});
  const [submitting, setSubmitting] = useState({});
  const [showOnboarding, setShowOnboarding] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      const params = { size: 100 };
      if (query) params.q = query;
      if (selectedAge !== 'All') params.age_group = selectedAge;
      const response = await axios.get(`${API}/search/events`, { params });
      setEvents(response.data.content || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }, [query, selectedAge]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const getSeats = (eventId) => seats[eventId] || 1;
  const setSeatCount = (eventId, value) => {
    setSeats((prev) => ({ ...prev, [eventId]: Math.max(1, value) }));
  };

  const isUpcoming = (event) => event.start_date && new Date(event.start_date) > new Date();

  const handleBookSeats = async (event) => {
    if (!isAuthenticated) {
      setShowOnboarding(true);
      return;
    }
    setSubmitting((prev) => ({ ...prev, [event.id]: true }));
    try {
      const { data } = await api.post('/api/events/bookings', {
        eventId: event.id,
        seats: getSeats(event.id),
      });
      if (data.status === 'WAITLISTED') {
        toast.success(`Seats aren't fully available yet — you've been added to the waiting list for "${event.title}".`);
      } else {
        toast.success(`Seat request sent for "${event.title}"! Track its status from your account.`);
      }
      setSeatCount(event.id, 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book seats');
    } finally {
      setSubmitting((prev) => ({ ...prev, [event.id]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9]">
      <Navigation />

      <section className="px-4 md:px-8 lg:px-16 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold font-heading text-[#2D3436] mb-4">
              Summer Camps & Events
            </h1>
            <p className="text-lg text-[#636E72] font-body max-w-2xl mx-auto">
              Join our exciting summer camps where learning meets adventure!
            </p>
          </div>

          {/* Search + Age Filter */}
          <div className="mb-12 bg-white rounded-3xl p-6 shadow-sm space-y-6">
            <SearchBar
              placeholder="Search events by title or description..."
              onSearch={setQuery}
              testId="event-search-input"
            />
            <div>
              <label className="block text-sm font-medium mb-3 text-[#2D3436]">Filter by Age Group</label>
              <div className="flex flex-wrap gap-2">
                {AGE_GROUPS.map((age) => (
                  <button
                    key={age}
                    onClick={() => setSelectedAge(age)}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      selectedAge === age
                        ? 'bg-[#4D96FF] text-white shadow-lg'
                        : 'bg-gray-100 text-[#2D3436] hover:bg-gray-200'
                    }`}
                    data-testid={`filter-age-${age.toLowerCase().replace(' ', '-')}`}
                  >
                    {age === 'All' ? 'All Ages' : `Ages ${age}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {events.map((event) => {
              const bookable = isUpcoming(event);
              return (
                <Card
                  key={event.id}
                  className="rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all bg-white"
                  data-testid={`event-card-${event.id}`}
                >
                  <div className="relative">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="px-4 py-2 rounded-full bg-[#FFD93D] text-[#2D3436] font-semibold text-sm">
                        Ages {event.age_group}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold font-heading mb-3 text-[#2D3436]">{event.title}</h3>
                    <RichText text={event.description} className="text-[#636E72] mb-4" />

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-[#636E72]">
                        <Calendar className="w-4 h-4 text-[#4D96FF]" />
                        <span>
                          {new Date(event.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {new Date(event.end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
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

                    {!bookable && (
                      <p className="text-xs text-red-500 font-medium mb-3">
                        Booking closed — this event has already started or ended.
                      </p>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-[#636E72]">Price per seat</p>
                        <p className="text-2xl font-bold text-[#FF6B6B]">₹{event.price}</p>
                      </div>
                      <div className="flex items-center border-2 rounded-full overflow-hidden">
                        <button
                          type="button"
                          className="p-2 disabled:opacity-40"
                          onClick={() => setSeatCount(event.id, getSeats(event.id) - 1)}
                          disabled={!bookable || getSeats(event.id) <= 1}
                          data-testid={`event-seats-decrease-${event.id}`}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 font-semibold" data-testid={`event-seats-${event.id}`}>
                          {getSeats(event.id)}
                        </span>
                        <button
                          type="button"
                          className="p-2 disabled:opacity-40"
                          onClick={() => setSeatCount(event.id, getSeats(event.id) + 1)}
                          disabled={!bookable}
                          data-testid={`event-seats-increase-${event.id}`}
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleBookSeats(event)}
                      disabled={!bookable || submitting[event.id]}
                      className="w-full rounded-full py-6 bg-[#4D96FF] hover:bg-[#3A86FF] font-bold text-lg transition-all hover:scale-105"
                      data-testid={`register-btn-${event.id}`}
                    >
                      {submitting[event.id] ? 'Requesting...' : 'Request Seats'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {events.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-[#636E72]">No events found for the selected filters.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <OnboardingDialog open={showOnboarding} onOpenChange={setShowOnboarding} />
    </div>
  );
}
