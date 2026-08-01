import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.trim();

    if (!query) {
      return NextResponse.json({ error: "Nomor ID Pesanan wajib diisi" }, { status: 400 });
    }

    // Clean query (remove leading # if user enters #ORD-xxx)
    const cleanNumber = query.replace(/^#/, "");

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { orderNumber: { equals: cleanNumber, mode: "insensitive" } },
          { orderNumber: { equals: query, mode: "insensitive" } },
          { id: { equals: cleanNumber, mode: "insensitive" } },
        ],
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Pesanan dengan ID tersebut tidak ditemukan. Mohon periksa kembali nomor ID Anda." }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error tracking order:", error);
    return NextResponse.json({ error: "Gagal mengambil data lacak pesanan" }, { status: 500 });
  }
}
