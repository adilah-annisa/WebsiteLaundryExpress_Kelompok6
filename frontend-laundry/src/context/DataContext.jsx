import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createInitialData } from "../data/initialData";
import {
  AUTH_STORAGE_KEY,
  DATA_STORAGE_KEY,
  KURIR_NAMA,
  calcTotalBiaya,
  formatBerat,
  formatRupiah,
  getLayananByValue,
  LAYANAN_OPTIONS,
} from "../lib/constants";

const DataContext = createContext(null);

function buildOrderRecord(payload) {
  const paymentMethod = payload.paymentMethod || payload.metode_pembayaran || "Tunai";
  const paymentStatus = payload.paymentStatus || payload.status_pembayaran || (paymentMethod === "Tunai" ? "Lunas" : "Belum Dibayar");

  return {
    id_pesanan: payload.id_pesanan || payload.id || "",
    id_pelanggan: payload.id_pelanggan || payload.customerId || "",
    id_jadwal: payload.id_jadwal || payload.slotId || null,
    id_kurir: payload.id_kurir || null,
    tanggal_pesanan: payload.tanggal_pesanan || payload.tanggal || "",
    berat_kg: payload.berat_kg ?? payload.berat ?? null,
    jenis_layanan: payload.jenis_layanan || payload.layanan || "",
    total_biaya: payload.total_biaya ?? payload.total ?? null,
    status: payload.status || "Diproses",
    paymentMethod,
    metode_pembayaran: paymentMethod,
    paymentStatus,
    status_pembayaran: paymentStatus,
    id: payload.id || payload.id_pesanan || "",
    customerId: payload.id_pelanggan || payload.customerId || "",
    nama: payload.nama,
    nohp: payload.nohp,
    alamat: payload.alamat,
    layanan: payload.layanan || payload.jenis_layanan || "",
    layananLabel: payload.layananLabel || "",
    tarifPerKg: payload.tarifPerKg ?? null,
    berat: payload.berat ?? payload.berat_kg ?? null,
    total: payload.total ?? payload.total_biaya ?? null,
    pengantaran: payload.pengantaran || "jemput",
    transportKotor: payload.transportKotor || null,
    transportBersih: payload.transportBersih || null,
    slotId: payload.slotId || payload.id_jadwal || null,
    tanggal: payload.tanggal || payload.tanggal_pesanan || "",
    jam: payload.jam || "",
    catatan: payload.catatan || "",
    bukti: payload.bukti || null,
    createdAt: payload.createdAt || new Date().toISOString().split("T")[0],
  };
}

function buildCustomerRecord(payload) {
  return {
    id_pelanggan: payload.id_pelanggan || payload.id || "",
    nama: payload.nama || payload.name || "",
    alamat: payload.alamat || payload.address || "",
    no_hp: payload.no_hp || payload.phone || "",
    id: payload.id || payload.id_pelanggan || "",
    name: payload.nama || payload.name || "",
    address: payload.alamat || payload.address || "",
    phone: payload.no_hp || payload.phone || "",
    email: payload.email || "",
  };
}

function buildSlotRecord(payload) {
  return {
    id: payload.id || payload.id_jadwal || "",
    id_jadwal: payload.id_jadwal || payload.id || "",
    // Jadwal berlaku setiap hari (tidak menggunakan tanggal), hanya menyimpan jam/jenis
    tanggal: "",
    jam: payload.jam || payload.jam_jemput || "",
    jenis: payload.jenis || "jemput",
    // Single-courier model: kapasitas implicit = 1, terisi 0/1
    kapasitas: 1,
    terisi: Number(payload.terisi) || 0,
    jam_jemput: payload.jam_jemput || payload.jam || "",
    jam_antar: payload.jam_antar || "",
    keterangan: payload.keterangan || "",
    done: payload.done || false,
  };
}

function normalizeOrderUpdates(changes) {
  const next = { ...changes };
  if (Object.prototype.hasOwnProperty.call(changes, "berat")) {
    next.berat_kg = changes.berat;
  }
  if (Object.prototype.hasOwnProperty.call(changes, "total")) {
    next.total_biaya = changes.total;
  }
  if (Object.prototype.hasOwnProperty.call(changes, "layanan")) {
    next.jenis_layanan = changes.layanan;
  }
  if (Object.prototype.hasOwnProperty.call(changes, "customerId")) {
    next.id_pelanggan = changes.customerId;
  }
  if (Object.prototype.hasOwnProperty.call(changes, "slotId")) {
    next.id_jadwal = changes.slotId;
  }
  if (Object.prototype.hasOwnProperty.call(changes, "tanggal")) {
    next.tanggal_pesanan = changes.tanggal;
  }
  if (Object.prototype.hasOwnProperty.call(changes, "paymentMethod")) {
    next.metode_pembayaran = changes.paymentMethod;
  }
  if (Object.prototype.hasOwnProperty.call(changes, "paymentStatus")) {
    next.status_pembayaran = changes.paymentStatus;
  }
  return next;
}

export function DataProvider({ children }) {
  const [data, setData] = useState(() => createInitialData());
  const [loading, setLoading] = useState(true);

  const refreshOrders = useCallback(async () => {
    // Data saat ini dikelola sepenuhnya secara lokal.
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        await Promise.resolve();
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback((updater) => {
    setData((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      return next;
    });
  }, []);


  const getOrdersForCustomer = useCallback(
    (customerId) => data.orders.filter((o) => o.customerId === customerId),
    [data.orders]
  );

  const getOrderById = useCallback(
    (id) => data.orders.find((o) => o.id === id),
    [data.orders]
  );

  const createOrder = useCallback((payload) => {
    const layanan = getLayananByValue(payload.layanan || (LAYANAN_OPTIONS[0] && LAYANAN_OPTIONS[0].value));
    if (!layanan) throw new Error("Jenis layanan tidak valid.");

    const paymentMethod = payload.paymentMethod || payload.metode_pembayaran || "Tunai";
    const paymentStatus = paymentMethod === "Tunai" ? "Lunas" : payload.paymentStatus || payload.status_pembayaran || "Belum Dibayar";

    let newOrder = null;
    update((prev) => {
      const counter = prev.orderCounter + 1;
      // Determine who handles dirty (kotor) and clean (bersih) transport
      // jemput: kurir picks up kotor, pelanggan picks up clean
      // antar: pelanggan brings kotor, kurir delivers clean
      // antar-jemput: kurir handles both directions
      const peng = payload.pengantaran || "jemput";
      const transportKotor = peng === "jemput" || peng === "antar-jemput" ? "kurir" : "pelanggan";
      const transportBersih = peng === "antar" ? "kurir" : "pelanggan";

      newOrder = buildOrderRecord({
        id: `#P${String(counter).padStart(3, "0")}`,
        customerId: payload.customerId,
        nama: payload.nama,
        nohp: payload.nohp,
        alamat: payload.alamat,
        layanan: layanan.value,
        layananLabel: layanan.label,
        tarifPerKg: layanan.price,
        berat: null,
        total: null,
        status: "Diproses",
        paymentMethod,
        metode_pembayaran: paymentMethod,
        paymentStatus,
        status_pembayaran: paymentStatus,
        pengantaran: payload.pengantaran || "jemput",
        transportKotor,
        transportBersih,
        slotId: null,
        tanggal: "",
        jam: "",
        catatan: payload.catatan || "",
        bukti: null,
        createdAt: new Date().toISOString().split("T")[0],
      });
      return {
        ...prev,
        orderCounter: counter,
        orders: [newOrder, ...prev.orders],
      };
    });
    return newOrder;
  }, [update]);

  const updateOrder = useCallback(
    (orderId, changes) => {
      const normalizedChanges = normalizeOrderUpdates(changes);
      update((prev) => ({
        ...prev,
        orders: prev.orders.map((o) =>
          o.id === orderId ? { ...o, ...normalizedChanges } : o
        ),
      }));
    },
    [update]
  );

  const bookSlot = useCallback(
    (orderId, slotId) => {
      let error = null;
      update((prev) => {
        const slot = prev.slots.find((s) => s.id === slotId);
        const order = prev.orders.find((o) => o.id === orderId);

        if (!slot) {
          error = "Slot jadwal tidak ditemukan.";
          return prev;
        }
        if (!order) {
          error = "Pesanan tidak ditemukan.";
          return prev;
        }
        // Single courier: slot can only be taken by one customer at a time
        if (slot.terisi >= 1) {
          error = "Slot sudah diambil. Silakan pilih jadwal lain.";
          return prev;
        }

        const oldSlotId = order.slotId;
        let slots = prev.slots.map((s) => {
          if (s.id === slotId) return { ...s, terisi: 1 };
          if (oldSlotId && s.id === oldSlotId && oldSlotId !== slotId) {
            return { ...s, terisi: 0 };
          }
          return s;
        });

        const orders = prev.orders.map((o) =>
          o.id === orderId
            ? buildOrderRecord({
                ...o,
                slotId,
                id_jadwal: slot.id_jadwal || slot.id,
                // Jadwal berlaku setiap hari - hanya simpan jam/slotId
                tanggal: "",
                jam: slot.jam,
                tanggal_pesanan: slot.tanggal,
                pengantaran: slot.jenis === "antar" ? "antar" : o.pengantaran,
              })
            : o
        );

        return { ...prev, slots, orders };
      });
      return { ok: !error, message: error };
    },
    [update]
  );

  const getAvailableSlots = useCallback(
    (jenis) => {
      // Available if terisi === 0 (single courier)
      return data.slots.filter((s) => s.jenis === jenis && (!s.terisi || s.terisi === 0));
    },
    [data.slots]
  );

  const addSlot = useCallback(
    (slotPayload) => {
      let error = null;
      update((prev) => {
        // Conflict when same jam & jenis (jadwal berlaku setiap hari)
        const conflict = prev.slots.some(
          (s) => s.jam === slotPayload.jam && s.jenis === slotPayload.jenis && s.id !== slotPayload.id
        );
        if (conflict) {
          error = "Jadwal bentrok dengan slot yang sudah ada (jam/jenis sama).";
          return prev;
        }

        const id = slotPayload.id || `S${Date.now()}`;
        const newSlot = buildSlotRecord({
          id,
          id_jadwal: slotPayload.id_jadwal || slotPayload.id || id,
          jam: slotPayload.jam,
          jenis: slotPayload.jenis,
          terisi: Number(slotPayload.terisi) || 0,
          jam_jemput: slotPayload.jam_jemput || slotPayload.jam || "",
          jam_antar: slotPayload.jam_antar || "",
          keterangan: slotPayload.keterangan || "",
        });

        const exists = prev.slots.some((s) => s.id === id);
        const slots = exists
          ? prev.slots.map((s) => (s.id === id ? { ...s, ...newSlot } : s))
          : [newSlot, ...prev.slots];

        return { ...prev, slots };
      });
      return { ok: !error, message: error };
    },
    [update]
  );

  const setOrderWeight = useCallback(
    (orderId, beratInput) => {
      const berat = formatBerat(beratInput);
      if (berat == null) {
        return { ok: false, message: "Berat tidak valid. Masukkan angka lebih dari 0." };
      }

      const order = data.orders.find((o) => o.id === orderId);
      if (!order) return { ok: false, message: "Pesanan tidak ditemukan." };

      const total = calcTotalBiaya(berat, order.tarifPerKg);
      updateOrder(orderId, { berat, total });
      return { ok: true, berat, total, formatted: formatRupiah(total) };
    },
    [data.orders, updateOrder]
  );

  const uploadBukti = useCallback(
    (orderId, { foto, catatan }) => {
      if (!foto) {
        return { ok: false, message: "Upload gagal. Foto bukti wajib diunggah." };
      }

      const waktu = new Date().toISOString();
      update((prev) => {
        const orders = prev.orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                // When kurir uploads bukti, mark as Diantar (awaiting customer confirmation)
                status: "Diantar",
                bukti: {
                  foto,
                  waktu,
                  catatan: catatan || "",
                  kurirNama: KURIR_NAMA,
                },
              }
            : o
        );

        // Free up the slot associated with this order (so it can be booked again)
        const order = prev.orders.find((o) => o.id === orderId);
        const slots = prev.slots.map((s) => {
          if (order && order.slotId && s.id === order.slotId) {
            return { ...s, terisi: 0 };
          }
          return s;
        });

        return { ...prev, orders, slots };
      });
      return { ok: true, waktu };
    },
    [update]
  );

  const addTransaction = useCallback(
    (payload) => {
      if (!payload.amount) {
        return { ok: false, message: "Jumlah nominal pendapatan belum diisi." };
      }

      let newTx = null;
      update((prev) => {
        const counter = prev.transactionCounter + 1;
        const date = payload.date || new Date().toISOString().slice(0, 10);
        const amountNum = Number(String(payload.amount).replace(/[^0-9]/g, "")) || 0;
        const amount = payload.amount.startsWith("Rp") ? payload.amount : formatRupiah(amountNum);
        const seri = payload.seri || `REV-${date.replace(/-/g, "")}-${String(counter).padStart(3, "0")}`;
        const paymentMethod = payload.paymentMethod || payload.metode_pembayaran || "Tunai";
        const paymentStatus = payload.paymentStatus || payload.status_pembayaran || (paymentMethod === "Tunai" ? "Lunas" : "Belum Dibayar");

        newTx = {
          id: `T${String(counter).padStart(3, "0")}`,
          orderId: payload.orderId || seri,
          seri,
          name: payload.name || "Pendapatan Harian",
          date,
          amount,
          amountNum,
          status: payload.status || paymentStatus,
          paymentMethod,
          metode_pembayaran: paymentMethod,
          paymentStatus,
          status_pembayaran: paymentStatus,
          keterangan: payload.keterangan || "",
        };
        return {
          ...prev,
          transactionCounter: counter,
          transactions: [newTx, ...prev.transactions],
        };
      });
      return { ok: true, transaction: newTx };
    },
    [update]
  );

  const addCustomer = useCallback(
    (payload) => {
      if (!payload.name || !payload.address || !payload.phone || !payload.email) {
        return { ok: false, message: "Data pelanggan belum lengkap." };
      }
      let customer = null;
      update((prev) => {
        customer = buildCustomerRecord({
          id: `C${String(prev.customers.length + 1).padStart(3, "0")}`,
          ...payload,
        });
        return { ...prev, customers: [customer, ...prev.customers] };
      });
      return { ok: true, customer };
    },
    [update]
  );

  const getCustomerById = useCallback(
    (id) => data.customers.find((c) => c.id === id),
    [data.customers]
  );

  const getKurirTasks = useCallback(() => {
    const pickups = data.orders
      .filter(
        (o) =>
          o.pengantaran === "jemput" &&
          o.slotId &&
          ["Diproses", "Dijemput"].includes(o.status)
      )
      .map((o) => ({
        kode: o.id,
        nama: o.nama,
        alamat: o.alamat,
        telepon: o.nohp,
        waktu: o.jam,
        tanggal: o.tanggal,
        jenis: "Penjemputan",
        status: o.status,
        catatan: o.catatan,
      }));

    const deliveries = data.orders
      .filter((o) => ["Siap Diantar", "Diantar"].includes(o.status))
      .map((o) => ({
        kode: o.id,
        nama: o.nama,
        alamat: o.alamat,
        telepon: o.nohp,
        waktu: o.jam || "-",
        tanggal: o.tanggal || "-",
        jenis: "Pengantaran",
        status: o.status,
        catatan: o.catatan,
      }));

    return { pickups, deliveries, all: [...pickups, ...deliveries] };
  }, [data.orders]);

  const totalPendapatan = useMemo(
    () =>
      data.transactions
        .filter((t) => t.status === "Lunas")
        .reduce((acc, t) => acc + (t.amountNum || 0), 0),
    [data.transactions]
  );

  const resetData = useCallback(() => {
    const fresh = createInitialData();
    setData(fresh);
    persist(fresh);
  }, []);

  const value = useMemo(
    () => ({
      data,
      orders: data.orders,
      slots: data.slots,
      customers: data.customers,
      transactions: data.transactions,
      totalPendapatan,
      getOrdersForCustomer,
      getOrderById,
      createOrder,
      updateOrder,
      bookSlot,
      getAvailableSlots,
      addSlot,
      setOrderWeight,
      uploadBukti,
      addTransaction,
      addCustomer,
      getCustomerById,
      getKurirTasks,
      resetData,
    }),
    [
      data,
      totalPendapatan,
      getOrdersForCustomer,
      getOrderById,
      createOrder,
      updateOrder,
      bookSlot,
      getAvailableSlots,
      addSlot,
      setOrderWeight,
      uploadBukti,
      addTransaction,
      addCustomer,
      getCustomerById,
      getKurirTasks,
      resetData,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}

export function clearAppStorage() {
  localStorage.removeItem(DATA_STORAGE_KEY);
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
