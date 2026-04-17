import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const imagenes: { id: number; imagen: string }[] = [
  // Bebidas calientes
  { id: 1,  imagen: '/CafeSolo.png' },
  { id: 2,  imagen: '/CafeLeche.png' },
  { id: 3,  imagen: '/CafeLeche2.png' },
  { id: 4,  imagen: '/CafeLeche.png' },
  { id: 5,  imagen: '/CafeLeche.png' },
  { id: 6,  imagen: '/CafeLeche2.png' },
  { id: 7,  imagen: '/Cacao.png' },
  { id: 8,  imagen: '/CafeLeche.png' },
  { id: 9,  imagen: '/CafeLeche.png' },
  { id: 10, imagen: '/CafeLeche2.png' },
  { id: 11, imagen: '/CafeLeche.png' },   // Infusión (mejor foto que tienes)

  // Golosinas
  { id: 12, imagen: '/Galletas.png' },
  { id: 13, imagen: '/Palitos.png' },     // Barquillo → Palitos
  { id: 14, imagen: '/Golosinas.png' },   // Papas
  { id: 15, imagen: '/Barritas.png' },
  { id: 16, imagen: '/Tortitas.png' },
  { id: 17, imagen: '/Golosinas.png' },   // Caramelos

  // Bebidas frías
  { id: 18, imagen: '/Zumo1.png' },
  { id: 19, imagen: '/Zumo1.png' },
  { id: 20, imagen: '/Agua.png' },
  { id: 21, imagen: '/Agua.png' },
  { id: 22, imagen: '/RefrescoZero.png' },

  // Bocadillos
  { id: 23,    imagen: '/BocataEmbutido.png' },
  { id: 24,    imagen: '/BocataEmbutido.png' },
  { id: 25,    imagen: '/BocataSerrano.png' },
  { id: 26,    imagen: '/BocataTortilla.png' },
  { id: 27,    imagen: '/BocataPechuga.png' },
  { id: 28,    imagen: '/BocataVegetal.png' },
  { id: 29,    imagen: '/BocataEmbutido.png' }, // Pulguita pan integral
  { id: 30001, imagen: '/CroissantVegetal.png' },
  { id: 60001, imagen: '/BocataEmbutido.png' },  // Lomo adobado
  { id: 90001, imagen: '/CroissantVegetal.png' },
  { id: 90002, imagen: '/SanwiMixto.png' },
  { id: 90003, imagen: '/CroisanMixto.png' },
];

async function main() {
  console.log(`Actualizando ${imagenes.length} productos...`);

  for (const { id, imagen } of imagenes) {
    await prisma.producto.update({
      where: { id },
      data: { imagen },
    });
    console.log(`  ✓ id=${id} → ${imagen}`);
  }

  console.log('\n✅ Todas las imágenes actualizadas correctamente.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
