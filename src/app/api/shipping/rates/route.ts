import { NextResponse } from "next/server";
import { getRajaOngkirRates } from "@/lib/rajaongkir";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cityId, weight } = body;

    const rates = await getRajaOngkirRates(cityId || "153", weight || 1000);

    return NextResponse.json({
      success: true,
      origin: "Kios Pasar Kramat Jati, Jakarta Timur",
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
