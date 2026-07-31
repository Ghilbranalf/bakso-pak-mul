import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Midtrans payment notification endpoint is active and healthy",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      order_id,
      transaction_status,
      fraud_status,
      status_code,
      gross_amount,
      signature_key,
    } = body;

    console.log(`[MIDTRANS NOTIFICATION] Order ID: ${order_id}, Status: ${transaction_status}`);

    // Verify signature key if server key exists
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    if (serverKey && signature_key) {
      const expectedSignature = crypto
        .createHash("sha512")
        .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
        .digest("hex");

      if (signature_key !== expectedSignature) {
        console.error("[MIDTRANS WEBHHOOK] Invalid signature key!");
        return NextResponse.json(
          { error: "Invalid signature key" },
          { status: 403 }
        );
      }
    }

    // If dummy test request from Midtrans dashboard
    if (!order_id) {
      return NextResponse.json(
        { message: "Midtrans notification endpoint active" },
        { status: 200 }
      );
    }

    // Find existing order in DB by orderNumber
    const order = await prisma.order.findUnique({
      where: { orderNumber: order_id },
      include: { items: true },
    });

    if (!order) {
      console.warn(`[MIDTRANS WEBHHOOK] Order not found: ${order_id}`);
      return NextResponse.json(
        { message: "Order not found, notification acknowledged" },
        { status: 200 }
      );
    }

    let newStatus = order.status;

    if (transaction_status === "capture") {
      if (fraud_status === "challenge") {
        newStatus = "PENDING";
      } else if (fraud_status === "accept") {
        newStatus = "PAID";
      }
    } else if (transaction_status === "settlement") {
      newStatus = "PAID";
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      newStatus = "CANCELED";
    } else if (transaction_status === "pending") {
      newStatus = "PENDING";
    }

    // Update order status in database
    const updatedOrder = await prisma.order.update({
      where: { orderNumber: order_id },
      data: { status: newStatus },
    });

    // If payment is newly settled/paid, automatically reduce product inventory
    if (newStatus === "PAID" && order.status !== "PAID") {
      for (const item of order.items) {
        try {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        } catch (err) {
          console.error(`Failed to decrement stock for product ${item.productId}:`, err);
        }
      }
    }

    console.log(`[MIDTRANS WEBHHOOK] Order ${order_id} status updated to: ${newStatus}`);

    return NextResponse.json({
      message: "Notification processed successfully",
      status: newStatus,
    });
  } catch (error: any) {
    console.error("[MIDTRANS WEBHHOOK ERROR]:", error);
    return NextResponse.json(
      { error: "Failed to process payment notification", details: error.message },
      { status: 500 }
    );
  }
}
