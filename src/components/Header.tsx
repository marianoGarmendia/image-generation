import  { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, User, Settings, CreditCard, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <header className="bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-white">
              MediaUploader
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/my-content"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Mi Contenido
            </Link>
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 rounded-full hover:bg-gray-700 text-white"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute right-0 top-0 h-full w-64 bg-gray-800 shadow-lg">
            <div className="p-4">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
              <div className="mt-8 space-y-4">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-md text-gray-300"
                >
                  <User size={20} />
                  <span>Usuario</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-md text-gray-300"
                >
                  <Settings size={20} />
                  <span>Settings</span>
                </Link>
                <Link
                  to="/account"
                  className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-md text-gray-300"
                >
                  <User size={20} />
                  <span>Mi Cuenta</span>
                </Link>
                <Link
                  to="/subscription"
                  className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-md text-gray-300"
                >
                  <CreditCard size={20} />
                  <span>Mi Suscripción</span>
                </Link>
                <button
                  onClick={logout}
                  className="w-full mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}