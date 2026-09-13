import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Heart, CalendarCheck, Mail, LogOut, X, Package, Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { productStatusClass, eventStatusClass } from '@/lib/status';

const TAB_ALIASES = { products: 'products', events: 'events', communications: 'communications' };

export default function AccountDashboard() {
  const navigate = useNavigate();
  const { username, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const initialTab = TAB_ALIASES[searchParams.get('tab')] || 'products';

  const [productWishlist, setProductWishlist] = useState([]);
  const [eventBookings, setEventBookings] = useState([]);
  const [communications, setCommunications] = useState([]);
  const [expandedCommId, setExpandedCommId] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      const [productsRes, eventsRes, commsRes] = await Promise.all([
        api.get('/api/products/wishlist/me'),
        api.get('/api/events/bookings/me'),
        api.get('/api/communications/me'),
      ]);
      setProductWishlist(productsRes.data);
      setEventBookings(eventsRes.data);
      setCommunications(commsRes.data.content || []);
    } catch (error) {
      toast.error('Failed to load your account data');
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleCancelProduct = async (id) => {
    if (!window.confirm('Cancel this wishlist request?')) return;
    try {
      await api.delete(`/api/products/wishlist/${id}`);
      toast.success('Wishlist item removed');
      fetchAll();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove item');
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Cancel this event booking?')) return;
    try {
      await api.delete(`/api/events/bookings/${id}`);
      toast.success('Booking cancelled');
      fetchAll();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9]">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-[#2D3436]">My Account</h1>
            <p className="text-[#636E72]">Welcome back, {username}</p>
          </div>
          <Button variant="outline" className="rounded-full" onClick={handleLogout} data-testid="account-logout-btn">
            <LogOut className="mr-2 w-4 h-4" /> Logout
          </Button>
        </div>

        <Tabs defaultValue={initialTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white rounded-full p-2">
            <TabsTrigger value="products" className="rounded-full" data-testid="account-tab-products">
              <Heart className="mr-2 w-4 h-4" /> Product Wishlist
            </TabsTrigger>
            <TabsTrigger value="events" className="rounded-full" data-testid="account-tab-events">
              <CalendarCheck className="mr-2 w-4 h-4" /> Event Wishlist
            </TabsTrigger>
            <TabsTrigger value="communications" className="rounded-full" data-testid="account-tab-communications">
              <Mail className="mr-2 w-4 h-4" /> Communications
            </TabsTrigger>
          </TabsList>

          {/* Product Wishlist */}
          <TabsContent value="products">
            {/* Desktop/tablet: table */}
            <Card className="rounded-2xl overflow-hidden hidden md:block">
              <Table className="min-w-[720px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productWishlist.map((item) => (
                    <TableRow key={item.id} data-testid={`account-product-row-${item.id}`}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {item.productImageUrl && (
                            <img src={item.productImageUrl} alt={item.productName} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          )}
                          <span className="font-medium">{item.productName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2.5 py-0.5 rounded-md border text-xs font-semibold ${productStatusClass(item.status)}`}>
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-[#636E72] max-w-[200px]">{item.adminNote || '—'}</TableCell>
                      <TableCell className="text-sm text-[#636E72]">
                        {item.requestedAt ? new Date(item.requestedAt).toLocaleDateString() : '—'}
                      </TableCell>
                      <TableCell>
                        {item.status === 'PENDING' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full"
                            onClick={() => handleCancelProduct(item.id)}
                            data-testid={`account-cancel-product-${item.id}`}
                          >
                            Cancel
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            {/* Mobile: feed-style cards */}
            <div className="md:hidden space-y-4">
              {productWishlist.map((item) => (
                <Card key={item.id} className="rounded-2xl overflow-hidden" data-testid={`account-product-card-${item.id}`}>
                  {item.productImageUrl && (
                    <img src={item.productImageUrl} alt={item.productName} className="w-full h-40 object-cover" />
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <h3 className="font-semibold text-lg text-[#2D3436] leading-tight">{item.productName}</h3>
                      <span className={`inline-flex flex-shrink-0 px-2.5 py-0.5 rounded-md border text-xs font-semibold ${productStatusClass(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="space-y-1.5 text-sm text-[#636E72] mb-3">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 flex-shrink-0" />
                        <span>Quantity: <span className="font-medium text-[#2D3436]">{item.quantity}</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>Requested {item.requestedAt ? new Date(item.requestedAt).toLocaleDateString() : '—'}</span>
                      </div>
                    </div>
                    {item.adminNote && (
                      <p className="text-sm text-[#636E72] bg-gray-50 rounded-xl p-3 mb-3 italic">"{item.adminNote}"</p>
                    )}
                    {item.status === 'PENDING' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full rounded-full"
                        onClick={() => handleCancelProduct(item.id)}
                        data-testid={`account-cancel-product-mobile-${item.id}`}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {productWishlist.length === 0 && (
              <p className="text-center py-10 text-[#636E72]">You haven't wishlisted any products yet.</p>
            )}
          </TabsContent>

          {/* Event Wishlist */}
          <TabsContent value="events">
            {/* Desktop/tablet: table */}
            <Card className="rounded-2xl overflow-hidden hidden md:block">
              <Table className="min-w-[780px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Seats</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventBookings.map((booking) => (
                    <TableRow key={booking.id} data-testid={`account-event-row-${booking.id}`}>
                      <TableCell className="font-medium">{booking.eventTitle}</TableCell>
                      <TableCell>{booking.seats}</TableCell>
                      <TableCell>₹{booking.totalAmount}</TableCell>
                      <TableCell className="text-sm text-[#636E72]">{booking.eventStartDate}</TableCell>
                      <TableCell className="text-sm text-[#636E72]">{booking.eventLocation}</TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2.5 py-0.5 rounded-md border text-xs font-semibold ${eventStatusClass(booking.status)}`}>
                          {booking.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {['PENDING', 'WAITLISTED', 'APPROVED'].includes(booking.status) && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full"
                            onClick={() => handleCancelBooking(booking.id)}
                            data-testid={`account-cancel-event-${booking.id}`}
                          >
                            Cancel
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            {/* Mobile: feed-style cards */}
            <div className="md:hidden space-y-4">
              {eventBookings.map((booking) => (
                <Card key={booking.id} className="rounded-2xl overflow-hidden" data-testid={`account-event-card-${booking.id}`}>
                  {booking.eventImageUrl && (
                    <img src={booking.eventImageUrl} alt={booking.eventTitle} className="w-full h-40 object-cover" />
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <h3 className="font-semibold text-lg text-[#2D3436] leading-tight">{booking.eventTitle}</h3>
                      <span className={`inline-flex flex-shrink-0 px-2.5 py-0.5 rounded-md border text-xs font-semibold ${eventStatusClass(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="space-y-1.5 text-sm text-[#636E72] mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>{booking.eventStartDate}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{booking.eventLocation}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 flex-shrink-0" />
                        <span>{booking.seats} seat(s)</span>
                      </div>
                    </div>
                    <p className="text-xl font-bold text-[#FF6B6B] mb-3">₹{booking.totalAmount}</p>
                    {booking.adminNote && (
                      <p className="text-sm text-[#636E72] bg-gray-50 rounded-xl p-3 mb-3 italic">"{booking.adminNote}"</p>
                    )}
                    {['PENDING', 'WAITLISTED', 'APPROVED'].includes(booking.status) && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full rounded-full"
                        onClick={() => handleCancelBooking(booking.id)}
                        data-testid={`account-cancel-event-mobile-${booking.id}`}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {eventBookings.length === 0 && (
              <p className="text-center py-10 text-[#636E72]">You haven't booked any events yet.</p>
            )}
          </TabsContent>

          {/* Communications */}
          <TabsContent value="communications">
            <div className="space-y-4">
              {communications.map((comm) => (
                <Card key={comm.id} className="rounded-2xl p-6" data-testid={`account-comm-${comm.id}`}>
                  <button
                    className="w-full text-left"
                    onClick={() => setExpandedCommId(expandedCommId === comm.id ? null : comm.id)}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-semibold text-[#2D3436]">{comm.subject}</h3>
                        <p className="text-xs text-[#636E72] mt-1">
                          {comm.type.replaceAll('_', ' ')} · {new Date(comm.sentAt).toLocaleString()}
                        </p>
                      </div>
                      {expandedCommId === comm.id && <X className="w-4 h-4 text-[#636E72] flex-shrink-0" />}
                    </div>
                  </button>
                  {expandedCommId === comm.id && (
                    <p className="mt-4 text-sm text-[#636E72] whitespace-pre-line border-t pt-4">{comm.body}</p>
                  )}
                </Card>
              ))}
              {communications.length === 0 && (
                <p className="text-center py-10 text-[#636E72]">No communications yet — you'll see order and booking emails here.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
