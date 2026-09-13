import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, Rocket, Sparkles, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import OnboardingDialog from '@/components/OnboardingDialog';
import { toast } from 'sonner';
import RichText from '@/components/RichText';
import { useAuth } from '@/context/AuthContext';
import "../css/Hero.css";
import bac_1 from "../images/bac_1.png";
import bac_2 from "../images/bac_2.png";
import bac_3 from "../images/bac_3.png";
import bac_4 from "../images/bac_4.png";
import abacus from "../images/icons/abacus.png";
import brain from "../images/icons/brain.png";
import mining from "../images/icons/mining.png";
import technology from "../images/icons/technology.png";
import little_wings_logo from "../images/little_wings_logo.jpeg";
import Gallery from '@/components/Memories';
import WhatsAppButton from '@/components/WhatsAppButton';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ONBOARDING_DISMISSED_KEY = 'lw_onboarding_dismissed';

export default function Home() {
  const images = [bac_1, bac_2, bac_3, bac_4];
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [events, setEvents] = useState([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    parent_name: '',
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!isAuthenticated && sessionStorage.getItem(ONBOARDING_DISMISSED_KEY) !== 'true') {
      setShowOnboarding(true);
    }
  }, [isAuthenticated]);

  const handleOnboardingChange = (open) => {
    setShowOnboarding(open);
    if (!open) {
      sessionStorage.setItem(ONBOARDING_DISMISSED_KEY, 'true');
    }
  };

  const fetchData = async () => {
    try {
      const [reviewsRes, productsRes, eventsRes] = await Promise.all([
        axios.get(`${API}/reviews`),
        axios.get(`${API}/products`),
        axios.get(`${API}/events`)
      ]);
      setReviews(reviewsRes.data.slice(0, 3));
      setProducts(productsRes.data.slice(0, 3));
      setEvents(eventsRes.data.slice(0, 2));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/reviews`, reviewForm);
      toast.success('Thank you for your review!');
      setReviewForm({ parent_name: '', rating: 5, comment: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9]">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative px-4 md:px-6 lg:px-10 py-10 md:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block">
                <img 
                  src={little_wings_logo} 
                  alt="Little Wings Logo" 
                  className="h-20 md:h-24 w-auto"
                  data-testid="logo-image"
                />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold font-heading text-[#2D3436] leading-tight">
                Where <span className="gradient-text">Curiosity</span> Takes Flight
              </h1>
              <p className="text-lg md:text-xl text-[#636E72] leading-relaxed font-body">
                Inspire young minds with hands-on STEM learning through robotics, coding, and creative workshops designed for kids aged 5-14.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products">
                  <Button 
                    className="rounded-full px-8 py-6 text-lg font-bold bg-[#FF6B6B] hover:bg-[#FF5252] transition-all hover:scale-105 active:scale-95 shadow-lg"
                    data-testid="explore-kits-btn"
                  >
                    <Rocket className="mr-2" /> Explore STEM Kits
                  </Button>
                </Link>
                <Link to="/events">
                  <Button 
                    variant="outline" 
                    className="rounded-full px-8 py-6 text-lg font-semibold border-2 border-[#2D3436] text-[#2D3436] hover:bg-[#2D3436] hover:text-white transition-all"
                    data-testid="view-camps-btn"
                  >
                    View Summer Camps
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hero-visual">
          <div className="hero-image-wrapper">
            <div className="slideshow-inner">
              <div className="slideshow-track">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="slide"
                    style={{ backgroundImage: `url("${img}")` }}
                  ></div>
                ))}
                {/* Clone the first image for seamless loop */}
                <div
                  className="slide"
                  style={{ backgroundImage: `url("${images[0]}")` }}
                ></div>
              </div>
            </div>
            
            <div className="image-overlay-card card-1">
              <span className="card-icon"><img src={brain} alt="" /></span>
              <div className="card-info">
                <strong>STEM</strong>
                <span>Education & Learning</span>
              </div>
            </div>
            <div className="image-overlay-card card-2">
              <span className="card-icon"><img src={technology} alt="" /></span>
              <div className="card-info">
                <strong>Robotics</strong>
                <span>Build & Program</span>
              </div>
            </div>
          </div>
          
          {/* Subtle background glow for the image */}
          <div className="hero-glow"></div>
        </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 md:px-8 lg:px-16 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-center mb-12 text-[#2D3436]">
            Why Choose Little Wings?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="rounded-3xl p-8 border-2 border-transparent hover:border-[#4D96FF] transition-all bg-white shadow-sm hover:shadow-md" data-testid="feature-card-hands-on">
              <div className="w-16 h-16 rounded-full bg-[#FFD93D] flex items-center justify-center mb-4">
                <Rocket className="w-8 h-8 text-[#2D3436]" />
              </div>
              <h3 className="text-2xl font-semibold font-heading mb-3 text-[#2D3436]">Hands-On Learning</h3>
              <p className="text-[#636E72] leading-relaxed font-body">Interactive STEM kits that make learning fun and engaging for all age groups.</p>
            </Card>
            <Card className="rounded-3xl p-8 border-2 border-transparent hover:border-[#6BCB77] transition-all bg-white shadow-sm hover:shadow-md" data-testid="feature-card-expert">
              <div className="w-16 h-16 rounded-full bg-[#6BCB77] flex items-center justify-center mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold font-heading mb-3 text-[#2D3436]">Expert Instructors</h3>
              <p className="text-[#636E72] leading-relaxed font-body">Trained educators passionate about inspiring the next generation of innovators.</p>
            </Card>
            <Card className="rounded-3xl p-8 border-2 border-transparent hover:border-[#9D4EDD] transition-all bg-white shadow-sm hover:shadow-md" data-testid="feature-card-flexible">
              <div className="w-16 h-16 rounded-full bg-[#9D4EDD] flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold font-heading mb-3 text-[#2D3436]">Flexible Programs</h3>
              <p className="text-[#636E72] leading-relaxed font-body">From weekend workshops to summer camps, we fit your schedule.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="px-4 md:px-8 lg:px-16 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-[#2D3436]">Featured STEM Kits</h2>
              <Link to="/products">
                <Button variant="outline" className="rounded-full" data-testid="view-all-products-btn">
                  View All
                </Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {products.map((product) => (
                <Card key={product.id} className="rounded-3xl overflow-hidden border-2 border-transparent hover:border-[#4D96FF] transition-all group" data-testid={`product-card-${product.id}`}>
                  <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold font-heading text-[#2D3436]">{product.name}</h3>
                      <span className="text-lg font-bold text-[#FF6B6B]">₹{product.price}</span>
                    </div>
                    <RichText text={product.description} className="text-[#636E72] mb-3" />
                    <div className="flex gap-2">
                      <span className="text-xs px-3 py-1 rounded-full bg-[#FFD93D]/20 text-[#2D3436] font-medium">{product.category}</span>
                      <span className="text-xs px-3 py-1 rounded-full bg-[#6BCB77]/20 text-[#2D3436] font-medium">Ages {product.age_group}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {events.length > 0 && (
        <section className="px-4 md:px-8 lg:px-16 py-16 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-[#2D3436]">Upcoming Summer Camps</h2>
              <Link to="/events">
                <Button variant="outline" className="rounded-full" data-testid="view-all-events-btn">
                  View All
                </Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {events.map((event) => (
                <Card key={event.id} className="rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all relative" data-testid={`event-card-${event.id}`}>
                  <img src={event.image_url} alt={event.title} className="w-full h-56 object-cover" />
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold font-heading mb-2 text-[#2D3436]">{event.title}</h3>
                    <RichText text={event.description} className="text-[#636E72] mb-4" />
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-[#636E72]">
                        <p>{new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}</p>
                        <p className="font-semibold text-[#2D3436] mt-1">₹{event.price}</p>
                      </div>
                      <Button
                        className="rounded-full bg-[#4D96FF] hover:bg-[#3A86FF]"
                        onClick={() => navigate('/events')}
                        data-testid={`register-btn-${event.id}`}
                      >
                        Register Now
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-4 md:px-8 lg:px-16 pt-16 pb-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-center mb-12 text-[#2D3436]">
            Memories from Our Workshops
          </h2>
          <Gallery/>
        </div>
      </section>

      

      {/* Reviews Section */}
      <section className="px-4 md:px-8 lg:px-16 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-center mb-12 text-[#2D3436]">
            What Parents Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {reviews.map((review) => (
              <Card key={review.id} className="rounded-2xl p-8 border-2 border-[#FFD93D] bg-[#FFFDF9] relative" data-testid={`review-card-${review.id}`}>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'fill-[#FFD93D] text-[#FFD93D]' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-[#2D3436] mb-4 italic leading-relaxed">"{review.comment}"</p>
                <p className="font-semibold text-[#2D3436]">- {review.parent_name}</p>
              </Card>
            ))}
          </div>

          {/* Review Form */}
          <Card className="rounded-3xl p-8 max-w-2xl mx-auto bg-white shadow-lg">
            <h3 className="text-2xl font-semibold font-heading mb-6 text-[#2D3436]">Share Your Experience</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-[#2D3436]">Your Name</label>
                <Input
                  type="text"
                  value={reviewForm.parent_name}
                  onChange={(e) => setReviewForm({...reviewForm, parent_name: e.target.value})}
                  className="rounded-xl border-2"
                  required
                  data-testid="review-name-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[#2D3436]">Rating</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({...reviewForm, rating: parseInt(e.target.value)})}
                  className="w-full rounded-xl border-2 border-gray-200 p-3"
                  data-testid="review-rating-select"
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Good</option>
                  <option value={2}>2 Stars - Fair</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[#2D3436]">Your Review</label>
                <Textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                  className="rounded-xl border-2 min-h-[120px]"
                  required
                  data-testid="review-comment-textarea"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full rounded-full py-6 text-lg font-bold bg-[#FF6B6B] hover:bg-[#FF5252]"
                data-testid="submit-review-btn"
              >
                Submit Review
              </Button>
            </form>
          </Card>
        </div>
      </section>

      <Footer />
      < WhatsAppButton />
      <OnboardingDialog open={showOnboarding} onOpenChange={handleOnboardingChange} />
    </div>
  );
}
