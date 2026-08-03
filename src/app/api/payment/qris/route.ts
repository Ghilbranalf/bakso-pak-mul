import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { generateDynamicQRIS, DEFAULT_BAKSO_PAK_MUL_STATIC_QRIS } from "@/lib/qris";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get("orderNumber");
    const amountParam = searchParams.get("amount");

    let amount = amountParam ? parseFloat(amountParam) : 0;
    let targetOrderNumber = orderNumber || "";

    // If orderNumber is passed, look up in database
    if (orderNumber) {
      const order = await prisma.order.findUnique({
        where: { orderNumber },
      });

      if (order) {
        amount = order.finalTotal;
        targetOrderNumber = order.orderNumber;
      }
    }

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount or order not found" }, { status: 400 });
    }

    // Generate Dynamic QRIS EMVCo string
    const dynamicQrisString = generateDynamicQRIS(DEFAULT_BAKSO_PAK_MUL_STATIC_QRIS, amount);

    // Render high resolution QR Code Data URL
    const qrCodeUrl = await QRCode.toDataURL(dynamicQrisString, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 400,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    return NextResponse.json({
      success: true,
      orderNumber: targetOrderNumber,
      amount,
      qrisString: dynamicQrisString,
      qrCodeUrl,
      merchantName: "Bakso Pak Mul",
      nmid: "ID1026563066301",
    });
  } catch (error: any) {
    console.error("QRIS API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate Dynamic QRIS" }, { status: 500 });
  }
}
