import { NextResponse } from "next/server";
import { getBiteshipRates } from "@/lib/biteship";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { postalCode, weight } = body;

    const rates = await getBiteshipRates(postalCode || 13510, weight || 1000);

    return NextResponse.json({
      success: true,
      origin: "Pasar Kramat Jati, Jakarta Timur",
      couriers: rates,
    });
  } catch (error: any) {
    console.error("Error fetching shipping rates:", error);
    return NextResponse.json(
      { error: error.message || "Gagal mengambil daftar ongkir kurir" },
      { status: 500 }
    );
  }
}
