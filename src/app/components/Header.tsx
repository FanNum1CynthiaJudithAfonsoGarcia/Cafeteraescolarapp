import { Link, useNavigate } from 'react-router';
import { ShoppingCart, LogOut, Coffee } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export const Header = () => {
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Coffee className="w-7 h-7 text-amber-700" />
          <h1 className="text-xl font-semibold text-gray-900">Cafetería Escolar</h1>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link 
            to="/cart" 
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </Link>
          
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
    </header>
  );
};
