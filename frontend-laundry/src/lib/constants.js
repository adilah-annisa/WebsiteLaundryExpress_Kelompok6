export const LAYANAN_OPTIONS = [
  { value: "cuci-kering", label: "Cuci Kering", price: 3000, estimate: "2-3 hari" },
  { value: "cuci-setrika", label: "Cuci Setrika", price: 7000, estimate: "1-2 hari" },
  { value: "setrika-saja", label: "Setrika Saja", price: 4000, estimate: "1 hari" },
  { value: "dry-clean", label: "Dry Clean", price: 15000, estimate: "3-4 hari" },
];

export const PENGANTARAN_OPTIONS = [
  { value: "jemput", label: "Jemput Saja" },
  { value: "antar", label: "Antar Saja" },
  { value: "antar-jemput", label: "Antar-Jemput" },
];

export const PAYMENT_METHOD_OPTIONS = [
  { value: "Tunai", label: "Tunai" },
  { value: "QRIS", label: "QRIS" },
  { value: "Transfer Bank", label: "Transfer Bank" },
  { value: "Dana", label: "Dana" },
  { value: "OVO", label: "OVO" },
  { value: "GoPay", label: "GoPay" },
  { value: "ShopeePay", label: "ShopeePay" },
];

export const PAYMENT_STATUS_OPTIONS = [
  { value: "Belum Dibayar", label: "Belum Dibayar" },
  { value: "Lunas", label: "Lunas" },
];

export const ORDER_STATUSES = [
  "Diproses",
  "Dijemput",
  "Sedang Dicuci",
  "Sedang Disetrika",
  "Siap Diantar",
  "Diantar",
  "Selesai",
];

export const ADMIN_ORDER_STATUSES = ORDER_STATUSES;

export const AUTH_USERS = {
  admin: {
    username: "admin",
    password: "admin123",
    role: "admin",
    name: "Pemilik Laundry",
    redirect: "/dashboard",
  },
  pelanggan: {
    username: "pelanggan",
    password: "pelanggan123",
    role: "pelanggan",
    name: "Budi Santoso",
    customerId: "C001",
    redirect: "/pelanggan",
  },
  kurir: {
    username: "kurir",
    password: "kurir123",
    role: "kurir",
    name: "Ahmad Rizky",
    redirect: "/kurir",
  },
};

export const KURIR_NAMA = "Ahmad Rizky";

export const AUTH_STORAGE_KEY = "laundry_express_auth";
export const DATA_STORAGE_KEY = "laundry_express_data";

export function getLayananByValue(value) {
  return LAYANAN_OPTIONS.find((l) => l.value === value);
}

export function formatRupiah(amount) {
  if (amount == null || Number.isNaN(amount)) return "-";
  return `Rp ${Number(amount).toLocaleString("id-ID")}`;
}

export function formatBerat(berat) {
  if (berat == null || berat === "") return null;
  const n = Number(berat);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export function calcTotalBiaya(berat, tarifPerKg) {
  const b = formatBerat(berat);
  if (b == null || !tarifPerKg) return null;
  return Math.round(b * tarifPerKg);
}
