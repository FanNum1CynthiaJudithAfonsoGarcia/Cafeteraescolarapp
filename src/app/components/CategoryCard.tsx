import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';

interface CategoryCardProps {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ id, name, icon, description }) => {
  return (
    <Link 
      to={`/category/${id}`}
      className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-amber-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-4xl">{icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
      </div>
    </Link>
  );
};
