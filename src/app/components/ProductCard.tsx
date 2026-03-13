import { Plus } from 'lucide-react';
import { Product, useCart } from '../contexts/CartContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
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
        <p className="text-sm text-gray-500 mb-3">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-amber-700">
            {product.price.toFixed(2)}€
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-amber-600 hover:bg-amber-700 text-white rounded-full p-2 transition-colors"
            aria-label="Añadir al carrito"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
