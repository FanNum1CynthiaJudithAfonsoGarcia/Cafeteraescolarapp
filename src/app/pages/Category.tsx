import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { products, categories } from '../data/products';

export default function Category() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const category = categories.find((cat) => cat.id === categoryId);
  const categoryProducts = products.filter((product) => product.category === categoryId);

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <p className="text-center text-gray-500">Categoría no encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a categorías
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{category.icon}</span>
            <h2 className="text-3xl font-bold text-gray-900">{category.name}</h2>
          </div>
          <p className="text-gray-600">{category.description}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {categoryProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay productos en esta categoría</p>
          </div>
        )}
      </main>
    </div>
  );
}
