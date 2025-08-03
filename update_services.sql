-- تحديث الخدمات مع الخدمات الجديدة المطلوبة
-- Update services with new required services

-- حذف الخدمات الموجودة أولاً
DELETE FROM public.services;

-- إعادة تعيين الترقيم التلقائي
ALTER SEQUENCE IF EXISTS services_id_seq RESTART WITH 1;

-- إدراج جميع الخدمات المحدثة
INSERT INTO public.services (name, price, order_index, active, category, description) VALUES
-- المحافظ الرقمية العالمية
('Payoneer', '30$', 1, true, 'digital_wallets', 'خدمة Payoneer للدفع الإلكتروني والتحويلات الدولية'),
('Wise', '30$', 2, true, 'digital_wallets', 'خدمة Wise (TransferWise) للتحويلات ال��ولية بأفضل أسعار الصرف'),
('Skrill', '20$', 3, true, 'digital_wallets', 'محفظة Skrill الرقمية للمدفوعات الإلكترونية'),
('Neteller', '20$', 4, true, 'digital_wallets', 'محفظة Neteller الرقمية للتحويلات السريعة'),
('PayPal', '15$', 12, true, 'digital_wallets', 'خدمة PayPal العالمية للمدفوعات الإلكترونية'),

-- محافظ رقمية أخرى
('Kast', '20$', 5, true, 'digital_wallets', 'خدمة Kast المالية للمدفوعات الرقمية'),
('Redotpay', '20$', 6, true, 'digital_wallets', 'محفظة Redotpay الرقمية متعددة الخدمات'),

-- منصات العملات الرقمية والتداول
('Okx', '20$', 7, true, 'crypto', 'منصة OKX للعملات الرقمية والتداول'),
('Bybit', '20$', 9, true, 'crypto', 'منصة Bybit للتداول والعملات الرقمية'),
('Bitget', '20$', 10, true, 'crypto', 'منصة Bitget للعملات الرقمية والتداول'),
('Kucoin', '20$', 11, true, 'crypto', 'منصة Kucoin للتداول والعملات الرقمية'),
('Mexc', '20$', 13, true, 'crypto', 'منصة MEXC للعملات الرقمية والتداول'),

-- خدمات مصرفية وتداول
('World First', '20$', 8, true, 'banking', 'خدمة World First للتحويلات والصرافة الدولية'),
('Exness', '20$', 14, true, 'trading', 'منصة Exness للتداول في الفوركس والأسهم'),

-- خدمات محلية مصرية
('شحن رصيد فودافون', '100 جنيه = 120 جنيه (متاح أي مبلغ)', 15, true, 'local_services', 'خدمة شحن رصيد فودافون كاش بأفضل الأسعار - متاح جميع المبالغ'),

-- خدمات سحب الأرباح
('سحب من TikTok', 'حسب الاتفاق', 16, true, 'withdrawal', 'سحب الأرباح من منصة TikTok Creator Fund وTikTok Shop'),
('سحب من PayPal', 'حسب الاتفاق', 17, true, 'withdrawal', 'سحب الأرباح والأموال من PayPal بأفضل أسعار الصرف');

-- تحديث تصنيفات إضافية للخدمات
UPDATE public.services SET 
    icon = CASE 
        WHEN category = 'digital_wallets' THEN 'CreditCard'
        WHEN category = 'crypto' THEN 'Zap'
        WHEN category = 'banking' THEN 'Building'
        WHEN category = 'trading' THEN 'TrendingUp'
        WHEN category = 'local_services' THEN 'Smartphone'
        WHEN category = 'withdrawal' THEN 'ArrowDownCircle'
        ELSE 'CreditCard'
    END,
    color = CASE 
        WHEN category = 'digital_wallets' THEN 'from-blue-500 to-cyan-500'
        WHEN category = 'crypto' THEN 'from-orange-500 to-red-500'
        WHEN category = 'banking' THEN 'from-green-500 to-emerald-500'
        WHEN category = 'trading' THEN 'from-purple-500 to-violet-500'
        WHEN category = 'local_services' THEN 'from-pink-500 to-rose-500'
        WHEN category = 'withdrawal' THEN 'from-indigo-500 to-purple-500'
        ELSE 'from-gray-500 to-gray-600'
    END;

-- إضافة معلومات إضافية للخدمات
UPDATE public.services SET 
    description = CASE name
        WHEN 'Payoneer' THEN 'خدمة Payoneer للدفع الإلكتروني والتحويلات الدولية - حساب معتمد وموثوق'
        WHEN 'Wise' THEN 'خدمة Wise للتحويلات الدولية بأفضل أسعار الصرف - سرعة وأمان'
        WHEN 'Skrill' THEN 'محفظة Skrill الرقمية للمدفوعات الإلكترونية - قبول عالمي'
        WHEN 'Neteller' THEN 'محفظة Neteller الرقمية للتحويلات السريعة - أمان عالي'
        WHEN 'PayPal' THEN 'خدمة PayPal العالمية للمدفوعات الإلكترونية - الأكثر انتشاراً'
        WHEN 'Kast' THEN 'خدمة Kast المالية للمدفوعات الرقمية - حلول مبتك��ة'
        WHEN 'Redotpay' THEN 'محفظة Redotpay الرقمية متعددة الخدمات - مرونة عالية'
        WHEN 'Okx' THEN 'منصة OKX للعملات الرقمية والتداول - من أكبر المنصات العالمية'
        WHEN 'World First' THEN 'خدمة World First للتحويلات والصرافة الدولية - للشركات والأفراد'
        WHEN 'Bybit' THEN 'منصة Bybit للتداول والعملات الرقمية - تداول احترافي'
        WHEN 'Bitget' THEN 'منصة Bitget للعملات الرقمية والتداول - أدوات متقدمة'
        WHEN 'Kucoin' THEN 'منصة Kucoin للتداول والعملات الرقمية - تنوع في العملات'
        WHEN 'Mexc' THEN 'منصة MEXC للعملات الرقمية والتداول - عملات جديدة'
        WHEN 'Exness' THEN 'منصة Exness للتداول في الفوركس والأسهم - وسيط موثوق'
        WHEN 'شحن رصيد فودافون' THEN 'خدمة شحن رصيد فودافون كاش بأفضل الأسعار - فوري ومضمون'
        WHEN 'سحب من TikTok' THEN 'سحب الأرباح من منصة TikTok - Creator Fund وTikTok Shop'
        WHEN 'سحب من PayPal' THEN 'سحب الأرباح والأموال من PayPal - أفضل أسعار الصرف'
        ELSE description
    END;

-- إضافة فهرس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);
CREATE INDEX IF NOT EXISTS idx_services_name_search ON public.services USING gin(to_tsvector('arabic', name));
CREATE INDEX IF NOT EXISTS idx_services_active_order ON public.services(active, order_index);

-- عرض ملخص الخدمات المضافة
SELECT 
    category,
    COUNT(*) as service_count,
    string_agg(name, ', ' ORDER BY order_index) as services
FROM public.services 
WHERE active = true
GROUP BY category
ORDER BY 
    CASE category
        WHEN 'digital_wallets' THEN 1
        WHEN 'crypto' THEN 2
        WHEN 'banking' THEN 3
        WHEN 'trading' THEN 4
        WHEN 'local_services' THEN 5
        WHEN 'withdrawal' THEN 6
        ELSE 7
    END;

-- عرض إجمالي الخدمات
SELECT 
    COUNT(*) as total_services,
    COUNT(*) FILTER (WHERE active = true) as active_services,
    COUNT(DISTINCT category) as categories
FROM public.services;

SELECT 'تم تحديث الخدمات بنجاح! Services updated successfully!' as message;
