import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Build the query
    const query: any = {
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    };

    // If userId is provided, filter by it (useful when you have auth implemented)
    // if (userId) {
    //   query.where = { userId };
    // }

    const orders = await prisma.order.findMany(query);

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data pesanan" },
      { status: 500 }
    );
  }
}
