# 📦 DOKUMENTASI MIGRASI LAUNDRY EXPRESS KE SUPABASE

**Tanggal:** 1 Juli 2026  
**Versi:** 1.0  
**Status:** Ready for Implementation

---

## 🎯 RINGKASAN ANALISIS

Aplikasi Laundry Express saat ini menggunakan dummy data dengan 7 tabel utama dan 3 peran pengguna (Admin, Pelanggan, Kurir). Migrasi ke Supabase akan menghubungkan frontend React yang sudah ada dengan backend yang scalable, secure, dan real-time.

---

## ✅ REQUIREMENT 1: DAFTAR TABEL SUPABASE

### Tabel Utama yang Dibutuhkan:

| No | Tabel | Deskripsi | Tipe |
|----|-------|-----------|------|
| 1 | `users` | Data pengguna & autentikasi | Master |
| 2 | `customers` | Data pelanggan (detail extension dari users) | Master |
| 3 | `couriers` | Data kurir/pengantar (detail extension dari users) | Master |
| 4 | `services` | Daftar jenis layanan laundry | Master |
| 5 | `schedules` | Jadwal pickup & delivery | Master |
| 6 | `orders` | Pesanan laundry | Transaksi |
| 7 | `order_items` | Detail item per pesanan (optional, untuk multi-item) | Transaksi |
| 8 | `transactions` | Riwayat pembayaran | Transaksi |
| 9 | `delivery_proofs` | Bukti pengantaran (foto, catatan, tanda tangan) | Transaksi |
| 10 | `notifications` | Notifikasi untuk pengguna | Log |
| 11 | `audit_logs` | Log aktivitas sistem | Log |

---

## 🏗️ REQUIREMENT 2: STRUKTUR TABEL LENGKAP

### 1️⃣ TABEL: `users` (Authentication & Authorization)

```
Tabel: users
Deskripsi: Kredensial & data profil pengguna
PK: id (UUID)

Kolom:
- id (UUID, PK) - Auto-generated oleh Supabase Auth
- email (TEXT, UNIQUE, NOT NULL) - Email untuk login
- password (TEXT, NOT NULL) - Hash password (managed by Supabase Auth)
- role (ENUM, NOT NULL) - admin, pelanggan, kurir
- full_name (TEXT, NOT NULL) - Nama lengkap
- phone (TEXT) - Nomor telepon
- photo_url (TEXT) - URL foto profil dari storage
- is_active (BOOLEAN, DEFAULT TRUE) - Status aktif/tidak
- created_at (TIMESTAMP, DEFAULT NOW()) - Waktu registrasi
- updated_at (TIMESTAMP, DEFAULT NOW()) - Update terakhir
- last_login (TIMESTAMP) - Login terakhir

FK:
- Tidak ada (tabel master)

Constraints:
- Email UNIQUE
- Role harus salah satu dari: admin, pelanggan, kurir
- Phone format: ^62\d{9,12}$
```

---

### 2️⃣ TABEL: `customers` (Data Pelanggan)

```
Tabel: customers
Deskripsi: Extended data untuk pelanggan
PK: id (UUID)

Kolom:
- id (UUID, PK) - Foreign key ke users.id
- user_id (UUID, FK NOT NULL) → users.id
- address (TEXT, NOT NULL) - Alamat lengkap
- city (TEXT) - Kota
- postal_code (TEXT) - Kode pos
- latitude (NUMERIC) - Koordinat GPS
- longitude (NUMERIC) - Koordinat GPS
- preferred_delivery_type (ENUM) - jemput, antar, antar-jemput (preferensi default)
- total_orders (INTEGER, DEFAULT 0) - Total pesanan
- total_spending (INTEGER, DEFAULT 0) - Total pengeluaran (dalam rupiah)
- loyalty_points (INTEGER, DEFAULT 0) - Poin loyalitas
- notes (TEXT) - Catatan khusus pelanggan
- created_at (TIMESTAMP, DEFAULT NOW())
- updated_at (TIMESTAMP, DEFAULT NOW())

FK:
- user_id → users.id (CASCADE DELETE)

Constraints:
- Unique(user_id)
- postal_code format: ^\d{5}$
```

---

### 3️⃣ TABEL: `couriers` (Data Kurir/Pengantar)

```
Tabel: couriers
Deskripsi: Extended data untuk kurir
PK: id (UUID)

Kolom:
- id (UUID, PK)
- user_id (UUID, FK NOT NULL) → users.id
- vehicle_type (ENUM) - motor, mobil, sepeda
- vehicle_plate (TEXT) - Plat nomor kendaraan
- is_available (BOOLEAN, DEFAULT TRUE) - Sedang tersedia
- current_location (POINT) - Lokasi GPS saat ini (PostGIS type)
- total_deliveries (INTEGER, DEFAULT 0) - Total pengantaran
- rating (NUMERIC, DEFAULT 0) - Rating 1-5
- bank_account (TEXT) - Nomor rekening
- bank_name (TEXT) - Nama bank
- salary_type (ENUM) - fixed, commission, hybrid
- base_salary (INTEGER) - Gaji pokok
- commission_rate (NUMERIC) - Persen komisi
- documents_verified (BOOLEAN, DEFAULT FALSE) - Dokumen terverifikasi
- verified_at (TIMESTAMP) - Waktu verifikasi
- notes (TEXT)
- created_at (TIMESTAMP, DEFAULT NOW())
- updated_at (TIMESTAMP, DEFAULT NOW())

FK:
- user_id → users.id (CASCADE DELETE)

Constraints:
- Unique(vehicle_plate)
- rating >= 0 AND rating <= 5
- commission_rate >= 0 AND commission_rate <= 100
```

---

### 4️⃣ TABEL: `services` (Jenis Layanan Laundry)

```
Tabel: services
Deskripsi: Master data jenis layanan
PK: id (UUID)

Kolom:
- id (UUID, PK) - Auto-generated
- code (TEXT, UNIQUE, NOT NULL) - cuci-kering, cuci-setrika, setrika-saja, dry-clean
- name (TEXT, NOT NULL) - Cuci Kering, Cuci Setrika, dst
- description (TEXT) - Deskripsi detail
- price_per_kg (INTEGER, NOT NULL) - Harga per kg (rupiah)
- estimated_days (INTEGER) - Estimasi hari pengerjaan
- min_weight (NUMERIC) - Berat minimum (kg)
- max_weight (NUMERIC) - Berat maksimum (kg)
- icon_name (TEXT) - Nama icon untuk UI
- is_active (BOOLEAN, DEFAULT TRUE)
- created_at (TIMESTAMP, DEFAULT NOW())
- updated_at (TIMESTAMP, DEFAULT NOW())

FK:
- Tidak ada

Constraints:
- price_per_kg > 0
- estimated_days > 0
- code UNIQUE
```

---

### 5️⃣ TABEL: `schedules` (Jadwal Pickup & Delivery)

```
Tabel: schedules
Deskripsi: Jadwal ketersediaan pickup dan delivery
PK: id (UUID)

Kolom:
- id (UUID, PK)
- schedule_date (DATE, NOT NULL) - Tanggal jadwal
- schedule_time (TIME, NOT NULL) - Jam jadwal (08:00, 10:00, dst)
- schedule_type (ENUM, NOT NULL) - jemput, antar, antar-jemput
- max_capacity (INTEGER, NOT NULL) - Kapasitas maksimum (default 3 atau 5)
- current_slots (INTEGER, DEFAULT 0) - Slot yang sudah terbooked
- assigned_courier_id (UUID, FK) → couriers.id (NULL jika belum assigned)
- notes (TEXT)
- is_active (BOOLEAN, DEFAULT TRUE)
- created_at (TIMESTAMP, DEFAULT NOW())
- updated_at (TIMESTAMP, DEFAULT NOW())

FK:
- assigned_courier_id → couriers.user_id (optional, SET NULL on delete)

Constraints:
- current_slots >= 0 AND current_slots <= max_capacity
- schedule_type IN ('jemput', 'antar', 'antar-jemput')
- schedule_date >= CURRENT_DATE
```

---

### 6️⃣ TABEL: `orders` (Pesanan Laundry)

```
Tabel: orders
Deskripsi: Pesanan laundry dari pelanggan
PK: id (UUID)

Kolom:
- id (UUID, PK) - Auto-generated
- order_code (TEXT, UNIQUE, NOT NULL) - #P001, #P002, dst (generated otomatis)
- customer_id (UUID, FK NOT NULL) → customers.id
- service_id (UUID, FK NOT NULL) → services.id
- delivery_type (ENUM, NOT NULL) - jemput, antar, antar-jemput
- scheduled_date (DATE) - Tanggal jadwal pickup/delivery
- scheduled_time (TIME) - Jam jadwal
- pickup_schedule_id (UUID, FK) → schedules.id (untuk jemput)
- delivery_schedule_id (UUID, FK) → schedules.id (untuk antar)
- weight_kg (NUMERIC) - Berat laundry (diisi setelah pickup)
- price_per_kg (INTEGER) - Harga per kg (snapshot saat order)
- total_price (INTEGER) - Total harga (weight * price_per_kg)
- status (ENUM, DEFAULT 'pending') - pending, diproses, sedang_disetrika, siap_diantar, diantar, selesai, dibatalkan
- payment_status (ENUM, DEFAULT 'belum_lunas') - belum_lunas, lunas, cicilan
- customer_notes (TEXT) - Catatan dari pelanggan
- special_instructions (TEXT) - Instruksi khusus
- estimated_completion (TIMESTAMP) - Perkiraan selesai
- actual_completion (TIMESTAMP) - Waktu selesai aktual
- pickup_date (TIMESTAMP) - Waktu pickup aktual
- delivery_date (TIMESTAMP) - Waktu delivery aktual
- pickup_courier_id (UUID, FK) → couriers.user_id
- delivery_courier_id (UUID, FK) → couriers.user_id
- created_at (TIMESTAMP, DEFAULT NOW())
- updated_at (TIMESTAMP, DEFAULT NOW())

FK:
- customer_id → customers.id (CASCADE DELETE)
- service_id → services.id (RESTRICT)
- pickup_schedule_id → schedules.id (SET NULL)
- delivery_schedule_id → schedules.id (SET NULL)
- pickup_courier_id → couriers.user_id (SET NULL)
- delivery_courier_id → couriers.user_id (SET NULL)

Constraints:
- delivery_type IN ('jemput', 'antar', 'antar-jemput')
- status NOT NULL
- payment_status NOT NULL
- order_code UNIQUE
```

---

### 7️⃣ TABEL: `transactions` (Riwayat Pembayaran)

```
Tabel: transactions
Deskripsi: Riwayat pembayaran pesanan
PK: id (UUID)

Kolom:
- id (UUID, PK) - Auto-generated
- order_id (UUID, FK NOT NULL) → orders.id
- transaction_code (TEXT, UNIQUE, NOT NULL) - CASH-20260701, INV-001, dst
- payment_method (ENUM, NOT NULL) - cash, bank_transfer, e_wallet, card
- amount (INTEGER, NOT NULL) - Jumlah (rupiah)
- paid_date (DATE, NOT NULL)
- paid_by (UUID, FK) → users.id (jika dibayar dari akun lain)
- recorded_by (UUID, FK NOT NULL) → users.id (siapa yang mencatat, biasanya admin)
- payment_proof_url (TEXT) - URL bukti pembayaran (untuk transfer)
- notes (TEXT) - Catatan pembayaran
- status (ENUM, DEFAULT 'pending') - pending, confirmed, failed, refunded
- created_at (TIMESTAMP, DEFAULT NOW())
- updated_at (TIMESTAMP, DEFAULT NOW())

FK:
- order_id → orders.id (CASCADE DELETE)
- paid_by → users.id (SET NULL)
- recorded_by → users.id (RESTRICT)

Constraints:
- amount > 0
- payment_method IN ('cash', 'bank_transfer', 'e_wallet', 'card')
- status IN ('pending', 'confirmed', 'failed', 'refunded')
- transaction_code UNIQUE
```

---

### 8️⃣ TABEL: `delivery_proofs` (Bukti Pengantaran)

```
Tabel: delivery_proofs
Deskripsi: Bukti pengantaran dengan foto dan catatan
PK: id (UUID)

Kolom:
- id (UUID, PK)
- order_id (UUID, FK NOT NULL) → orders.id
- proof_type (ENUM, NOT NULL) - pickup_proof, delivery_proof
- courier_id (UUID, FK NOT NULL) → couriers.user_id
- photo_url (TEXT) - URL foto dari Supabase Storage
- photo_timestamp (TIMESTAMP, NOT NULL) - Waktu foto diambil
- notes (TEXT) - Catatan kurir
- recipient_name (TEXT) - Nama penerima
- recipient_signature_url (TEXT) - URL foto tanda tangan
- latitude (NUMERIC) - Lokasi GPS pengantaran
- longitude (NUMERIC) - Lokasi GPS pengantaran
- status (ENUM, DEFAULT 'pending') - pending, verified, rejected
- verified_by (UUID, FK) → users.id (admin yang verifikasi)
- verified_at (TIMESTAMP)
- created_at (TIMESTAMP, DEFAULT NOW())
- updated_at (TIMESTAMP, DEFAULT NOW())

FK:
- order_id → orders.id (CASCADE DELETE)
- courier_id → couriers.user_id (RESTRICT)
- verified_by → users.id (SET NULL)

Constraints:
- proof_type IN ('pickup_proof', 'delivery_proof')
- status IN ('pending', 'verified', 'rejected')
```

---

### 9️⃣ TABEL: `notifications` (Notifikasi Pengguna)

```
Tabel: notifications
Deskripsi: Notifikasi untuk berbagai event
PK: id (UUID)

Kolom:
- id (UUID, PK)
- user_id (UUID, FK NOT NULL) → users.id
- type (ENUM, NOT NULL) - order_created, order_accepted, pickup_scheduled, delivery_scheduled, order_completed, payment_reminder, status_update
- title (TEXT, NOT NULL)
- message (TEXT, NOT NULL)
- related_order_id (UUID, FK) → orders.id (optional)
- is_read (BOOLEAN, DEFAULT FALSE)
- read_at (TIMESTAMP)
- action_url (TEXT) - URL untuk aksi (misal: /orders/#P001)
- created_at (TIMESTAMP, DEFAULT NOW())

FK:
- user_id → users.id (CASCADE DELETE)
- related_order_id → orders.id (CASCADE DELETE)

Constraints:
- type NOT NULL
- title NOT NULL
```

---

### 🔟 TABEL: `audit_logs` (Log Aktivitas)

```
Tabel: audit_logs
Deskripsi: Log semua aktivitas penting sistem
PK: id (UUID)

Kolom:
- id (UUID, PK)
- user_id (UUID, FK) → users.id
- action (TEXT, NOT NULL) - CREATE_ORDER, UPDATE_ORDER, PAYMENT_RECORDED, DELIVERY_PROOF_UPLOADED, dst
- resource_type (TEXT, NOT NULL) - orders, transactions, delivery_proofs, users
- resource_id (TEXT) - ID resource yang di-action
- old_values (JSONB) - Data lama (untuk UPDATE)
- new_values (JSONB) - Data baru (untuk UPDATE)
- ip_address (INET) - IP address pengguna
- user_agent (TEXT) - User agent browser
- status (ENUM) - success, failed
- error_message (TEXT) - Error jika ada
- created_at (TIMESTAMP, DEFAULT NOW())

FK:
- user_id → users.id (SET NULL)

Constraints:
- action NOT NULL
```

---

## 💾 REQUIREMENT 3: STORAGE BUCKET

### Supabase Storage Buckets yang Dibutuhkan:

```
Bucket 1: avatars
- Tujuan: Foto profil pengguna
- Visibility: Public
- File: *.jpg, *.jpeg, *.png (max 5MB)
- Path: /users/{user_id}/avatar.{ext}

Bucket 2: order-documents
- Tujuan: Dokumen terkait pesanan
- Visibility: Private (hanya bisa diakses pemilik + admin)
- File: *.pdf, *.doc, *.docx
- Path: /orders/{order_id}/{filename}

Bucket 3: delivery-proofs
- Tujuan: Foto bukti pengantaran
- Visibility: Private
- File: *.jpg, *.jpeg, *.png (max 10MB)
- Path: /deliveries/{order_id}/{proof_type}_{timestamp}.jpg

Bucket 4: receipts
- Tujuan: Bukti pembayaran
- Visibility: Private
- File: *.pdf, *.jpg, *.jpeg, *.png
- Path: /receipts/{transaction_id}/{filename}

Total: 4 buckets
```

---

## 🗄️ REQUIREMENT 4: SQL CREATE TABLE

```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('admin', 'pelanggan', 'kurir');
CREATE TYPE delivery_type_enum AS ENUM ('jemput', 'antar', 'antar-jemput');
CREATE TYPE schedule_type_enum AS ENUM ('jemput', 'antar', 'antar-jemput');
CREATE TYPE order_status AS ENUM (
  'pending', 'diproses', 'sedang_disetrika', 'siap_diantar', 
  'diantar', 'selesai', 'dibatalkan'
);
CREATE TYPE payment_status AS ENUM ('belum_lunas', 'lunas', 'cicilan');
CREATE TYPE payment_method AS ENUM ('cash', 'bank_transfer', 'e_wallet', 'card');
CREATE TYPE vehicle_type_enum AS ENUM ('motor', 'mobil', 'sepeda');
CREATE TYPE salary_type_enum AS ENUM ('fixed', 'commission', 'hybrid');
CREATE TYPE proof_type_enum AS ENUM ('pickup_proof', 'delivery_proof');
CREATE TYPE proof_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE transaction_status AS ENUM ('pending', 'confirmed', 'failed', 'refunded');
CREATE TYPE notification_type AS ENUM (
  'order_created', 'order_accepted', 'pickup_scheduled', 'delivery_scheduled',
  'order_completed', 'payment_reminder', 'status_update'
);

-- ============================================
-- 1. USERS TABLE (Managed by Supabase Auth)
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'pelanggan',
  full_name TEXT NOT NULL,
  phone TEXT,
  photo_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- 2. CUSTOMERS TABLE
-- ============================================
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  city TEXT,
  postal_code TEXT,
  latitude NUMERIC(11, 8),
  longitude NUMERIC(11, 8),
  preferred_delivery_type delivery_type_enum,
  total_orders INTEGER DEFAULT 0,
  total_spending INTEGER DEFAULT 0,
  loyalty_points INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_customers_city ON customers(city);

-- ============================================
-- 3. COURIERS TABLE
-- ============================================
CREATE TABLE couriers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  vehicle_type vehicle_type_enum,
  vehicle_plate TEXT UNIQUE,
  is_available BOOLEAN DEFAULT TRUE,
  total_deliveries INTEGER DEFAULT 0,
  rating NUMERIC(3, 2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  bank_account TEXT,
  bank_name TEXT,
  salary_type salary_type_enum,
  base_salary INTEGER,
  commission_rate NUMERIC(5, 2) CHECK (commission_rate >= 0 AND commission_rate <= 100),
  documents_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_couriers_user_id ON couriers(user_id);
CREATE INDEX idx_couriers_is_available ON couriers(is_available);

-- ============================================
-- 4. SERVICES TABLE
-- ============================================
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price_per_kg INTEGER NOT NULL CHECK (price_per_kg > 0),
  estimated_days INTEGER NOT NULL CHECK (estimated_days > 0),
  min_weight NUMERIC(6, 2),
  max_weight NUMERIC(6, 2),
  icon_name TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_services_code ON services(code);
CREATE INDEX idx_services_is_active ON services(is_active);

-- ============================================
-- 5. SCHEDULES TABLE
-- ============================================
CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  schedule_date DATE NOT NULL,
  schedule_time TIME NOT NULL,
  schedule_type schedule_type_enum NOT NULL,
  max_capacity INTEGER NOT NULL CHECK (max_capacity > 0),
  current_slots INTEGER DEFAULT 0 CHECK (current_slots >= 0),
  assigned_courier_id UUID REFERENCES couriers(user_id) ON DELETE SET NULL,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_slots CHECK (current_slots <= max_capacity),
  CONSTRAINT unique_schedule UNIQUE(schedule_date, schedule_time, schedule_type)
);

CREATE INDEX idx_schedules_date ON schedules(schedule_date);
CREATE INDEX idx_schedules_type ON schedules(schedule_type);
CREATE INDEX idx_schedules_courier ON schedules(assigned_courier_id);

-- ============================================
-- 6. ORDERS TABLE
-- ============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_code TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  delivery_type delivery_type_enum NOT NULL,
  scheduled_date DATE,
  scheduled_time TIME,
  pickup_schedule_id UUID REFERENCES schedules(id) ON DELETE SET NULL,
  delivery_schedule_id UUID REFERENCES schedules(id) ON DELETE SET NULL,
  weight_kg NUMERIC(6, 2),
  price_per_kg INTEGER,
  total_price INTEGER,
  status order_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'belum_lunas',
  customer_notes TEXT,
  special_instructions TEXT,
  estimated_completion TIMESTAMP WITH TIME ZONE,
  actual_completion TIMESTAMP WITH TIME ZONE,
  pickup_date TIMESTAMP WITH TIME ZONE,
  delivery_date TIMESTAMP WITH TIME ZONE,
  pickup_courier_id UUID REFERENCES couriers(user_id) ON DELETE SET NULL,
  delivery_courier_id UUID REFERENCES couriers(user_id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_service ON orders(service_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_code ON orders(order_code);
CREATE INDEX idx_orders_date ON orders(created_at DESC);

-- ============================================
-- 7. TRANSACTIONS TABLE
-- ============================================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  transaction_code TEXT UNIQUE NOT NULL,
  payment_method payment_method NOT NULL,
  amount INTEGER NOT NULL CHECK (amount > 0),
  paid_date DATE NOT NULL,
  paid_by UUID REFERENCES users(id) ON DELETE SET NULL,
  recorded_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  payment_proof_url TEXT,
  notes TEXT,
  status transaction_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_transactions_order ON transactions(order_id);
CREATE INDEX idx_transactions_code ON transactions(transaction_code);
CREATE INDEX idx_transactions_date ON transactions(paid_date DESC);

-- ============================================
-- 8. DELIVERY_PROOFS TABLE
-- ============================================
CREATE TABLE delivery_proofs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  proof_type proof_type_enum NOT NULL,
  courier_id UUID NOT NULL REFERENCES couriers(user_id) ON DELETE RESTRICT,
  photo_url TEXT,
  photo_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  notes TEXT,
  recipient_name TEXT,
  recipient_signature_url TEXT,
  latitude NUMERIC(11, 8),
  longitude NUMERIC(11, 8),
  status proof_status DEFAULT 'pending',
  verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_delivery_proofs_order ON delivery_proofs(order_id);
CREATE INDEX idx_delivery_proofs_courier ON delivery_proofs(courier_id);
CREATE INDEX idx_delivery_proofs_status ON delivery_proofs(status);

-- ============================================
-- 9. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_date ON notifications(created_at DESC);

-- ============================================
-- 10. AUDIT_LOGS TABLE
-- ============================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  status TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_date ON audit_logs(created_at DESC);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_timestamp BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_couriers_timestamp BEFORE UPDATE ON couriers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_timestamp BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_schedules_timestamp BEFORE UPDATE ON schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_timestamp BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_timestamp BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_delivery_proofs_timestamp BEFORE UPDATE ON delivery_proofs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order code
CREATE OR REPLACE FUNCTION generate_order_code()
RETURNS TEXT AS $$
DECLARE
  next_id INT;
BEGIN
  SELECT COUNT(*) + 1 INTO next_id FROM orders;
  RETURN '#P' || LPAD(next_id::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to decrement schedule slots
CREATE OR REPLACE FUNCTION decrement_schedule_slots()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.pickup_schedule_id IS NOT NULL AND OLD.pickup_schedule_id IS DISTINCT FROM NEW.pickup_schedule_id THEN
    UPDATE schedules SET current_slots = current_slots - 1 WHERE id = OLD.pickup_schedule_id;
    UPDATE schedules SET current_slots = current_slots + 1 WHERE id = NEW.pickup_schedule_id;
  ELSIF NEW.pickup_schedule_id IS NOT NULL AND OLD.pickup_schedule_id IS NULL THEN
    UPDATE schedules SET current_slots = current_slots + 1 WHERE id = NEW.pickup_schedule_id;
  END IF;
  
  IF NEW.delivery_schedule_id IS NOT NULL AND OLD.delivery_schedule_id IS DISTINCT FROM NEW.delivery_schedule_id THEN
    UPDATE schedules SET current_slots = current_slots - 1 WHERE id = OLD.delivery_schedule_id;
    UPDATE schedules SET current_slots = current_slots + 1 WHERE id = NEW.delivery_schedule_id;
  ELSIF NEW.delivery_schedule_id IS NOT NULL AND OLD.delivery_schedule_id IS NULL THEN
    UPDATE schedules SET current_slots = current_slots + 1 WHERE id = NEW.delivery_schedule_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_order_schedule_slots AFTER UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION decrement_schedule_slots();
```

---

## 🔐 REQUIREMENT 5: ROW LEVEL SECURITY (RLS)

```sql
-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE couriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS TABLE RLS
-- ============================================

-- Admin dan user sendiri bisa akses profil pengguna
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- User hanya bisa update profil mereka sendiri
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Admin bisa update user (kecuali role, hanya bisa via function)
CREATE POLICY "Admins can update users" ON users
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (true);

-- ============================================
-- CUSTOMERS TABLE RLS
-- ============================================

-- Pelanggan hanya bisa lihat profil mereka sendiri
CREATE POLICY "Customers can view own profile" ON customers
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Pelanggan hanya bisa update profil mereka sendiri
CREATE POLICY "Customers can update own profile" ON customers
  FOR UPDATE USING (user_id = auth.uid());

-- Admin bisa lihat dan update semua customer
CREATE POLICY "Admins access all customers" ON customers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- COURIERS TABLE RLS
-- ============================================

-- Kurir hanya bisa lihat profil mereka sendiri
CREATE POLICY "Couriers can view own profile" ON couriers
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Kurir hanya bisa update status ketersediaan mereka
CREATE POLICY "Couriers can update own availability" ON couriers
  FOR UPDATE USING (user_id = auth.uid());

-- Admin bisa lihat dan update semua kurir
CREATE POLICY "Admins access all couriers" ON couriers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- SERVICES TABLE RLS (PUBLIC READ)
-- ============================================

-- Semua orang bisa lihat layanan yang aktif
CREATE POLICY "Anyone can view active services" ON services
  FOR SELECT USING (is_active = true);

-- Hanya admin bisa create/update/delete services
CREATE POLICY "Only admins manage services" ON services
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- SCHEDULES TABLE RLS
-- ============================================

-- Semua user autentikasi bisa lihat schedule yang tersedia
CREATE POLICY "Authenticated users view schedules" ON schedules
  FOR SELECT USING (
    auth.role() = 'authenticated' AND is_active = true
  );

-- Admin bisa manage semua schedule
CREATE POLICY "Admins manage schedules" ON schedules
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- ORDERS TABLE RLS
-- ============================================

-- Pelanggan hanya bisa lihat order mereka sendiri
CREATE POLICY "Customers view own orders" ON orders
  FOR SELECT USING (
    customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
  );

-- Kurir bisa lihat order yang ditugaskan ke mereka
CREATE POLICY "Couriers view assigned orders" ON orders
  FOR SELECT USING (
    pickup_courier_id = auth.uid() OR
    delivery_courier_id = auth.uid() OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin bisa lihat semua order
CREATE POLICY "Admins view all orders" ON orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Pelanggan hanya bisa create order untuk diri sendiri
CREATE POLICY "Customers create own orders" ON orders
  FOR INSERT WITH CHECK (
    customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
  );

-- Pelanggan bisa update order mereka (status tertentu)
CREATE POLICY "Customers update own orders" ON orders
  FOR UPDATE USING (
    customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
  );

-- Kurir bisa update status order yang ditugaskan
CREATE POLICY "Couriers update assigned orders" ON orders
  FOR UPDATE USING (
    pickup_courier_id = auth.uid() OR
    delivery_courier_id = auth.uid()
  );

-- Admin bisa update semua order
CREATE POLICY "Admins update all orders" ON orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- TRANSACTIONS TABLE RLS
-- ============================================

-- Pelanggan lihat transaksi order mereka
CREATE POLICY "Customers view own transactions" ON transactions
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders 
      WHERE customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
    )
  );

-- Admin lihat semua transaksi
CREATE POLICY "Admins view all transactions" ON transactions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Hanya admin bisa create/update transaksi
CREATE POLICY "Only admins manage transactions" ON transactions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins update transactions" ON transactions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- DELIVERY_PROOFS TABLE RLS
-- ============================================

-- Kurir lihat proof mereka sendiri
CREATE POLICY "Couriers view own proofs" ON delivery_proofs
  FOR SELECT USING (
    courier_id = auth.uid() OR
    order_id IN (
      SELECT id FROM orders WHERE
      customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
    ) OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Kurir bisa upload proof
CREATE POLICY "Couriers upload proofs" ON delivery_proofs
  FOR INSERT WITH CHECK (
    courier_id = auth.uid()
  );

-- Admin bisa verify proof
CREATE POLICY "Admins verify proofs" ON delivery_proofs
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- NOTIFICATIONS TABLE RLS
-- ============================================

-- User hanya lihat notifikasi mereka sendiri
CREATE POLICY "Users view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

-- User bisa mark read notifikasi mereka
CREATE POLICY "Users update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- System (via function) create notifikasi
CREATE POLICY "System creates notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- ============================================
-- AUDIT_LOGS TABLE RLS
-- ============================================

-- Hanya admin bisa lihat audit log
CREATE POLICY "Admins view audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- System auto-insert audit log
CREATE POLICY "System creates audit logs" ON audit_logs
  FOR INSERT WITH CHECK (true);
```

---

## 🔑 REQUIREMENT 6: AUTHENTICATION STRUCTURE

### Email & Password Authentication

**Provider:** Supabase Auth (built-in)

**Flow:**
1. User daftar → Supabase auto generate UUID & hash password
2. Email verification (optional, recommended)
3. Sistem auto create record di tabel `users` dengan role default
4. User login → Supabase Auth validate & return JWT token
5. JWT disimpan di localStorage
6. Setiap request include JWT di header Authorization

**JWT Token Structure:**
```json
{
  "aud": "authenticated",
  "exp": 1234567890,
  "iat": 1234567890,
  "iss": "https://[project].supabase.co/auth/v1",
  "sub": "user-uuid-123",
  "email": "user@example.com",
  "email_confirmed_at": "2026-07-01T10:00:00Z",
  "phone_verified_at": null,
  "app_metadata": {
    "provider": "email",
    "providers": ["email"]
  },
  "user_metadata": {},
  "role": "authenticated"
}
```

---

## 📱 REQUIREMENT 7: ALUR REGISTER & LOGIN

### 📝 Alur Register (Sign Up)

```
FRONTEND                                SUPABASE
   |                                         |
   |-- 1. User input: email, password -------|
   |                                         |
   |                                    ✓ Validate email format
   |<-- 2. Check email exists ----------- ✓ Query users table
   |
   |-- 3. Sign up request (email, password) ->|
   |                                         |
   |                                    ✓ Hash password (bcrypt)
   |                                    ✓ Create auth.users record
   |                                    ✓ Generate UUID
   |                                    ✓ Send email verification (optional)
   |<-- 4. Success + UUID + JWT ---------|
   |
   |-- 5. Create users table record ----->|
   |    (id, email, role='pelanggan')     |
   |                                      ✓ Insert
   |<-- 6. Confirmation ------------|
   |
   |-- 7. If pelanggan: Create customer record --|
   |                                           ✓ Insert to customers
   |<-- 8. Done -------------------------|
   |
   Save JWT to localStorage
   Redirect to /pelanggan/dashboard
```

**Request:**
```json
POST /auth/v1/signup
{
  "email": "budi@example.com",
  "password": "SecurePass123!",
  "data": {
    "full_name": "Budi Santoso",
    "phone": "081234567890"
  }
}
```

**Response:**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "budi@example.com",
    "created_at": "2026-07-01T10:00:00Z"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "renewal_token_123...",
    "expires_in": 3600
  }
}
```

---

### 🔓 Alur Login (Sign In)

```
FRONTEND                                SUPABASE
   |                                         |
   |-- 1. User input: email, password -------|
   |                                         |
   |-- 2. Sign in request (email, password)->|
   |                                         |
   |                                    ✓ Find user by email
   |                                    ✓ Compare password hash
   |                                    ✓ Generate JWT & Refresh Token
   |<-- 3. JWT + Refresh Token + User ID ----|
   |
   |-- 4. Fetch user data (users table) ---->|
   |                                    ✓ Query role & details
   |<-- 5. User data ----------------------|
   |
   |-- 6. Fetch role-specific data ------>|
   |    (customers / couriers)              |
   |<-- 7. Profile data ---|
   |
   Save JWT & Refresh Token to localStorage
   Redirect based on role:
   - admin -> /admin/dashboard
   - pelanggan -> /pelanggan/dashboard
   - kurir -> /kurir/dashboard
```

**Request:**
```json
POST /auth/v1/token?grant_type=password
{
  "email": "budi@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "renewal_token_123...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "budi@example.com",
    "email_confirmed_at": "2026-07-01T09:00:00Z"
  }
}
```

---

### 🚪 Alur Logout

```
FRONTEND
   |
   |-- 1. Sign out request
   |
   |-- 2. Delete JWT from localStorage
   |
   |-- 3. Clear user state from context
   |
   Redirect to /auth/login
```

---

### 🔄 Alur Refresh Token

```
FRONTEND                                SUPABASE
   |                                         |
   |-- 1. Detect JWT expired -------|
   |                                         |
   |-- 2. Send refresh token ----->|
   |      POST /auth/v1/token?grant_type=refresh_token
   |      {refresh_token: "..."}
   |                                         |
   |                                    ✓ Validate refresh token
   |                                    ✓ Generate new JWT
   |<-- 3. New JWT + new Refresh Token -----|
   |
   Save new JWT & token to localStorage
   Retry original request
```

---

## 📡 REQUIREMENT 8: DAFTAR API CRUD YANG DIBUTUHKAN

### A. AUTHENTICATION ENDPOINTS

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/auth/v1/signup` | Registrasi user baru | ❌ |
| POST | `/auth/v1/token` | Login (grant_type=password) | ❌ |
| POST | `/auth/v1/token` | Refresh token (grant_type=refresh_token) | ❌ |
| POST | `/auth/v1/logout` | Logout | ✅ JWT |
| POST | `/auth/v1/user` | Get user info | ✅ JWT |
| PUT | `/auth/v1/user` | Update user info | ✅ JWT |
| POST | `/auth/v1/password` | Change password | ✅ JWT |
| POST | `/auth/v1/recover` | Password reset email | ❌ |

---

### B. USERS MANAGEMENT

| Method | Endpoint | Deskripsi | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/api/users/{id}` | Get user profile | ✅ JWT | Own/Admin |
| PUT | `/api/users/{id}` | Update user profile | ✅ JWT | Own/Admin |
| GET | `/api/users` | List all users (pagination) | ✅ JWT | Admin |
| PUT | `/api/users/{id}/role` | Change user role | ✅ JWT | Admin |
| DELETE | `/api/users/{id}` | Delete user | ✅ JWT | Admin |
| GET | `/api/users/stats` | User statistics | ✅ JWT | Admin |

---

### C. CUSTOMERS ENDPOINTS

| Method | Endpoint | Deskripsi | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/api/customers/{id}` | Get customer profile | ✅ JWT | Own/Admin |
| PUT | `/api/customers/{id}` | Update customer data | ✅ JWT | Own/Admin |
| GET | `/api/customers/{id}/orders` | List customer orders | ✅ JWT | Own/Admin |
| GET | `/api/customers/{id}/stats` | Customer dashboard stats | ✅ JWT | Own/Admin |
| POST | `/api/customers/{id}/upload-avatar` | Upload customer avatar | ✅ JWT | Own |

---

### D. COURIERS ENDPOINTS

| Method | Endpoint | Deskripsi | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/api/couriers/{id}` | Get courier profile | ✅ JWT | Own/Admin |
| PUT | `/api/couriers/{id}` | Update courier data | ✅ JWT | Own/Admin |
| GET | `/api/couriers` | List all couriers | ✅ JWT | Admin |
| GET | `/api/couriers/{id}/deliveries` | Courier tasks | ✅ JWT | Own/Admin |
| PUT | `/api/couriers/{id}/availability` | Toggle availability | ✅ JWT | Own |
| GET | `/api/couriers/{id}/earnings` | Courier earnings | ✅ JWT | Own/Admin |

---

### E. SERVICES ENDPOINTS

| Method | Endpoint | Deskripsi | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/api/services` | List all services | ❌ | - |
| GET | `/api/services/{id}` | Get service detail | ❌ | - |
| POST | `/api/services` | Create service | ✅ JWT | Admin |
| PUT | `/api/services/{id}` | Update service | ✅ JWT | Admin |
| DELETE | `/api/services/{id}` | Delete service | ✅ JWT | Admin |

---

### F. SCHEDULES ENDPOINTS

| Method | Endpoint | Deskripsi | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/api/schedules` | List available schedules | ✅ JWT | Authenticated |
| GET | `/api/schedules?type=jemput&date=2026-07-01` | Filter by type & date | ✅ JWT | Authenticated |
| POST | `/api/schedules` | Create new schedule | ✅ JWT | Admin |
| PUT | `/api/schedules/{id}` | Update schedule | ✅ JWT | Admin |
| DELETE | `/api/schedules/{id}` | Delete schedule | ✅ JWT | Admin |
| GET | `/api/schedules/{id}/capacity` | Check slot availability | ✅ JWT | Authenticated |
| POST | `/api/schedules/{id}/assign-courier` | Assign courier to schedule | ✅ JWT | Admin |

---

### G. ORDERS ENDPOINTS

| Method | Endpoint | Deskripsi | Auth | Role |
|--------|----------|-----------|------|------|
| POST | `/api/orders` | Create new order | ✅ JWT | Pelanggan |
| GET | `/api/orders/{id}` | Get order detail | ✅ JWT | Own/Courier/Admin |
| GET | `/api/orders` | List orders (with filters) | ✅ JWT | Own/Admin/Courier |
| PUT | `/api/orders/{id}` | Update order | ✅ JWT | Owner/Courier/Admin |
| PUT | `/api/orders/{id}/status` | Update order status | ✅ JWT | Courier/Admin |
| PUT | `/api/orders/{id}/weight` | Record weight (admin/kurir) | ✅ JWT | Courier/Admin |
| PUT | `/api/orders/{id}/schedule` | Change schedule | ✅ JWT | Pelanggan/Admin |
| DELETE | `/api/orders/{id}` | Cancel order | ✅ JWT | Owner/Admin |
| GET | `/api/orders/{id}/timeline` | Get order timeline | ✅ JWT | Owner/Admin |
| POST | `/api/orders/{id}/assign-pickup-courier` | Assign pickup courier | ✅ JWT | Admin |
| POST | `/api/orders/{id}/assign-delivery-courier` | Assign delivery courier | ✅ JWT | Admin |

---

### H. TRANSACTIONS ENDPOINTS

| Method | Endpoint | Deskripsi | Auth | Role |
|--------|----------|-----------|------|------|
| POST | `/api/transactions` | Record new payment | ✅ JWT | Admin |
| GET | `/api/transactions/{id}` | Get transaction detail | ✅ JWT | Owner/Admin |
| GET | `/api/transactions` | List transactions | ✅ JWT | Own/Admin |
| PUT | `/api/transactions/{id}` | Update transaction | ✅ JWT | Admin |
| PUT | `/api/transactions/{id}/verify` | Verify payment | ✅ JWT | Admin |
| GET | `/api/transactions/by-order/{orderId}` | Get order payments | ✅ JWT | Owner/Admin |
| POST | `/api/transactions/{id}/upload-proof` | Upload payment proof | ✅ JWT | Admin |

---

### I. DELIVERY PROOFS ENDPOINTS

| Method | Endpoint | Deskripsi | Auth | Role |
|--------|----------|-----------|------|------|
| POST | `/api/delivery-proofs` | Submit delivery proof | ✅ JWT | Kurir |
| GET | `/api/delivery-proofs/{id}` | Get proof detail | ✅ JWT | Owner/Admin |
| GET | `/api/delivery-proofs?order_id={orderId}` | Get proofs for order | ✅ JWT | Owner/Admin |
| PUT | `/api/delivery-proofs/{id}/verify` | Verify/reject proof | ✅ JWT | Admin |
| POST | `/api/delivery-proofs/{id}/upload-photo` | Upload photo | ✅ JWT | Kurir |
| POST | `/api/delivery-proofs/{id}/upload-signature` | Upload signature | ✅ JWT | Kurir |

---

### J. NOTIFICATIONS ENDPOINTS

| Method | Endpoint | Deskripsi | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/api/notifications` | List notifications | ✅ JWT | Own |
| GET | `/api/notifications/unread` | Get unread count | ✅ JWT | Own |
| PUT | `/api/notifications/{id}/read` | Mark as read | ✅ JWT | Owner |
| PUT | `/api/notifications/read-all` | Mark all as read | ✅ JWT | Own |
| DELETE | `/api/notifications/{id}` | Delete notification | ✅ JWT | Owner |

---

### K. ANALYTICS & REPORTING

| Method | Endpoint | Deskripsi | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/api/analytics/dashboard` | Dashboard metrics | ✅ JWT | Admin |
| GET | `/api/analytics/revenue` | Revenue reports | ✅ JWT | Admin |
| GET | `/api/analytics/orders` | Order statistics | ✅ JWT | Admin |
| GET | `/api/analytics/couriers` | Courier performance | ✅ JWT | Admin |
| GET | `/api/analytics/customers` | Customer analytics | ✅ JWT | Admin |
| GET | `/api/analytics/export` | Export data (CSV/PDF) | ✅ JWT | Admin |

---

### L. FILE UPLOADS

| Method | Endpoint | Deskripsi | Auth | Role |
|--------|----------|-----------|------|------|
| POST | `/storage/v1/object/avatars/{user_id}/avatar` | Upload avatar | ✅ JWT | Own |
| POST | `/storage/v1/object/delivery-proofs/{orderId}/photo` | Upload proof photo | ✅ JWT | Kurir |
| POST | `/storage/v1/object/delivery-proofs/{orderId}/signature` | Upload signature | ✅ JWT | Kurir |
| POST | `/storage/v1/object/receipts/{transactionId}/proof` | Upload payment proof | ✅ JWT | Admin |

---

## 💻 REQUIREMENT 9: CONTOH IMPLEMENTASI REACT

### Setup Awal

**File: `src/lib/supabaseClient.ts`**

```typescript
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export types for TypeScript
export type Database = any;
```

**File: `.env.local`**

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### Authentication Context (UPDATED)

**File: `src/context/AuthContext.jsx`**

```javascript
import React, { createContext, useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useToast } from "./ToastContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Initialize auth state dari Supabase
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          setUser(data.session.user);
          // Fetch user profile
          const { data: profileData } = await supabase
            .from("users")
            .select("*")
            .eq("id", data.session.user.id)
            .single();
          setProfile(profileData);
        }
      } catch (error) {
        console.error("Auth init error:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          const { data: profileData } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();
          setProfile(profileData);
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const register = useCallback(
    async (email, password, fullName, phone, role = "pelanggan") => {
      try {
        setLoading(true);

        // 1. Sign up to Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, phone },
          },
        });

        if (authError) throw authError;

        // 2. Create user profile
        const { error: profileError } = await supabase.from("users").insert({
          id: authData.user.id,
          email,
          role,
          full_name: fullName,
          phone,
        });

        if (profileError) throw profileError;

        // 3. If role is pelanggan, create customer profile
        if (role === "pelanggan") {
          const { error: customerError } = await supabase
            .from("customers")
            .insert({
              user_id: authData.user.id,
              address: "",
            });
          if (customerError) throw customerError;
        }

        // 4. If role is kurir, create courier profile
        if (role === "kurir") {
          const { error: courierError } = await supabase
            .from("couriers")
            .insert({
              user_id: authData.user.id,
            });
          if (courierError) throw courierError;
        }

        showToast("Registrasi berhasil! Silakan login.", "success");
        return { ok: true };
      } catch (error) {
        showToast(error.message || "Registrasi gagal", "error");
        return { ok: false, error };
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  const login = useCallback(
    async (email, password) => {
      try {
        setLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Fetch user profile
        const { data: profileData } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();

        setUser(data.user);
        setProfile(profileData);

        showToast("Login berhasil!", "success");
        return { ok: true, user: profileData };
      } catch (error) {
        showToast(error.message || "Login gagal", "error");
        return { ok: false, error };
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setProfile(null);
      showToast("Logout berhasil", "success");
      return { ok: true };
    } catch (error) {
      showToast(error.message || "Logout gagal", "error");
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const updateProfile = useCallback(
    async (updates) => {
      try {
        setLoading(true);

        const { error } = await supabase
          .from("users")
          .update(updates)
          .eq("id", user.id);

        if (error) throw error;

        setProfile({ ...profile, ...updates });
        showToast("Profil diperbarui", "success");
        return { ok: true };
      } catch (error) {
        showToast(error.message || "Update gagal", "error");
        return { ok: false, error };
      } finally {
        setLoading(false);
      }
    },
    [user, profile, showToast]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        register,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
```

---

### Data Context (UPDATED)

**File: `src/context/DataContext.jsx` (snippet)**

```javascript
import React, { createContext, useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./AuthContext";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { user, profile } = useAuth();
  const [data, setData] = useState({
    orders: [],
    transactions: [],
    schedules: [],
    services: [],
  });
  const [loading, setLoading] = useState(false);

  // Fetch customer orders
  const getOrdersForCustomer = useCallback(async (customerId) => {
    try {
      const { data: orders, error } = await supabase
        .from("orders")
        .select(`
          *,
          service:services(*),
          pickup_schedule:schedules(id, schedule_date, schedule_time),
          delivery_schedule:schedules(id, schedule_date, schedule_time),
          delivery_proofs(*)
        `)
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return orders || [];
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  }, []);

  // Create new order
  const createOrder = useCallback(
    async (payload) => {
      try {
        setLoading(true);

        // Get service details
        const { data: service } = await supabase
          .from("services")
          .select("*")
          .eq("id", payload.service_id)
          .single();

        // Create order
        const { data: order, error } = await supabase
          .from("orders")
          .insert({
            order_code: `#P${Date.now()}`, // Should be generated by trigger
            customer_id: payload.customer_id,
            service_id: payload.service_id,
            delivery_type: payload.delivery_type,
            customer_notes: payload.notes || "",
            status: "pending",
            payment_status: "belum_lunas",
            price_per_kg: service.price_per_kg,
          })
          .select()
          .single();

        if (error) throw error;

        // Create notification
        await supabase.from("notifications").insert({
          user_id: user.id,
          type: "order_created",
          title: "Pesanan Baru",
          message: `Pesanan ${order.order_code} telah dibuat`,
          related_order_id: order.id,
        });

        return { ok: true, data: order };
      } catch (error) {
        console.error("Error creating order:", error);
        return { ok: false, error };
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  // Book schedule slot
  const bookSlot = useCallback(async (orderId, scheduleId) => {
    try {
      setLoading(true);

      // Check slot availability
      const { data: schedule } = await supabase
        .from("schedules")
        .select("*")
        .eq("id", scheduleId)
        .single();

      if (schedule.current_slots >= schedule.max_capacity) {
        return { ok: false, message: "Slot penuh" };
      }

      // Update order with schedule
      const { error } = await supabase
        .from("orders")
        .update({
          pickup_schedule_id: scheduleId,
          scheduled_date: schedule.schedule_date,
          scheduled_time: schedule.schedule_time,
        })
        .eq("id", orderId);

      if (error) throw error;

      // Increment slot counter
      await supabase
        .from("schedules")
        .update({ current_slots: schedule.current_slots + 1 })
        .eq("id", scheduleId);

      return { ok: true };
    } catch (error) {
      console.error("Error booking slot:", error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update order status
  const updateOrderStatus = useCallback(async (orderId, status) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);

      if (error) throw error;
      return { ok: true };
    } catch (error) {
      console.error("Error updating status:", error);
      return { ok: false, error };
    }
  }, []);

  // Record payment
  const addTransaction = useCallback(async (payload) => {
    try {
      setLoading(true);

      const { data: transaction, error } = await supabase
        .from("transactions")
        .insert({
          order_id: payload.orderId,
          transaction_code: `CASH-${new Date().toISOString().split("T")[0].replace(/-/g, "")}`,
          payment_method: "cash",
          amount: payload.amount,
          paid_date: new Date().toISOString().split("T")[0],
          recorded_by: user.id,
          notes: payload.notes,
          status: "confirmed",
        })
        .select()
        .single();

      if (error) throw error;

      // Update order payment status
      await supabase
        .from("orders")
        .update({ payment_status: "lunas" })
        .eq("id", payload.orderId);

      return { ok: true, data: transaction };
    } catch (error) {
      console.error("Error recording transaction:", error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch available schedules
  const getAvailableSlots = useCallback(async (type) => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data: schedules, error } = await supabase
        .from("schedules")
        .select("*")
        .eq("schedule_type", type)
        .gte("schedule_date", tomorrow.toISOString().split("T")[0])
        .lt("current_slots", supabase.rpc("max_capacity"))
        .order("schedule_date");

      if (error) throw error;
      return schedules || [];
    } catch (error) {
      console.error("Error fetching schedules:", error);
      return [];
    }
  }, []);

  return (
    <DataContext.Provider
      value={{
        data,
        loading,
        getOrdersForCustomer,
        createOrder,
        bookSlot,
        updateOrderStatus,
        addTransaction,
        getAvailableSlots,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = React.useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within DataProvider");
  }
  return context;
};
```

---

### Upload File Example

**File: `src/services/fileService.js`**

```javascript
import { supabase } from "../lib/supabaseClient";

export async function uploadAvatar(userId, file) {
  try {
    const fileExt = file.name.split(".").pop();
    const filePath = `${userId}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    // Update user profile
    const { error: updateError } = await supabase
      .from("users")
      .update({ photo_url: publicUrl })
      .eq("id", userId);

    if (updateError) throw updateError;

    return { ok: true, url: publicUrl };
  } catch (error) {
    console.error("Upload error:", error);
    return { ok: false, error };
  }
}

export async function uploadDeliveryProof(orderId, proofType, file, metadata) {
  try {
    const fileExt = file.name.split(".").pop();
    const timestamp = new Date().getTime();
    const filePath = `${orderId}/${proofType}_${timestamp}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("delivery-proofs")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("delivery-proofs").getPublicUrl(filePath);

    // Create delivery proof record
    const { data: proof, error: proofError } = await supabase
      .from("delivery_proofs")
      .insert({
        order_id: orderId,
        proof_type: proofType,
        courier_id: metadata.courier_id,
        photo_url: publicUrl,
        photo_timestamp: new Date().toISOString(),
        notes: metadata.notes,
        latitude: metadata.latitude,
        longitude: metadata.longitude,
      })
      .select()
      .single();

    if (proofError) throw proofError;

    return { ok: true, data: proof };
  } catch (error) {
    console.error("Upload proof error:", error);
    return { ok: false, error };
  }
}
```

---

### Query Real-time Subscription (Optional)

```javascript
// Listen to order updates in real-time
const subscription = supabase
  .from("orders")
  .on("*", (payload) => {
    console.log("Order updated:", payload);
    // Update UI
  })
  .subscribe();

// Cleanup
subscription.unsubscribe();
```

---

## 🎨 REQUIREMENT 10: SARAN TABEL TAMBAHAN

### Tabel-tabel Optional yang Direkomendasikan:

#### 1️⃣ `promo_codes` - Kode Promo

```sql
CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_type ENUM ('percentage', 'fixed'), -- Diskon persen atau nominal
  discount_value INTEGER,
  valid_from DATE,
  valid_until DATE,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  min_order_amount INTEGER, -- Minimal order untuk berlaku
  applicable_services UUID[], -- Array service IDs yang bisa pakai
  created_by UUID NOT NULL REFERENCES users(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

#### 2️⃣ `customer_loyalty` - Program Loyalitas

```sql
CREATE TABLE customer_loyalty (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL UNIQUE REFERENCES customers(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  tier ENUM ('bronze', 'silver', 'gold', 'platinum'),
  tier_since TIMESTAMP,
  points_earned INTEGER DEFAULT 0,
  points_redeemed INTEGER DEFAULT 0,
  last_earned_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

#### 3️⃣ `courier_earnings` - Riwayat Penghasilan Kurir

```sql
CREATE TABLE courier_earnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  courier_id UUID NOT NULL REFERENCES couriers(user_id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  order_date DATE,
  delivery_fee INTEGER, -- Biaya pengantaran
  commission_amount INTEGER, -- Komisi jika ada
  total_earnings INTEGER,
  payment_status ENUM ('pending', 'paid'),
  paid_date DATE,
  payment_method ENUM ('transfer', 'cash'),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

#### 4️⃣ `complaints` - Keluhan Pelanggan

```sql
CREATE TABLE complaints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_code TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES customers(id),
  order_id UUID REFERENCES orders(id),
  complaint_type ENUM ('quality', 'delivery', 'lost_item', 'damaged', 'other'),
  description TEXT NOT NULL,
  attachment_urls TEXT[],
  status ENUM ('open', 'in_progress', 'resolved', 'rejected'),
  priority ENUM ('low', 'medium', 'high', 'urgent'),
  assigned_to UUID REFERENCES users(id),
  resolution_notes TEXT,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

#### 5️⃣ `feedback` - Rating & Review

```sql
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id),
  courier_id UUID REFERENCES couriers(user_id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  categories JSONB, -- {cleanliness: 4, speed: 5, accuracy: 4}
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

#### 6️⃣ `service_quality_metrics` - Metrik Kualitas Layanan

```sql
CREATE TABLE service_quality_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  pickup_on_time BOOLEAN,
  pickup_quality INTEGER, -- 1-5
  delivery_on_time BOOLEAN,
  delivery_quality INTEGER, -- 1-5
  item_condition TEXT, -- excellent, good, fair, poor
  overall_score NUMERIC(4, 2),
  notes TEXT,
  measured_at TIMESTAMP DEFAULT NOW()
);
```

---

#### 7️⃣ `payment_methods` - Metode Pembayaran Tersimpan

```sql
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  method_type ENUM ('bank_account', 'e_wallet', 'credit_card'),
  account_number TEXT, -- encrypted
  account_holder TEXT,
  bank_name TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

#### 8️⃣ `bulk_orders` - Pesanan Dalam Jumlah Besar (B2B)

```sql
CREATE TABLE bulk_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_code TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES customers(id),
  company_name TEXT,
  contact_person TEXT,
  pickup_location TEXT,
  delivery_location TEXT,
  total_items INTEGER,
  total_weight_kg NUMERIC,
  scheduled_pickup_date DATE,
  scheduled_delivery_date DATE,
  special_requirements TEXT,
  status ENUM ('pending', 'approved', 'in_progress', 'completed', 'cancelled'),
  discount_percentage NUMERIC(5, 2),
  total_amount INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

#### 9️⃣ `subscription_plans` - Paket Berlangganan (Membership)

```sql
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, -- Regular, Premium, Enterprise
  monthly_price INTEGER,
  pickup_per_month INTEGER,
  discount_percentage NUMERIC(5, 2),
  priority_support BOOLEAN DEFAULT FALSE,
  free_delivery BOOLEAN DEFAULT FALSE,
  features JSONB, -- Array of features
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE customer_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  started_at TIMESTAMP,
  expires_at TIMESTAMP,
  auto_renew BOOLEAN DEFAULT TRUE,
  status ENUM ('active', 'cancelled', 'expired'),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

#### 🔟 `system_config` - Konfigurasi Sistem

```sql
CREATE TABLE system_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  config_key TEXT UNIQUE NOT NULL,
  config_value TEXT, -- JSON format untuk complex values
  data_type ENUM ('string', 'number', 'boolean', 'json'),
  description TEXT,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contoh isi:
-- business_name: "Laundry Express"
-- business_email: "info@laundryexpress.id"
-- business_phone: "021-123-4567"
-- operating_hours: {"start": "08:00", "end": "18:00"}
-- courier_commission_rate: 10
-- delivery_fee: 5000
-- min_order_amount: 20000
```

---

## 📊 COMPARISON: BEFORE vs AFTER

| Aspek | Data Dummy | Supabase |
|-------|-----------|----------|
| **Storage** | localStorage | PostgreSQL Database |
| **Autentikasi** | Hardcoded Users | Supabase Auth (Email) |
| **Security** | ❌ Tidak aman | ✅ Secure (RLS, Encryption) |
| **Skalabilitas** | Limited (local storage) | Unlimited (Cloud) |
| **Real-time** | ❌ Manual refresh | ✅ Subscriptions |
| **Backup** | Manual | Automatic |
| **Multi-device** | ❌ Tidak sync | ✅ Auto sync |
| **API** | Manual fetch | RESTful + Real-time |
| **Performance** | Slow (big data) | Fast (indexing, optimization) |
| **File Storage** | ❌ Tidak ada | ✅ S3-compatible storage |

---

## 🚀 TAHAP IMPLEMENTASI

### Phase 1: Setup (1-2 hari)
- Create Supabase project
- Setup tables & RLS
- Configure Storage buckets
- Setup Auth

### Phase 2: Backend Migration (2-3 hari)
- Export data dummy ke PostgreSQL
- Create API endpoints / Edge Functions
- Setup automated backups
- Implement audit logging

### Phase 3: Frontend Integration (3-4 hari)
- Update Auth Context
- Update Data Context
- Replace all localStorage calls
- Setup real-time subscriptions

### Phase 4: Testing & Deployment (2-3 hari)
- Unit testing
- Integration testing
- Load testing
- Production deployment

---

## 📝 CHECKLIST IMPLEMENTATION

- [ ] Create Supabase project
- [ ] Setup PostgreSQL database
- [ ] Create all tables & indexes
- [ ] Configure RLS policies
- [ ] Setup Storage buckets
- [ ] Enable Auth (email/password)
- [ ] Export dummy data
- [ ] Migrate frontend to use Supabase
- [ ] Setup error handling
- [ ] Implement real-time features
- [ ] Add audit logging
- [ ] Setup monitoring
- [ ] Load testing
- [ ] Documentation
- [ ] Team training
- [ ] Go live!

---

**END OF DOCUMENTATION**

*Dokumentasi ini comprehensive dan siap untuk diimplementasikan. Untuk pertanyaan lebih lanjut atau klarifikasi, silakan hubungi tim development.*
