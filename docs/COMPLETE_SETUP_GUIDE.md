# دليل الإعداد الكامل | Complete Setup Guide

## 🎯 نظرة عامة | Overview

هذا الدليل الشامل لإعداد منصة KYCtrust كاملة مع قاعدة البيانات الحقيقية في Supabase.

This is the comprehensive guide to set up the complete KYCtrust platform with real database in Supabase.

## 📋 متطلبات الإعداد | Setup Requirements

### البيانات المطلوبة | Required Credentials
✅ **تم توفيرها** | **Already Provided:**
- Supabase URL: `https://tpjqiymtzaywfgaajvnx.supabase.co`
- Supabase Anon Key: `eyJhbGci...` ✅
- Supabase Service Role Key: `eyJhbGci...` ✅
- PostgreSQL URLs: Connection strings ✅
- JWT Secret: `Dy9YN5V...` ✅

## ��� خطوات الإعداد السريع | Quick Setup Steps

### 1. إعداد قاعدة البيانات | Database Setup

#### الطريقة الأولى: تشغيل سكريپت واحد شامل ⭐ (مُوصى به)
**Method 1: Single Complete Script ⭐ (Recommended)**

1. **افتح Supabase Dashboard | Open Supabase Dashboard**
   ```
   https://supabase.com/dashboard/project/tpjqiymtzaywfgaajvnx
   ```

2. **اذهب إلى SQL Editor | Go to SQL Editor**
   - اضغط على "SQL Editor" في القائمة الجانبية
   - Click "SQL Editor" in sidebar

3. **انسخ والصق السكريپت الكامل | Copy & Paste Complete Script**
   ```sql
   -- انسخ محتوى الملف كاملاً:
   -- Copy the entire content of:
   database/final-complete-setup.sql
   ```

4. **اضغط "Run" وانتظر | Click "Run" and Wait**
   - سيستغرق 2-3 دقائق
   - Takes 2-3 minutes
   - ستشاهد رسائل التقدم
   - You'll see progress messages

5. **تأكد من رسالة النجاح | Confirm Success Message**
   ```
   🎉 KYCtrust Database Setup COMPLETED Successfully!
   ```

#### الطريقة الثانية: تشغيل تدريجي | Method 2: Step by Step

1. **إنشاء الهيكل | Create Structure**
   ```sql
   -- Run: database/complete-database-setup.sql
   ```

2. **إعداد الأمان | Setup Security**
   ```sql
   -- Run: database/advanced-rls-setup.sql
   ```

3. **إدراج البيانات | Insert Data**
   ```sql
   -- Run: database/complete-seed-data.sql
   ```

### 2. تحديث ملف البيئة | Update Environment File

الملف `.env.local` محدث بالفعل بالبيانات الصحيحة:
The `.env.local` file is already updated with correct credentials:

```env
# ✅ Already configured in .env.local
VITE_SUPABASE_URL=https://tpjqiymtzaywfgaajvnx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
POSTGRES_URL=postgres://postgres...
# ... all other variables
```

### 3. تشغيل التطبيق | Run Application

```bash
# تأكد من وجود Node.js
# Ensure Node.js is installed
npm install

# تشغيل التطبيق
# Run the application
npm run dev
```

### 4. التحقق من التشغيل | Verify Setup

1. **افتح المتصفح | Open Browser**
   ```
   http://localhost:5173
   ```

2. **اختبر الصفحة الرئيسية | Test Homepage**
   - يجب أن تظهر الخدمات الـ 6
   - Should show 6 services
   - يجب أن تعمل طرق الدفع الـ 10
   - Should show 10 payment methods

3. **اختبر لوحة الإدارة | Test Admin Panel**
   ```
   http://localhost:5173/admin
   Email: admin@kyctrust.com
   Password: KYCtrust2024!Admin
   ```

## 📊 ما تم إعداده | What's Been Set Up

### 🗄️ الجداول | Tables (8 جدول)
1. **services** - 6 خدمات متنوعة
2. **payment_methods** - 10 طرق دفع مختلفة
3. **orders** - نظام طلبات متكامل
4. **site_settings** - إعدادات شاملة
5. **admin_users** - مستخدم إداري واحد
6. **analytics_events** - تتبع الأحداث
7. **page_templates** - قوالب الصفحات
8. **themes** - ثيم افتراضي

### 🔒 الأمان | Security
- **Row Level Security (RLS)** مُفعل
- **Policies** للتطوير (مفتوحة)
- **Admin Authentication** جاهز
- **Session Management** متقدم

### 📈 التحليلات | Analytics
- **Event Tracking** شامل
- **Performance Monitoring** متقدم
- **User Behavior** تتبع السلوك
- **Custom Events** أحداث مخصصة

### 🎨 التصميم | Design
- **Responsive Design** تصميم متجاوب
- **Arabic RTL Support** دعم العربية
- **Modern UI Components** مكونات حديثة
- **Dark/Light Themes** ثيمات متعددة

## 🧪 اختبار النظام | System Testing

### 1. اختبار الخدمات | Test Services
```javascript
// في Developer Console
// In Developer Console
fetch('/api/services')
  .then(r => r.json())
  .then(console.log);
```

### 2. اختبار إنشاء طل�� | Test Order Creation
1. اختر خدمة من الصفحة الرئيسية
2. امل البيانات المطلوبة
3. اختر طريقة دفع
4. أرسل الطلب
5. تحقق من الطلب في لوحة الإدارة

### 3. اختبار التحليلات | Test Analytics
```javascript
// تتبع حدث تجريبي
// Track test event
import { databaseService } from './src/services/database';
databaseService.trackEvent('test_event', { test: true });
```

## 🔧 إعدادات متقدمة | Advanced Configuration

### تفعيل Google Analytics | Enable Google Analytics
```env
# في .env.local
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_ENABLE_ANALYTICS=true
```

### تخصيص الألوان | Customize Colors
```sql
UPDATE site_settings SET 
  primary_color = '#your-color',
  secondary_color = '#your-color'
WHERE active = true;
```

### إضافة خدمات جديدة | Add New Services
```sql
INSERT INTO services (name, name_en, description, price, price_numeric, category, active) 
VALUES ('خدمة جديدة', 'New Service', 'وصف الخدمة', '$99', 99.00, 'category', true);
```

## 📱 تطبيق الجوال | Mobile App Ready

التطبيق جاهز للعمل على:
App ready for:
- ✅ **iOS Safari**
- ✅ **Android Chrome**
- ✅ **Responsive Design**
- ✅ **PWA Support**

## 🌐 النشر | Deployment

### Vercel (مُوصى به | Recommended)
```bash
# تنصيب Vercel CLI
npm i -g vercel

# النشر
vercel --prod
```

### Netlify
```bash
# بناء المشروع
npm run build

# رفع مجلد dist
# Upload dist folder
```

## 🚨 استكشاف الأخطاء | Troubleshooting

### مشكلة: لا تظهر البيانات | Data Not Loading
**التحقق:**
1. تأكد من تشغيل SQL scripts بنجاح
2. تحقق من متغيرات البيئة
3. افحص Network tab في Developer Tools

### مشكلة: خطأ في تسجيل الدخول | Login Error
**الحل:**
```sql
-- إعادة تعيين كلمة المرور
UPDATE admin_users 
SET password_hash = crypt('KYCtrust2024!Admin', gen_salt('bf'))
WHERE email = 'admin@kyctrust.com';
```

### مشكلة: خطأ CORS | CORS Error
**الحل:**
- تأكد من إعدادات Supabase
- تحقق من CORS settings في Dashboard

## 📞 الدعم | Support

### موارد مساعدة | Help Resources
- 📚 **Documentation**: `/docs` folder
- 🐛 **Error Logs**: Browser DevTools Console
- 📊 **Database**: Supabase Dashboard
- 🔧 **Config**: `.env.local` file

### ملفات مهمة | Important Files
- `database/final-complete-setup.sql` - إعداد شامل
- `.env.local` - متغيرات البيئة
- `src/services/database.ts` - خدمة قاعدة البيانات
- `docs/` - توثيق شامل

## ✅ قائمة المراجعة النهائية | Final Checklist

- [ ] ✅ تشغيل SQL script في Supabase
- [ ] ✅ تحديث `.env.local` (مُكتمل)
- [ ] ✅ تشغيل `npm install`
- [ ] ✅ تشغيل `npm run dev`
- [ ] ✅ اختبار الصفحة الرئيسية
- [ ] ✅ اختبار لوحة الإدارة
- [ ] ✅ اختبار إنشاء طلب
- [ ] ✅ تحقق من قاعدة البيانات
- [ ] ✅ اختبار طرق الدفع
- [ ] ✅ مراجعة التحليلات

---

## 🎉 تهانينا! | Congratulations!

🚀 **منصة KYCtrust جاهزة للاستخدام بالكامل!**

🚀 **KYCtrust Platform is fully ready to use!**

### الميزات المُفعلة | Active Features
- ✅ **6 خدمات مالية متخصصة**
- ✅ **10 طرق دفع متنوعة**
- ✅ **نظام إدارة متكامل**
- ✅ **تتبع وتحليلات متقدمة**
- ✅ **أمان متقدم RLS**
- ✅ **تصميم متجاوب ومتعدد اللغات**

**استمتع باستخدام منصة KYCtrust! 🎯**

**Enjoy using KYCtrust platform! 🎯**
