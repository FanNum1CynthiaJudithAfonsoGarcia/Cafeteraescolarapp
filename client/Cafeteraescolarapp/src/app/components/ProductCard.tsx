import { Plus } from 'lucide-react';
import { Product, useCart } from '../contexts/CartContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';
import { ProductCustomization } from './ProductCustomization';
import { ExtrasModal } from './ExtrasModal';

interface ProductCardProps {
  product: Product;
  /** ID de la categoría "Bocadillos" en la BD. Si el producto pertenece a ella,
   *  se abrirá el modal de extras al pulsar añadir. */
  bocadillosCategoryId?: string;
  /** ID de la categoría "Extras" en la BD. Se usa dentro del ExtrasModal para
   *  cargar los productos que son extras. */
  extrasCategoryId?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  bocadillosCategoryId,
  extrasCategoryId,
}) => {
  const { addToCart } = useCart();
  const [showCustomization, setShowCustomization] = useState(false);
  const [showExtras, setShowExtras] = useState(false);

  // Mostrar modal de extras si es bocadillo Y existe la categoría de extras en la BD
  const isBocadillo =
    !!bocadillosCategoryId &&
    !!extrasCategoryId &&
    product.category === bocadillosCategoryId;

  const handleAddToCart = () => {
    if (isBocadillo) {
      setShowExtras(true);
    } else if (product.customizable) {
      setShowCustomization(true);
    } else {
      addToCart(product);
    }
  };

  const handleCustomizationComplete = (
    customizations: any,
    customizationPrice: number
  ) => {
    addToCart(product, customizations, customizationPrice);
    setShowCustomization(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100">
        <div className="aspect-square overflow-hidden bg-gray-100">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-500 mb-2">{product.description}</p>

          {product.allergens && product.allergens.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-amber-700 mb-1">Alérgenos:</p>
              <p className="text-xs text-gray-600">{product.allergens.join(', ')}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-amber-700">
              {product.price.toFixed(2)}€
            </span>
            <button
              onClick={handleAddToCart}
              className="bg-amber-600 hover:bg-amber-700 text-white rounded-full p-2 transition-colors"
              aria-label={
                isBocadillo
                  ? 'Añadir con extras'
                  : product.customizable
                  ? 'Personalizar y añadir'
                  : 'Añadir al carrito'
              }
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {isBocadillo && (
            <p className="text-xs text-center text-amber-600 mt-2">
              + Extras disponibles
            </p>
          )}
          {!isBocadillo && product.customizable && (
            <p className="text-xs text-center text-amber-600 mt-2">
              Personalizable
            </p>
          )}
        </div>
      </div>

      {showCustomization && (
        <ProductCustomization
          product={product}
          onClose={() => setShowCustomization(false)}
          onAddToCart={handleCustomizationComplete}
        />
      )}

      {showExtras && extrasCategoryId && (
        <ExtrasModal
          product={product}
          extrasCategoryId={extrasCategoryId}
          onClose={() => setShowExtras(false)}
        />
      )}
    </>
  );
};