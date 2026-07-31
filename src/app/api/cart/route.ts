import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = user.email || `${user.id}@user.com`;

    // Check if user exists by ID or Email
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { id: user.id },
          { email: userEmail }
        ]
      }
    });

    let prismaUserId = user.id;

    if (!existingUser) {
      const created = await prisma.user.create({
        data: {
          id: user.id,
          email: userEmail,
          name: user.user_metadata?.full_name || user.email || "Pengguna",
        }
      });
      prismaUserId = created.id;
    } else {
      prismaUserId = existingUser.id;
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: prismaUserId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!cart) {
      return NextResponse.json({ items: [] });
    }

    const formattedItems = cart.items.map(item => ({
      id: item.productId,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
      unit: item.product.unit
    }));

    return NextResponse.json({ items: formattedItems });
  } catch (error: any) {
    console.error("Cart GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { items = [] } = body;

    const userEmail = user.email || `${user.id}@user.com`;

    // Check if user exists by ID or Email
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { id: user.id },
          { email: userEmail }
        ]
      }
    });

    let prismaUserId = user.id;

    if (!existingUser) {
      const created = await prisma.user.create({
        data: {
          id: user.id,
          email: userEmail,
          name: user.user_metadata?.full_name || user.email || "Pengguna",
        }
      });
      prismaUserId = created.id;
    } else {
      prismaUserId = existingUser.id;
    }

    // Find or create cart for prismaUserId
    let cart = await prisma.cart.findUnique({
      where: { userId: prismaUserId }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: prismaUserId }
      });
    }

    // Delete existing cart items
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    // Create new cart items
    if (items.length > 0) {
      await prisma.cartItem.createMany({
        data: items.map((item: any) => ({
          cartId: cart!.id,
          productId: item.id,
          quantity: item.quantity
        }))
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Cart POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
