# TODO - Perbaikan Tampilan (Dashboard SaaS)

## Tahap 1 — Fondasi UI Kit (Reusable Components)
- [ ] Tambahkan folder `frontend-laundry/src/components/ui/`.
- [ ] Buat komponen reusable: `Card`, `Button`, `Input`, `Textarea`, `Badge`, `StatusBadge` (enhance), `Modal`, `Toast`, `SearchBar`, `Table`, `Pagination`, `EmptyState`, `UploadCard`, `Timeline`.
- [ ] Pastikan komponen menggunakan Tailwind konsisten (sm–2xl) dan mendukung props.

## Tahap 2 — Shortcut antar role
- [ ] Update `frontend-laundry/src/components/Sidebar.jsx` untuk link: Dashboard Kurir & Dashboard Pelanggan.
- [ ] Update `frontend-laundry/src/pages/pelanggan/DashboardPelanggan.jsx` untuk shortcut: Dashboard Admin & Dashboard Kurir.
- [ ] Update `frontend-laundry/src/pages/kurir/DashboardKurir.jsx` untuk shortcut: Dashboard Admin & Dashboard Pelanggan.

## Tahap 3 — Redesign halaman per use case (tanpa ubah bisnis)
- [ ] US-01: `frontend-laundry/src/pages/pelanggan/Pemesanan.jsx` (rapikan form, tambah Date/Time Picker, validasi jadwal).
- [ ] US-04: `frontend-laundry/src/pages/pelanggan/StatusLaundry.jsx` (CostBreakdown + PaymentWidget; empty state berat).
- [ ] US-05: `frontend-laundry/src/pages/pelanggan/BuktiPengantaran.jsx` (ProofTimeline + empty state).
- [ ] US-06: `frontend-laundry/src/pages/admin/Pesanan.jsx` (Search/Filter/Table + Modal detail + edit status).
- [ ] US-07: `frontend-laundry/src/pages/admin/Jadwal.jsx` (ScheduleCard + modal/panel add/edit, error alert bentrok).
- [ ] US-10: `frontend-laundry/src/pages/admin/Keuangan.jsx` (stat cards + table rapi + filter).
- [ ] US-11: `frontend-laundry/src/pages/kurir/Antar.jsx` dan `frontend-laundry/src/pages/kurir/Jemput.jsx` (Schedule card + empty state).
- [ ] US-12: `frontend-laundry/src/pages/kurir/UploadBukti.jsx` (UploadCard: preview/progress/retry-ready).

## Tahap 4 — QA
- [ ] `npm run dev` cek UI tidak error.
- [ ] `npm run build` pastikan build sukses.
- [ ] Uji alur: Pemesanan → Jadwal, Status Laundry, Bukti Pengantaran, Upload Bukti, Admin update status.

