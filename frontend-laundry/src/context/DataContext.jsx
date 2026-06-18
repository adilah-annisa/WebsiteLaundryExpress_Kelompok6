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
} from "../lib/constants";

const DataContext = createContext(null);

function loadData() {
  try {
    const raw = localStorage.getItem(DATA_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    localStorage.removeItem(DATA_STORAGE_KEY);
  }
  return createInitialData();
}

function persist(data) {
  localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(data));
}

export function DataProvider({ children }) {
  const [data, setData] = useState(loadData);

  useEffect(() => {
    persist(data);
  }, [data]);

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
    const layanan = getLayananByValue(payload.layanan);
    if (!layanan) throw new Error("Jenis layanan tidak valid.");

    let newOrder = null;
    update((prev) => {
      const counter = prev.orderCounter + 1;
      newOrder = {
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
        pengantaran: payload.pengantaran || "jemput",
        slotId: null,
        tanggal: "",
        jam: "",
        catatan: payload.catatan || "",
        bukti: null,
        createdAt: new Date().toISOString().split("T")[0],
      };
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
      update((prev) => ({
        ...prev,
        orders: prev.orders.map((o) => (o.id === orderId ? { ...o, ...changes } : o)),
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
        if (slot.terisi >= slot.kapasitas) {
          error = "Slot penuh. Silakan pilih jadwal lain.";
          return prev;
        }

        const oldSlotId = order.slotId;
        let slots = prev.slots.map((s) => {
          if (s.id === slotId) return { ...s, terisi: s.terisi + 1 };
          if (oldSlotId && s.id === oldSlotId && oldSlotId !== slotId) {
            return { ...s, terisi: Math.max(0, s.terisi - 1) };
          }
          return s;
        });

        const orders = prev.orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                slotId,
                tanggal: slot.tanggal,
                jam: slot.jam,
                pengantaran: slot.jenis === "antar" ? "antar" : o.pengantaran,
              }
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
      return data.slots.filter(
        (s) => s.jenis === jenis && s.terisi < s.kapasitas
      );
    },
    [data.slots]
  );

  const addSlot = useCallback(
    (slotPayload) => {
      let error = null;
      update((prev) => {
        const conflict = prev.slots.some(
          (s) =>
            s.tanggal === slotPayload.tanggal &&
            s.jam === slotPayload.jam &&
            s.jenis === slotPayload.jenis &&
            s.id !== slotPayload.id
        );
        if (conflict) {
          error = "Jadwal bentrok dengan slot yang sudah ada. Pilih tanggal atau waktu lain.";
          return prev;
        }

        const id = slotPayload.id || `S${Date.now()}`;
        const newSlot = {
          id,
          tanggal: slotPayload.tanggal,
          jam: slotPayload.jam,
          jenis: slotPayload.jenis,
          kapasitas: Number(slotPayload.kapasitas) || 3,
          terisi: Number(slotPayload.terisi) || 0,
        };

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
      update((prev) => ({
        ...prev,
        orders: prev.orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: "Selesai",
                bukti: {
                  foto,
                  waktu,
                  catatan: catatan || "",
                  kurirNama: KURIR_NAMA,
                },
              }
            : o
        ),
      }));
      return { ok: true, waktu };
    },
    [update]
  );

  const addTransaction = useCallback(
    (payload) => {
      if (!payload.seri || !payload.name || !payload.date || !payload.amount) {
        return { ok: false, message: "Data transaksi belum lengkap." };
      }

      let newTx = null;
      update((prev) => {
        const counter = prev.transactionCounter + 1;
        const amountNum = Number(String(payload.amount).replace(/[^0-9]/g, "")) || 0;
        newTx = {
          id: `T${String(counter).padStart(3, "0")}`,
          orderId: payload.orderId || payload.seri,
          seri: payload.seri,
          name: payload.name,
          date: payload.date,
          amount: payload.amount.startsWith("Rp") ? payload.amount : formatRupiah(amountNum),
          amountNum,
          status: payload.status || "Lunas",
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
        customer = {
          id: `C${String(prev.customers.length + 1).padStart(3, "0")}`,
          ...payload,
        };
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
