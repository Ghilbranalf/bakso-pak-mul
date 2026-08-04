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

    // Try to get authenticated Supabase user safely
    let userId: string | null = null;
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      const user = data?.user || null;

      if (user) {
        // Ensure user exists in Prisma DB
        const existingUser = await prisma.user.findFirst({
          where: {
            OR: [
              { id: user.id },
              { email: user.email || customerEmail || `${user.id}@user.com` }
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
    } catch (authErr) {
      console.warn("Checkout Supabase Auth Session bypass:", authErr);
    }

    // Generate unique order number: BPM-YYYYMMDD-XXXX
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `BPM-${dateStr}-${randomDigits}`;

    // Validate items & fetch real database products
    const validItemsData: any[] = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      try {
        const dbProduct = await prisma.product.findUnique({
          where: { id: item.id }
        });

        if (dbProduct) {
          const qty = Math.max(1, Number(item.quantity) || 1);
          const price = Number(item.price) || dbProduct.price;
          calculatedSubtotal += price * qty;

          validItemsData.push({
            product: { connect: { id: dbProduct.id } },
            quantity: qty,
            priceAtTime: price
          });
        }
      } catch (itemErr) {
        console.warn(`Skipping missing product ID ${item.id} during checkout:`, itemErr);
      }
    }

    // Fallback if no valid products found from database
    if (validItemsData.length === 0) {
      return NextResponse.json(
        { error: "Item di keranjang tidak valid atau telah diperbarui. Silakan tambahkan kembali produk ke keranjang." },
        { status: 400 }
      );
    }

    const shippingCost = Number(body.shippingFee || body.shippingCost || 0);
    const uniqueCode = Math.floor(1 + Math.random() * 999);
    const finalTotal = calculatedSubtotal + shippingCost + uniqueCode;

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
        uniqueCode,
        finalTotal,
        paymentType: paymentMethod,
        items: {
          create: validItemsData
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
