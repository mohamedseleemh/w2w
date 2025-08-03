# دليل إعداد متغيرات البيئة
# Environment Variables Setup Guide

## 🌍 نظرة عامة | Overview

هذا الدليل يشرح كيفية إعداد و��دارة متغيرات البيئة في مشروع KYCtrust.

This guide explains how to set up and manage environment variables in the KYCtrust project.

## 📁 ملفات متغيرات البيئة | Environment Files

المشروع يتضمن عدة ملفات لمتغيرات البيئة:

The project includes several environment variable files:

### 1. `.env.example`
- قالب لجميع المتغيرات المطلوبة والاختيارية
- Template for all required and optional variables
- يجب نسخه إلى `.env.local` للتطوير المحلي
- Should be copied to `.env.local` for local development

### 2. `.env.local`
- ملف التطوير المحلي (غير مضمن في Git)
- Local development file (not included in Git)
- يحتوي على قيم التطوير والاختبار
- Contains development and testing values

### 3. `.env.production`
- إعدادات بيئة الإنتاج
- Production environment settings
- يُستخدم عند النشر
- Used during deployment

## 🚀 الإعداد السريع | Quick Setup

### 1. نسخ ملف القالب | Copy Template File
```bash
cp .env.example .env.local
```

### 2. تحديث المتغيرات المطلوبة | Update Required Variables
```bash
# افتح الملف وحدث القيم
# Open the file and update the values
nano .env.local
```

### 3. المتغيرات المطلوبة | Required Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🔧 فئات المتغيرات | Variable Categories

### 1. إعدادات Supabase | Supabase Configuration
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. إعدادات التطبيق | Application Settings
```env
VITE_APP_NAME=KYCtrust
VITE_APP_DESCRIPTION=Digital Financial Services Platform
VITE_APP_URL=http://localhost:5173
```

### 3. معلومات التواصل | Contact Information
```env
VITE_WHATSAPP_NUMBER=+966501234567
VITE_SUPPORT_EMAIL=support@kyctrust.com
VITE_CONTACT_PHONE=+966501234567
```

### 4. إعدادات الإدارة | Admin Configuration
```env
ADMIN_PASSWORD=your_secure_admin_password
VITE_ADMIN_EMAIL=admin@kyctrust.com
```

### 5. إعدادات الأمان | Security Settings
```env
VITE_ENCRYPTION_KEY=your_encryption_key
VITE_JWT_SECRET=your_jwt_secret
```

### 6. إعدادات الميزات | Feature Flags
```env
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_MULTILANG=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_OFFLINE_MODE=true
```

### 7. إع��ادات الأداء | Performance Settings
```env
VITE_ENABLE_PWA=true
VITE_CACHE_TIMEOUT=300000
VITE_API_TIMEOUT=30000
```

### 8. التحليلات | Analytics
```env
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_ENABLE_ANALYTICS=true
```

## 💻 الاستخدام في الكود | Usage in Code

### استيراد مساعد البيئة | Import Environment Helper
```typescript
import { env } from '@/utils/env';

// استخدام القيم
// Using values
const appName = env.APP_NAME;
const supabaseUrl = env.SUPABASE_URL;
const enableAnalytics = env.ENABLE_ANALYTICS;
```

### التحقق من المتغيرات | Variable Validation
```typescript
import { validateEnv } from '@/utils/env';

// التحقق من المتغيرات المطلوبة
// Validate required variables
try {
  validateEnv();
  console.log('✅ Environment variables are valid');
} catch (error) {
  console.error('❌ Environment validation failed:', error);
}
```

### الحصول على متغير محدد | Get Specific Variable
```typescript
import { getEnv, getEnvBoolean, getEnvNumber } from '@/utils/env';

// نص
// String
const apiUrl = getEnv('VITE_API_URL', 'http://localhost:5173/api');

// منطقي
// Boolean
const debugMode = getEnvBoolean('VITE_DEBUG_MODE', false);

// رقم
// Number
const timeout = getEnvNumber('VITE_API_TIMEOUT', 30000);
```

## 🏗️ بيئات مختلفة | Different Environments

### التطوير | Development
```env
NODE_ENV=development
VITE_DEBUG_MODE=true
VITE_API_URL=http://localhost:5173/api
```

### الإنتاج | Production
```env
NODE_ENV=production
VITE_DEBUG_MODE=false
VITE_API_URL=https://your-domain.com/api
```

### الاختبار | Testing
```env
NODE_ENV=test
VITE_DEBUG_MODE=true
VITE_API_URL=http://localhost:3000/api
```

## 🔒 أفضل الممارسات الأمنية | Security Best Practices

### 1. لا تلتزم بالأسرار | Never Commit Secrets
- استخدم `.env.local` للأسرار المحلية
- Use `.env.local` for local secrets
- تأكد من إضافة `.env*` إلى `.gitignore`
- Ensure `.env*` is added to `.gitignore`

### 2. استخدم متغيرات قوية | Use Strong Variables
```env
# ضعيف | Weak
ADMIN_PASSWORD=123456

# قوي | Strong
ADMIN_PASSWORD=MyStr0ng_P@ssw0rd_2024!
```

### 3. فصل البيئات | Separate Environments
- استخدم قيم مختلفة لكل بيئة
- Use different values for each environment
- لا تشارك أسرار الإنتاج
- Don't share production secrets

## 🚨 استكشاف الأخطاء | Troubleshooting

### المشاكل الشائعة | Common Issues

#### 1. متغير مطلوب مفقود | Missing Required Variable
```
Error: Required environment variable VITE_SUPABASE_URL is not set
```
**الحل | Solution:** أضف المتغير إلى ملف `.env.local`

#### 2. قيمة منطقية خاطئة | Invalid Boolean Value
```
VITE_ENABLE_ANALYTICS=yes  # خطأ | Wrong
VITE_ENABLE_ANALYTICS=true # صحيح | Correct
```

#### 3. مشكلة في التحميل | Loading Issue
- تأكد من أن الملف موجود في الجذر
- Ensure file exists in root directory
- أعد تشغيل الخادم بعد التغييرات
- Restart server after changes

### فحص المتغيرات | Check Variables
```typescript
// في وحدة التحكم | In console
console.log('Environment:', import.meta.env);
```

## 📝 نصائح إضافية | Additional Tips

### 1. النسخ الاحتياطية | Backups
- احتفظ بنسخة احتياطية من ملفات البيئة
- Keep backups of environment files
- استخدم مدير كلمات المرور للأسرار
- Use password manager for secrets

### 2. التوثيق | Documentation
- وثق جميع المتغيرات الجديدة
- Document all new variables
- حدث `.env.example` عند الإضافة
- Update `.env.example` when adding

### 3. المراجعة | Review
- راجع المتغيرات بانتظام
- Review variables regularly
- احذف المتغيرات غير المستخدمة
- Remove unused variables

## 🆘 الدعم | Support

إذا واجهت مشاكل في إعداد متغيرات البيئة:

If you encounter issues with environment variable setup:

1. تحقق من [الوثائق الرسمية](https://vitejs.dev/guide/env-and-mode.html)
2. ابحث في المشاكل المفتوحة في GitHub
3. أنشئ issue جديد مع تفاصيل المشكلة

---

## 📚 مراجع إضافية | Additional References

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Supabase Configuration](https://supabase.com/docs/guides/getting-started)
- [Security Best Practices](https://owasp.org/www-project-top-ten/)
