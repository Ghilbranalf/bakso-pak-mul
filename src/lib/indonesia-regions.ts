export interface RegionData {
  [province: string]: {
    [city: string]: string[];
  };
}

export const INDONESIA_REGIONS: RegionData = {
  "Jawa Tengah": {
    "Kabupaten Brebes": [
      "Tonjong",
      "Bumiayu",
      "Sirampog",
      "Paguyangan",
      "Bantarkawung",
      "Jatibarang",
      "Brebes",
      "Ketanggungan",
      "Larangan",
      "Songgom",
      "Kersana",
      "Banjarharjo",
      "Losari",
      "Tanjung",
      "Bulakamba",
      "Wanasari",
      "Salem"
    ],
    "Kota Semarang": [
      "Semarang Tengah",
      "Semarang Barat",
      "Semarang Timur",
      "Semarang Selatan",
      "Semarang Utara",
      "Banyumanik",
      "Candisari",
      "Gajahmungkur",
      "Gayamsari",
      "Genuk",
      "Gunungpati",
      "Mijen",
      "Ngaliyan",
      "Pedurungan",
      "Tembalang"
    ],
    "Kabupaten Tegal": [
      "Slawi",
      "Adiwerna",
      "Dukuhturi",
      "Dukuhwaru",
      "Kramat",
      "Lebaksiu",
      "Margasari",
      "Pagerbarang",
      "Pangkah",
      "Surodadi",
      "Talang",
      "Tarub"
    ],
    "Kota Tegal": ["Tegal Barat", "Tegal Timur", "Tegal Selatan", "Margadana"],
    "Kabupaten Banyumas": ["Purwokerto Timur", "Purwokerto Barat", "Purwokerto Selatan", "Purwokerto Utara", "Ajibarang", "Banyumas", "Baturraden", "Sokaraja", "Wangon"],
    "Kabupaten Cilacap": ["Cilacap Selatan", "Cilacap Tengah", "Cilacap Utara", "Majenang", "Sidareja", "Kroya"],
    "Kota Surakarta (Solo)": ["Banjarsari", "Jebres", "Laweyan", "Pasar Kliwon", "Serengan"],
    "Kabupaten Kudus": ["Kota Kudus", "Bae", "Dawe", "Gebog", "Jati", "Jekulo", "Kaliwungu", "Mejobo", "Undaan"]
  },
  "DKI Jakarta": {
    "Jakarta Timur": [
      "Kramat Jati",
      "Duren Sawit",
      "Jatinegara",
      "Cakung",
      "Ciracas",
      "Cipayung",
      "Pasar Rebo",
      "Makasar",
      "Matraman",
      "Pulo Gadung"
    ],
    "Jakarta Selatan": [
      "Kebayoran Baru",
      "Kebayoran Lama",
      "Cilandak",
      "Jagakarsa",
      "Mampang Prapatan",
      "Pancoran",
      "Pasar Minggu",
      "Pesanggrahan",
      "Setiabudi",
      "Tebet"
    ],
    "Jakarta Pusat": [
      "Menteng",
      "Tanah Abang",
      "Gambir",
      "Kemayoran",
      "Cempaka Putih",
      "Senen",
      "Sawah Besar",
      "Johar Baru"
    ],
    "Jakarta Barat": ["Grogol Petamburan", "Kebon Jeruk", "Kembangan", "Cengkareng", "Kalideres", "Palmerah", "Taman Sari", "Tambora"],
    "Jakarta Utara": ["Kelapa Gading", "Tanjung Priok", "Penjaringan", "Pademangan", "Koja", "Cilincing"]
  },
  "Jawa Barat": {
    "Kota Bandung": ["Sumur Bandung", "Coblong", "Cicendo", "Lengkong", "Andir", "Regol", "Sukajadi", "Bandung Wetan", "Cibeunying Kaler", "Cibeunying Kidul"],
    "Kabupaten Bandung": ["Soreang", "Banjaran", "Baleendah", "Cileunyi", "Dayeuhkolot", "Katapang", "Margahayu", "Majalaya"],
    "Kota Bekasi": ["Bekasi Timur", "Bekasi Barat", "Bekasi Selatan", "Bekasi Utara", "Jatiasih", "Pondok Gede", "Rawalumbu"],
    "Kabupaten Bekasi": ["Cikarang Pusat", "Cikarang Barat", "Cikarang Selatan", "Cikarang Utara", "Cikarang Timur", "Tambun Selatan", "Tambun Utara"],
    "Kota Depok": ["Beji", "Cimanggis", "Cinere", "Pancasoran Mas", "Sukmajaya", "Tapos", "Sawangan"],
    "Kota Bogor": ["Bogor Tengah", "Bogor Barat", "Bogor Selatan", "Bogor Timur", "Bogor Utara", "Tanah Sareal"]
  },
  "DI Yogyakarta": {
    "Kota Yogyakarta": ["Danurejan", "Gedongtengen", "Gondokusuman", "Gondomanan", "Jetis", "Kotagede", "Kraton", "Mantrijeron", "Mergangsan", "Ngampilan", "Pakualaman", "Tegalrejo", "Umbulharjo", "Wirobrajan"],
    "Kabupaten Sleman": ["Depok", "Mlati", "Gamping", "Ngaglik", "Kalasan", "Sleman", "Godean", "Prambanan"],
    "Kabupaten Bantul": ["Bantul", "Bangguntapan", "Kasihan", "Sewon", "Piyungan", "Imogiri", "Srandakan"],
    "Kabupaten Gunungkidul": ["Wonosari", "Semanu", "Karangmojo", "Playen"],
    "Kabupaten Kulon Progo": ["Wates", "Pengasih", "Sentolo", "Lendah"]
  },
  "Jawa Timur": {
    "Kota Surabaya": ["Gubeng", "Tegalsari", "Wonokromo", "Genteng", "Sukololo", "Rungkut", "Sawahan", "Tambaksari", "Mulyorejo"],
    "Kota Malang": ["Klojen", "Blimbing", "Lowokwaru", "Kedungkandang", "Sukun"],
    "Kabupaten Sidoarjo": ["Sidoarjo", "Warul", "Candi", "Taman", "Krian", "Gedangan"]
  },
  "Banten": {
    "Kota Tangerang": ["Tangerang", "Cipondoh", "Karawaci", "Ciledug", "Pinang", "Periuk"],
    "Kota Tangerang Selatan": ["BSD Serpong", "Bintaro Pondok Aren", "Pamulang", "Ciputat", "Ciputat Timur", "Setu"],
    "Kota Serang": ["Serang", "Cipocok Jaya", "Curug", "Kasemen", "Taktakan", "Walantaka"]
  }
};
