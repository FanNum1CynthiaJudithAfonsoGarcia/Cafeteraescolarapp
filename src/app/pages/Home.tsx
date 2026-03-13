import { Header } from '../components/Header';
import { CategoryCard } from '../components/CategoryCard';
import { categories } from '../data/products';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Bienvenido!</h2>
          <p className="text-gray-600">Selecciona una categoría para ver nuestros productos</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              name={category.name}
              icon={category.icon}
              description={category.description}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
