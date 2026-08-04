import { NextResponse } from "next/server";
import { createIpaymuDirectPayment } from "@/lib/ipaymu";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { orderId = `BPM-${Date.now()}`, grossAmount = 10000, bank = "bca", paymentType = "qris" } = body;

    let resData: any = {};

    if (paymentType === "qris") {
      resData = await createIpaymuDirectPayment({
        referenceId: orderId,
        amount: Math.round(Number(grossAmount) || 10000),
        name: body.customerName || "Pembeli Bakso Pak Mul",
        phone: body.phone || "081234567890",
        email: body.email || "customer@baksopakmul.id",
        paymentMethod: "qris",
        paymentChannel: "qris",
      });
    } else {
      // Virtual Account (BCA, Mandiri, BNI, BRI)
      const mappedBank = bank.toLowerCase();
      resData = await createIpaymuDirectPayment({
        referenceId: orderId,
        amount: Math.round(Number(grossAmount) || 10000),
        name: body.customerName || "Pembeli Bakso Pak Mul",
        phone: body.phone || "081234567890",
        email: body.email || "customer@baksopakmul.id",
        paymentMethod: "va",
        paymentChannel: mappedBank,
      });
    }

    console.log("[IPAYMU CHARGE ROUTE DATA]:", resData);

    let qrCodeUrl = "";
    let vaNumber = "";

    if (resData && resData.Data) {
      if (resData.Data.QrImage) {
        qrCodeUrl = resData.Data.QrImage;
      } else if (resData.Data.QrString) {
        qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(resData.Data.QrString)}`;
      }

      if (resData.Data.PaymentNo) {
        vaNumber = resData.Data.PaymentNo;
      }
    }

    if (resData.Status === 200 || resData.Success) {
      return NextResponse.json({
        success: true,
        qrCodeUrl,
        vaNumber,
        raw: resData,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: resData.Message || "Pembayaran langsung via IPaymu sedang diproses. Silakan gunakan transfer manual atau QRIS resmi.",
        raw: resData,
      }, { status: 200 });
    }
  } catch (error: any) {
    console.error("IPaymu Charge Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process IPaymu payment" },
      { status: 500 }
    );
  }
}
