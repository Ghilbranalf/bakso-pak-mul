import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendOrderInvoiceEmail, sendAdminNewOrderNotificationEmail } from "@/lib/nodemailer";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "IPaymu notification endpoint active and healthy",
  });
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let bodyData: any = {};

    if (contentType.includes("application/json")) {
      bodyData = await request.json().catch(() => ({}));
    } else {
      const formData = await request.formData().catch(() => null);
      if (formData) {
        bodyData = Object.fromEntries(formData.entries());
      }
    }

    console.log("[IPAYMU NOTIFICATION RECEIVED]:", bodyData);

    const orderId = bodyData.referenceId || bodyData.reference_id || bodyData.sid || bodyData.trx_id;
    const status = String(bodyData.status || bodyData.status_code || "").toLowerCase();

    if (!orderId) {
      return NextResponse.json({ message: "No referenceId provided" }, { status: 200 });
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber: orderId },
      include: { items: true },
    });

    if (!order) {
      console.warn(`[IPAYMU WEBHOOK] Order not found: ${orderId}`);
      return NextResponse.json({ message: "Order not found" }, { status: 200 });
    }

    const isPaid =
      status === "berhasil" ||
      status === "berhasil_dibayar" ||
      status === "settlement" ||
      status === "paid" ||
      status === "1";

    if (isPaid && order.status !== "PAID") {
      const updatedOrder = await prisma.order.update({
        where: { orderNumber: orderId },
        data: { status: "PAID" },
      });

      // Reduce product stock
      for (const item of order.items) {
        try {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        } catch (e) {
          console.error("Failed to decrement stock:", e);
        }
      }

      // Send invoice email & admin alert email
      sendOrderInvoiceEmail(updatedOrder).catch((e) => console.warn(e));
      sendAdminNewOrderNotificationEmail(updatedOrder).catch((e) => console.warn(e));

      console.log(`[IPAYMU WEBHOOK] Order ${orderId} successfully updated to PAID!`);
    }

    return NextResponse.json({ success: true, message: "IPaymu notification processed" });
  } catch (error: any) {
    console.error("[IPAYMU WEBHOOK ERROR]:", error);
    return NextResponse.json(
      { error: "Failed to process IPaymu notification", details: error.message },
      { status: 500 }
    );
  }
}
