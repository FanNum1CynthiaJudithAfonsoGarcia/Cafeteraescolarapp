import { Link, useNavigate } from 'react-router';
import { ShoppingCart, LogOut, Coffee, ClipboardList, ShieldCheck } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export const Header = () => {
  const { getTotalItems } = useCart();
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Coffee className="w-7 h-7 text-amber-700" />
          <h1 className="text-xl font-semibold text-gray-900">Cafetería Escolar</h1>
        </Link>

        <div className="flex items-center gap-2">
          {/* Nombre del usuario */}
          {usuario && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-sm text-gray-600 mr-2">
              <span className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs uppercase">
                {usuario.nombreCompleto.charAt(0)}
              </span>
              <span className="font-medium">{usuario.nombreCompleto.split(' ')[0]}</span>
            </span>
          )}

          {/* Mis Pedidos */}
          <Link
            to="/historial"
            className="p-2 hover:bg-amber-50 rounded-full transition-colors"
            title="Mis pedidos"
          >
            <ClipboardList className="w-5 h-5 text-gray-700" />
          </Link>

          {/* Panel Admin — solo si ADMIN */}
          {usuario?.rol === 'ADMIN' && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-xs font-semibold transition-colors"
              title="Panel de administración"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}

          {/* Carrito */}
          <Link
            to="/cart"
            className="relative p-2 hover:bg-amber-50 rounded-full transition-colors"
            aria-label="Carrito de compra"
          >
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {getTotalItems()}
              </span>
            )}
          </Link>

          {/* Logout */}
          <button
            id="header-logout"
            onClick={handleLogout}
            className="p-2 hover:bg-red-50 rounded-full transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-6 h-6 text-gray-700 hover:text-red-500 transition-colors" />
          </button>
        </div>
      </div>
    </header>
  );
};
