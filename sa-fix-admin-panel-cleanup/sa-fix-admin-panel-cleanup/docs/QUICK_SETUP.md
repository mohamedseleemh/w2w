# دليل الإعداد السريع | Quick Setup Guide

## 🚀 إعداد سريع للمطور | Quick Developer Setup

### 1. نسخ ملف البيئة | Copy Environment File
```bash
cp .env.example .env.local
```

### 2. تحديث إعدادات Supabase | Update Supabase Settings
افتح ملف `.env.local` وحدث المتغيرات التالية:

Open `.env.local` file and update the following variables:

```env
# Required - مطلوب
VITE_SUPABASE_URL=https://tpjqiymtzaywfgaajvnx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwanFpeW10emF5d2ZnYWFqdm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0ODkzODYsImV4cCI6MjA2NjA2NTM4Nn0.au8zeFDU_RJVPjyMUdULEfHYwtWlCEwDwtQ2owflRL0

# Optional for admin features - اختياري للميزات الإدارية
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwanFpeW10emF5d2ZnYWFqdm54Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDQ4OTM4NiwiZXhwIjoyMDY2MDY1Mzg2fQ.yBj-9SFnU4VKZ_pAoE5EAobn2ViSZFJ3M4FiotGPodM
SUPABASE_JWT_SECRET=Dy9YN5V/+7ELxHQncWMqtDqfRLvMnGXynEiKpDd6ixG7csB8OJupguxbW0ZIsGYk1uG5zhLPBC2wrwWNFVfz4A==

# PostgreSQL - for direct database access - للوصول المباشر لقاعدة البيانات
POSTGRES_URL=postgres://postgres.tpjqiymtzaywfgaajvnx:loP8TwmUMHimAzxm@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require
```

### 3. تشغيل التطبيق | Run Application
```bash
npm install
npm run dev
```

## 🔧 التحقق من الإعداد | Verify Setup

### 1. فحص الاتصال | Check Connection
افتح المتصفح واذهب إلى: `http://localhost:5173`

Open browser and go to: `http://localhost:5173`

### 2. فحص وحدة التحكم | Check Console
- افتح أدوات المطور (F12)
- Open Developer Tools (F12)
- تأكد من عدم وجود أخطاء في وحدة التحكم
- Make sure there are no errors in console
- ابحث عن رسالة: "🔧 Environment Configuration"
- Look for message: "🔧 Environment Configuration"

### 3. اختبار الوظائف | Test Functions
- جرب إضافة طلب جديد
- Try adding a new order
- ادخل إلى لوحة الإدارة: `/admin`
- Access admin panel: `/admin`
- كلمة المرور الافتراضية: `dev123456`
- Default password: `dev123456`

## 🛠️ إعداد قاعدة البيانات | Database Setup

### إنشاء الجداول | Create Tables
```sql
-- Services table
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  details TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  service_name TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  order_notice TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  metadata JSONB,
  page_url TEXT,
  referrer_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### إعداد RLS (Row Level Security)
```sql
-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for development)
CREATE POLICY "Allow all operations" ON services FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON payment_methods FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON orders FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON site_settings FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON analytics_events FOR ALL USING (true);
```

## 🔒 إعدادات الأمان | Security Settings

### للتطوير | For Development
```env
VITE_DEBUG_MODE=true
ADMIN_PASSWORD=dev123456
```

### للإنتاج | For Production
```env
VITE_DEBUG_MODE=false
ADMIN_PASSWORD=your_secure_password_here
VITE_ENABLE_ANALYTICS=true
```

## 🚨 استكشاف الأخطاء | Troubleshooting

### خطأ: "Supabase not configured"
1. تأكد من وجود ملف `.env.local`
2. تحقق من صحة متغيرات Supabase
3. أعد تشغيل الخادم

### خطأ: "Failed to track event"
1. تحقق من اتصال قاعدة البيانات
2. تأكد من وجود جدول `analytics_events`
3. راجع صلاحيات RLS

### خطأ: "Database connection failed"
1. تحقق من متغيرات PostgreSQL
2. تأكد من صحة كلمة المرور
3. تحقق من إعدادات SSL

## 📞 الدعم | Support

إذا واجهت مشاكل:
- راجع ملف `docs/ENVIRONMENT_SETUP.md`
- تحقق من ملف `docs/ERROR_LOGGING.md`
- ابحث في Issues على GitHub

If you face issues:
- Check `docs/ENVIRONMENT_SETUP.md`
- Review `docs/ERROR_LOGGING.md`  
- Search GitHub Issues

---

## �� قائمة المراجعة | Checklist

- [ ] نسخ ملف .env.local
- [ ] تحديث متغيرات Supabase
- [ ] تشغيل `npm install`
- [ ] تشغيل `npm run dev`
- [ ] فتح المتصفح على `localhost:5173`
- [ ] التحقق من وحدة التحكم
- [ ] اختبار إضافة طلب
- [ ] دخول لوحة الإدارة
- [ ] إنشاء جداول قاعدة البيانات
- [ ] إعداد صلاحيات RLS

---

**مبروك! التطبيق جاهز للاستخدام 🎉**

**Congratulations! Your application is ready to use 🎉**
