# TODO - Supabase Porting (DataContext)

## Target
- DataContext tidak lagi memakai dummy/localStorage
- DataContext mengambil/mutakhirkan data melalui `frontend-laundry/src/services/supabaseApi.js`

## Checklist
- [ ] Ambil services aktif dan simpan ke state
- [ ] Ambil schedules (untuk pilih slot)
- [ ] Ambil orders untuk role tertentu (pelanggan: by customer_id; kurir: tasks; admin: semua)
- [ ] Ambil transactions (admin: semua)
- [ ] Ambil delivery_proofs untuk bukti pelanggan
- [ ] Ubah createOrder/updateOrder/bookSlot/addSlot/addTransaction/uploadBukti agar memanggil supabaseApi
- [ ] Pastikan DataContext expose fungsi yang dipakai halaman existing (tanpa ubah fitur lain)

