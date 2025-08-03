# دليل إعداد قاعدة البيانات | Database Setup Guide

## 🎯 نظرة عامة | Overview

هذا الدليل يوضح كيفية إعداد قاعدة البيانات الكاملة لمنصة KYCtrust في Supabase.

This guide explains how to set up the complete database for KYCtrust platform in Supabase.

## 🚀 الإعداد السريع | Quick Setup

### الطريقة الأولى: تشغيل سكريپت واحد | Method 1: Run Single Script

1. **افتح Supabase SQL Editor | Open Supabase SQL Editor**
   - اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
   - اختر مشروعك
   - اذهب إلى "SQL Editor"

2. **انسخ وشغل السكريپت | Copy and Run Script**
   ```sql
   -- Copy the entire content of database/run-all-setup.sql
   -- انسخ محتوى ملف database/run-all-setup.sql كاملاً
   ```

3. **اضغط "Run" | Click "Run"**
   - سيتم إعداد كل شيء تلقائياً
   - تابع الرسائل في النتائج

### الطريقة الثانية: تشغيل تدريجي | Method 2: Step by Step

#### الخطوة 1: إنشاء الهيكل | Step 1: Create Structure
```sql
-- Run: database/setup-complete.sql
-- شغل: database/setup-complete.sql
```

#### الخطوة 2: إعداد الأمان | Step 2: Setup Security
```sql
-- Run: database/setup-rls.sql
-- شغل: database/setup-rls.sql
```

#### الخطوة 3: إدراج البيانات | Step 3: Insert Data
```sql
-- Run: database/seed-data.sql
-- شغل: database/seed-data.sql
```

## 📊 هيكل قاعدة البيانات | Database Structure

### الجداول الرئيسية | Main Tables

#### 1. Services (الخدمات)
```sql
- id: UUID (Primary Key)
- name: TEXT (اسم الخدمة)
- name_en: TEXT (الاسم بالإنجليزية)
- description: TEXT (الوصف)
- price: TEXT (السعر)
- price_numeric: DECIMAL (السعر الرقمي)
- category: VARCHAR (الفئة)
- active: BOOLEAN (نشطة/غير نشطة)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 2. Payment Methods (طرق الدفع)
```sql
- id: UUID (Primary Key)
- name: TEXT (اسم طريقة الدفع)
- description: TEXT (الوصف)
- type: VARCHAR (النوع: bank, wallet, crypto)
- account_info: JSONB (معلومات الحساب)
- active: BOOLEAN (نشطة/غير نشطة)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 3. Orders (الطلبات)
```sql
- id: UUID (Primary Key)
- order_number: VARCHAR (رقم ال��لب)
- customer_name: TEXT (اسم العميل)
- customer_email: VARCHAR (البريد الإلكتروني)
- service_name: TEXT (اسم الخدمة)
- status: VARCHAR (الحالة: pending, processing, completed)
- notes: TEXT (الملاحظات)
- archived: BOOLEAN (مؤرشف)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 4. Site Settings (إعدادات الموقع)
```sql
- id: UUID (Primary Key)
- site_title: TEXT (عنوان الموقع)
- site_description: TEXT (وصف الموقع)
- hero_title: TEXT (عنوان الصفحة الرئيسية)
- primary_color: VARCHAR (اللون الأساسي)
- contact_email: VARCHAR (البريد الإلكتروني)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 5. Analytics Events (أحداث التحليلات)
```sql
- id: UUID (Primary Key)
- event_type: VARCHAR (نوع الحدث)
- event_category: VARCHAR (فئة الحدث)
- page_url: TEXT (رابط الصفحة)
- metadata: JSONB (بيانات إضافية)
- created_at: TIMESTAMP
```

## 🔒 إعدادات الأمان | Security Settings

### Row Level Security (RLS)

تم تفعيل RLS على جميع الجداول مع السياسات التالية:

RLS is enabled on all tables with the following policies:

#### للتطوير | For Development
```sql
-- Allow all operations (basic policy)
CREATE POLICY "Allow all operations" ON [table_name] FOR ALL USING (true);
```

#### للإنتاج | For Production
```sql
-- Services: Public read, Admin manage
-- الخدمات: قراءة عامة، إدارة للمشرفين

-- Orders: Public create, Admin manage  
-- الطلبات: إنشاء عام، إدارة للمشرفين

-- Settings: Public read, Admin manage
-- الإعدادات: قراءة عامة، إدارة للمشرفين
```

## 🌱 البيانات الأولية | Initial Data

### الخدمات الافتراضية | Default Services
1. **خدمات KYC المتقدمة** - $299
2. **تحليل المخاطر المالية** - $199
3. **خدمات AML المتخصصة** - $399

### طرق الدفع الافتراضية | Default Payment Methods
1. **التحويل البنكي المحلي** - بنك الراجحي
2. **محفظة STC Pay** - +966501234567
3. **تحويل Wise** - للتحويلات الدولية
4. **العملات المشفرة** - Bitcoin, USDT, Ethereum

### إعدادات الموقع | Site Settings
- **العنوان**: KYCtrust - منصة موثوقة
- **الوصف**: منصة موثوقة للخدمات المالية الرقمية
- **الألوان**: Blue theme (#3B82F6, #6366F1, #8B5CF6)

## 🔧 التحقق من الإعداد | Verify Setup

### 1. فحص الجداول | Check Tables
```sql
-- List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Count records in each table
SELECT 
    (SELECT COUNT(*) FROM services) as services,
    (SELECT COUNT(*) FROM payment_methods) as payment_methods,
    (SELECT COUNT(*) FROM orders) as orders,
    (SELECT COUNT(*) FROM site_settings) as site_settings;
```

### 2. فحص RLS | Check RLS
```sql
-- Check RLS status
SELECT schemaname, tablename, rowlevelenabled 
FROM pg_tables 
WHERE schemaname = 'public';
```

### 3. فحص البيانات | Check Data
```sql
-- Check services
SELECT name, price, active FROM services;

-- Check payment methods
SELECT name, type, active FROM payment_methods;

-- Check site settings
SELECT site_title, contact_email FROM site_settings;
```

## 🚨 استكشاف الأخطاء | Troubleshooting

### مشكلة: "relation does not exist"
**الحل:**
1. تأكد من تشغيل setup-complete.sql أولاً
2. تحقق من أن الجداول موجودة في schema العام

### مشكلة: "permission denied"
**الحل:**
1. تحقق من إعدادات RLS
2. تأكد من تشغيل setup-rls.sql
3. تحقق من أذونات المستخدم

### مشكلة: "duplicate key error"
**الحل:**
1. احذف البيانات الموجودة
2. أعد تشغيل seed-data.sql

### مشكلة: "function does not exist"
**الحل:**
1. تأكد من تفعيل Extensions
2. تحقق من تشغيل الدوال في setup-complete.sql

## 📝 ملاحظات مهمة | Important Notes

### للتطوير | For Development
- استخدم السياسات المفتوحة (Allow all)
- فعل RLS لكن مع صلاحيات واسعة
- استخدم البيانات التجريبية

### للإنتاج | For Production
- استخدم السياسات المقيدة
- فعل المصادقة والتخويل
- احذف البيانات التجريبية
- فعل النسخ الاحتياطي

### الأمان | Security
- غير كلمة مرور الإدارة الافتراضية
- حدث معلومات الاتصال
- راجع السياسات والأذونات
- فعل تسجيل العمليات

## 🔄 تحديث قاعدة البيانات | Database Updates

### إضافة عمود جديد | Add New Column
```sql
ALTER TABLE services ADD COLUMN new_field TEXT;
```

### تحديث البيانات | Update Data
```sql
UPDATE site_settings 
SET contact_email = 'new@email.com' 
WHERE active = true;
```

### نسخ احتياطية | Backups
```sql
-- Export data
COPY services TO '/path/to/services_backup.csv' CSV HEADER;

-- Import data
COPY services FROM '/path/to/services_backup.csv' CSV HEADER;
```

## 📞 الدعم | Support

إذا واجهت مشاكل في الإعداد:
1. راجع رسائل الخطأ في SQL Editor
2. تحقق من ملف التوثيق
3. ابحث في Issues على GitHub

If you encounter setup issues:
1. Check error messages in SQL Editor
2. Review documentation
3. Search GitHub Issues

---

## ✅ قائمة المراجعة | Checklist

- [ ] تشغيل setup-complete.sql
- [ ] تشغيل setup-rls.sql  
- [ ] تشغيل seed-data.sql
- [ ] التحقق من وجود الجداول
- [ ] فحص البيانات الأولية
- [ ] اختبار RLS
- [ ] تحديث ملف .env.local
- [ ] اختبار الاتصال من التطبيق
- [ ] تغيير كلمة مرور الإدارة
- [ ] تحديث معلومات الاتصال

**مبروك! قاعدة البيانات جاهزة للاستخدام 🎉**

**Congratulations! Your database is ready to use 🎉**
