import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📥 Incoming Notification Listener Webhook:", body);

    const secret = body.secret || req.headers.get("x-webhook-secret");
    const expectedSecret = process.env.NOTIFICATION_WEBHOOK_SECRET || "baksopakmul123";

    if (secret && secret !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized webhook secret" }, { status: 401 });
    }

    // Extract amount and notification text
    let amount = 0;
    if (typeof body.amount === "number") {
      amount = body.amount;
    } else if (typeof body.amount === "string") {
      amount = parseFloat(body.amount.replace(/[^0-9]/g, ""));
    }

    const notificationText = body.notification || body.text || body.message || "";
    const orderNumber = body.orderNumber || body.note || "";

    // Parse amount from text if not provided directly
    if (!amount && notificationText) {
      const amountMatch = notificationText.match(/Rp\s*([\d.]+)/i) || notificationText.match(/(\d{4,7})/);
      if (amountMatch) {
        amount = parseFloat(amountMatch[1].replace(/\./g, ""));
      }
    }

    if (!amount && !orderNumber) {
      return NextResponse.json({ error: "No valid amount or order number found in notification payload" }, { status: 400 });
    }

    // Search target order in database
    let targetOrder = null;

    if (orderNumber) {
      targetOrder = await prisma.order.findUnique({
        where: { orderNumber },
      });
    }

    // Fallback: Find pending order matching the exact amount created in the last 60 minutes
    if (!targetOrder && amount > 0) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      targetOrder = await prisma.order.findFirst({
        where: {
          finalTotal: amount,
          status: { in: ["PENDING", "UNPAID"] },
          createdAt: { gte: oneHourAgo },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    if (!targetOrder) {
      return NextResponse.json({
        success: false,
        message: "No matching pending order found for amount Rp " + amount,
      });
    }

    // Update order status to PAID / COMPLETED
    const updatedOrder = await prisma.order.update({
      where: { id: targetOrder.id },
      data: {
        status: "PAID",
        paymentType: "qris",
      },
    });

    console.log(`✅ Order ${updatedOrder.orderNumber} successfully marked as PAID!`);

    return NextResponse.json({
      success: true,
      message: `Order ${updatedOrder.orderNumber} updated to PAID successfully!`,
      orderNumber: updatedOrder.orderNumber,
      amount: updatedOrder.finalTotal,
    });
  } catch (error: any) {
    console.error("Webhook Notification Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process notification" }, { status: 500 });
  }
}
