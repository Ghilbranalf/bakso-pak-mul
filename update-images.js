const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const map = {
  "Bakso Jeruk SB": "/images/Bakso Jeruk SB.png",
  "Bakso Mekar Wangi": "/images/Bakso Mekar Wangi.png",
  "Bakso Super Essem Spesial": "/images/Bakso Super Essem.png",
  "Bakso Cita Rasa Premium": "/images/Bakso CItra Rasa Premium.png",
  "Mie Ayam Nasa": "/images/Bakmie Ayam Nasa.png",
  "Mie Ayam Resto Telur Bebek": "/images/Bakmie Telor Bebek.png",
  "Mie Keriting ACI": "/images/Mie Keriting ACI.png",
  "Kulit Pangsit Bawang Spesial Goreng": "/images/Kulit Pangsit Sari Bawang.png",
  "Kulit Pangsit Spesial Rebus Dan Goreng": "/images/Kulit Pangsit Spesial Rebus Dan Goreng.png",
  "Kulit Pangsit Dimsum": "/images/Kulit Pangsit Dimsum Spesial Nasa.png",
  "Bumbu Multi Guna (Kuah Bakso, Sop Daging/Iga, Nasi Goreng, Mie Goreng, Sayur Sop)": "/images/Bumbu Kuah Bakso.png",
  "Protein Nabati Cap Tiga Bintang": "/images/Protein Nabati Cap Tiga Bintang.png",
  "Saos Pedas Lima Delapan": "/images/Saos Pedas Lima Delapan.png",
  "Saos Pedas Asam Sambal Guna": "/images/Saos Cabe Sambal Guna Pedas Asam.png",
  "Saos Botol Pedas Mapan": "/images/Saos Sambal Botol Lima Delapan.png",
  "Kecap Manis Nasional": "/images/Kecap Manis Nasional.png",
  "Kecap Sari Sedap Manis": "/images/Kecap Manis Sari Sedap.png",
  "Kecap Manis Guna": "/images/Kecap Manis Guna.png",
  "Lada Bubuk": "/images/Lada Bubuk 81.png"
};

async function main() {
  console.log("Updating product images...");
  for (const [name, image] of Object.entries(map)) {
    const res = await prisma.product.updateMany({
      where: { name: name },
      data: { image: image }
    });
    console.log(`Updated ${name}: ${res.count} items`);
  }
  console.log("Image update completed!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
