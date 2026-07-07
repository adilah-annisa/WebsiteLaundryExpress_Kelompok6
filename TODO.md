# TODO - Revisi LaundryExpress (sesuai daftar revisi)

## Tahap 1 — Analisis & pemetaan implementasi (wajib)
- [ ] Identifikasi halaman admin yang berisi form "Tambah Transaksi" lama
- [ ] Identifikasi halaman detail pesanan admin dan area "Status Pesanan"
- [ ] Identifikasi halaman kurir/jadwal lama (Antar/Jemput) yang harus digabung atau dihapus routing
- [ ] Identifikasi halaman pelanggan: Riwayat/Status/Bukti Pengantaran/Jadwal
- [ ] Identifikasi halaman pelanggan: Pemesanan (form layanan, pilihan jadwal, preferensi waktu)

## Tahap 2 — Integrasi Supabase end-to-end
- [ ] Ubah `frontend-laundry/src/context/DataContext.jsx` agar melakukan CRUD via `frontend-laundry/src/services/supabaseApi.js`
- [ ] Pastikan state data: services, orders, schedules, transactions, delivery_proofs, notifications
- [ ] Pastikan seluruh halaman (admin/kurir/pelanggan) menggunakan data dari DataContext

## Tahap 3 — Fitur layanan Antar-Jemput
- [ ] Tambahkan pilihan layanan `antar-jemput` pada form pemesanan pelanggan
- [ ] Pastikan selector/label layanan di UI menampilkan Antar-Jemput
- [ ] Pastikan persist ke DB menggunakan enum `delivery_type_enum`

## Tahap 4 — Preferensi Waktu pelanggan (ganti menu Jadwal)
- [ ] Hapus routing/menu pelanggan "Jadwal"
- [ ] Tambahkan UI preferensi waktu di `Pemesanan.jsx` (pilih slot/jadwal yang diinginkan)
- [ ] Simpan preferensi waktu ke `orders.scheduled_date/time` dan/atau `pickup_schedule_id/delivery_schedule_id`
- [ ] Pastikan admin & kurir membaca field tersebut

## Tahap 5 — Gabungkan halaman Pelanggan
- [ ] Buat halaman tunggal `PelangganPesanan.jsx` (Riwayat + Status + Bukti)
- [ ] Update routing & `customerMenu.js` agar menu tidak lagi terpisah
- [ ] Pastikan data riwayat diambil dari `orders` + `delivery_proofs`

## Tahap 6 — Gabungkan halaman Kurir
- [ ] Pastikan routing kurir hanya memakai `AntarJemput.jsx`
- [ ] Gabungkan list tugas antar maupun jemput di satu halaman
- [ ] Update menu kurir agar hanya menampilkan Antar-Jemput
- [ ] Pastikan halaman jadwal/antar/jemput lama tidak dipanggil routing

## Tahap 7 — Admin: Tambah transaksi cash harian
- [ ] Hapus form "Tambah Transaksi" lama
- [ ] Buat form baru (pendapatan harian cash)
- [ ] Simpan ke Supabase (gunakan tabel yang sudah ada; jika tidak cukup buat migrasi)
- [ ] Pastikan nominal masuk laporan pendapatan

## Tahap 8 — Admin: Hapus "Status Pesanan" hanya di Detail Pesanan
- [ ] Update halaman detail pesanan admin untuk menghapus section UI status
- [ ] Jangan ubah logika status yang dipakai halaman lain

## Tahap 9 — Validasi
- [ ] Jalankan build/lint untuk memastikan tidak ada error
- [ ] Uji CRUD: create order, pilih slot, update status, upload bukti, admin tambah cash, lihat laporan


