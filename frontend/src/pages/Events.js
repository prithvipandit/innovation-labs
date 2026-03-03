import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import WhatsAppButton from '@/components/WhatsAppButton';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AGE_GROUPS = ['All', '5-7', '8-10', '11-14'];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedAge, setSelectedAge] = useState('All');

  const fetchEvents = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/events`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }, []);

  const filterEvents = useCallback(() => {
    if (selectedAge === 'All') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(e => e.age_group === selectedAge));
    }
  }, [events, selectedAge]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    filterEvents();
  }, [events, selectedAge, filterEvents]);

  const handleRegister = (event) => {
    toast.success(`Registration interest noted for ${event.title}!`);
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

          {/* Age Filter */}
          <div className="mb-12 bg-white rounded-3xl p-6 shadow-sm">
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

          {/* Events Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {filteredEvents.map((event) => (
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
                  <p className="text-[#636E72] mb-4 leading-relaxed">{event.description}</p>
                  
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
                      <span>Limited Seats Available</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-[#636E72]">Starting at</p>
                      <p className="text-2xl font-bold text-[#FF6B6B]">₹{event.price}</p>
                    </div>
                    <Button 
                      onClick={() => handleRegister(event)}
                      className="rounded-full px-8 py-6 bg-[#4D96FF] hover:bg-[#3A86FF] font-bold text-lg transition-all hover:scale-105"
                      data-testid={`register-btn-${event.id}`}
                    >
                      Register Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-[#636E72]">No events found for the selected age group.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
      < WhatsAppButton />
    </div>
  );
}
