import crypto from "crypto";

export interface IpaymuPaymentParams {
  referenceId: string;
  amount: number;
  name: string;
  phone: string;
  email: string;
  paymentMethod: "qris" | "va" | "cstore";
  paymentChannel?: string; // bca, mandiri, bni, bri, qris, etc.
}

export async function createIpaymuDirectPayment(params: IpaymuPaymentParams) {
  const va = process.env.IPAYMU_VA || "1179005600436463";
  const apiKey = process.env.IPAYMU_API_KEY || "E0E13B2D-88F0-4672-9DCA-39613DC9DA59";
  const isProd = process.env.IPAYMU_ENV !== "sandbox";

  const baseUrl = isProd
    ? "https://my.ipaymu.com/api/v2/payment/direct"
    : "https://sandbox.ipaymu.com/api/v2/payment/direct";

  const notifyUrl = "https://bakso-pak-mul.vercel.app/api/payment/ipaymu-notification";

  const bodyObj = {
    name: params.name || "Pembeli Bakso Pak Mul",
    phone: params.phone || "081234567890",
    email: params.email || "customer@baksopakmul.id",
    amount: Math.round(params.amount),
    notifyUrl,
    expired: 24, // 24 jam
    paymentMethod: params.paymentMethod,
    paymentChannel: params.paymentChannel || (params.paymentMethod === "qris" ? "qris" : "bca"),
    referenceId: params.referenceId,
  };

  const bodyJson = JSON.stringify(bodyObj);
  const bodyHash = crypto.createHash("sha256").update(bodyJson).digest("hex").toLowerCase();
  const stringToSign = `POST:${va}:${bodyHash}:${apiKey}`;
  const signature = crypto.createHmac("sha256", apiKey).update(stringToSign).digest("hex");

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      va: va,
      signature: signature,
      timestamp: Date.now().toString(),
    },
    body: bodyJson,
  });

  const data = await response.json();
  console.log("[IPAYMU DIRECT PAYMENT RESPONSE]:", data);
  return data;
}
