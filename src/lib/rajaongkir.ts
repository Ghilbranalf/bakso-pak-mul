// RajaOngkir API Integration Helper
// Supports official API Key: GDiWk4kC9e477fee315c4506mF5tQkOq

const RAJAONGKIR_API_KEY = process.env.RAJAONGKIR_API_KEY || "GDiWk4kC9e477fee315c4506mF5tQkOq";
// Origin: Pasar Kramat Jati, Jakarta Timur (City ID: 153 for Jakarta Timur in RajaOngkir)
export const STORE_ORIGIN_CITY = "153";

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

export async function getRajaOngkirRates(destinationCityId: string = "153", weightInGrams: number = 1000) {
  try {
    const couriersToFetch = ["jne", "pos", "tiki"];
    const allRates: CourierRate[] = [];

    // Fetch rates for couriers in parallel
    const requests = couriersToFetch.map(async (courier) => {
      try {
        const res = await fetch("https://api.rajaongkir.com/starter/cost", {
          method: "POST",
          headers: {
            "key": RAJAONGKIR_API_KEY,
            "content-type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            origin: STORE_ORIGIN_CITY,
            destination: destinationCityId || STORE_ORIGIN_CITY,
            weight: String(weightInGrams),
            courier: courier,
          }),
        });

        if (!res.ok) return [];

        const data = await res.json();
        const results = data?.rajaongkir?.results?.[0];
        if (!results) return [];

        const courierName = results.name || courier.toUpperCase();
        const courierCode = results.code || courier;

        return (results.costs || []).map((c: any) => ({
          courier_name: courierName,
          courier_code: courierCode,
          courier_service_name: c.service,
          courier_service_code: c.service.toLowerCase().replace(/\s+/g, "_"),
          description: c.description || `${courierName} ${c.service}`,
          duration: c.cost?.[0]?.etd ? `${c.cost[0].etd} Hari` : "1-2 Hari",
          price: c.cost?.[0]?.value || 15000,
          type: "standard",
        }));
      } catch (e) {
        return [];
      }
    });

    const fetchedResults = await Promise.all(requests);
    fetchedResults.forEach((rates) => allRates.push(...rates));

    if (allRates.length > 0) {
      return allRates;
    }

    throw new Error("No rates returned from RajaOngkir");
  } catch (error) {
    console.warn("RajaOngkir fetch failed or limited, returning standard courier rates:", error);
    // Robust fallback list
    return [
      {
        courier_name: "JNE Express",
        courier_code: "jne",
        courier_service_name: "REG (Reguler)",
        courier_service_code: "reg",
        description: "Layanan Pengiriman Reguler JNE",
        duration: "1 - 2 Hari",
        price: 12000,
        type: "standard",
      },
      {
        courier_name: "SiCepat Express",
        courier_code: "sicepat",
        courier_service_name: "REG (Reguler)",
        courier_service_code: "reg",
        description: "Layanan SiCepat REG",
        duration: "1 - 2 Hari",
        price: 14000,
        type: "standard",
      },
      {
        courier_name: "GoSend Instant",
        courier_code: "gosend",
        courier_service_name: "Instant",
        courier_service_code: "instant",
        description: "Pengiriman Sameday / Instant Hari Ini Sampai",
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
        price: 15000,
        type: "standard",
      },
    ];
  }
}
