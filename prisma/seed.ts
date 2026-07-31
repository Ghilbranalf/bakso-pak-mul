import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const products = [
    {
      id: "prod_1",
      name: "Bakso Sapi Super Polos (50pcs) - Vacuum Pack",
      price: 75000,
      unit: "Vacuum Pack",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoSn1QFRuBtno28pVjYK6N4_y85CUzc2yG57z8lGFD9tGlkMGeRAFGrNx4-Z72V88egcpEkTE39DtNOyJ26myXEM6O_Imnwsl1htytvOnRsOEeqC4tCxDCQWEvzoodMx3gHAPlWpz26c90gG4c_Hh5wJ-YZ5LqWAh3fZ58nak9RyNJR3Tt6v7-EEq7qtQlvJqKTAUyflIwlD6rwfTwwoC0mStIFfdE6EGL_3dw3u6kMYbrvVsXsZZgSq1pU8cwv36nii7mGTn2UWwg",
      category: "Bakso Super",
      stock: 100
    },
    {
      id: "prod_2",
      name: "Bakso Sapi Urat Spesial (50pcs) - B2B Pack",
      price: 90000,
      unit: "B2B Pack",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1w0vvJSrk1eft-6aivgFBVz2UkU6lb-RfllLPk-ymAkWrV9PZK3vhLgJvY7LZAWUDySVqhdJjqkx8-LAkEaMJXBdn1sPWzS_ssGW45PwPWlJE_j8tQCQHBbWkdtZdJBdqpkd-3eIDHxlzUvLFy6PUK69llfBqpoljJ00hut_MfDI16EuJX_mAbPqx7SQrOo2dKDS01NOadT5VN0ErKkZNIgmSfbgtHdB_gat4PxbOAwvXQbVBQfzEAYHiootUKw9EUnFvmGHc_SUz",
      category: "Bakso Urat",
      stock: 100
    },
    {
      id: "prod_3",
      name: "Mie Kuning Premium 225 (Bal 5kg) - Fresh Daily",
      price: 45000,
      unit: "Bal 5kg",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBeERQB6nMx75KBcf6lslRry7PYbawSP6-NPJc7RKAqynsAtF0AXjCS1gBHEoJx4XhMqGkyRtfAQY_fsEGpD8ia4m1bYw5YxLAxXF4VAPh3TjtQDCMHOt3KpEtJ8P2ETN4P9ljqf57skiL8Ds7VkqnrqEcfbKbZaYqVdDCqskoJUhlSUouIH0Xcw93HNjE73LtoSV4KBbzx89RYqI8Qt-YV3Z35CZgX1Q6HMVBwq5VwkBJ2N_fJ7LFuIEaStAlQLHP-6GBSmuJe_Q7w",
      category: "Mie 225",
      stock: 100
    },
    {
      id: "prod_4",
      name: "Bumbu Kuah Bakso Rahasia Pak Mul (5L) - Special Edition",
      price: 210000,
      unit: "Jerigen 5L",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdQO1Re968kIIdcQ4nrphEVBEUVRNCPBJdvbaOyveLwYQ4yUKq2qMiAOCWnwlNf3kwKwdCxdHO2USsV-jBywZJbeGfC7enmeu4RNV_aBYwyclLtw61JXtY8IJGW0HW2r8vk12NSSrN574CNBm1aIKUyIjbIdFSkd9LumyJkEcVDQF1ezyBs_RxspA25XpwQbCw8uekXiWZyvyaUqutQIafFiPxphZd63L00Jmn40uJt6MflorntExDrkNnrdWesrOOPj9a-u-AQ3XH",
      category: "Signature Series",
      stock: 50
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product,
    })
  }

  console.log("Seeding finished.")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
