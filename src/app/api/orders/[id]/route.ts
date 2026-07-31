import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: id },
          { orderNumber: id }
        ]
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error("Error fetching order detail:", error);
    return NextResponse.json({ error: "Gagal mengambil detail order" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "Status harus diisi" }, { status: 400 });
    }

    // Find order first by ID or orderNumber
    const targetOrder = await prisma.order.findFirst({
      where: {
        OR: [
          { id: id },
          { orderNumber: id }
        ]
      }
    });

    if (!targetOrder) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: targetOrder.id },
      data: { status }
    });

    return NextResponse.json({ order: updatedOrder });
  } catch (error: any) {
    console.error("Error updating order status:", error);
    return NextResponse.json({ error: "Gagal mengubah status pesanan" }, { status: 500 });
  }
}
