import { useAuth } from '@polaris/authentication/react';

export function Navbar() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <nav className="bg-black text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">✨ L'Oréal Luxe</h1>
          <div className="text-sm text-gray-400">Chargement...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-black text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">✨ L'Oréal Luxe</h1>
            <span className="text-sm text-gray-400 hidden md:block">Premium Beauty Services</span>
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-6 items-center">
              <a href="#products" className="font-medium hover:text-purple-400 transition-colors">
                Catalogue
              </a>
              <a href="#bookings" className="font-medium hover:text-purple-400 transition-colors">
                Mes Réservations
              </a>
            </nav>

            {user && (
              <div className="flex items-center gap-3 bg-gray-800 px-4 py-2 rounded-full">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold border-2 border-purple-400">
                  {(user.name || user.email || 'U')[0].toUpperCase()}
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm text-white">{user.name || user.email}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
