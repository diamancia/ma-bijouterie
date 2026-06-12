import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configuration Supabase (à remplacer par vos clés réelles)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const INITIAL_PRODUCTS = [
  { id: 1, name: 'Bague Diamant Naturel', price: 12000, category: 'Bagues', image: 'https://placehold.co/400x400/e2e8f0/1e293b?text=Bague' },
  { id: 2, name: 'Pendentif Or Rose', price: 4500, category: 'Colliers', image: 'https://placehold.co/400x400/e2e8f0/1e293b?text=Pendentif' },
  { id: 3, name: 'Bracelet Maille Anglaise', price: 3200, category: 'Bracelets', image: 'https://placehold.co/400x400/e2e8f0/1e293b?text=Bracelet' },
  { id: 4, name: 'Alliance Platine', price: 5800, category: 'Bagues', image: 'https://placehold.co/400x400/e2e8f0/1e293b?text=Alliance' },
];

const CATEGORIES = ['Tout', ...new Set(INITIAL_PRODUCTS.map(p => p.category))];

export default function App() {
  const [activeCategory, setActiveCategory] = useState('Tout');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderStatus, setOrderStatus] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const filteredProducts = activeCategory === 'Tout' 
    ? INITIAL_PRODUCTS 
    : INITIAL_PRODUCTS.filter(p => p.category === activeCategory);

  const openCheckout = (product) => {
    setSelectedProduct(product);
    setIsCheckoutOpen(true);
    setOrderStatus('');
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
    setSelectedProduct(null);
    setFormData({ name: '', phone: '', address: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const submitOrder = async (e) => {
    e.preventDefault();
    setOrderStatus('loading');

    const { error } = await supabase
      .from('orders')
      .insert([
        {
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_address: formData.address,
          product_id: selectedProduct.id,
          product_name: selectedProduct.name,
          amount: selectedProduct.price,
          status: 'pending'
        }
      ]);

    if (error) {
      console.error("Erreur d'insertion:", error);
      setOrderStatus('error');
    } else {
      setOrderStatus('success');
      setTimeout(closeCheckout, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Boutique</h1>
          <nav className="hidden md:flex space-x-6 text-sm font-medium">
            <a href="#" className="hover:text-blue-600">Accueil</a>
            <a href="#" className="hover:text-blue-600">Catalogue</a>
            <a href="#" className="hover:text-blue-600">Contact</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Filters */}
        <div className="flex overflow-x-auto pb-4 mb-6 space-x-3 hide-scrollbar">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                activeCategory === category 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
              <div className="aspect-square bg-gray-100 relative">
                <img src={product.image} alt={product.name} className="object-cover w-full h-full" loading="lazy" />
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                <h3 className="font-semibold text-lg mb-2 truncate">{product.name}</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold text-lg">{product.price} MAD</span>
                  <button 
                    onClick={() => openCheckout(product)}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    Acheter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/212600000000?text=Bonjour,%20je%20souhaite%20avoir%20plus%20d'informations." 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all z-50 flex items-center justify-center"
        aria-label="Contact WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">Validation de commande</h2>
              <button onClick={closeCheckout} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            
            <form onSubmit={submitOrder} className="p-6">
              <div className="mb-6 p-4 bg-gray-50 rounded-lg flex items-center gap-4">
                <img src={selectedProduct?.image} alt="" className="w-16 h-16 object-cover rounded-md" />
                <div>
                  <p className="font-semibold text-gray-900">{selectedProduct?.name}</p>
                  <p className="text-blue-600 font-bold">{selectedProduct?.price} MAD</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse de livraison</label>
                  <textarea required name="address" value={formData.address} onChange={handleInputChange} rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"></textarea>
                </div>
              </div>

              <div className="mt-8">
                <button 
                  type="submit" 
                  disabled={orderStatus === 'loading' || orderStatus === 'success'}
                  className="w-full bg-gray-900 text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex justify-center items-center"
                >
                  {orderStatus === 'loading' ? 'Traitement...' : 
                   orderStatus === 'success' ? 'Commande envoyée ✓' : 
                   'Confirmer l\'achat'}
                </button>
                {orderStatus === 'error' && (
                  <p className="text-red-500 text-sm mt-2 text-center">Une erreur est survenue. Veuillez réessayer.</p>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}