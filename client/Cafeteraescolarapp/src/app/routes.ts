import { createBrowserRouter, redirect } from 'react-router';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Category from './pages/Category';
import Cart from './pages/Cart';
import { CheckoutPage } from './components/CheckoutForm';
import PagoExitoso from './pages/PagoExitoso';
import Historial from './pages/Historial';
import AdminPanel from './pages/AdminPanel';

// Protección básica — redirige si no hay sesión
const protectedLoader = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (!isLoggedIn) return redirect('/login');
  return null;
};

// Redirigir a home si ya está autenticado
const loginLoader = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (isLoggedIn) return redirect('/');
  return null;
};

// Solo admins
const adminLoader = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (!isLoggedIn) return redirect('/login');
  const rol = localStorage.getItem('rolUsuario');
  if (rol !== 'ADMIN') return redirect('/');
  return null;
};

export const router = createBrowserRouter([
  { path: '/login',        Component: Login,        loader: loginLoader },
  { path: '/register',     Component: Register,     loader: loginLoader },
  { path: '/',             Component: Home,         loader: protectedLoader },
  { path: '/category/:categoryId', Component: Category, loader: protectedLoader },
  { path: '/cart',         Component: Cart,         loader: protectedLoader },
  { path: '/pagar',        Component: CheckoutPage, loader: protectedLoader },
  { path: '/pago-exitoso', Component: PagoExitoso,  loader: protectedLoader },
  { path: '/historial',    Component: Historial,    loader: protectedLoader },
  { path: '/admin',        Component: AdminPanel,   loader: adminLoader },
]);