// RajaOngkir API Integration Helper & City ID Resolver
const RAJAONGKIR_API_KEY = process.env.RAJAONGKIR_API_KEY || "GDiWk4kC9e477fee315c4506mF5tQkOq";
// Origin: Pasar Kramat Jati, Jakarta Timur (City ID: 153 in RajaOngkir Starter)
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

// Mapping Kota/Kabupaten Indonesia ke City ID RajaOngkir Starter
export const CITY_TO_RAJAONGKIR_ID: Record<string, string> = {
  // DKI Jakarta
  "Kota Jakarta Timur": "153",
  "Kota Jakarta Selatan": "152",
  "Kota Jakarta Pusat": "151",
  "Kota Jakarta Barat": "150",
  "Kota Jakarta Utara": "154",
  "Kabupaten Kepulauan Seribu": "155",
  
  // Jawa Barat
  "Kota Bandung": "23",
  "Kabupaten Bandung": "22",
  "Kota Bogor": "79",
  "Kabupaten Bogor": "78",
  "Kota Bekasi": "55",
  "Kabupaten Bekasi": "54",
  "Kota Depok": "115",
  "Kota Tangerang": "456",
  "Kota Tangerang Selatan": "457",
  
  // Jawa Tengah
  "Kota Semarang": "399",
  "Kota Surakarta": "444",
  "Kabupaten Purbalingga": "375",
  "Kabupaten Banyumas": "41",

  // Jawa Timur
  "Kota Surabaya": "444",
  "Kota Malang": "256",
  "Kabupaten Sidoarjo": "418",
  "Kabupaten Gresik": "133",
  "Kota Kediri": "178",

  // DIY
  "Kota Yogyakarta": "501",

  // Bali & Sumatera & Lainnya
  "Kota Denpasar": "114",
  "Kota Medan": "278",
  "Kota Palembang": "327",
  "Kota Makassar": "254"
};

export async function getRajaOngkirRates(cityName: string = "Kota Jakarta Timur", weightInGrams: number = 1000) {
  const cityId = CITY_TO_RAJAONGKIR_ID[cityName] || CITY_TO_RAJAONGKIR_ID[Object.keys(CITY_TO_RAJAONGKIR_ID).find(k => cityName.includes(k) || k.includes(cityName)) || ""] || "153";

  try {
    const couriersToFetch = ["jne", "pos", "tiki"];
    const allRates: CourierRate[] = [];

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
            destination: cityId,
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

    throw new Error("No rates returned from RajaOngkir API");
  } catch (error) {
    console.warn("RajaOngkir API fallback used for:", cityName, error);
    
    // Perhitungan dinamis berbasis wilayah jika API RajaOngkir offline
    const isJabodetabek = cityName.includes("Jakarta") || cityName.includes("Bogor") || cityName.includes("Depok") || cityName.includes("Tangerang") || cityName.includes("Bekasi");
    const isJawa = cityName.includes("Bandung") || cityName.includes("Surabaya") || cityName.includes("Semarang") || cityName.includes("Malang") || cityName.includes("Yogyakarta") || cityName.includes("Gresik") || cityName.includes("Sidoarjo");
    
    const jnePrice = isJabodetabek ? 10000 : isJawa ? 18000 : 28000;
    const sicepatPrice = isJabodetabek ? 11000 : isJawa ? 20000 : 30000;
    const gosendPrice = isJabodetabek ? 20000 : isJawa ? 35000 : 50000;
    const jntPrice = isJabodetabek ? 12000 : isJawa ? 19000 : 29000;

    return [
      {
        courier_name: "JNE Express",
        courier_code: "jne",
        courier_service_name: "REG (Reguler)",
        courier_service_code: "reg",
        description: `Layanan Pengiriman ke ${cityName}`,
        duration: isJabodetabek ? "1 Hari" : "2 - 3 Hari",
        price: jnePrice,
        type: "standard",
      },
      {
        courier_name: "SiCepat Express",
        courier_code: "sicepat",
        courier_service_name: "REG (Reguler)",
        courier_service_code: "reg",
        description: `Layanan SiCepat ke ${cityName}`,
        duration: isJabodetabek ? "1 Hari" : "2 - 3 Hari",
        price: sicepatPrice,
        type: "standard",
      },
      {
        courier_name: "GoSend Instant",
        courier_code: "gosend",
        courier_service_name: "Instant / SameDay",
        courier_service_code: "instant",
        description: "Pengiriman Sameday / Instant",
        duration: "3 - 6 Jam",
        price: gosendPrice,
        type: "instant",
      },
      {
        courier_name: "J&T Express",
        courier_code: "jnt",
        courier_service_name: "EZ Express",
        courier_service_code: "ez",
        description: `Pengiriman Cepat J&T ke ${cityName}`,
        duration: isJabodetabek ? "1 Hari" : "2 - 3 Hari",
        price: jntPrice,
        type: "standard",
      },
    ];
  }
}
