import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    // Return empty array fallback on network/DB connection timeout
    return NextResponse.json({ products: [], error: "Gagal mengambil data produk" });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sku, name, description, price, originalPrice, unit, category, image, badge, stock, isActive } = body;

    // Validasi input
    if (!name || !price || !unit || !category || !image) {
      return NextResponse.json(
        { error: "Data produk tidak lengkap" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        sku: sku || null,
        name,
        description: description || "",
        price: parseInt(price),
        originalPrice: originalPrice ? parseInt(originalPrice) : null,
        unit,
        category,
        image,
        badge: badge || null,
        stock: stock ? parseInt(stock) : 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Gagal membuat produk" },
      { status: 500 }
    );
  }
}
