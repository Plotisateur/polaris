import { useState, useEffect } from 'react';
import type { Product, Booking } from './types';
import { productsApi, bookingsApi } from './services/api';
import ProductCard from './components/ProductCard';
import BookingCard from './components/BookingCard';
import { Navbar } from './components/Navbar';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const categories = ['all', 'Parfum', 'Soin', 'Maquillage'];

  useEffect(() => {
    loadProducts();
    loadBookings();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productsApi.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      const data = await bookingsApi.getAll();
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const filteredProducts =
    selectedCategory === 'all' ? products : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#8b4789] via-[#6d3670] to-black text-white py-20 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold mb-4 animate-fade-in">
            Réservez vos cosmétiques de luxe
          </h2>
          <p className="text-xl opacity-95">Accédez en exclusivité à notre sélection premium</p>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-black mb-4">
            Notre Sélection Premium
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Découvrez nos marques iconiques : Lancôme, Yves Saint Laurent, Dior, Giorgio Armani
          </p>
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#8b4789] text-white shadow-lg'
                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-[#8b4789] hover:text-[#8b4789]'
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'all' ? 'Tout' : cat}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="text-center py-12 text-gray-500 text-lg">
              Chargement des produits...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onBookingCreated={loadBookings} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bookings Section */}
      <section id="bookings" className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-black mb-4">Mes Réservations</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">Gérez vos réservations en cours</p>
          {bookings.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-500 text-lg">Vous n'avez pas encore de réservations</p>
              <p className="text-gray-400 mt-2">
                Parcourez notre catalogue pour réserver vos produits
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} onCancelled={loadBookings} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-4">
            <h3 className="text-2xl font-bold mb-2">✨ L'Oréal Luxe</h3>
            <p className="text-gray-400">Votre destination pour les cosmétiques de luxe</p>
          </div>
          <div className="flex justify-center gap-8 mb-6 text-sm">
            <a href="#" className="hover:text-[#8b4789] transition-colors">
              À propos
            </a>
            <a href="#" className="hover:text-[#8b4789] transition-colors">
              Contact
            </a>
            <a href="#" className="hover:text-[#8b4789] transition-colors">
              Conditions
            </a>
            <a href="#" className="hover:text-[#8b4789] transition-colors">
              Confidentialité
            </a>
          </div>
          <div className="text-gray-500 text-sm">
            © 2026 L'Oréal. Tous droits réservés. | Powered by Polaris
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
