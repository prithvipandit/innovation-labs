import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import RichText from '@/components/RichText';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CATEGORIES = ['All', 'Robotics', 'Coding', 'Science Kits', 'Wood Workshop'];
const AGE_GROUPS = ['All', '5-7', '8-10', '11-14'];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAge, setSelectedAge] = useState('All');

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, []);

  const filterProducts = useCallback(() => {
    let filtered = products;
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    if (selectedAge !== 'All') {
      filtered = filtered.filter(p => p.age_group === selectedAge);
    }
    
    setFilteredProducts(filtered);
  }, [products, selectedCategory, selectedAge]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, selectedAge, filterProducts]);

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

          {/* Filters */}
          <div className="mb-12 bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
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
            {filteredProducts.map((product) => (
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
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold font-heading text-[#2D3436]">{product.name}</h3>
                    <span className="text-xl font-bold text-[#FF6B6B]">₹{product.price}</span>
                  </div>
                  <RichText text={product.description} className="text-[#636E72] mb-4" />
                  <div className="flex gap-2 mb-4">
                    <span className="text-xs px-3 py-1 rounded-full bg-[#FFD93D]/20 text-[#2D3436] font-medium">
                      {product.category}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full bg-[#6BCB77]/20 text-[#2D3436] font-medium">
                      Ages {product.age_group}
                    </span>
                  </div>
                  <Button 
                    className="w-full rounded-full bg-[#4D96FF] hover:bg-[#3A86FF] font-semibold"
                    data-testid={`product-buy-btn-${product.id}`}
                  >
                    Learn More
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-[#636E72]">No products found matching your filters.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
      < WhatsAppButton />
    </div>
  );
}
