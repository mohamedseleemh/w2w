/*
  # إنشاء قاعدة البيانات الأولية لـ KYCtrust

  1. الجداول الجديدة
    - `services` - جدول الخدمات
      - `id` (uuid, primary key)
      - `name` (text) - اسم الخدمة
      - `price` (text) - سعر الخدمة
      - `order_index` (integer) - ترتيب الخدمة
      - `active` (boolean) - حالة الخدمة
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `payment_methods` - جدول طرق الدفع
      - `id` (uuid, primary key)
      - `name` (text) - اسم طريقة الدفع
      - `details` (text) - تفاصيل الدفع
      - `active` (boolean) - حالة طريقة الدفع
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `orders` - جدول الطلبات
      - `id` (uuid, primary key)
      - `customer_name` (text) - اسم العميل
      - `service_name` (text) - اسم الخدمة
      - `notes` (text) - ملاحظات
      - `status` (text) - حالة الطلب
      - `archived` (boolean) - مؤرشف أم لا
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `site_settings` - جدول إعدادات الموقع
      - `id` (uuid, primary key)
      - `title` (text) - عنوان الموقع
      - `description` (text) - وصف الموقع
      - `order_notice` (text) - تنبيه الطلبات
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `admin_users` - جدول المديرين
      - `id` (uuid, primary key)
      - `email` (text) - البريد الإلكتروني
      - `password_hash` (text) - كلمة المرور المشفرة
      - `role` (text) - الدور
      - `active` (boolean) - نشط أم لا
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. الأمان
    - تفعيل RLS على جميع الجداول
    - إضافة سياسات الأمان المناسبة
*/

-- إنشاء جدول الخدمات
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price text NOT NULL,
  order_index integer NOT NULL DEFAULT 1,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء جدول طرق الدفع
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  details text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء جدول الطلبات
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  service_name text NOT NULL,
  notes text DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  archived boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء جدول إعدادات الموقع
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  order_notice text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء جدول المديرين
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- تفعيل RLS على جميع الجداول
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان للخدمات (قراءة عامة، تعديل للمديرين فقط)
CREATE POLICY "Services are viewable by everyone"
  ON services
  FOR SELECT
  USING (true);

CREATE POLICY "Services are editable by admins only"
  ON services
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND active = true
  ));

-- سياسات الأمان لطرق الدفع
CREATE POLICY "Payment methods are viewable by everyone"
  ON payment_methods
  FOR SELECT
  USING (true);

CREATE POLICY "Payment methods are editable by admins only"
  ON payment_methods
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND active = true
  ));

-- سياسات الأمان للطلبات
CREATE POLICY "Orders are viewable by admins only"
  ON orders
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND active = true
  ));

CREATE POLICY "Orders can be created by anyone"
  ON orders
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Orders are editable by admins only"
  ON orders
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND active = true
  ));

CREATE POLICY "Orders are deletable by admins only"
  ON orders
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND active = true
  ));

-- سياسات الأمان لإعدادات الموقع
CREATE POLICY "Site settings are viewable by everyone"
  ON site_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Site settings are editable by admins only"
  ON site_settings
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND active = true
  ));

-- سياسات الأمان للمديرين
CREATE POLICY "Admin users are viewable by admins only"
  ON admin_users
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND active = true
  ));

CREATE POLICY "Admin users are editable by admins only"
  ON admin_users
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND active = true
  ));

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_services_order ON services(order_index);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(active);
CREATE INDEX IF NOT EXISTS idx_payment_methods_active ON payment_methods(active);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_archived ON orders(archived);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- إدراج البيانات الافتراضية للخدمات
INSERT INTO services (name, price, order_index, active) VALUES
('Payoneer', '30$', 1, true),
('Wise', '30$', 2, true),
('Skrill', '20$', 3, true),
('Neteller', '20$', 4, true),
('Kast', '20$', 5, true),
('Redotpay', '20$', 6, true),
('Okx', '20$', 7, true),
('World First', '20$', 8, true),
('Bybit', '20$', 9, true),
('Bitget', '20$', 10, true),
('Kucoin', '20$', 11, true),
('PayPal', '15$', 12, true),
('Mexc', '20$', 13, true),
('Exness', '20$', 14, true),
('شحن رصيد فودافون', '100 جنيه = 120 جنيه', 15, true),
('سحب أرباح من TikTok', 'حسب الاتفاق', 16, true),
('سحب أرباح من PayPal', 'حسب الاتفاق', 17, true)
ON CONFLICT DO NOTHING;

-- إدراج البيانات الافتراضية لطرق الدفع
INSERT INTO payment_methods (name, details, active) VALUES
('Vodafone Cash', '01062453344', true),
('USDT (TRC20)', 'TFUt8GRpk2R8Wv3FvoCiSUghRBQo4HrmQK', true)
ON CONFLICT DO NOTHING;

-- إدراج الإعدادات الافتراضية للموقع
INSERT INTO site_settings (title, description, order_notice) VALUES
('KYCtrust - خدمات مالية رقمية موثوقة', 'نقدم خدمات مالية رقمية احترافية وآمنة لجميع المنصات العالمية مع ضمان الجودة والموثوقية', 'سيتم التواصل معك يدويًا عبر واتساب بعد إرسال الطلب.')
ON CONFLICT DO NOTHING;

-- إنشاء دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- إضافة المحفزات لتحديث updated_at
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();