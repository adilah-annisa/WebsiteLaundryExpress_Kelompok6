import { LAYANAN_OPTIONS } from "../lib/constants";

const today = new Date();
const fmt = (d) => d.toISOString().split("T")[0];
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfter = new Date(today);
dayAfter.setDate(dayAfter.getDate() + 2);

function createCustomerRecord(id, name, address, phone, email) {
  return {
    id_pelanggan: id,
    nama: name,
    alamat: address,
    no_hp: phone,
    id,
    name,
    address,
    phone,
    email,
  };
}

function createKurirRecord(id, name, phone) {
  return {
    id_kurir: id,
    nama: name,
    no_hp: phone,
    id,
    name,
    phone,
  };
}

function createJadwalRecord(id, tanggal, jamJemput, jamAntar, keterangan, jenis, kapasitas = 3, terisi = 0) {
  return {
    id_jadwal: id,
    tanggal,
    jam_jemput: jamJemput,
    jam_antar: jamAntar,
    keterangan,
    id,
    tanggalValue: tanggal,
    jam: jamJemput || jamAntar || "",
    jenis,
    kapasitas,
    terisi,
  };
}

function createOrderRecord({
  id,
  customerId,
  customerName,
  phone,
  address,
  layanan,
  layananLabel,
  tarifPerKg,
  berat,
  total,
  status,
  pengantaran,
  slotId,
  tanggal,
  jam,
  catatan,
  bukti,
  createdAt,
  id_pesanan,
  id_pelanggan,
  id_jadwal,
  id_kurir,
  tanggal_pesanan,
  berat_kg,
  jenis_layanan,
  total_biaya,
}) {
  const normalizedId = id || id_pesanan || "";
  const normalizedCustomerId = customerId || id_pelanggan || "";
  const normalizedSlotId = slotId || id_jadwal || null;
  const normalizedTanggal = tanggal || tanggal_pesanan || "";
  const normalizedJam = jam || "";
  const normalizedLayanan = layanan || jenis_layanan || "";
  const normalizedStatus = status || "Diproses";

  return {
    id_pesanan: id_pesanan || normalizedId,
    id_pelanggan: id_pelanggan || normalizedCustomerId,
    id_jadwal: id_jadwal || normalizedSlotId,
    id_kurir: id_kurir || null,
    tanggal_pesanan: tanggal_pesanan || normalizedTanggal || createdAt || fmt(today),
    berat_kg: berat_kg ?? berat ?? null,
    jenis_layanan: jenis_layanan || normalizedLayanan,
    total_biaya: total_biaya ?? total ?? null,
    status: normalizedStatus,
    id: normalizedId,
    customerId: normalizedCustomerId,
    nama: customerName,
    nohp: phone,
    alamat: address,
    layanan: normalizedLayanan,
    layananLabel,
    tarifPerKg,
    berat: berat ?? berat_kg ?? null,
    total: total ?? total_biaya ?? null,
    pengantaran: pengantaran || "jemput",
    slotId: normalizedSlotId,
    tanggal: normalizedTanggal,
    jam: normalizedJam,
    catatan: catatan || "",
    bukti: bukti || null,
    createdAt: createdAt || fmt(today),
  };
}

export function createInitialData() {
  const pelanggan = [
    createCustomerRecord("C001", "Budi Santoso", "Jl. Melati No. 12, Jakarta Selatan", "081234567890", "budi@example.com"),
    createCustomerRecord("C002", "Siti Aminah", "Jl. Melati No. 45, Bandung", "081234567891", "siti@example.com"),
    createCustomerRecord("C003", "Andi Wijaya", "Jl. Kenanga No. 27, Depok", "081234567892", "andi@example.com"),
  ];

  const kurir = [
    createKurirRecord("K001", "Ahmad Rizky", "081234567893"),
  ];

  const jadwal = [
    createJadwalRecord("J001", fmt(today), "08:00", "14:00", "Jadwal reguler", "jemput", 3, 1),
    createJadwalRecord("J002", fmt(today), "10:00", "16:00", "Jadwal reguler", "jemput", 3, 3),
    createJadwalRecord("J003", fmt(today), "", "14:00", "Jadwal antar", "antar", 2, 1),
    createJadwalRecord("J004", fmt(tomorrow), "09:00", "", "Jadwal jemput", "jemput", 3, 0),
    createJadwalRecord("J005", fmt(tomorrow), "", "10:00", "Jadwal antar", "antar", 2, 1),
    createJadwalRecord("J006", fmt(dayAfter), "11:00", "", "Jadwal jemput", "jemput", 3, 0),
  ];

  const pesanan = [
    createOrderRecord({
      id: "#P001",
      customerId: "C001",
      customerName: "Budi Santoso",
      phone: "081234567890",
      address: "Jl. Melati No. 12, Jakarta Selatan",
      layanan: "cuci-setrika",
      layananLabel: "Cuci Setrika",
      tarifPerKg: 7000,
      berat: 3,
      total: 21000,
      status: "Sedang Disetrika",
      pengantaran: "jemput",
      slotId: "J001",
      tanggal: fmt(today),
      jam: "08:00",
      catatan: "",
      bukti: null,
      createdAt: fmt(today),
      id_pesanan: "#P001",
      id_pelanggan: "C001",
      id_jadwal: "J001",
      id_kurir: "K001",
      tanggal_pesanan: fmt(today),
      berat_kg: 3,
      jenis_layanan: "cuci-setrika",
      total_biaya: 21000,
    }),
    createOrderRecord({
      id: "#P002",
      customerId: "C001",
      customerName: "Budi Santoso",
      phone: "081234567890",
      address: "Jl. Mawar No. 5, Jakarta",
      layanan: "cuci-kering",
      layananLabel: "Cuci Kering",
      tarifPerKg: 3000,
      berat: null,
      total: null,
      status: "Diproses",
      pengantaran: "jemput",
      slotId: null,
      tanggal: "",
      jam: "",
      catatan: "Belum pilih jadwal",
      bukti: null,
      createdAt: fmt(today),
      id_pesanan: "#P002",
      id_pelanggan: "C001",
      id_jadwal: null,
      id_kurir: null,
      tanggal_pesanan: fmt(today),
      berat_kg: null,
      jenis_layanan: "cuci-kering",
      total_biaya: null,
    }),
    createOrderRecord({
      id: "#P003",
      customerId: "C002",
      customerName: "Siti Aminah",
      phone: "081234567891",
      address: "Jl. Melati No. 45, Bandung",
      layanan: "dry-clean",
      layananLabel: "Dry Clean",
      tarifPerKg: 15000,
      berat: 2,
      total: 30000,
      status: "Selesai",
      pengantaran: "jemput",
      slotId: "J003",
      tanggal: fmt(new Date(today.getTime() - 86400000 * 2)),
      jam: "14:00",
      catatan: "",
      bukti: {
        foto: null,
        waktu: new Date(today.getTime() - 86400000).toISOString(),
        catatan: "Laundry diterima dengan baik",
        kurirNama: "Ahmad Rizky",
      },
      createdAt: fmt(new Date(today.getTime() - 86400000 * 3)),
      id_pesanan: "#P003",
      id_pelanggan: "C002",
      id_jadwal: "J003",
      id_kurir: "K001",
      tanggal_pesanan: fmt(new Date(today.getTime() - 86400000 * 2)),
      berat_kg: 2,
      jenis_layanan: "dry-clean",
      total_biaya: 30000,
    }),
    createOrderRecord({
      id: "#P004",
      customerId: "C003",
      customerName: "Andi Wijaya",
      phone: "081234567892",
      address: "Jl. Kenanga No. 27, Depok",
      layanan: "setrika-saja",
      layananLabel: "Setrika Saja",
      tarifPerKg: 4000,
      berat: 4,
      total: 16000,
      status: "Siap Diantar",
      pengantaran: "antar",
      slotId: "J005",
      tanggal: fmt(tomorrow),
      jam: "10:00",
      catatan: "",
      bukti: null,
      createdAt: fmt(today),
      id_pesanan: "#P004",
      id_pelanggan: "C003",
      id_jadwal: "J005",
      id_kurir: "K001",
      tanggal_pesanan: fmt(tomorrow),
      berat_kg: 4,
      jenis_layanan: "setrika-saja",
      total_biaya: 16000,
    }),
  ];

  const slots = jadwal.map((slot) => ({
    id: slot.id,
    id_jadwal: slot.id_jadwal,
    tanggal: slot.tanggal,
    jam: slot.jam,
    jenis: slot.jenis,
    kapasitas: slot.kapasitas,
    terisi: slot.terisi,
    jam_jemput: slot.jam_jemput,
    jam_antar: slot.jam_antar,
    keterangan: slot.keterangan,
  }));

  return {
    pelanggan,
    pesanan,
    jadwal,
    kurir,
    orders: pesanan,
    slots,
    customers: pelanggan,
    transactions: [
      {
        id: "T001",
        orderId: "#P001",
        seri: "#P001",
        name: "Budi Santoso",
        date: fmt(today),
        amount: "Rp 21.000",
        amountNum: 21000,
        status: "Belum Lunas",
        paymentMethod: "Tunai",
        metode_pembayaran: "Tunai",
        paymentStatus: "Belum Dibayar",
        status_pembayaran: "Belum Dibayar",
      },
      {
        id: "T002",
        orderId: "#P003",
        seri: "#P003",
        name: "Siti Aminah",
        date: fmt(new Date(today.getTime() - 86400000 * 2)),
        amount: "Rp 30.000",
        amountNum: 30000,
        status: "Lunas",
        paymentMethod: "Transfer Bank",
        metode_pembayaran: "Transfer Bank",
        paymentStatus: "Lunas",
        status_pembayaran: "Lunas",
      },
    ],
    orderCounter: 4,
    transactionCounter: 2,
  };
}

export { LAYANAN_OPTIONS };
