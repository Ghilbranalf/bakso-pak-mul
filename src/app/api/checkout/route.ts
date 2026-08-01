import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { notifyNewOrderWhatsApp } from "@/lib/fonnte";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      city,
      province,
      notes,
      paymentMethod = "MIDTRANS",
      items = [],
    } = body;

    if (!customerName || !customerPhone || !shippingAddress || items.length === 0) {
      return NextResponse.json(
        { error: "Data pesanan atau item keranjang tidak lengkap." },
        { status: 400 }
      );
    }

    // Try to get authenticated Supabase user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let userId: string | null = null;

    if (user) {
      // Ensure user exists in Prisma DB
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { id: user.id },
            { email: user.email || customerEmail }
          ]
        }
      });

      if (!existingUser) {
        const created = await prisma.user.create({
          data: {
            id: user.id,
            email: user.email || customerEmail || `${user.id}@user.com`,
            name: customerName,
          }
        });
        userId = created.id;
      } else {
        userId = existingUser.id;
      }
    }

    // Generate unique order number: BPM-YYYYMMDD-XXXX
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `BPM-${dateStr}-${randomDigits}`;

    // Calculate totals
    const subtotal = items.reduce(
      (acc: number, item: any) => acc + (Number(item.price) * Number(item.quantity)),
      0
    );
    const shippingCost = Number(body.shippingFee || body.shippingCost || 0);
    const finalTotal = subtotal + shippingCost;

    // Create Order in DB according to exact Prisma schema
    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        customerName,
        phone: customerPhone,
        address: shippingAddress,
        city: city || "Jakarta Timur",
        province: province || "DKI Jakarta",
        notes: notes || null,
        status: "PENDING",
        shippingCost,
        discount: 0,
        finalTotal,
        paymentType: paymentMethod,
        items: {
          create: items.map((item: any) => ({
            product: { connect: { id: item.id } },
            quantity: Number(item.quantity),
            priceAtTime: Number(item.price),
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // Clear cart in DB if user logged in
    if (userId) {
      const cart = await prisma.cart.findUnique({ where: { userId } });
      if (cart) {
        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      }
    }

    // Send automated background WA notification via Fonnte Gateway
    try {
      notifyNewOrderWhatsApp({
        orderNumber: newOrder.orderNumber,
        customerName: newOrder.customerName,
        phone: newOrder.phone,
        address: newOrder.address,
        finalTotal: newOrder.finalTotal,
        paymentType: newOrder.paymentType,
      });
    } catch (waErr) {
      console.warn("Fonnte WA push notification skipped:", waErr);
    }

    return NextResponse.json({
      success: true,
      orderNumber: newOrder.orderNumber,
      orderId: newOrder.id,
      order: newOrder,
    });
  } catch (error: any) {
    console.error("Checkout Error:", error);
    return NextResponse.json(
      { error: "Gagal memproses pesanan.", details: error.message },
      { status: 500 }
    );
  }
}
