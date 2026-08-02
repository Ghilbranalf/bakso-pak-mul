import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { orderId = `BPM-${Date.now()}`, grossAmount = 10000, bank = "bca", paymentType = "qris" } = body;

    const serverKey = process.env.MIDTRANS_SERVER_KEY || "Mid-server-nUgGimDS95Y1taLsqv8zNakM";
    const authString = Buffer.from(`${serverKey}:`).toString("base64");

    const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_ENV === "production" || serverKey.startsWith("Mid-server-");
    const chargeUrl = isProduction
      ? "https://api.midtrans.com/v2/charge"
      : "https://api.sandbox.midtrans.com/v2/charge";

    let payload: any = {};
    const uniqueOrderId = orderId;

    const customerDetails = {
      first_name: body.customerName || "Pembeli",
      last_name: "Bakso Pak Mul",
      email: body.email || "customer@baksopakmul.id",
      phone: body.phone || "081234567890",
    };

    if (paymentType === "qris") {
      payload = {
        payment_type: "qris",
        transaction_details: {
          order_id: uniqueOrderId,
          gross_amount: Math.round(Number(grossAmount) || 10000),
        },
        qris: {
          acquirer: "gopay",
        },
        customer_details: customerDetails,
      };
    } else if (bank === "mandiri") {
      payload = {
        payment_type: "echannel",
        transaction_details: {
          order_id: uniqueOrderId,
          gross_amount: Math.round(Number(grossAmount) || 10000),
        },
        echannel: {
          bill_info1: "Pembayaran:",
          bill_info2: "Bakso Pak Mul",
        },
        customer_details: customerDetails,
      };
    } else {
      // BCA, BNI, BRI
      payload = {
        payment_type: "bank_transfer",
        transaction_details: {
          order_id: uniqueOrderId,
          gross_amount: Math.round(Number(grossAmount) || 10000),
        },
        bank_transfer: {
          bank: bank.toLowerCase(),
        },
        customer_details: customerDetails,
      };
    }

    const response = await fetch(chargeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("[MIDTRANS CORE API CHARGE RESPONSE]:", data);

    let qrCodeUrl = "";
    let vaNumber = "";
    let billerCode = "";

    if (data.qr_string) {
      qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(data.qr_string)}`;
    } else if (data.actions) {
      const qrAction = data.actions.find((a: any) => a.name === "generate-qr-code");
      if (qrAction) {
        qrCodeUrl = qrAction.url;
      }
    }

    if (data.va_numbers && data.va_numbers.length > 0) {
      vaNumber = data.va_numbers[0].va_number;
    } else if (data.bill_key) {
      vaNumber = data.bill_key;
      billerCode = data.biller_code || "70012";
    }

    return NextResponse.json({
      success: true,
      qrCodeUrl,
      qrString: data.qr_string || "",
      vaNumber,
      billerCode,
      raw: data,
    });
  } catch (error: any) {
    console.error("Core API Charge Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process charge" },
      { status: 500 }
    );
  }
}
