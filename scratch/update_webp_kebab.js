const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const map = {
  "Bakso Jeruk SB": "/images/bakso-jeruk-sb.webp",
  "Bakso Mekar Wangi": "/images/bakso-mekar-wangi.webp",
  "Bakso Super Essem Spesial": "/images/bakso-super-essem.webp",
  "Bakso Cita Rasa Premium": "/images/bakso-citra-rasa-premium.webp",
  "Mie Ayam Nasa": "/images/bakmie-ayam-nasa.webp",
  "Mie Ayam Resto Telur Bebek": "/images/bakmie-telor-bebek.webp",
  "Mie Keriting ACI": "/images/mie-keriting-aci.webp",
  "Kulit Pangsit Bawang Spesial Goreng": "/images/kulit-pangsit-sari-bawang.webp",
  "Kulit Pangsit Spesial Rebus Dan Goreng": "/images/kulit-pangsit-spesial-rebus-dan-goreng.webp",
  "Kulit Pangsit Dimsum": "/images/kulit-pangsit-dimsum-spesial-nasa.webp",
  "Bumbu Multi Guna (Kuah Bakso, Sop Daging/Iga, Nasi Goreng, Mie Goreng, Sayur Sop)": "/images/bumbu-kuah-bakso.webp",
  "Protein Nabati Cap Tiga Bintang": "/images/protein-nabati-cap-tiga-bintang.webp",
  "Saos Pedas Lima Delapan": "/images/saos-pedas-lima-delapan.webp",
  "Saos Pedas Asam Sambal Guna": "/images/saos-cabe-sambal-guna-pedas-asam.webp",
  "Saos Botol Pedas Mapan": "/images/saos-sambal-botol-lima-delapan.webp",
  "Kecap Manis Nasional": "/images/kecap-manis-nasional.webp",
  "Kecap Sari Sedap Manis": "/images/kecap-manis-sari-sedap.webp",
  "Kecap Manis Guna": "/images/kecap-manis-guna.webp",
  "Lada Bubuk": "/images/lada-bubuk-81.webp",
  "Sumpit Bambu Steril": "/images/lada-bubuk-81.webp"
};

async function main() {
  console.log("Updating product images to URL-safe webp filenames...");
  for (const [name, image] of Object.entries(map)) {
    const res = await prisma.product.updateMany({
      where: { name: name },
      data: { image: image }
    });
    console.log(`Updated ${name}: ${res.count} items -> ${image}`);
  }
  console.log("Done!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
