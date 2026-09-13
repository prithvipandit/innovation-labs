import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Edit, Trash2, LogOut, Package, Calendar, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { api, BACKEND_URL } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import RichTextEditor from '@/components/RichTextEditor';
import RichText from '@/components/RichText';

const EMPTY_PRODUCT_FORM = {
  name: '', description: '', price: '', category: 'Robotics', age_group: '5-7', image_url: '', created_at: ''
};

const EMPTY_EVENT_FORM = {
  title: '', description: '', start_date: '', end_date: '', location: '', age_group: '5-7', price: '', image_url: '', created_at: ''
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { username, isAuthenticated, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [events, setEvents] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [productImageFile, setProductImageFile] = useState(null);
  const [eventImageFile, setEventImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const [productForm, setProductForm] = useState(EMPTY_PRODUCT_FORM);

  const [eventForm, setEventForm] = useState(EMPTY_EVENT_FORM);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, navigate]);

  const fetchData = async () => {
    try {
      // Public read endpoints — fetched without the admin token so an expired
      // (or absent) session doesn't block the dashboard from loading data.
      const [productsRes, eventsRes, reviewsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/products`),
        axios.get(`${BACKEND_URL}/api/events`),
        axios.get(`${BACKEND_URL}/api/reviews`)
      ]);
      setProducts(productsRes.data);
      setEvents(eventsRes.data);
      setReviews(reviewsRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingProduct) {
        if (productImageFile) {
          const formData = new FormData();
          formData.append('name', productForm.name);
          formData.append('category', productForm.category);
          formData.append('age_group', productForm.age_group);
          formData.append('price', productForm.price);
          formData.append('description', productForm.description);
          formData.append('file', productImageFile);
          await api.put(`/api/products/${editingProduct.id}`, formData);
        } else {
          await api.put(`/api/products/${editingProduct.id}`, {
            name: productForm.name,
            description: productForm.description,
            category: productForm.category,
            age_group: productForm.age_group,
            price: Number(productForm.price),
            image_url: productForm.image_url,
            created_at: productForm.created_at
          });
        }
        toast.success('Product updated!');
      } else {
        if (!productImageFile) {
          toast.error('Please select an image');
          setSaving(false);
          return;
        }
        const formData = new FormData();
        formData.append('name', productForm.name);
        formData.append('category', productForm.category);
        formData.append('age_group', productForm.age_group);
        formData.append('price', productForm.price);
        formData.append('description', productForm.description);
        formData.append('file', productImageFile);
        await api.post('/api/products', formData);
        toast.success('Product created!');
      }
      setShowProductModal(false);
      setEditingProduct(null);
      setProductForm(EMPTY_PRODUCT_FORM);
      setProductImageFile(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingEvent) {
        if (eventImageFile) {
          const formData = new FormData();
          formData.append('title', eventForm.title);
          formData.append('description', eventForm.description);
          formData.append('start_date', eventForm.start_date);
          formData.append('end_date', eventForm.end_date);
          formData.append('location', eventForm.location);
          formData.append('age_group', eventForm.age_group);
          formData.append('price', eventForm.price);
          formData.append('file', eventImageFile);
          await api.put(`/api/events/${editingEvent.id}`, formData);
        } else {
          await api.put(`/api/events/${editingEvent.id}`, {
            title: eventForm.title,
            description: eventForm.description,
            start_date: eventForm.start_date,
            end_date: eventForm.end_date,
            location: eventForm.location,
            age_group: eventForm.age_group,
            price: Number(eventForm.price),
            image_url: eventForm.image_url,
            created_at: eventForm.created_at
          });
        }
        toast.success('Event updated!');
      } else {
        if (!eventImageFile) {
          toast.error('Please select an image');
          setSaving(false);
          return;
        }
        const formData = new FormData();
        formData.append('title', eventForm.title);
        formData.append('description', eventForm.description);
        formData.append('start_date', eventForm.start_date);
        formData.append('end_date', eventForm.end_date);
        formData.append('location', eventForm.location);
        formData.append('age_group', eventForm.age_group);
        formData.append('price', eventForm.price);
        formData.append('file', eventImageFile);
        await api.post('/api/events', formData);
        toast.success('Event created!');
      }
      setShowEventModal(false);
      setEditingEvent(null);
      setEventForm(EMPTY_EVENT_FORM);
      setEventImageFile(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await api.delete(`/api/products/${id}`);
        toast.success('Product deleted');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Delete this event?')) {
      try {
        await api.delete(`/api/events/${id}`);
        toast.success('Event deleted');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm('Delete this review?')) {
      try {
        await api.delete(`/api/reviews/${id}`);
        toast.success('Review deleted');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete review');
      }
    }
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setProductImageFile(null);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      age_group: product.age_group,
      image_url: product.image_url,
      created_at: product.created_at
    });
    setShowProductModal(true);
  };

  const openEditEvent = (event) => {
    setEditingEvent(event);
    setEventImageFile(null);
    setEventForm({
      title: event.title,
      description: event.description,
      start_date: event.start_date.split('T')[0],
      end_date: event.end_date.split('T')[0],
      location: event.location,
      age_group: event.age_group,
      price: event.price,
      image_url: event.image_url,
      created_at: event.created_at
    });
    setShowEventModal(true);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img 
              src="https://customer-assets.emergentagent.com/job_dfb65b39-8dbe-4dfd-94f2-b15734a08e64/artifacts/rx6a5jtl_little_wings_logo.jpeg" 
              alt="Little Wings" 
              className="h-12 w-auto"
            />
            <div>
              <h1 className="text-2xl font-bold font-heading text-[#2D3436]">Admin Dashboard</h1>
              <p className="text-sm text-[#636E72]">Welcome, {username}</p>
            </div>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            className="rounded-full"
            data-testid="logout-btn"
          >
            <LogOut className="mr-2 w-4 h-4" /> Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white rounded-full p-2">
            <TabsTrigger value="products" className="rounded-full" data-testid="tab-products">
              <Package className="mr-2 w-4 h-4" /> Products
            </TabsTrigger>
            <TabsTrigger value="events" className="rounded-full" data-testid="tab-events">
              <Calendar className="mr-2 w-4 h-4" /> Events
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-full" data-testid="tab-reviews">
              <MessageSquare className="mr-2 w-4 h-4" /> Reviews
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="mb-6">
              <Button 
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm(EMPTY_PRODUCT_FORM);
                  setProductImageFile(null);
                  setShowProductModal(true);
                }}
                className="rounded-full bg-[#FF6B6B] hover:bg-[#FF5252]"
                data-testid="add-product-btn"
              >
                <Plus className="mr-2" /> Add Product
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="rounded-2xl overflow-hidden" data-testid={`admin-product-${product.id}`}>
                  <img src={product.image_url} alt={product.name} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <RichText text={product.description} className="text-[#636E72] mb-2" />
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-[#FF6B6B]">₹{product.price}</span>
                      <div className="flex gap-1">
                        <span className="text-xs px-2 py-1 rounded-full bg-[#FFD93D]/20">{product.category}</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-[#6BCB77]/20">{product.age_group}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => openEditProduct(product)}
                        className="flex-1 rounded-full"
                        data-testid={`edit-product-${product.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1 rounded-full"
                        data-testid={`delete-product-${product.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <div className="mb-6">
              <Button 
                onClick={() => {
                  setEditingEvent(null);
                  setEventForm(EMPTY_EVENT_FORM);
                  setEventImageFile(null);
                  setShowEventModal(true);
                }}
                className="rounded-full bg-[#4D96FF] hover:bg-[#3A86FF]"
                data-testid="add-event-btn"
              >
                <Plus className="mr-2" /> Add Event
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="rounded-2xl overflow-hidden" data-testid={`admin-event-${event.id}`}>
                  <img src={event.image_url} alt={event.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                    <RichText text={event.description} className="text-[#636E72] mb-2" />
                    <div className="text-xs text-[#636E72] mb-3">
                      <p>{new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}</p>
                      <p>{event.location} | Ages {event.age_group} | ₹{event.price}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => openEditEvent(event)}
                        className="flex-1 rounded-full"
                        data-testid={`edit-event-${event.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDeleteEvent(event.id)}
                        className="flex-1 rounded-full"
                        data-testid={`delete-event-${event.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id} className="rounded-2xl p-6" data-testid={`admin-review-${review.id}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{review.parent_name}</h3>
                        <div className="flex">
                          {[...Array(review.rating)].map((_, i) => (
                            <span key={i} className="text-[#FFD93D]">★</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-[#636E72]">{review.comment}</p>
                      <p className="text-xs text-[#636E72] mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDeleteReview(review.id)}
                      className="rounded-full"
                      data-testid={`delete-review-${review.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Modal */}
      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleProductSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Product Name</label>
              <Input
                value={productForm.name}
                onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                required
                data-testid="product-name-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <RichTextEditor
                value={productForm.description}
                onChange={(value) => setProductForm({...productForm, description: value})}
                required
                dataTestId="product-description-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price (₹)</label>
                <Input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                  required
                  data-testid="product-price-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                  className="w-full rounded-xl border-2 p-2"
                  data-testid="product-category-select"
                >
                  <option>Robotics</option>
                  <option>Coding</option>
                  <option>Science Kits</option>
                  <option>Wood Workshop</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Age Group</label>
              <select
                value={productForm.age_group}
                onChange={(e) => setProductForm({...productForm, age_group: e.target.value})}
                className="w-full rounded-xl border-2 p-2"
                data-testid="product-age-select"
              >
                <option>5-7</option>
                <option>8-10</option>
                <option>11-14</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Image</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setProductImageFile(e.target.files[0] || null)}
                required={!editingProduct}
                data-testid="product-image-upload"
              />
              {editingProduct && (
                <p className="text-xs text-[#636E72] mt-1">
                  Leave empty to keep the current image, or select a new file to replace it.
                </p>
              )}
              {productImageFile ? (
                <img src={URL.createObjectURL(productImageFile)} alt="Preview" className="mt-2 h-32 rounded-lg" />
              ) : (
                editingProduct && productForm.image_url && (
                  <img src={productForm.image_url} alt="Current" className="mt-2 h-32 rounded-lg" />
                )
              )}
            </div>
            <Button type="submit" className="w-full rounded-full" disabled={saving} data-testid="save-product-btn">
              {saving ? 'Saving...' : `${editingProduct ? 'Update' : 'Create'} Product`}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Event Modal */}
      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edit Event' : 'Add Event'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEventSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Event Title</label>
              <Input
                value={eventForm.title}
                onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                required
                data-testid="event-title-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <RichTextEditor
                value={eventForm.description}
                onChange={(value) => setEventForm({...eventForm, description: value})}
                required
                dataTestId="event-description-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <Input
                  type="date"
                  value={eventForm.start_date}
                  onChange={(e) => setEventForm({...eventForm, start_date: e.target.value})}
                  required
                  data-testid="event-start-date-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <Input
                  type="date"
                  value={eventForm.end_date}
                  onChange={(e) => setEventForm({...eventForm, end_date: e.target.value})}
                  required
                  data-testid="event-end-date-input"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                value={eventForm.location}
                onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                required
                data-testid="event-location-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Age Group</label>
                <select
                  value={eventForm.age_group}
                  onChange={(e) => setEventForm({...eventForm, age_group: e.target.value})}
                  className="w-full rounded-xl border-2 p-2"
                  data-testid="event-age-select"
                >
                  <option>5-7</option>
                  <option>8-10</option>
                  <option>11-14</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Price (₹)</label>
                <Input
                  type="number"
                  value={eventForm.price}
                  onChange={(e) => setEventForm({...eventForm, price: e.target.value})}
                  required
                  data-testid="event-price-input"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Image</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setEventImageFile(e.target.files[0] || null)}
                required={!editingEvent}
                data-testid="event-image-upload"
              />
              {editingEvent && (
                <p className="text-xs text-[#636E72] mt-1">
                  Leave empty to keep the current image, or select a new file to replace it.
                </p>
              )}
              {eventImageFile ? (
                <img src={URL.createObjectURL(eventImageFile)} alt="Preview" className="mt-2 h-32 rounded-lg" />
              ) : (
                editingEvent && eventForm.image_url && (
                  <img src={eventForm.image_url} alt="Current" className="mt-2 h-32 rounded-lg" />
                )
              )}
            </div>
            <Button type="submit" className="w-full rounded-full" disabled={saving} data-testid="save-event-btn">
              {saving ? 'Saving...' : `${editingEvent ? 'Update' : 'Create'} Event`}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
