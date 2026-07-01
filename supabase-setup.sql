-- ============================================
-- SUPABASE LAUNDRY EXPRESS - DATABASE SETUP
-- ============================================
-- Copy & paste semua kode ini ke Supabase SQL Editor

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CREATE ENUM TYPES
-- ============================================

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
-- 1. USERS TABLE
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY,
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
-- CREATE FUNCTIONS & TRIGGERS
-- ============================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_timestamp BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_couriers_timestamp BEFORE UPDATE ON couriers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_timestamp BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_schedules_timestamp BEFORE UPDATE ON schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_timestamp BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_timestamp BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_delivery_proofs_timestamp BEFORE UPDATE ON delivery_proofs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INSERT INITIAL DATA (OPTIONAL)
-- ============================================

-- Insert services
INSERT INTO services (code, name, description, price_per_kg, estimated_days, icon_name) VALUES
('cuci-kering', 'Cuci Kering', 'Mencuci dan mengeringkan pakaian', 3000, 2, 'shirt'),
('cuci-setrika', 'Cuci Setrika', 'Mencuci, mengeringkan dan menyetrika pakaian', 7000, 1, 'sparkles'),
('setrika-saja', 'Setrika Saja', 'Hanya menyetrika pakaian', 4000, 1, 'iron'),
('dry-clean', 'Dry Clean', 'Membersihkan pakaian khusus dengan bahan kimia', 15000, 3, 'coat');

-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
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

-- Users RLS Policies
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update users" ON users FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
) WITH CHECK (true);

-- Customers RLS Policies
CREATE POLICY "Customers can view own profile" ON customers FOR SELECT USING (
  user_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Customers can update own profile" ON customers FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins access all customers" ON customers FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Couriers RLS Policies
CREATE POLICY "Couriers can view own profile" ON couriers FOR SELECT USING (
  user_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Couriers can update own availability" ON couriers FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins access all couriers" ON couriers FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Services RLS Policies (Public Read)
CREATE POLICY "Anyone can view active services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Only admins manage services" ON services FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Schedules RLS Policies
CREATE POLICY "Authenticated users view schedules" ON schedules FOR SELECT USING (
  auth.role() = 'authenticated' AND is_active = true
);
CREATE POLICY "Admins manage schedules" ON schedules FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Orders RLS Policies
CREATE POLICY "Customers view own orders" ON orders FOR SELECT USING (
  customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
);
CREATE POLICY "Couriers view assigned orders" ON orders FOR SELECT USING (
  pickup_courier_id = auth.uid() OR delivery_courier_id = auth.uid() OR
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins view all orders" ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Customers create own orders" ON orders FOR INSERT WITH CHECK (
  customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
);
CREATE POLICY "Customers update own orders" ON orders FOR UPDATE USING (
  customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
);
CREATE POLICY "Couriers update assigned orders" ON orders FOR UPDATE USING (
  pickup_courier_id = auth.uid() OR delivery_courier_id = auth.uid()
);
CREATE POLICY "Admins update all orders" ON orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Transactions RLS Policies
CREATE POLICY "Customers view own transactions" ON transactions FOR SELECT USING (
  order_id IN (SELECT id FROM orders WHERE customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()))
);
CREATE POLICY "Admins view all transactions" ON transactions FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins manage transactions" ON transactions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins update transactions" ON transactions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Delivery Proofs RLS Policies
CREATE POLICY "Couriers view own proofs" ON delivery_proofs FOR SELECT USING (
  courier_id = auth.uid() OR
  order_id IN (SELECT id FROM orders WHERE customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())) OR
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Couriers upload proofs" ON delivery_proofs FOR INSERT WITH CHECK (courier_id = auth.uid());
CREATE POLICY "Admins verify proofs" ON delivery_proofs FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Notifications RLS Policies
CREATE POLICY "Users view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "System creates notifications" ON notifications FOR INSERT WITH CHECK (true);

-- Audit Logs RLS Policies
CREATE POLICY "Admins view audit logs" ON audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "System creates audit logs" ON audit_logs FOR INSERT WITH CHECK (true);

-- ============================================
-- SUCCESS!
-- ============================================
-- Database setup selesai. Lanjutkan dengan:
-- 1. Setup Storage buckets di Supabase Console
-- 2. Setup Authentication Email/Password Provider
-- 3. Implement Frontend Integration
