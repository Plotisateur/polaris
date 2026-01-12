import type { Booking } from '../types';
import { bookingsApi } from '../services/api';

interface BookingCardProps {
  booking: Booking;
  onCancelled: () => void;
}

export default function BookingCard({ booking, onCancelled }: BookingCardProps) {
  const handleCancel = async () => {
    if (!confirm(`Annuler la réservation de ${booking.productName} ?`)) {
      return;
    }

    try {
      await bookingsApi.cancel(booking.id);
      alert('✅ Réservation annulée avec succès');
      onCancelled();
    } catch (error) {
      alert('❌ Erreur lors de l\'annulation');
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex-1">
          <h4 className="text-2xl font-bold text-black mb-3">{booking.productName}</h4>
          <div className="flex flex-wrap gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-lg">📦</span>
              <span className="font-medium">Quantité: <span className="text-black">{booking.quantity}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">📅</span>
              <span className="font-medium">
                {new Date(booking.appointmentDate).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
          <div className="mt-3">
            <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold border border-green-200">
              ✓ {booking.status}
            </span>
          </div>
        </div>
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
          onClick={handleCancel}
        >
          Annuler la réservation
        </button>
      </div>
    </div>
  );
}
