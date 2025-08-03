-- ===================================================
-- KYCtrust Database Schema - قاعدة بيانات نظام KYCtrust
-- Complete Database Setup - إعداد كامل لقاعدة البيانات
-- ===================================================

-- Enable necessary extensions
-- تفعيل الامتدادات المطلوبة
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables if they exist (for fresh install)
-- حذف الجداول الموجودة إذا كانت موجودة (للتثبيت الجديد)
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS content_management CASCADE;
DROP TABLE IF EXISTS page_templates CASCADE;
DROP TABLE IF EXISTS backup_logs CASCADE;
DROP TABLE IF EXISTS admin_sessions CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS payment_methods CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS user_permissions CASCADE;
DROP TABLE IF EXISTS system_logs CASCADE;

-- ===================================================
-- Core Tables - الجداول الأساسية
-- ===================================================

-- Categories table - جدول التصنيفات
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    name_ar VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    description_ar TEXT,
    icon VARCHAR(50),
    color VARCHAR(7) DEFAULT '#3B82F6',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Services table - جدول الخدمات
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    name_ar VARCHAR(200) NOT NULL,
    description TEXT,
    description_ar TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    features JSONB DEFAULT '[]',
    requirements JSONB DEFAULT '[]',
    delivery_time VARCHAR(50),
    order_index INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    image_url TEXT,
    icon VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payment Methods table - جدول طرق الدفع
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    name_ar VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'bank', 'wallet', 'crypto', 'card'
    details JSONB NOT NULL DEFAULT '{}',
    instructions TEXT,
    instructions_ar TEXT,
    fees JSONB DEFAULT '{"fixed": 0, "percentage": 0}',
    limits JSONB DEFAULT '{"min": 0, "max": null}',
    icon VARCHAR(50),
    color VARCHAR(7) DEFAULT '#10B981',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    countries JSONB DEFAULT '[]', -- Supported countries
    currencies JSONB DEFAULT '["USD"]',
    processing_time VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders table - جدول الطلبات
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(20) UNIQUE NOT NULL,
    customer_name VARCHAR(200) NOT NULL,
    customer_email VARCHAR(200),
    customer_phone VARCHAR(20),
    customer_country VARCHAR(2),
    service_id UUID REFERENCES services(id) ON DELETE RESTRICT,
    service_name VARCHAR(200) NOT NULL, -- Snapshot for historical data
    service_price DECIMAL(10,2) NOT NULL,
    payment_method_id UUID REFERENCES payment_methods(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'processing', 'completed', 'cancelled', 'refunded'
    priority VARCHAR(10) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    notes TEXT,
    internal_notes TEXT,
    requirements JSONB DEFAULT '{}',
    documents JSONB DEFAULT '[]',
    progress JSONB DEFAULT '{}',
    payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'refunded', 'failed'
    payment_details JSONB DEFAULT '{}',
    assigned_to UUID,
    estimated_completion TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    archived BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Site Settings table - جدول إعدادات الموقع
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    setting_type VARCHAR(20) DEFAULT 'string', -- 'string', 'number', 'boolean', 'json', 'array'
    description TEXT,
    description_ar TEXT,
    is_public BOOLEAN DEFAULT false,
    category VARCHAR(50) DEFAULT 'general',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===================================================
-- User Management - إدارة المستخدمين
-- ===================================================

-- User Permissions table - جدول صلاحيات المستخدمين
CREATE TABLE user_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    permission_key VARCHAR(100) UNIQUE NOT NULL,
    permission_name VARCHAR(200) NOT NULL,
    permission_name_ar VARCHAR(200) NOT NULL,
    description TEXT,
    description_ar TEXT,
    category VARCHAR(50) DEFAULT 'general',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Admin Users table - جدول المستخدمين الإداريين
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin', -- 'super_admin', 'admin', 'editor', 'viewer'
    permissions JSONB DEFAULT '[]',
    avatar_url TEXT,
    phone VARCHAR(20),
    language VARCHAR(5) DEFAULT 'ar',
    timezone VARCHAR(50) DEFAULT 'UTC',
    is_active BOOLEAN DEFAULT true,
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret TEXT,
    last_login TIMESTAMP WITH TIME ZONE,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    password_reset_token TEXT,
    password_reset_expires TIMESTAMP WITH TIME ZONE,
    email_verified BOOLEAN DEFAULT false,
    email_verification_token TEXT,
    preferences JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Admin Sessions table - جدول جلسات المدراء
CREATE TABLE admin_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    device_type VARCHAR(50),
    location JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===================================================
-- Content Management - إدارة المحتوى
-- ===================================================

-- Page Templates table - جدول قوالب الصفحات
CREATE TABLE page_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_name VARCHAR(100) UNIQUE NOT NULL,
    template_name_ar VARCHAR(100) NOT NULL,
    description TEXT,
    description_ar TEXT,
    template_type VARCHAR(50) DEFAULT 'page', -- 'page', 'component', 'section'
    template_data JSONB NOT NULL DEFAULT '{}',
    preview_image TEXT,
    category VARCHAR(50) DEFAULT 'general',
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    usage_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Content Management table - جدول إدارة المحتوى
CREATE TABLE content_management (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_key VARCHAR(100) UNIQUE NOT NULL,
    content_type VARCHAR(50) NOT NULL, -- 'hero', 'about', 'services', 'contact', 'footer', 'navigation'
    title VARCHAR(200),
    title_ar VARCHAR(200),
    content JSONB NOT NULL DEFAULT '{}',
    images JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    seo_data JSONB DEFAULT '{}',
    is_published BOOLEAN DEFAULT true,
    publish_date TIMESTAMP WITH TIME ZONE,
    expire_date TIMESTAMP WITH TIME ZONE,
    version INTEGER DEFAULT 1,
    parent_id UUID REFERENCES content_management(id) ON DELETE SET NULL,
    created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===================================================
-- Analytics & Logging - التحليلات والسجلات
-- ===================================================

-- Analytics Events table - جدول أحداث التحليلات
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL,
    event_category VARCHAR(50) DEFAULT 'general',
    user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    session_id UUID,
    page_url TEXT,
    referrer_url TEXT,
    ip_address INET,
    user_agent TEXT,
    device_info JSONB DEFAULT '{}',
    location_info JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    duration INTEGER, -- in milliseconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- System Logs table - جدول سجلات النظام
CREATE TABLE system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    log_level VARCHAR(20) NOT NULL, -- 'info', 'warning', 'error', 'critical'
    log_category VARCHAR(50) DEFAULT 'system',
    message TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    ip_address INET,
    stack_trace TEXT,
    context JSONB DEFAULT '{}',
    resolved BOOLEAN DEFAULT false,
    resolved_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Backup Logs table - جدول سجلات النسخ الاحتياطية
CREATE TABLE backup_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    backup_type VARCHAR(50) NOT NULL, -- 'full', 'incremental', 'manual'
    backup_name VARCHAR(200) NOT NULL,
    file_path TEXT,
    file_size BIGINT,
    checksum TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
    progress INTEGER DEFAULT 0, -- 0-100
    error_message TEXT,
    started_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    tables_included JSONB DEFAULT '[]',
    compression_type VARCHAR(20) DEFAULT 'gzip',
    retention_days INTEGER DEFAULT 30,
    metadata JSONB DEFAULT '{}',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- ===================================================
-- Indexes for Performance - الفهارس لتحسين الأداء
-- ===================================================

-- Categories indexes
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- Services indexes
CREATE INDEX idx_services_active ON services(active);
CREATE INDEX idx_services_featured ON services(featured);
CREATE INDEX idx_services_category ON services(category_id);
CREATE INDEX idx_services_order ON services(order_index);
CREATE INDEX idx_services_price ON services(price);

-- Payment Methods indexes
CREATE INDEX idx_payment_methods_active ON payment_methods(is_active);
CREATE INDEX idx_payment_methods_type ON payment_methods(type);
CREATE INDEX idx_payment_methods_order ON payment_methods(sort_order);

-- Orders indexes
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_priority ON orders(priority);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_service ON orders(service_id);
CREATE INDEX idx_orders_payment_method ON orders(payment_method_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_archived ON orders(archived);

-- Site Settings indexes
CREATE INDEX idx_site_settings_key ON site_settings(setting_key);
CREATE INDEX idx_site_settings_category ON site_settings(category);
CREATE INDEX idx_site_settings_public ON site_settings(is_public);

-- Admin Users indexes
CREATE INDEX idx_admin_users_username ON admin_users(username);
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_admin_users_active ON admin_users(is_active);

-- Admin Sessions indexes
CREATE INDEX idx_admin_sessions_user ON admin_sessions(user_id);
CREATE INDEX idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX idx_admin_sessions_active ON admin_sessions(is_active);
CREATE INDEX idx_admin_sessions_expires ON admin_sessions(expires_at);

-- Content Management indexes
CREATE INDEX idx_content_key ON content_management(content_key);
CREATE INDEX idx_content_type ON content_management(content_type);
CREATE INDEX idx_content_published ON content_management(is_published);
CREATE INDEX idx_content_created_by ON content_management(created_by);

-- Analytics indexes
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_category ON analytics_events(event_category);

-- System Logs indexes
CREATE INDEX idx_system_logs_level ON system_logs(log_level);
CREATE INDEX idx_system_logs_category ON system_logs(log_category);
CREATE INDEX idx_system_logs_created_at ON system_logs(created_at);
CREATE INDEX idx_system_logs_resolved ON system_logs(resolved);

-- ===================================================
-- Functions and Triggers - الدوال والمحفزات
-- ===================================================

-- Function to update the updated_at column
-- دالة لتحديث عمود التحديث
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
-- إنشاء محفزات لعمود التحديث
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_management_updated_at BEFORE UPDATE ON content_management FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_page_templates_updated_at BEFORE UPDATE ON page_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order numbers
-- دالة لتوليد أرقام الطلبات
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number = 'KYC' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(NEXTVAL('order_number_seq')::text, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
-- إنشاء تسلسل لأرقام الطلبات
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- Create trigger for order number generation
-- إنشاء محفز لتوليد رقم الطلب
CREATE TRIGGER generate_order_number_trigger
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_order_number();

-- ===================================================
-- Row Level Security (RLS) - أمان مستوى الصف
-- ===================================================

-- Enable RLS on sensitive tables
-- تفعيل أمان مستوى الصف على الجداول الحساسة
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_logs ENABLE ROW LEVEL SECURITY;

-- ===================================================
-- Initial Data - البيانات الأولية
-- ===================================================

-- Insert default user permissions
-- إدراج الصلاحيات الافتراضية للمستخدمين
INSERT INTO user_permissions (permission_key, permission_name, permission_name_ar, description, description_ar, category) VALUES
('users.view', 'View Users', 'عرض المستخدمين', 'Can view user list and details', 'يمكن عرض قائمة المستخدمين والتفاصيل', 'users'),
('users.create', 'Create Users', 'إنشاء مستخدمين', 'Can create new users', 'يمكن إنشاء مستخدمين جدد', 'users'),
('users.edit', 'Edit Users', 'تعديل المستخدمين', 'Can edit existing users', 'يمكن تعديل المستخدمين الموجودين', 'users'),
('users.delete', 'Delete Users', 'حذف المستخدمين', 'Can delete users', 'يمكن حذف المستخدمين', 'users'),
('orders.view', 'View Orders', 'عرض الطلبات', 'Can view orders', 'يمكن عرض الطلبات', 'orders'),
('orders.create', 'Create Orders', 'إنشاء طلبات', 'Can create new orders', 'يمكن إنشاء طلبات جديدة', 'orders'),
('orders.edit', 'Edit Orders', 'تعديل الطلبات', 'Can edit existing orders', 'يمكن تعديل الطلبات الموجودة', 'orders'),
('orders.delete', 'Delete Orders', 'حذف الطلبات', 'Can delete orders', 'يمكن حذف الطلبات', 'orders'),
('services.view', 'View Services', 'عرض الخدمات', 'Can view services', 'يمكن عرض الخدمات', 'services'),
('services.create', 'Create Services', 'إنشاء خدمات', 'Can create new services', 'يمكن إنشاء خدمات جديدة', 'services'),
('services.edit', 'Edit Services', 'تعديل الخدمات', 'Can edit existing services', 'يمكن تعديل الخدمات الموجودة', 'services'),
('services.delete', 'Delete Services', 'حذف الخدمات', 'Can delete services', 'يمكن حذف الخدمات', 'services'),
('content.view', 'View Content', 'عرض المحتوى', 'Can view content', 'يمكن عرض المحتوى', 'content'),
('content.create', 'Create Content', 'إنشاء محتوى', 'Can create new content', 'يمكن إنشاء محتوى جديد', 'content'),
('content.edit', 'Edit Content', 'تعديل المحتوى', 'Can edit existing content', 'يمكن تعديل المحتوى الموجود', 'content'),
('content.delete', 'Delete Content', 'حذف المحتوى', 'Can delete content', 'يمكن حذف المحتوى', 'content'),
('settings.view', 'View Settings', 'عرض الإعدادات', 'Can view system settings', 'يمكن عرض إعدادات النظام', 'settings'),
('settings.edit', 'Edit Settings', 'تعديل الإعدادات', 'Can edit system settings', 'يمكن تعديل إعدادات النظام', 'settings'),
('analytics.view', 'View Analytics', 'عرض التحليلات', 'Can view analytics and reports', 'يمكن عرض التحليلات والتقارير', 'analytics'),
('backup.create', 'Create Backups', 'إنشاء نسخ احتياطية', 'Can create system backups', 'يمكن إنشاء نسخ احتياطية للنظام', 'backup'),
('backup.restore', 'Restore Backups', 'استعادة النسخ الاحتياطية', 'Can restore system from backups', 'يمكن استعادة النظام من النسخ الاحتياطية', 'backup');

-- Insert default categories
-- إدراج التصنيفات الافتراضية
INSERT INTO categories (name, name_ar, slug, description, description_ar, icon, color, sort_order) VALUES
('Digital Services', 'الخدمات الرقمية', 'digital-services', 'Digital and online services', 'الخدمات الرقمية وا��إلكترونية', 'laptop', '#3B82F6', 1),
('Financial Services', 'الخدمات المالية', 'financial-services', 'Banking and financial services', 'الخدمات المصرفية والمالية', 'credit-card', '#10B981', 2),
('Documentation', 'التوثيق', 'documentation', 'Document and certificate services', 'خدمات التوثيق والشهادات', 'file-text', '#8B5CF6', 3),
('Business Services', 'الخدمات التجارية', 'business-services', 'Business and corporate services', 'الخدمات التجارية والشركات', 'briefcase', '#F59E0B', 4),
('Legal Services', 'الخدمات القانونية', 'legal-services', 'Legal and consulting services', 'الخدمات القانونية والاستشارية', 'scale', '#EF4444', 5);

-- Insert default payment methods
-- إدراج طرق الدفع الافتراضية
INSERT INTO payment_methods (name, name_ar, type, details, instructions, instructions_ar, icon, color, sort_order) VALUES
('Bank Transfer', 'تحويل بنكي', 'bank', '{"bank_name": "Example Bank", "account_number": "123456789", "swift": "EXMPUS33"}', 'Please use the provided bank details for transfer', 'يرجى استخدام التفاصيل المصرفية المقدمة للتحويل', 'bank', '#1F2937', 1),
('PayPal', 'باي ب��ل', 'wallet', '{"email": "payments@kyctrust.com"}', 'Send payment to our PayPal account', 'أرسل الدفعة إلى حساب باي بال الخاص بنا', 'paypal', '#0070BA', 2),
('Cryptocurrency', 'العملة المشفرة', 'crypto', '{"bitcoin": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", "ethereum": "0x742d35Cc6639C0532fBb3AA025F12345678"}', 'Send cryptocurrency to the provided wallet address', 'أرسل العملة المشفرة إلى عنوان المحفظة المقدم', 'bitcoin', '#F7931A', 3),
('Credit Card', 'بطاقة ائتمان', 'card', '{"processor": "stripe", "supported_cards": ["visa", "mastercard", "amex"]}', 'We accept major credit cards', 'نقبل البطاقات الائتمانية الرئيسية', 'credit-card', '#6366F1', 4);

-- Insert default site settings
-- إدراج إعدادات الموقع الافتراضية
INSERT INTO site_settings (setting_key, setting_value, setting_type, description, description_ar, is_public, category) VALUES
('site_title', '"KYCtrust - Digital Financial Services"', 'string', 'Website title', 'عنوان الموقع', true, 'general'),
('site_description', '"Professional digital financial services and KYC solutions"', 'string', 'Website description', 'وصف الموقع', true, 'general'),
('contact_email', '"info@kyctrust.com"', 'string', 'Main contact email', 'البريد الإلكتروني للتواصل', true, 'contact'),
('contact_phone', '"+1234567890"', 'string', 'Main contact phone', 'رقم الهاتف للتواصل', true, 'contact'),
('whatsapp_number', '"+1234567890"', 'string', 'WhatsApp contact number', 'رقم واتساب للتواصل', true, 'contact'),
('business_hours', '{"monday": "9:00-17:00", "tuesday": "9:00-17:00", "wednesday": "9:00-17:00", "thursday": "9:00-17:00", "friday": "9:00-17:00", "saturday": "closed", "sunday": "closed"}', 'json', 'Business operating hours', 'ساعات العمل', true, 'general'),
('supported_languages', '["en", "ar"]', 'array', 'Supported website languages', 'اللغات المدعومة للموقع', true, 'general'),
('default_language', '"ar"', 'string', 'Default website language', 'اللغة الافتراضية للموقع', true, 'general'),
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode', 'تفعيل وضع الصيانة', false, 'system'),
('max_order_processing_days', '7', 'number', 'Maximum days for order processing', 'الحد الأقصى لأيام معالجة الطلب', false, 'orders'),
('email_notifications', 'true', 'boolean', 'Enable email notifications', 'تفعيل إشع��رات البريد الإلكتروني', false, 'notifications'),
('sms_notifications', 'false', 'boolean', 'Enable SMS notifications', 'تفعيل إشعارات الرسائل النصية', false, 'notifications'),
('backup_retention_days', '30', 'number', 'Days to keep backups', 'أيام الاحتفاظ بالنسخ الاحتياطية', false, 'backup'),
('session_timeout_minutes', '120', 'number', 'Admin session timeout in minutes', 'انتهاء جلسة الإدارة بالدقائق', false, 'security'),
('max_login_attempts', '5', 'number', 'Maximum login attempts before lockout', 'الحد الأقصى لمحاولات تسجيل الدخول', false, 'security');

-- Insert default content
-- إدراج المحتوى الافتراضي
INSERT INTO content_management (content_key, content_type, title, title_ar, content, seo_data) VALUES
('hero_section', 'hero', 'Professional Digital Financial Services', 'خدمات مالية رقمية احترافية', 
'{"heading": "KYCtrust - Digital Financial Services", "heading_ar": "KYCtrust - خدمات مالية رقمية", "subheading": "Professional KYC, AML, and digital financial solutions", "subheading_ar": "حلول احترافية لتحقق الهوية ومكافحة غسل الأموال والخدمات المالية الر��مية", "cta_text": "Get Started", "cta_text_ar": "ابدأ الآن", "background_image": "/images/hero-bg.jpg"}',
'{"title": "Professional Digital Financial Services - KYCtrust", "description": "Leading provider of KYC, AML and digital financial solutions", "keywords": ["KYC", "AML", "digital finance", "compliance", "financial services"]}'),

('about_section', 'about', 'About KYCtrust', 'حول KYCtrust',
'{"heading": "About Our Company", "heading_ar": "حول شركتنا", "description": "We are a leading provider of digital financial services, specializing in KYC, AML compliance, and innovative financial solutions.", "description_ar": "نحن مقدم رائد للخدمات المالية الرقمية، متخصصون في تحقق الهوية ومكافحة غسل الأموال والحلول المالية المبتكرة.", "features": ["Professional KYC Services", "AML Compliance", "24/7 Support", "Global Coverage"], "features_ar": ["خدمات تحقق هوية احترافية", "امتثال مكافحة غسل الأموال", "دعم على مدار الساعة", "تغطية عالمية"]}',
'{"title": "About KYCtrust - Digital Financial Services", "description": "Learn about our professional digital financial services and KYC solutions"}'),

('contact_section', 'contact', 'Contact Us', 'اتصل بنا',
'{"heading": "Get in Touch", "heading_ar": "تواصل معنا", "description": "Ready to get started? Contact us for professional digital financial services.", "description_ar": "مستعد للبدء؟ اتصل بنا للحصول على خدمات مالية رقمية احترافية.", "email": "info@kyctrust.com", "phone": "+1234567890", "whatsapp": "+1234567890", "address": "Professional Business Center", "address_ar": "مركز الأعمال المهني"}',
'{"title": "Contact KYCtrust - Professional Financial Services", "description": "Contact us for professional digital financial services and KYC solutions"}'),

('footer_content', 'footer', 'Footer Information', 'معلومات التذييل',
'{"company_name": "KYCtrust", "copyright": "2024 KYCtrust. All rights reserved.", "copyright_ar": "2024 KYCtrust. جميع الحقوق محفوظة.", "description": "Professional digital financial services provider", "description_ar": "مقدم خدمات مالية رقمية احترافي", "social_links": {"facebook": "#", "twitter": "#", "linkedin": "#", "instagram": "#"}, "quick_links": [{"text": "Services", "text_ar": "الخدم��ت", "url": "#services"}, {"text": "About", "text_ar": "حول", "url": "#about"}, {"text": "Contact", "text_ar": "اتصل", "url": "#contact"}]}',
'{}');

-- Create default super admin user (password: admin123)
-- إنشاء مستخدم مدير عام افتراضي (كلمة المرور: admin123)
INSERT INTO admin_users (username, email, password_hash, full_name, role, permissions, is_active, email_verified) VALUES
('admin', 'admin@kyctrust.com', '$2b$12$LQv3c1yqBwLFaAY9qOhE7eM6VNglnKv5K3v0Y9K3v0Y9K3v0Y9K3v0', 'System Administrator', 'super_admin', 
'["users.view", "users.create", "users.edit", "users.delete", "orders.view", "orders.create", "orders.edit", "orders.delete", "services.view", "services.create", "services.edit", "services.delete", "content.view", "content.create", "content.edit", "content.delete", "settings.view", "settings.edit", "analytics.view", "backup.create", "backup.restore"]', 
true, true);

-- ===================================================
-- Views for Complex Queries - المناظر للاستعلامات المعقدة
-- ===================================================

-- Order Summary View
-- منظر ملخص الطلبات
CREATE VIEW order_summary AS
SELECT 
    o.id,
    o.order_number,
    o.customer_name,
    o.customer_email,
    o.service_name,
    o.service_price,
    o.status,
    o.priority,
    o.payment_status,
    o.created_at,
    o.updated_at,
    s.name as current_service_name,
    s.category_id,
    c.name as category_name,
    pm.name as payment_method_name,
    pm.type as payment_method_type
FROM orders o
LEFT JOIN services s ON o.service_id = s.id
LEFT JOIN categories c ON s.category_id = c.id
LEFT JOIN payment_methods pm ON o.payment_method_id = pm.id;

-- Service Statistics View
-- منظر إحصائيات الخدمات
CREATE VIEW service_statistics AS
SELECT 
    s.id,
    s.name,
    s.category_id,
    c.name as category_name,
    s.price,
    s.active,
    COUNT(o.id) as total_orders,
    COUNT(CASE WHEN o.status = 'completed' THEN 1 END) as completed_orders,
    COUNT(CASE WHEN o.status = 'pending' THEN 1 END) as pending_orders,
    SUM(CASE WHEN o.status = 'completed' THEN o.service_price ELSE 0 END) as total_revenue,
    AVG(CASE WHEN o.status = 'completed' THEN o.service_price END) as avg_order_value
FROM services s
LEFT JOIN categories c ON s.category_id = c.id
LEFT JOIN orders o ON s.id = o.service_id
GROUP BY s.id, s.name, s.category_id, c.name, s.price, s.active;

-- User Activity View
-- منظر نشاط المستخدمين
CREATE VIEW user_activity AS
SELECT 
    u.id,
    u.username,
    u.full_name,
    u.role,
    u.last_login,
    COUNT(s.id) as active_sessions,
    COUNT(ae.id) as total_events,
    COUNT(CASE WHEN ae.created_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as events_today
FROM admin_users u
LEFT JOIN admin_sessions s ON u.id = s.user_id AND s.is_active = true
LEFT JOIN analytics_events ae ON u.id = ae.user_id
GROUP BY u.id, u.username, u.full_name, u.role, u.last_login;

-- ===================================================
-- Completion Message
-- ===================================================

-- Database schema creation completed successfully!
-- تم إنشاء مخطط قاعدة البيانات بنجاح!

COMMENT ON DATABASE CURRENT_DATABASE() IS 'KYCtrust Complete Database Schema - قاعدة بيانات KYCtrust الكاملة';
