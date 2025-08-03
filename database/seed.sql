-- Default services
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
('شحن رصيد فودافون', '100 جنيه = 120 جنيه (متاح أي مبلغ)', 15, true),
('سحب من TikTok', 'حسب الاتفاق', 16, true),
('سحب من PayPal', 'حسب الاتفاق', 17, true);

-- Default payment methods
INSERT INTO payment_methods (name, details, active) VALUES
('Vodafone Cash', '01062453344', true),
('USDT (TRC20)', 'TFUt8GRpk2R8Wv3FvoCiSUghRBQo4HrmQK', true);

-- Default site settings
INSERT INTO site_settings (title, description, order_notice) VALUES
('KYCtrust - خدمات مالية رقمية موثوقة', 'نقدم خدمات مالية رقمية احترافية وآمنة لجميع المنصات العالمية مع ضمان الجودة والموثوقية', 'سيتم التواصل معك يدويًا عبر واتساب بعد إرسال الطلب.');

-- Default admin user
INSERT INTO admin_users (email, password_hash) VALUES
('admin@kyctrust.com', '$2b$10$f.gZ3.kY4.L9QJ8Z.pX.d.8Xz.zY8.Z5M/7.w.E/6.N/9.O/8.Q');
