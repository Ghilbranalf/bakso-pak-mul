const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const products = [
  { name: "Bakso Jeruk SB", price: 60000, unit: "bungkus (50pcs)", category: "Bakso", image: "/images/bakso-jeruk-sb.webp" },
  { name: "Bakso Mekar Wangi", price: 50000, unit: "bungkus (50pcs)", category: "Bakso", image: "/images/bakso-mekar-wangi.webp" },
  { name: "Bakso Super Essem Spesial", price: 75000, unit: "bks", category: "Bakso", badge: "Premium", image: "/images/bakso-super-essem.webp" },
  { name: "Bakso Cita Rasa Premium", price: 80000, unit: "bks", category: "Bakso", badge: "Terlaris", image: "/images/bakso-citra-rasa-premium.webp" },
  { name: "Mie Ayam Nasa", price: 20000, unit: "bks", category: "Mie & Kulit Pangsit", image: "/images/bakmie-ayam-nasa.webp" },
  { name: "Mie Ayam Resto Telur Bebek", price: 20000, unit: "bks", category: "Mie & Kulit Pangsit", image: "/images/bakmie-telor-bebek.webp" },
  { name: "Mie Keriting ACI", price: 15000, unit: "bks", category: "Mie & Kulit Pangsit", image: "/images/mie-keriting-aci.webp" },
  { name: "Kulit Pangsit Bawang Spesial Goreng", price: 20000, unit: "bks", category: "Mie & Kulit Pangsit", image: "/images/kulit-pangsit-sari-bawang.webp" },
  { name: "Kulit Pangsit Spesial Rebus Dan Goreng", price: 20000, unit: "bks", category: "Mie & Kulit Pangsit", image: "/images/kulit-pangsit-spesial-rebus-dan-goreng.webp" },
  { name: "Kulit Pangsit Dimsum", price: 20000, unit: "bks", category: "Mie & Kulit Pangsit", image: "/images/kulit-pangsit-dimsum-spesial-nasa.webp" },
  { name: "Bumbu Multi Guna (Kuah Bakso, Sop Daging/Iga, Nasi Goreng, Mie Goreng, Sayur Sop)", price: 30000, unit: "bks", category: "Bumbu & Saos", image: "/images/bumbu-kuah-bakso.webp" },
  { name: "Protein Nabati Cap Tiga Bintang", price: 15000, unit: "bks", category: "Bumbu & Saos", image: "/images/protein-nabati-cap-tiga-bintang.webp" },
  { name: "Saos Pedas Lima Delapan", price: 8000, unit: "bks", category: "Bumbu & Saos", image: "/images/saos-pedas-lima-delapan.webp" },
  { name: "Saos Pedas Asam Sambal Guna", price: 10000, unit: "bks", category: "Bumbu & Saos", image: "/images/saos-cabe-sambal-guna-pedas-asam.webp" },
  { name: "Saos Botol Pedas Mapan", price: 10000, unit: "bks", category: "Bumbu & Saos", image: "/images/saos-sambal-botol-lima-delapan.webp" },
  { name: "Kecap Manis Nasional", price: 10000, unit: "bks", category: "Bumbu & Saos", image: "/images/kecap-manis-nasional.webp" },
  { name: "Kecap Sari Sedap Manis", price: 10000, unit: "bks", category: "Bumbu & Saos", image: "/images/kecap-manis-sari-sedap.webp" },
  { name: "Kecap Manis Guna", price: 15000, unit: "bks", category: "Bumbu & Saos", image: "/images/kecap-manis-guna.webp" },
  { name: "Lada Bubuk", price: 8000, unit: "bks", category: "Bumbu & Saos", image: "/images/lada-bubuk-81.webp" },
  { name: "Sumpit Bambu Steril", price: 100, unit: "pasang", category: "Pelengkap", badge: "Hemat", image: "/images/lada-bubuk-81.webp" },
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
