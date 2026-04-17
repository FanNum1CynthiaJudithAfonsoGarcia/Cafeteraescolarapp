import { useEffect, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import {
  ShieldCheck, Package, Users, UtensilsCrossed, LogOut,
  Trash2, Plus, ChevronDown, ChevronUp, Search, X, Loader2,
  AlertCircle, CheckCircle2, Coffee
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  getAllPedidosAdmin, getAllUsuariosAdmin, getProductos, getCategorias,
  deleteUsuarioAdmin, deleteProductoAdmin, createProductoAdmin
} from '../../services/api';

// ─── Types ────────────────────────────────────────────────
interface Pedido {
  id: number; total: number; fechaPedido: string;
  usuario: { id: number; nombreCompleto: string; email: string; rol: string };
  detalles: Array<{ cantidad: number; producto: { nombre: string; precio: number } }>;
}
interface Usuario {
  id: number; nombreCompleto: string; email: string;
  rol: string; horario: string; alergenos: string | null;
  _count: { pedidos: number };
}
interface Producto {
  id: number; nombre: string; precio: number;
  disponible: boolean; imagen: string | null; descripcion: string | null;
  categoria: { nombre: string };
}
interface Categoria { id: number; nombre: string }

type Tab = 'pedidos' | 'usuarios' | 'productos';

// ─── Sub-panels ────────────────────────────────────────────

function PedidosPanel() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [expandido, setExpandido] = useState<number | null>(null);

  useEffect(() => {
    getAllPedidosAdmin()
      .then(setPedidos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pedidosFiltrados = pedidos.filter((p) =>
    p.usuario.nombreCompleto.toLowerCase().includes(filtro.toLowerCase()) ||
    p.usuario.email.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text" value={filtro} onChange={(e) => setFiltro(e.target.value)}
            placeholder="Buscar por usuario o email…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none text-sm"
          />
        </div>
        <span className="text-sm text-gray-500 whitespace-nowrap">{pedidosFiltrados.length} pedidos</span>
      </div>

      {loading && <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}</div>}

      <div className="space-y-3">
        {pedidosFiltrados.map((pedido) => {
          const abierto = expandido === pedido.id;
          const fecha = new Date(pedido.fechaPedido);
          return (
            <div key={pedido.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                onClick={() => setExpandido(abierto ? null : pedido.id)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="bg-amber-100 w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-700 font-bold text-xs">#{pedido.id}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{pedido.usuario.nombreCompleto}</p>
                    <p className="text-xs text-gray-400 truncate">{pedido.usuario.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <p className="text-xs text-gray-400 hidden sm:block">
                    {fecha.toLocaleDateString('es-ES')} {fecha.toLocaleTimeString('es-ES', {hour:'2-digit', minute:'2-digit'})}
                  </p>
                  <span className="font-bold text-amber-700">{Number(pedido.total).toFixed(2)}€</span>
                  {abierto ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </button>
              {abierto && (
                <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                  {pedido.detalles.map((det, i) => (
                    <div key={i} className="flex justify-between text-sm py-1">
                      <span className="text-gray-700">{det.cantidad}× {det.producto.nombre}</span>
                      <span className="text-gray-600 font-medium">{(Number(det.producto.precio) * det.cantidad).toFixed(2)}€</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold text-sm">
                    <span>Total</span><span className="text-amber-700">{Number(pedido.total).toFixed(2)}€</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {!loading && pedidosFiltrados.length === 0 && (
          <p className="text-center text-gray-400 py-10">No se encontraron pedidos.</p>
        )}
      </div>
    </div>
  );
}

function UsuariosPanel() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [eliminando, setEliminando] = useState<number | null>(null);
  const { usuario: adminActual } = useAuth();

  useEffect(() => {
    getAllUsuariosAdmin().then(setUsuarios).catch(console.error).finally(() => setLoading(false));
  }, []);

  const eliminar = async (id: number) => {
    if (!confirm('¿Seguro que quieres eliminar este usuario? Esta acción es irreversible.')) return;
    setEliminando(id);
    try {
      await deleteUsuarioAdmin(id);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) { alert(err.message); }
    finally { setEliminando(null); }
  };

  const filtrados = usuarios.filter((u) =>
    u.nombreCompleto.toLowerCase().includes(filtro.toLowerCase()) ||
    u.email.toLowerCase().includes(filtro.toLowerCase())
  );

  const rolColor: Record<string, string> = {
    ADMIN: 'bg-purple-100 text-purple-700',
    TUTOR: 'bg-blue-100 text-blue-700',
    CLIENTE: 'bg-green-100 text-green-700',
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={filtro} onChange={(e) => setFiltro(e.target.value)}
            placeholder="Buscar usuario…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none text-sm"
          />
        </div>
        <span className="text-sm text-gray-500 whitespace-nowrap">{filtrados.length} usuarios</span>
      </div>

      {loading && <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}</div>}

      <div className="space-y-3">
        {filtrados.map((u) => (
          <div key={u.id} className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm flex-shrink-0">
                {u.nombreCompleto.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{u.nombreCompleto}</p>
                <p className="text-xs text-gray-400 truncate">{u.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="hidden sm:inline text-xs text-gray-400">{u._count.pedidos} pedidos</span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${rolColor[u.rol] ?? 'bg-gray-100 text-gray-600'}`}>{u.rol}</span>
              {u.id !== adminActual?.id && (
                <button
                  onClick={() => eliminar(u.id)}
                  disabled={eliminando === u.id}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Eliminar usuario"
                >
                  {eliminando === u.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        ))}
        {!loading && filtrados.length === 0 && <p className="text-center text-gray-400 py-10">No se encontraron usuarios.</p>}
      </div>
    </div>
  );
}

function ProductosPanel() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [eliminando, setEliminando] = useState<number | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [exito, setExito] = useState('');
  const [errorForm, setErrorForm] = useState('');

  // Form state
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [alergenos, setAlergenos] = useState('');
  const [imagen, setImagen] = useState('');

  useEffect(() => {
    Promise.all([getProductos(), getCategorias()])
      .then(([prods, cats]) => { setProductos(prods); setCategorias(cats); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const eliminar = async (id: number) => {
    if (!confirm('¿Eliminar este producto?')) return;
    setEliminando(id);
    try {
      await deleteProductoAdmin(id);
      setProductos((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) { alert(err.message); }
    finally { setEliminando(null); }
  };

  const handleCrear = async (e: FormEvent) => {
    e.preventDefault();
    setErrorForm(''); setExito('');
    if (!nombre || !precio || !categoriaId) { setErrorForm('Nombre, precio y categoría son obligatorios.'); return; }
    setGuardando(true);
    try {
      const nuevo = await createProductoAdmin({
        nombre, precio: Number(precio), categoriaId: Number(categoriaId),
        descripcion: descripcion || undefined, alergenos: alergenos || undefined,
        imagen: imagen || undefined,
      });
      setProductos((prev) => [...prev, nuevo]);
      setExito(`"${nuevo.nombre}" creado correctamente.`);
      setNombre(''); setPrecio(''); setCategoriaId(''); setDescripcion(''); setAlergenos(''); setImagen('');
      setTimeout(() => { setExito(''); setMostrarForm(false); }, 2000);
    } catch (err: any) { setErrorForm(err.message); }
    finally { setGuardando(false); }
  };

  return (
    <div>
      {/* Botón nueva alta */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => { setMostrarForm(!mostrarForm); setErrorForm(''); setExito(''); }}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          {mostrarForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {mostrarForm ? 'Cancelar' : 'Nuevo Producto'}
        </button>
      </div>

      {/* Formulario alta */}
      {mostrarForm && (
        <form onSubmit={handleCrear} className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6 space-y-4">
          <h3 className="font-bold text-amber-900 text-sm uppercase tracking-wide">Alta de Producto</h3>

          {errorForm && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{errorForm}
            </div>
          )}
          {exito && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />{exito}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre *</label>
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} required
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 outline-none text-sm" placeholder="Bocadillo de jamón" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Precio (€) *</label>
              <input value={precio} onChange={(e) => setPrecio(e.target.value)} required type="number" min="0" step="0.01"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 outline-none text-sm" placeholder="2.50" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Categoría *</label>
              <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} required
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 outline-none text-sm bg-white">
                <option value="">Selecciona…</option>
                {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Alergenos</label>
              <input value={alergenos} onChange={(e) => setAlergenos(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 outline-none text-sm" placeholder="Gluten, Lácteos…" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Descripción</label>
              <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 outline-none text-sm" placeholder="Descripción breve del producto" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">URL de imagen</label>
              <input value={imagen} onChange={(e) => setImagen(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 outline-none text-sm" placeholder="https://..." />
            </div>
          </div>

          <button type="submit" disabled={guardando}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            {guardando ? <><Loader2 className="w-4 h-4 animate-spin" />Guardando…</> : <><Plus className="w-4 h-4" />Crear Producto</>}
          </button>
        </form>
      )}

      {/* Lista de productos */}
      {loading && <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}</div>}

      <div className="space-y-2">
        {productos.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-200 px-5 py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {p.imagen
                ? <img src={p.imagen} alt={p.nombre} className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-gray-100" />
                : <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0"><Coffee className="w-5 h-5 text-amber-600" /></div>
              }
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{p.nombre}</p>
                <p className="text-xs text-gray-400">{p.categoria?.nombre}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="font-bold text-amber-700 text-sm">{Number(p.precio).toFixed(2)}€</span>
              <button onClick={() => eliminar(p.id)} disabled={eliminando === p.id}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Eliminar producto">
                {eliminando === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Panel Principal ────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'pedidos', label: 'Pedidos', icon: <Package className="w-5 h-5" /> },
  { id: 'usuarios', label: 'Usuarios', icon: <Users className="w-5 h-5" /> },
  { id: 'productos', label: 'Productos', icon: <UtensilsCrossed className="w-5 h-5" /> },
];

export default function AdminPanel() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('pedidos');

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Admin Header */}
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 p-1.5 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight">Panel de Administración</h1>
            <p className="text-gray-400 text-xs">{usuario?.nombreCompleto}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white text-sm transition-colors hidden sm:block">
            ← Ir al menú
          </button>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 text-sm transition-colors">
            <LogOut className="w-4 h-4" />
            Salir
          </button>
        </div>
      </header>

      <div className="flex flex-1 max-w-6xl mx-auto w-full px-4 py-8 gap-8">
        {/* Sidebar Tabs */}
        <aside className="w-48 flex-shrink-0 hidden md:block">
          <nav className="space-y-1">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  tab === t.id
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-white hover:text-gray-900'
                }`}>
                {t.icon}{t.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile tab bar */}
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 flex justify-around z-50 px-2 py-2">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                tab === t.id ? 'text-amber-600' : 'text-gray-500'
              }`}>
              {t.icon}<span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <main className="flex-1 min-w-0 pb-20 md:pb-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {TABS.find((t) => t.id === tab)?.label}
            </h2>
            {tab === 'pedidos' && <PedidosPanel />}
            {tab === 'usuarios' && <UsuariosPanel />}
            {tab === 'productos' && <ProductosPanel />}
          </div>
        </main>
      </div>
    </div>
  );
}
