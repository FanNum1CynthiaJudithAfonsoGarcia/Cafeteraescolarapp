import { useParams, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../contexts/CartContext';
import { getProductos } from '../../services/api';

export default function Category() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [extrasCategoryId, setExtrasCategoryId] = useState<string | undefined>();
  const [bocadillosCategoryId, setBocadillosCategoryId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProductos()
      .then((data: any[]) => {
        // Mapear campos de la BD (schema Prisma) al formato Product del frontend
        const mapped: Product[] = data.map((p) => ({
          id: String(p.id),
          name: p.nombre,
          price: Number(p.precio),
          category: String(p.categoriaId),
          description: p.descripcion ?? '',
          image: p.imagen ?? '',
          allergens: p.alergenos
            ? p.alergenos.split(',').map((a: string) => a.trim())
            : [],
        }));
        setAllProducts(mapped);

        // El nombre de la categoría viene dentro de p.categoria.nombre (include en la API)
        const primerProductoDeCategoria = data.find(
          (p) => String(p.categoriaId) === categoryId
        );
        if (primerProductoDeCategoria?.categoria?.nombre) {
          setCategoryName(primerProductoDeCategoria.categoria.nombre);
        }

        // Detectar las categorías "Extras" y "Bocadillos" por nombre (insensible a mayúsculas)
        const categoriasUnicas = new Map<string, string>(); // nombre.lower -> id
        for (const p of data) {
          if (p.categoria?.nombre) {
            categoriasUnicas.set(p.categoria.nombre.toLowerCase(), String(p.categoriaId));
          }
        }
        setExtrasCategoryId(categoriasUnicas.get('extras'));
        setBocadillosCategoryId(categoriasUnicas.get('bocadillos'));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [categoryId]);

  // Filtrar por categoriaId numérico (llega como string en la URL)
  const categoryProducts = allProducts.filter(
    (product) => product.category === categoryId
  );

  if (!loading && !error && categoryName === null && categoryProducts.length === 0) {
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
          <h2 className="text-3xl font-bold text-gray-900">
            {categoryName ?? 'Categoría'}
          </h2>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Cargando productos...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">Error al cargar los productos: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categoryProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  extrasCategoryId={extrasCategoryId}
                  bocadillosCategoryId={bocadillosCategoryId}
                />
              ))}
            </div>

            {categoryProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No hay productos en esta categoría</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
