#!/bin/bash

echo "🚀 Starting KYCtrust build process..."

# تثبيت التبعيات
echo "📦 Installing dependencies..."
npm ci

# فحص المتغيرات البيئية
echo "🔍 Checking environment variables..."
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo "⚠️  Warning: Supabase environment variables not set"
    echo "   Application will use localStorage fallback"
    echo "   To connect to Supabase, set:"
    echo "   - VITE_SUPABASE_URL"
    echo "   - VITE_SUPABASE_ANON_KEY"
else
    echo "✅ Supabase environment variables found"
fi

# بناء التطبيق
echo "🏗️  Building application..."
npm run build

# التحقق من نجاح البناء
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📂 Built files are in ./dist directory"
    
    # عرض إحصائيات الملفات
    echo "📊 Build statistics:"
    du -sh dist/
    find dist/ -name "*.js" -o -name "*.css" | wc -l | xargs echo "   JS/CSS files:"
    find dist/ -name "*.html" | wc -l | xargs echo "   HTML files:"
    
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Build process completed successfully!"
