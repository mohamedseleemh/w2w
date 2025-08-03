-- KYCtrust Database Setup SQL
-- Complete database structure for KYCtrust application

-- =============================================================================
-- 1. SERVICES TABLE
-- =============================================================================

-- Drop existing table if exists
DROP TABLE IF EXISTS public.services CASCADE;

-- Create services table
CREATE TABLE public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price VARCHAR(100) NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN DEFAULT true,
    description TEXT,
    category VARCHAR(100) DEFAULT 'digital_wallets',
    icon VARCHAR(100) DEFAULT 'CreditCard',
    color VARCHAR(50) DEFAULT 'from-blue-500 to-cyan-500',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policy
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON public.services FOR ALL USING (true);

-- Insert default services
INSERT INTO public.services (name, price, order_index, active, category, description) VALUES
('Payoneer', '30$', 1, true, 'digital_wallets', 'خدمة Payoneer للدفع الإلكتروني'),
('Wise', '30$', 2, true, 'digital_wallets', 'خدمة Wise (TransferWise) للتحويلات الدولية'),
('Skrill', '20$', 3, true, 'digital_wallets', 'محفظة Skrill الرقمية'),
('Neteller', '20$', 4, true, 'digital_wallets', 'محفظة Neteller الرقمية'),
('Kast', '20$', 5, true, 'digital_wallets', 'خدمة Kast المالية'),
('Redotpay', '20$', 6, true, 'digital_wallets', 'محفظة Redotpay الرقمية'),
('Okx', '20$', 7, true, 'crypto', 'منصة OKX للعملات الرقمية'),
('World First', '20$', 8, true, 'banking', 'خدمة World First للتحويلات'),
('Bybit', '20$', 9, true, 'crypto', 'منصة Bybit للتداول'),
('Bitget', '20$', 10, true, 'crypto', 'منصة Bitget للعملات الرقمية'),
('Kucoin', '20$', 11, true, 'crypto', 'منصة Kucoin للتداول'),
('PayPal', '15$', 12, true, 'digital_wallets', 'خدمة PayPal العالمية'),
('Mexc', '20$', 13, true, 'crypto', 'منصة MEXC للعملات الرقمية'),
('Exness', '20$', 14, true, 'trading', 'منصة Exness للتداول'),
('شحن رصيد فودافون', '100 جنيه = 120 جنيه (متاح أي مبلغ)', 15, true, 'local_services', 'خدمة شحن رصيد فودافون كاش'),
('سحب من TikTok', 'حسب الاتفاق', 16, true, 'withdrawal', 'سحب الأرباح من منصة TikTok'),
('سحب من PayPal', 'حسب الاتفاق', 17, true, 'withdrawal', 'سحب الأرباح من PayPal');

-- =============================================================================
-- 2. PAYMENT METHODS TABLE
-- =============================================================================

-- Drop existing table if exists
DROP TABLE IF EXISTS public.payment_methods CASCADE;

-- Create payment methods table
CREATE TABLE public.payment_methods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    details TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    type VARCHAR(50) DEFAULT 'bank',
    icon VARCHAR(100) DEFAULT 'CreditCard',
    color VARCHAR(50) DEFAULT 'from-green-500 to-emerald-500',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policy
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON public.payment_methods FOR ALL USING (true);

-- Insert default payment methods
INSERT INTO public.payment_methods (name, details, active, type) VALUES
('Vodafone Cash', '01062453344', true, 'mobile_money'),
('USDT (TRC20)', 'TFUt8GRpk2R8Wv3FvoCiSUghRBQo4HrmQK', true, 'cryptocurrency'),
('Orange Money', '01234567890', true, 'mobile_money'),
('البنك الأهلي المصري', 'حساب رقم: 1234567890123456', true, 'bank'),
('Instapay', 'kyctrust@instapay.com', true, 'instant_payment');

-- =============================================================================
-- 3. ORDERS TABLE
-- =============================================================================

-- Drop existing table if exists
DROP TABLE IF EXISTS public.orders CASCADE;

-- Create orders table
CREATE TABLE public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50),
    service_name VARCHAR(255) NOT NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'normal',
    estimated_completion TIMESTAMP WITH TIME ZONE,
    archived BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policy
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON public.orders FOR ALL USING (true);

-- Add indexes for better performance
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_archived ON public.orders(archived);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);
CREATE INDEX idx_orders_service_id ON public.orders(service_id);

-- =============================================================================
-- 4. SITE SETTINGS TABLE
-- =============================================================================

-- Drop existing table if exists
DROP TABLE IF EXISTS public.site_settings CASCADE;

-- Create site settings table
CREATE TABLE public.site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(500) NOT NULL DEFAULT 'KYCtrust - خدمات مالية رقمية موثوقة',
    subtitle VARCHAR(1000) DEFAULT 'نقدم خدمات مالية رقمية احتر��فية وآمنة',
    description TEXT NOT NULL DEFAULT 'نقدم خدمات مالية رقمية احترافية وآمنة لجميع المنصات العالمية مع ضمان الجودة والموثوقية',
    order_notice TEXT DEFAULT 'سيتم التواصل معك يدوياً عبر واتساب بعد إرسال الطلب',
    whatsapp_number VARCHAR(50) DEFAULT '201062453344',
    email_address VARCHAR(255) DEFAULT 'support@kyctrust.com',
    telegram_username VARCHAR(100),
    facebook_page VARCHAR(255),
    instagram_username VARCHAR(100),
    primary_color VARCHAR(20) DEFAULT '#3B82F6',
    secondary_color VARCHAR(20) DEFAULT '#6366F1',
    accent_color VARCHAR(20) DEFAULT '#8B5CF6',
    logo_url TEXT,
    favicon_url TEXT,
    seo_keywords TEXT DEFAULT 'خدمات مالية, رقمية, KYCtrust, Payoneer, Wise, PayPal',
    maintenance_mode BOOLEAN DEFAULT false,
    announcement_text TEXT,
    announcement_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policy
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON public.site_settings FOR ALL USING (true);

-- Insert default settings
INSERT INTO public.site_settings (
    title, 
    subtitle,
    description, 
    order_notice,
    whatsapp_number,
    email_address
) VALUES (
    'KYCtrust - خدمات مالية رقمية موثوقة',
    'نحن نعيد تعريف الخدمات المالية الرقمية',
    'نقدم خدمات مالية رقمية احترافية وآمنة لجميع المنصات العالمية مع ضمان الجودة والموثوقية. نتميز بالسرعة في التنفيذ والأمان العالي ودعم العملاء المتواصل.',
    'سيتم التواصل معك يدوياً عبر واتساب بعد إرسال الطلب. نحن نضمن سرية بياناتك وأمان معاملاتك.',
    '201062453344',
    'support@kyctrust.com'
);

-- =============================================================================
-- 5. ADMIN USERS TABLE
-- =============================================================================

-- Drop existing table if exists
DROP TABLE IF EXISTS public.admin_users CASCADE;

-- Create admin users table
CREATE TABLE public.admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin',
    permissions JSONB DEFAULT '{}',
    active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policy
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can access all" ON public.admin_users FOR ALL USING (auth.role() = 'authenticated');

-- Create indexes
CREATE INDEX idx_admin_users_username ON public.admin_users(username);
CREATE INDEX idx_admin_users_email ON public.admin_users(email);

-- =============================================================================
-- 6. ACTIVITY LOGS TABLE
-- =============================================================================

-- Drop existing table if exists
DROP TABLE IF EXISTS public.activity_logs CASCADE;

-- Create activity logs table
CREATE TABLE public.activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policy
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can access logs" ON public.activity_logs FOR ALL USING (auth.role() = 'authenticated');

-- Create indexes
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON public.activity_logs(action);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at);

-- =============================================================================
-- 7. TESTIMONIALS TABLE
-- =============================================================================

-- Drop existing table if exists
DROP TABLE IF EXISTS public.testimonials CASCADE;

-- Create testimonials table
CREATE TABLE public.testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_title VARCHAR(255),
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    image_url TEXT,
    order_index INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policy
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.testimonials FOR SELECT USING (active = true);
CREATE POLICY "Admins can manage testimonials" ON public.testimonials FOR ALL USING (auth.role() = 'authenticated');

-- Insert default testimonials
INSERT INTO public.testimonials (customer_name, customer_title, content, rating, order_index, active, featured) VALUES
('أحمد محمد علي', 'رائد أعمال', 'خدمة استثنائية وسرعة في التنفيذ. لقد حلت KYCtrust جميع مشاكلي المالية الرقمية بكفاءة عالية. أنصح بشدة بالتعامل معهم.', 5, 1, true, true),
('فاطمة السيد', 'مطورة ويب', 'أثق في KYCtrust بجميع معاملاتي المالية. الأمان والموثوقية هما أهم ما يميز هذه المنصة. دعم العملاء ممتاز والاستجابة سريعة.', 5, 2, true, true),
('خالد أحمد', 'مسوق رقمي', 'دعم العملاء رائع والأسعار تنافسية جداً. تعاملت معهم في عدة مشاريع وكانت التجربة مميزة في كل مرة. سرعة وأمان لا مثيل له.', 5, 3, true, true),
('مريم حسن', 'مديرة مبيعات', 'أفضل منصة تعاملت معها للخدمات المالية الرقمية. السرعة في التنفيذ والشفافية في التعامل جعلتني أثق بهم تماماً.', 5, 4, true, false),
('محمود عبدالله', 'صاحب متجر إلكتروني', 'KYCtrust غيرت طريقة تعاملي مع الخدمات المالية الرقمية. كل شيء أصبح أسهل وأسرع. فريق محترف ومتعاون.', 5, 5, true, false);

-- =============================================================================
-- 8. FEATURES TABLE
-- =============================================================================

-- Drop existing table if exists
DROP TABLE IF EXISTS public.features CASCADE;

-- Create features table
CREATE TABLE public.features (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(100) DEFAULT 'Shield',
    color VARCHAR(50) DEFAULT 'from-blue-500 to-cyan-500',
    image_url TEXT,
    order_index INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policy
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.features FOR SELECT USING (active = true);
CREATE POLICY "Admins can manage features" ON public.features FOR ALL USING (auth.role() = 'authenticated');

-- Insert default features
INSERT INTO public.features (title, description, icon, color, order_index, active, featured) VALUES
('أمان متقدم', 'تشفير متقدم وحماية شاملة لجميع معاملاتك المالية مع أحدث معايير الأمان العالمية', 'Shield', 'from-blue-500 to-cyan-500', 1, true, true),
('سرعة البرق', 'معالجة فورية للطلبات في أقل من 5 دقائق مع ضمان الدقة والموثوقية', 'Zap', 'from-orange-500 to-red-500', 2, true, true),
('دعم استثنائي', 'فريق دعم محترف متاح 24/7 لمساعدتك في جميع استفساراتك ومتطلباتك', 'Users', 'from-purple-500 to-violet-500', 3, true, true),
('جودة مضمونة', 'ضمان الجودة وإرجاع الأموال في حالة عدم الرضا مع متابعة مستمرة للخدمة', 'Award', 'from-green-500 to-emerald-500', 4, true, true),
('تغطية عالمية', 'خدماتنا متاحة في أكثر من 150 دولة حول العالم مع دعم العملات المختلفة', 'Globe', 'from-indigo-500 to-purple-500', 5, true, true),
('أسعار تنافسية', 'أفضل الأسعار في السوق مع جودة خدمة استثنائية وعروض خاصة للعملاء المميزين', 'TrendingUp', 'from-pink-500 to-rose-500', 6, true, true);

-- =============================================================================
-- 9. LANDING PAGE CUSTOMIZATION TABLE
-- =============================================================================

-- Drop existing table if exists
DROP TABLE IF EXISTS public.landing_customization CASCADE;

-- Create landing page customization table
CREATE TABLE public.landing_customization (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section_name VARCHAR(100) NOT NULL,
    content JSONB NOT NULL DEFAULT '{}',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policy
ALTER TABLE public.landing_customization ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.landing_customization FOR SELECT USING (active = true);
CREATE POLICY "Admins can manage customization" ON public.landing_customization FOR ALL USING (auth.role() = 'authenticated');

-- Insert default customization
INSERT INTO public.landing_customization (section_name, content) VALUES
('hero', '{
    "title": "مستقبل الخدمات",
    "titleGradient": "المالية الرقمية",
    "subtitle": "نحن نعيد تعريف الخدمات المالية الرقمية من خلال تقديم حلول مبتكرة وآمنة ومتطورة تلبي احتياجاتك المالية بكفاءة عالية وموثوقية استثنائية",
    "button1Text": "ابدأ رحلتك معنا",
    "button2Text": "استكشف خدماتنا",
    "badgeText": "منصة رائدة في الخدمات المالية الرقمية",
    "showStats": true,
    "statsData": {
        "clients": "5000+",
        "successRate": "99.9%",
        "support": "24/7",
        "speed": "< 5 دقائق"
    }
}'),
('global_settings', '{
    "primaryColor": "#3b82f6",
    "secondaryColor": "#6366f1",
    "accentColor": "#8b5cf6",
    "fontFamily": "Cairo",
    "borderRadius": "1rem",
    "spacing": "1.5rem"
}');

-- =============================================================================
-- 10. FUNCTIONS AND TRIGGERS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON public.payment_methods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_features_updated_at BEFORE UPDATE ON public.features FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_landing_customization_updated_at BEFORE UPDATE ON public.landing_customization FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 11. VIEWS FOR ANALYTICS
-- =============================================================================

-- View for order statistics
CREATE OR REPLACE VIEW public.order_stats AS
SELECT 
    COUNT(*) as total_orders,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_orders,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_orders,
    COUNT(*) FILTER (WHERE archived = true) as archived_orders,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as today_orders,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as week_orders,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as month_orders
FROM public.orders;

-- View for service popularity
CREATE OR REPLACE VIEW public.service_popularity AS
SELECT 
    s.name,
    s.price,
    COUNT(o.id) as order_count,
    ROUND(COUNT(o.id) * 100.0 / (SELECT COUNT(*) FROM public.orders), 2) as percentage
FROM public.services s
LEFT JOIN public.orders o ON s.name = o.service_name
WHERE s.active = true
GROUP BY s.id, s.name, s.price
ORDER BY order_count DESC;

-- =============================================================================
-- COMPLETION MESSAGE
-- =============================================================================

-- Grant necessary permissions (if using with authentication)
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Database setup completed successfully
SELECT 'KYCtrust database setup completed successfully!' as message;
