import { Product } from '../contexts/CartContext';

export const getCustomizationNames = (
  product: Product,
  customizations?: {
    extras?: string[];
    removed?: string[];
    breadType?: string;
  }
) => {
  if (!customizations) return null;

  const result: {
    breadName?: string;
    extraNames?: string[];
    removed?: string[];
  } = {};

  // Obtener nombre del pan
  if (customizations.breadType && product.customizationOptions?.breadOptions) {
    const breadOption = product.customizationOptions.breadOptions.find(
      (b) => b.id === customizations.breadType
    );
    if (breadOption) {
      result.breadName = breadOption.name;
    }
  }

  // Obtener nombres de extras
  if (customizations.extras && customizations.extras.length > 0 && product.customizationOptions?.extras) {
    result.extraNames = customizations.extras
      .map((extraId) => {
        const extra = product.customizationOptions?.extras?.find((e) => e.id === extraId);
        return extra?.name;
      })
      .filter(Boolean) as string[];
  }

  // Ingredientes removidos
  if (customizations.removed && customizations.removed.length > 0) {
    result.removed = customizations.removed;
  }

  return result;
};
