import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { CategoryCard } from '../components/CategoryCard';
import { getProductos } from '../../services/api';

// Iconos por nombre de categoría (insensible a mayúsculas/tildes)
const CATEGORY_ICONS: Record<string, string> = {
  'bebidas calientes': '☕',
  'bebidas frías': '🥤',
  'bebidas frias': '🥤',
  'bocadillos': '🥖',
  'comidas': '🍽️',
};

const getIcon = (nombre: string) =>
  CATEGORY_ICONS[nombre.toLowerCase()] ?? '🍴';

interface Categoria {
  id: number;
  nombre: string;
}

export default function Home() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProductos()
      .then((productos: any[]) => {
        // Extraer categorías únicas de los productos (la API las incluye con include: { categoria: true })
        const seen = new Set<number>();
        const cats: Categoria[] = [];
        for (const p of productos) {
          if (p.categoria && !seen.has(p.categoria.id)) {
            seen.add(p.categoria.id);
            // Excluir la categoría "Extras" — se usa solo internamente en el modal de bocadillos
            if (p.categoria.nombre.toLowerCase() !== 'extras') {
              cats.push(p.categoria);
            }
          }
        }
        setCategorias(cats);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Bienvenido!</h2>
          <p className="text-gray-600">Selecciona una categoría para ver nuestros productos</p>
        </div>

        {loading && <p className="text-gray-500">Cargando categorías...</p>}
        {error && <p className="text-red-500">Error al cargar categorías: {error}</p>}

        <div className="grid gap-4 md:grid-cols-2">
          {categorias.map((cat) => (
            <CategoryCard
              key={cat.id}
              id={String(cat.id)}
              name={cat.nombre}
              icon={getIcon(cat.nombre)}
              description={cat.nombre}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
