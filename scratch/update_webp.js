const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateToWebp() {
  const products = await prisma.product.findMany();
  for (const p of products) {
    if (p.image && (p.image.endsWith('.png') || p.image.endsWith('.jpg'))) {
      const newImg = p.image.replace(/\.(png|jpg)$/i, '.webp');
      await prisma.product.update({
        where: { id: p.id },
        data: { image: newImg }
      });
      console.log(`Updated ${p.name}: ${p.image} -> ${newImg}`);
    }
  }
}

updateToWebp()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
