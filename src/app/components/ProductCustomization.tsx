import { useState } from 'react';
import { X, Plus, Minus, AlertCircle } from 'lucide-react';
import { Product } from '../contexts/CartContext';

interface ProductCustomizationProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (customizations: any, customizationPrice: number) => void;
}

export const ProductCustomization: React.FC<ProductCustomizationProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [selectedBread, setSelectedBread] = useState<string>(
    product.customizationOptions?.breadOptions?.[0]?.id || ''
  );

  const toggleExtra = (extraId: string) => {
    setSelectedExtras((prev) =>
      prev.includes(extraId)
        ? prev.filter((id) => id !== extraId)
        : [...prev, extraId]
    );
  };

  const toggleRemove = (ingredient: string) => {
    setRemovedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((i) => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  const calculateCustomizationPrice = () => {
    let total = 0;

    // Precio de extras
    selectedExtras.forEach((extraId) => {
      const extra = product.customizationOptions?.extras?.find((e) => e.id === extraId);
      if (extra) total += extra.price;
    });

    // Precio del pan
    const breadOption = product.customizationOptions?.breadOptions?.find(
      (b) => b.id === selectedBread
    );
    if (breadOption) total += breadOption.price;

    return total;
  };

  const handleAddToCart = () => {
    const customizations = {
      extras: selectedExtras,
      removed: removedIngredients,
      breadType: selectedBread,
    };
    onAddToCart(customizations, calculateCustomizationPrice());
  };

  const totalPrice = product.price + calculateCustomizationPrice();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Personalizar {product.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Alérgenos */}
          {product.allergens && product.allergens.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-1">Alérgenos</h3>
                  <p className="text-sm text-amber-800">
                    {product.allergens.join(', ')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Opciones de pan */}
          {product.customizationOptions?.breadOptions && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Tipo de Pan</h3>
              <div className="space-y-2">
                {product.customizationOptions.breadOptions.map((breadOption) => (
                  <label
                    key={breadOption.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="bread"
                        checked={selectedBread === breadOption.id}
                        onChange={() => setSelectedBread(breadOption.id)}
                        className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-gray-900">{breadOption.name}</span>
                    </div>
                    {breadOption.price > 0 && (
                      <span className="text-amber-700 font-medium">
                        +{breadOption.price.toFixed(2)}€
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Ingredientes a quitar */}
          {product.customizationOptions?.removable && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Quitar Ingredientes</h3>
              <div className="flex flex-wrap gap-2">
                {product.customizationOptions.removable.map((ingredient) => (
                  <button
                    key={ingredient}
                    onClick={() => toggleRemove(ingredient)}
                    className={`px-4 py-2 rounded-full border-2 transition-all ${
                      removedIngredients.includes(ingredient)
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {removedIngredients.includes(ingredient) && <Minus className="w-4 h-4" />}
                      {ingredient}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Extras */}
          {product.customizationOptions?.extras && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Añadir Extras</h3>
              <div className="space-y-2">
                {product.customizationOptions.extras.map((extra) => (
                  <label
                    key={extra.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedExtras.includes(extra.id)}
                        onChange={() => toggleExtra(extra.id)}
                        className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                      />
                      <span className="text-gray-900">{extra.name}</span>
                    </div>
                    <span className="text-amber-700 font-medium">
                      +{extra.price.toFixed(2)}€
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">Precio Total</span>
            <span className="text-2xl font-bold text-amber-700">
              {totalPrice.toFixed(2)}€
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Añadir al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};
