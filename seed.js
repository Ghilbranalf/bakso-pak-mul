const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const products = [
  { name: "Bakso Jeruk SB", price: 60000, unit: "bungkus (50pcs)", category: "Bakso", image: "/images/Bakso Jeruk SB.png" },
  { name: "Bakso Mekar Wangi", price: 50000, unit: "bungkus (50pcs)", category: "Bakso", image: "/images/Bakso Mekar Wangi.png" },
  { name: "Bakso Super Essem Spesial", price: 75000, unit: "bks", category: "Bakso", badge: "Premium", image: "/images/Bakso Super Essem.png" },
  { name: "Bakso Cita Rasa Premium", price: 80000, unit: "bks", category: "Bakso", badge: "Terlaris", image: "/images/Bakso CItra Rasa Premium.png" },
  { name: "Mie Ayam Nasa", price: 20000, unit: "bks", category: "Mie & Kulit Pangsit", image: "/images/Bakmie Ayam Nasa.png" },
  { name: "Mie Ayam Resto Telur Bebek", price: 20000, unit: "bks", category: "Mie & Kulit Pangsit", image: "/images/Bakmie Telor Bebek.png" },
  { name: "Mie Keriting ACI", price: 15000, unit: "bks", category: "Mie & Kulit Pangsit", image: "/images/Mie Keriting ACI.png" },
  { name: "Kulit Pangsit Bawang Spesial Goreng", price: 20000, unit: "bks", category: "Mie & Kulit Pangsit", image: "/images/Kulit Pangsit Sari Bawang.png" },
  { name: "Kulit Pangsit Spesial Rebus Dan Goreng", price: 20000, unit: "bks", category: "Mie & Kulit Pangsit", image: "/images/Kulit Pangsit Spesial Rebus Dan Goreng.png" },
  { name: "Kulit Pangsit Dimsum", price: 20000, unit: "bks", category: "Mie & Kulit Pangsit", image: "/images/Kulit Pangsit Dimsum Spesial Nasa.png" },
  { name: "Bumbu Multi Guna (Kuah Bakso, Sop Daging/Iga, Nasi Goreng, Mie Goreng, Sayur Sop)", price: 30000, unit: "bks", category: "Bumbu & Saos", image: "/images/Bumbu Kuah Bakso.png" },
  { name: "Protein Nabati Cap Tiga Bintang", price: 15000, unit: "bks", category: "Bumbu & Saos", image: "/images/Protein Nabati Cap Tiga Bintang.png" },
  { name: "Saos Pedas Lima Delapan", price: 8000, unit: "bks", category: "Bumbu & Saos", image: "/images/Saos Pedas Lima Delapan.png" },
  { name: "Saos Pedas Asam Sambal Guna", price: 10000, unit: "bks", category: "Bumbu & Saos", image: "/images/Saos Cabe Sambal Guna Pedas Asam.png" },
  { name: "Saos Botol Pedas Mapan", price: 10000, unit: "bks", category: "Bumbu & Saos", image: "/images/Saos Sambal Botol Lima Delapan.png" },
  { name: "Kecap Manis Nasional", price: 10000, unit: "bks", category: "Bumbu & Saos", image: "/images/Kecap Manis Nasional.png" },
  { name: "Kecap Sari Sedap Manis", price: 10000, unit: "bks", category: "Bumbu & Saos", image: "/images/Kecap Manis Sari Sedap.png" },
  { name: "Kecap Manis Guna", price: 15000, unit: "bks", category: "Bumbu & Saos", image: "/images/Kecap Manis Guna.png" },
  { name: "Lada Bubuk", price: 8000, unit: "bks", category: "Bumbu & Saos", image: "/images/Lada Bubuk 81.png" },
  { name: "Sumpit Bambu Steril", price: 100, unit: "pasang", category: "Pelengkap", badge: "Hemat", image: "/images/Lada Bubuk 81.png" },
];

async function main() {
  console.log("Menghapus pesanan lama (krn nyambung ke produk)...");
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});

  console.log("Menghapus produk lama...");
  await prisma.product.deleteMany({});
  
  console.log("Menambahkan produk baru...");
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    await prisma.product.create({
      data: {
        sku: `BPM-${String(i+1).padStart(3, '0')}`,
        name: p.name,
        price: p.price,
        unit: p.unit,
        category: p.category,
        image: p.image,
        badge: p.badge || null,
        stock: 100,
        isActive: true,
      }
    });
  }
  console.log("Selesai!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
