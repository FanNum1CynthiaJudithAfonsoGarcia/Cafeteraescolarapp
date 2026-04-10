import { useEffect, useState } from 'react';
import { X, Plus, Minus, ShoppingCart, Loader2 } from 'lucide-react';
import { Product, useCart } from '../contexts/CartContext';
import { getProductos } from '../../services/api';

interface ExtraItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ExtrasModalProps {
  product: Product;           // El bocadillo al que se añaden extras
  extrasCategoryId: string;   // ID numérico (como string) de la categoría "Extras" en la BD
  onClose: () => void;
}

export const ExtrasModal: React.FC<ExtrasModalProps> = ({
  product,
  extrasCategoryId,
  onClose,
}) => {
  const { addToCart } = useCart();
  const [extras, setExtras] = useState<ExtraItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar los productos de la categoría "Extras" desde la BD
  useEffect(() => {
    getProductos()
      .then((data: any[]) => {
        const extrasFromDB = data
          .filter((p) => String(p.categoriaId) === extrasCategoryId)
          .map((p) => ({
            id: String(p.id),
            name: p.nombre,
            price: Number(p.precio),
            quantity: 0,
          }));
        setExtras(extrasFromDB);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [extrasCategoryId]);

  const changeQty = (id: string, delta: number) => {
    setExtras((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, quantity: Math.max(0, e.quantity + delta) } : e
      )
    );
  };

  const selectedExtras = extras.filter((e) => e.quantity > 0);
  const extrasPrice = selectedExtras.reduce(
    (sum, e) => sum + e.price * e.quantity,
    0
  );
  const totalPrice = product.price + extrasPrice;

  const handleConfirm = () => {
    // Construir la lista de nombres de extras para el ticket
    // (repite el nombre tantas veces como unidades se hayan pedido)
    const extrasNames = selectedExtras.flatMap((e) =>
      Array(e.quantity).fill(e.name)
    );

    addToCart(
      product,
      { extras: extrasNames },
      extrasPrice
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Añadir Extras</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Para tu{' '}
              <span className="font-medium text-amber-700">{product.name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Lista de extras */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading && (
            <div className="flex items-center justify-center py-12 gap-3 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Cargando extras...</span>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-center py-8">Error: {error}</p>
          )}

          {!loading && !error && extras.length === 0 && (
            <p className="text-gray-400 text-center py-8">
              No hay extras disponibles.
            </p>
          )}

          {!loading && !error && extras.length > 0 && (
            <div className="space-y-2">
              {extras.map((extra) => (
                <div
                  key={extra.id}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    extra.quantity > 0
                      ? 'border-amber-400 bg-amber-50'
                      : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                  }`}
                >
                  <div>
                    <p className="font-medium text-gray-900">{extra.name}</p>
                    <p className="text-sm text-amber-700 font-semibold">
                      +{extra.price.toFixed(2)}€ / ud.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => changeQty(extra.id, -1)}
                      disabled={extra.quantity === 0}
                      className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Reducir cantidad"
                    >
                      <Minus className="w-4 h-4 text-gray-700" />
                    </button>
                    <span className="w-5 text-center font-semibold text-gray-900">
                      {extra.quantity}
                    </span>
                    <button
                      onClick={() => changeQty(extra.id, 1)}
                      className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center hover:bg-amber-700 transition-colors"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer con resumen y confirmación */}
        <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 rounded-b-2xl">
          {selectedExtras.length > 0 && (
            <div className="mb-3 space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Extras seleccionados
              </p>
              {selectedExtras.map((e) => (
                <div
                  key={e.id}
                  className="flex justify-between text-sm text-gray-700"
                >
                  <span>
                    {e.name}
                    {e.quantity > 1 && (
                      <span className="text-gray-400"> ×{e.quantity}</span>
                    )}
                  </span>
                  <span className="text-amber-700 font-medium">
                    +{(e.price * e.quantity).toFixed(2)}€
                  </span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-2 mt-2" />
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 text-sm">Total</span>
            <span className="text-2xl font-bold text-amber-700">
              {totalPrice.toFixed(2)}€
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors font-medium"
            >
              Sin extras
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
