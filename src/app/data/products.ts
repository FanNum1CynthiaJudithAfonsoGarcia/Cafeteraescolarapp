import { Product } from '../contexts/CartContext';

export const products: Product[] = [
  // Bebidas Calientes
  {
    id: '1',
    name: 'Café Latte',
    price: 2.50,
    category: 'bebidas-calientes',
    image: 'https://images.unsplash.com/photo-1622868300874-0a1c2a9458fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjdXAlMjBsYXR0ZXxlbnwxfHx8fDE3NzMzMzAwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Café espresso con leche vaporizada',
  },
  {
    id: '2',
    name: 'Capuchino',
    price: 2.30,
    category: 'bebidas-calientes',
    image: 'https://images.unsplash.com/photo-1622868300874-0a1c2a9458fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjdXAlMjBsYXR0ZXxlbnwxfHx8fDE3NzMzMzAwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Espresso con espuma de leche',
  },
  {
    id: '3',
    name: 'Chocolate Caliente',
    price: 2.80,
    category: 'bebidas-calientes',
    image: 'https://images.unsplash.com/photo-1730390772222-fb05e3882284?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3QlMjBjaG9jb2xhdGUlMjBtdWd8ZW58MXx8fHwxNzczNDE0MDcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Chocolate caliente con nata',
  },
  {
    id: '4',
    name: 'Té Verde',
    price: 1.80,
    category: 'bebidas-calientes',
    image: 'https://images.unsplash.com/photo-1622868300874-0a1c2a9458fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjdXAlMjBsYXR0ZXxlbnwxfHx8fDE3NzMzMzAwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Té verde natural',
  },

  // Bebidas Frías
  {
    id: '5',
    name: 'Café Helado',
    price: 3.00,
    category: 'bebidas-frias',
    image: 'https://images.unsplash.com/photo-1684439670717-b1147a7e7534?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpY2VkJTIwY29mZmVlJTIwZHJpbmt8ZW58MXx8fHwxNzczMjk5MjgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Café frío con hielo',
  },
  {
    id: '6',
    name: 'Zumo Natural',
    price: 2.50,
    category: 'bebidas-frias',
    image: 'https://images.unsplash.com/photo-1673090431108-014275c62265?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcnVpdCUyMGp1aWNlJTIwZ2xhc3N8ZW58MXx8fHwxNzczNDE0MDczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Zumo recién exprimido',
  },
  {
    id: '7',
    name: 'Smoothie de Frutas',
    price: 3.50,
    category: 'bebidas-frias',
    image: 'https://images.unsplash.com/photo-1673090431108-014275c62265?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcnVpdCUyMGp1aWNlJTIwZ2xhc3N8ZW58MXx8fHwxNzczNDE0MDczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Batido de frutas naturales',
  },
  {
    id: '8',
    name: 'Agua Mineral',
    price: 1.20,
    category: 'bebidas-frias',
    image: 'https://images.unsplash.com/photo-1673090431108-014275c62265?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcnVpdCUyMGp1aWNlJTIwZ2xhc3N8ZW58MXx8fHwxNzczNDE0MDczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Agua mineral natural',
  },

  // Bocadillos
  {
    id: '9',
    name: 'Sandwich Mixto',
    price: 3.50,
    category: 'bocadillos',
    image: 'https://images.unsplash.com/photo-1572982270458-ad80e5fcc49a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbmR3aWNoJTIwY2FmZXxlbnwxfHx8fDE3NzMzODEzMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Jamón y queso en pan blanco',
    allergens: ['Gluten', 'Lácteos'],
    customizable: true,
    customizationOptions: {
      extras: [
        { id: 'pechuga', name: 'Pechuga de pollo', price: 1.50 },
        { id: 'bacon', name: 'Bacon', price: 1.00 },
        { id: 'aguacate', name: 'Aguacate', price: 0.80 },
        { id: 'tomate', name: 'Tomate extra', price: 0.30 },
      ],
      removable: ['Lechuga', 'Tomate', 'Cebolla', 'Mayonesa'],
      breadOptions: [
        { id: 'blanco', name: 'Pan blanco', price: 0 },
        { id: 'integral', name: 'Pan integral', price: 0.50 },
        { id: 'sin-gluten', name: 'Pan sin gluten', price: 1.00 },
      ],
    },
  },
  {
    id: '10',
    name: 'Bagel con Queso',
    price: 2.80,
    category: 'bocadillos',
    image: 'https://images.unsplash.com/photo-1707144289499-8903dc4929c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWdlbCUyMGJyZWFrZmFzdHxlbnwxfHx8fDE3NzM0MTQwNzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Bagel tostado con queso crema',
    allergens: ['Gluten', 'Lácteos'],
    customizable: true,
    customizationOptions: {
      extras: [
        { id: 'salmon', name: 'Salmón ahumado', price: 2.00 },
        { id: 'aguacate', name: 'Aguacate', price: 0.80 },
      ],
      removable: ['Queso crema'],
      breadOptions: [
        { id: 'normal', name: 'Bagel normal', price: 0 },
        { id: 'sin-gluten', name: 'Bagel sin gluten', price: 1.00 },
      ],
    },
  },
  {
    id: '11',
    name: 'Croissant',
    price: 2.00,
    category: 'bocadillos',
    image: 'https://images.unsplash.com/photo-1712723247648-64a03ba7c333?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9pc3NhbnQlMjBwYXN0cnl8ZW58MXx8fHwxNzczNDE0MDcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Croissant de mantequilla',
    allergens: ['Gluten', 'Lácteos', 'Huevo'],
  },
  {
    id: '12',
    name: 'Tostada Integral',
    price: 2.20,
    category: 'bocadillos',
    image: 'https://images.unsplash.com/photo-1707144289499-8903dc4929c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWdlbCUyMGJyZWFrZmFzdHxlbnwxfHx8fDE3NzM0MTQwNzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Tostada con aceite y tomate',
    allergens: ['Gluten'],
    customizable: true,
    customizationOptions: {
      extras: [
        { id: 'jamon', name: 'Jamón serrano', price: 1.20 },
      ],
      removable: ['Tomate', 'Aceite'],
    },
  },

  // Comidas
  {
    id: '13',
    name: 'Ensalada César',
    price: 4.50,
    category: 'comidas',
    image: 'https://images.unsplash.com/photo-1649531794884-b8bb1de72e68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxhZCUyMGJvd2wlMjBoZWFsdGh5fGVufDF8fHx8MTc3MzQxMjA4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Lechuga, pollo, parmesano y salsa césar',
    allergens: ['Lácteos', 'Huevo', 'Pescado'],
    customizable: true,
    customizationOptions: {
      extras: [
        { id: 'pollo-extra', name: 'Pollo extra', price: 1.50 },
        { id: 'bacon', name: 'Bacon crujiente', price: 1.00 },
      ],
      removable: ['Pollo', 'Parmesano', 'Crutones'],
    },
  },
  {
    id: '14',
    name: 'Wrap de Pollo',
    price: 4.80,
    category: 'comidas',
    image: 'https://images.unsplash.com/photo-1572982270458-ad80e5fcc49a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbmR3aWNoJTIwY2FmZXxlbnwxfHx8fDE3NzMzODEzMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Tortilla con pollo, lechuga y tomate',
    allergens: ['Gluten'],
    customizable: true,
    customizationOptions: {
      extras: [
        { id: 'queso', name: 'Queso cheddar', price: 0.80 },
        { id: 'guacamole', name: 'Guacamole', price: 1.00 },
      ],
      removable: ['Lechuga', 'Tomate', 'Salsa'],
    },
  },
  {
    id: '15',
    name: 'Pasta Carbonara',
    price: 5.50,
    category: 'comidas',
    image: 'https://images.unsplash.com/photo-1649531794884-b8bb1de72e68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxhZCUyMGJvd2wlMjBoZWFsdGh5fGVufDF8fHx8MTc3MzQxMjA4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Pasta con salsa carbonara',
    allergens: ['Gluten', 'Lácteos', 'Huevo'],
  },
  {
    id: '16',
    name: 'Bowl Vegetariano',
    price: 5.00,
    category: 'comidas',
    image: 'https://images.unsplash.com/photo-1649531794884-b8bb1de72e68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxhZCUyMGJvd2wlMjBoZWFsdGh5fGVufDF8fHx8MTc3MzQxMjA4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Bowl con verduras frescas y quinoa',
    allergens: ['Frutos secos'],
    customizable: true,
    customizationOptions: {
      extras: [
        { id: 'tofu', name: 'Tofu marinado', price: 1.50 },
        { id: 'aguacate', name: 'Aguacate', price: 0.80 },
      ],
      removable: ['Quinoa', 'Frutos secos'],
    },
  },
];

export const categories = [
  {
    id: 'bebidas-calientes',
    name: 'Bebidas Calientes',
    icon: '☕',
    description: 'Café, té y más',
  },
  {
    id: 'bebidas-frias',
    name: 'Bebidas Frías',
    icon: '🥤',
    description: 'Refrescos y zumos',
  },
  {
    id: 'bocadillos',
    name: 'Bocadillos',
    icon: '🥖',
    description: 'Sandwiches y más',
  },
  {
    id: 'comidas',
    name: 'Comidas',
    icon: '🍽️',
    description: 'Platos principales',
  },
];