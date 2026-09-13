import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Filter, Minus, Plus as PlusIcon, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import RichText from '@/components/RichText';
import SearchBar from '@/components/SearchBar';
import OnboardingDialog from '@/components/OnboardingDialog';
import { toast } from 'sonner';
import { api, BACKEND_URL } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const API = `${BACKEND_URL}/api`;

const CATEGORIES = ['All', 'Robotics', 'Coding', 'Science Kits', 'Wood Workshop'];
const AGE_GROUPS = ['All', '5-7', '8-10', '11-14'];

export default function Products() {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAge, setSelectedAge] = useState('All');
  const [query, setQuery] = useState('');
  const [quantities, setQuantities] = useState({});
  const [submitting, setSubmitting] = useState({});
  const [showOnboarding, setShowOnboarding] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const params = { size: 100 };
      if (query) params.q = query;
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedAge !== 'All') params.age_group = selectedAge;
      const response = await axios.get(`${API}/search/products`, { params });
      setProducts(response.data.content || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, [query, selectedCategory, selectedAge]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getQuantity = (productId) => quantities[productId] || 1;

  const setQuantity = (productId, value) => {
    setQuantities((prev) => ({ ...prev, [productId]: Math.max(1, value) }));
  };

  const handleAddToWishlist = async (product) => {
    if (!isAuthenticated) {
      setShowOnboarding(true);
      return;
    }
    setSubmitting((prev) => ({ ...prev, [product.id]: true }));
    try {
      await api.post('/api/products/wishlist', {
        productId: product.id,
        quantity: getQuantity(product.id),
      });
      toast.success(`Added "${product.name}" to your wishlist!`);
      setQuantity(product.id, 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to wishlist');
    } finally {
      setSubmitting((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9]">
      <Navigation />

      <section className="px-4 md:px-8 lg:px-16 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold font-heading text-[#2D3436] mb-4">
              Our STEM Kits
            </h1>
            <p className="text-lg text-[#636E72] font-body max-w-2xl mx-auto">
              Discover hands-on learning kits designed to spark curiosity and creativity in young minds.
            </p>
          </div>

          {/* Search + Filters */}
          <div className="mb-12 bg-white rounded-3xl p-6 shadow-sm space-y-6">
            <SearchBar
              placeholder="Search products by name or description..."
              onSearch={setQuery}
              testId="product-search-input"
            />
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#4D96FF]" />
              <h3 className="text-lg font-semibold text-[#2D3436]">Filter By</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-[#2D3436]">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-full font-medium transition-all ${
                        selectedCategory === cat
                          ? 'bg-[#FF6B6B] text-white shadow-lg'
                          : 'bg-gray-100 text-[#2D3436] hover:bg-gray-200'
                      }`}
                      data-testid={`filter-category-${cat.toLowerCase().replace(' ', '-')}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[#2D3436]">Age Group</label>
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
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => {
              const outOfStock = (product.stock ?? 0) <= 0;
              return (
                <Card
                  key={product.id}
                  className="rounded-3xl overflow-hidden border-2 border-transparent hover:border-[#4D96FF] transition-all duration-300 group bg-white"
                  data-testid={`product-card-${product.id}`}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-56 object-cover transition-transform group-hover:scale-105"
                    />
                    {outOfStock && (
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-semibold">
                        Out of Stock
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold font-heading text-[#2D3436]">{product.name}</h3>
                      <span className="text-xl font-bold text-[#FF6B6B]">₹{product.price}</span>
                    </div>
                    <RichText text={product.description} className="text-[#636E72] mb-4" />
                    <div className="flex gap-2 mb-2">
                      <span className="text-xs px-3 py-1 rounded-full bg-[#FFD93D]/20 text-[#2D3436] font-medium">
                        {product.category}
                      </span>
                      <span className="text-xs px-3 py-1 rounded-full bg-[#6BCB77]/20 text-[#2D3436] font-medium">
                        Ages {product.age_group}
                      </span>
                    </div>
                    <p className="text-xs text-[#636E72] mb-4">
                      {outOfStock ? 'Currently unavailable' : `${product.stock} in stock`}
                    </p>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center border-2 rounded-full overflow-hidden">
                        <button
                          type="button"
                          className="p-2 disabled:opacity-40"
                          onClick={() => setQuantity(product.id, getQuantity(product.id) - 1)}
                          disabled={outOfStock || getQuantity(product.id) <= 1}
                          data-testid={`product-qty-decrease-${product.id}`}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 font-semibold" data-testid={`product-qty-${product.id}`}>
                          {getQuantity(product.id)}
                        </span>
                        <button
                          type="button"
                          className="p-2 disabled:opacity-40"
                          onClick={() => setQuantity(product.id, getQuantity(product.id) + 1)}
                          disabled={outOfStock}
                          data-testid={`product-qty-increase-${product.id}`}
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <Button
                      className="w-full rounded-full bg-[#4D96FF] hover:bg-[#3A86FF] font-semibold"
                      onClick={() => handleAddToWishlist(product)}
                      disabled={outOfStock || submitting[product.id]}
                      data-testid={`product-wishlist-btn-${product.id}`}
                    >
                      <Heart className="mr-2 w-4 h-4" />
                      {outOfStock ? 'Out of Stock' : submitting[product.id] ? 'Adding...' : 'Add to Wishlist'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {products.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-[#636E72]">No products found matching your filters.</p>
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
