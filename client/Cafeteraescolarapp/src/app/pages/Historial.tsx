import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { getPedidosUsuario } from '../../services/api';
import { ClipboardList, Clock, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';

interface DetallePedido {
  id: number;
  cantidad: number;
  precioUnitario: number;
  producto: { nombre: string; imagen: string | null };
}

interface Pedido {
  id: number;
  total: number;
  fechaPedido: string;
  detalles: DetallePedido[];
}

function PedidoCard({ pedido }: { pedido: Pedido }) {
  const [abierto, setAbierto] = useState(false);
  const fecha = new Date(pedido.fechaPedido);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-shadow hover:shadow-md">
      {/* Cabecera */}
      <button
        className="w-full text-left px-6 py-4 flex items-center justify-between gap-4"
        onClick={() => setAbierto(!abierto)}
      >
        <div className="flex items-center gap-4">
          <div className="bg-amber-100 p-2.5 rounded-xl flex-shrink-0">
            <ShoppingBag className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">Pedido #{pedido.id}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" />
              {fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
              {' · '}
              {fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            Completado
          </span>
          <span className="text-lg font-bold text-amber-700 whitespace-nowrap">
            {Number(pedido.total).toFixed(2)}€
          </span>
          {abierto
            ? <ChevronUp className="w-5 h-5 text-gray-400" />
            : <ChevronDown className="w-5 h-5 text-gray-400" />
          }
        </div>
      </button>

      {/* Detalles desplegables */}
      {abierto && (
        <div className="border-t border-gray-100 px-6 pb-5 pt-4 space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Productos
          </p>
          {pedido.detalles.map((det) => (
            <div key={det.id} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-amber-50 text-amber-700 text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                  {det.cantidad}
                </span>
                <span className="text-sm text-gray-800 font-medium">{det.producto.nombre}</span>
              </div>
              <span className="text-sm text-gray-600 font-semibold">
                {(Number(det.precioUnitario) * det.cantidad).toFixed(2)}€
              </span>
            </div>
          ))}
          <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center mt-2">
            <span className="text-sm font-semibold text-gray-600">Total</span>
            <span className="text-base font-bold text-amber-700">{Number(pedido.total).toFixed(2)}€</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Historial() {
  const { usuario } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario) return;
    getPedidosUsuario(usuario.id)
      .then(setPedidos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [usuario]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-amber-100 p-2.5 rounded-xl">
            <ClipboardList className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Pedidos</h1>
            <p className="text-gray-500 text-sm mt-0.5">Historial completo de tus compras</p>
          </div>
        </div>

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-20 animate-pulse border border-gray-100" />
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {!loading && !error && pedidos.length === 0 && (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-500">Todavía sin pedidos</h3>
            <p className="text-gray-400 text-sm mt-1">¡Haz tu primer pedido desde el menú!</p>
          </div>
        )}

        <div className="space-y-3">
          {pedidos.map((pedido) => (
            <PedidoCard key={pedido.id} pedido={pedido} />
          ))}
        </div>
      </main>
    </div>
  );
}
