import { useState } from 'react';
import type { Product } from '../types';
import { bookingsApi } from '../services/api';

interface ProductCardProps {
  product: Product;
  onBookingCreated: () => void;
}

export default function ProductCard({ product, onBookingCreated }: ProductCardProps) {
  const [isBooking, setIsBooking] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooking(true);

    try {
      await bookingsApi.create({
        productId: product.id,
        productName: product.name,
        quantity,
        appointmentDate,
      });

      alert(`✅ Réservation confirmée pour ${product.name}!`);
      setShowModal(false);
      onBookingCreated();
    } catch (error) {
      alert('❌ Erreur lors de la réservation. Veuillez réessayer.');
      console.error(error);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <>
      <div
        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100"
        onClick={() => setShowModal(true)}
      >
        <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
        <div className="p-6">
          <div className="text-[#8b4789] font-semibold text-sm uppercase tracking-wide">
            {product.brand}
          </div>
          <h3 className="text-xl font-bold mt-2 mb-2 text-black">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
          <div className="flex justify-between items-center mt-4">
            <div className="text-2xl font-bold text-black">{product.price}€</div>
            <div className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `✓ ${product.stock} en stock` : '✗ Rupture'}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl p-8 w-full max-w-2xl relative animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-4xl text-gray-400 hover:text-black transition-colors"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h3 className="text-3xl font-bold text-black mb-6">Réserver ce produit</h3>
            <div className="mb-6">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h4 className="text-xl font-bold text-black">{product.name}</h4>
              <p className="text-gray-600">
                {product.brand} - <span className="font-bold text-lg">{product.price}€</span>
              </p>
            </div>
            <form onSubmit={handleBooking} className="space-y-6">
              <div>
                <label htmlFor="quantity" className="block mb-2 font-semibold text-gray-700">
                  Quantité
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#8b4789] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label htmlFor="appointmentDate" className="block mb-2 font-semibold text-gray-700">
                  Date de rendez-vous
                </label>
                <input
                  type="datetime-local"
                  id="appointmentDate"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#8b4789] focus:outline-none transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={isBooking}
                className="w-full bg-[#8b4789] hover:bg-[#6d3670] text-white py-4 rounded-lg font-semibold text-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
              >
                {isBooking ? 'Réservation en cours...' : '✨ Confirmer la réservation'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
