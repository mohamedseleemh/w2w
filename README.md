# KYCtrust Platform

**KYCtrust - Digital Financial Services Platform with Visual Page Builder**

A comprehensive platform for digital financial services with an advanced admin panel and visual page builder. Built with React, TypeScript, and Supabase.

## ✨ Features

- 🎨 **Visual Page Builder** - Drag & drop interface for creating custom landing pages
- 🛠️ **Admin Panel** - Complete management system for services, orders, and site settings
- 📱 **Responsive Design** - Works perfectly on all devices
- 🔒 **Secure** - No user registration system, manual order processing only
- 🌍 **Multi-language** - Arabic and English support
- 📊 **Analytics** - Basic analytics and reporting
- 🎭 **Themes** - Multiple themes and customization options
- 🚀 **Fast** - Built with modern technologies for optimal performance

## 🚫 What's NOT Included (As Per Requirements)

- ❌ User registration/login system
- ❌ Automatic payment processing
- ❌ User accounts or profiles
- ❌ Automated billing

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Package Manager**: npm/yarn/pnpm
- **UI Components**: Lucide React Icons
- **Drag & Drop**: React DnD
- **State Management**: React Context
- **Forms**: React Hook Form + Zod

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account (optional - fallback to local storage)
- Git

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kyctrust-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Database (Optional - uses local storage as fallback)
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Admin Settings
   ADMIN_PASSWORD=your_admin_password
   
   # App Settings
   VITE_APP_NAME=KYCtrust
   VITE_WHATSAPP_NUMBER=+966501234567
   ```

4. **Database Setup (Optional)**
   
   If using Supabase:
   ```bash
   # Run in your Supabase SQL editor
   # 1. Execute database/simplified-schema.sql
   # 2. Execute database/simplified-seed.sql
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Build for Production**
   ```bash
   npm run build
   ```

## 🗄️ Database Schema

The platform uses a simplified database schema without user registration:

### Core Tables
- `site_settings` - Website configuration
- `services` - Available services
- `payment_methods` - Manual payment methods
- `orders` - Customer orders (manual processing)
- `page_templates` - Visual page builder templates
- `themes` - Page builder themes
- `testimonials` - Customer testimonials
- `faqs` - Frequently asked questions
- `analytics_events` - Basic analytics

### Setup Commands
```bash
# Option 1: Use provided scripts
npm run db:setup

# Option 2: Manual setup
# Execute database/simplified-schema.sql in your database
# Execute database/simplified-seed.sql in your database
```

## 🎨 Visual Page Builder

The platform includes a powerful drag-and-drop page builder with:

- **Pre-built Components**: Hero, Services, Features, Testimonials, Stats, CTA
- **Theme System**: Multiple themes with color/font customization
- **Responsive Preview**: Desktop, tablet, and mobile previews
- **Style Editor**: Advanced styling options for each component
- **Template Management**: Save and reuse page templates

### Usage
1. Access admin panel at `/admin`
2. Use default password or set in environment
3. Navigate to "منشئ الصفحات" (Page Builder)
4. Drag components from library to canvas
5. Customize styles and content
6. Save as template

## 🛡️ Admin Panel

Comprehensive admin interface with:

- **Dashboard** - Overview and statistics
- **Services Management** - Add/edit/delete services
- **Orders Management** - View and process orders
- **Payment Methods** - Manage payment options
- **Site Settings** - Configure website
- **Page Builder** - Visual page editor
- **Analytics** - Basic reporting

### Access
- URL: `/admin`
- Password: Set in environment variables

## 🚀 Deployment

### Vercel (Recommended)

1. **Automatic Deployment**
   ```bash
   npm run deploy
   ```

2. **Manual Deployment**
   - Connect repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy

### Environment Variables for Production
```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
ADMIN_PASSWORD=your_secure_admin_password
VITE_WHATSAPP_NUMBER=your_whatsapp_number
```

## 📱 API Endpoints

The platform includes RESTful API endpoints:

- `GET/POST/PUT/DELETE /api/services` - Services management
- `GET/POST/PUT/DELETE /api/orders` - Orders management  
- `GET/POST/PUT/DELETE /api/payment-methods` - Payment methods
- `GET/PUT /api/site-settings` - Site configuration
- `GET/POST/PUT/DELETE /api/page-templates` - Page templates
- `GET/POST/PUT/DELETE /api/themes` - Themes management

## 🔧 Configuration

### Site Settings
Configure via admin panel or environment variables:
- Site title and description
- WhatsApp contact number
- Theme colors
- Meta tags for SEO

### Features Flags
Enable/disable features via environment:
```env
FEATURE_PAGE_BUILDER=true
FEATURE_ANALYTICS=true
FEATURE_BACKUP=true
FEATURE_WHATSAPP_INTEGRATION=true
FEATURE_PAYMENT_PROCESSING=false  # Always false
FEATURE_USER_REGISTRATION=false   # Always false
```

## 📞 Support & Contact

- **WhatsApp**: Set in environment variables
- **Issues**: Create issue in repository
- **Documentation**: See `/docs` folder

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 Notes

- No user registration system by design
- All orders processed manually via WhatsApp
- Supabase is optional - uses local storage fallback
- Admin panel protected by simple password authentication
- All payments handled manually (no automatic processing)

---

**KYCtrust Platform** - Built for secure, manual financial services management.
