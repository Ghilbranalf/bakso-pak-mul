import { NextResponse } from "next/server";
import { getRajaOngkirRates } from "@/lib/rajaongkir";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { city, weight } = body;

    const rates = await getRajaOngkirRates(city || "Kota Jakarta Timur", weight || 1000);

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
