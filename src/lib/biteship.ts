// Biteship API Integration Helper

const BITESHIP_API_KEY = process.env.BITESHIP_API_KEY || "biteship.test.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJiaXRlc2hpcCIsInN1YiI6ImJpdGVzaGlwLXRlc3Qta2V5IiwiaWF0IjoxNzgwMDAwMDAwfQ.demo_key";
const BITESHIP_BASE_URL = "https://api.biteship.com/v1";

// Origin: Kios Bakso Pak Mul, Pasar Kramat Jati, Jakarta Timur
export const STORE_ORIGIN = {
  contact_name: "Bakso Pak Mul Official",
  contact_phone: "081298980252",
  address: "Kios Bakso Pak Mul, Pasar Kramat Jati, Jakarta Timur",
  postal_code: 13510,
  latitude: -6.2731,
  longitude: 106.8665,
  area_id: "IDNP6IDNC147IDD1063",
};

export interface CourierRate {
  courier_name: string;
  courier_code: string;
  courier_service_name: string;
  courier_service_code: string;
  description: string;
  duration: string;
  price: number;
  type: string;
}

export async function getBiteshipRates(destinationPostalCode: number | string, weightInGrams: number = 1000) {
  try {
    const res = await fetch(`${BITESHIP_BASE_URL}/rates/couriers`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${BITESHIP_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        origin_postal_code: STORE_ORIGIN.postal_code,
        destination_postal_code: Number(destinationPostalCode) || 13510,
        couriers: "jne,sicepat,jnt,gosend,grab",
        items: [
          {
            name: "Paket Produk Bakso Pak Mul",
            description: "Makanan / Produk Olahan Sapi",
            value: 50000,
            quantity: 1,
            weight: weightInGrams,
          },
        ],
      }),
    });

    if (!res.ok) {
      throw new Error(`Biteship API returned status ${res.status}`);
    }

    const data = await res.json();
    return data.pricing || [];
  } catch (error) {
    console.warn("Biteship API fetch failed, using fallback courier rates:", error);
    // Fallback standard Indonesian couriers
    return [
      {
        courier_name: "SiCepat",
        courier_code: "sicepat",
        courier_service_name: "REG (Reguler)",
        courier_service_code: "reg",
        description: "Layanan Pengiriman Reguler",
        duration: "1 - 2 Hari",
        price: 12000,
        type: "standard",
      },
      {
        courier_name: "JNE",
        courier_code: "jne",
        courier_service_name: "REG (Reguler)",
        courier_service_code: "reg",
        description: "JNE Reguler Service",
        duration: "1 - 2 Hari",
        price: 15000,
        type: "standard",
      },
      {
        courier_name: "GoSend",
        courier_code: "gosend",
        courier_service_name: "Instant / SameDay",
        courier_service_code: "instant",
        description: "Pengiriman Instan Hari Ini Sampai",
        duration: "3 - 6 Jam",
        price: 20000,
        type: "instant",
      },
      {
        courier_name: "J&T Express",
        courier_code: "jnt",
        courier_service_name: "EZ Express",
        courier_service_code: "ez",
        description: "Pengiriman Cepat J&T",
        duration: "1 - 2 Hari",
        price: 14000,
        type: "standard",
      },
    ];
  }
}
