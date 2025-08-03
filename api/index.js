export default function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      message: 'KYCtrust Platform API',
      version: '2.0.0',
      status: 'active',
      timestamp: new Date().toISOString(),
      endpoints: {
        services: '/api/services',
        orders: '/api/orders',
        paymentMethods: '/api/payment-methods',
        siteSettings: '/api/site-settings',
        pageTemplates: '/api/page-templates',
        themes: '/api/themes',
        supabaseConfig: '/api/get-supabase-config',
        setupDatabase: '/api/setup-database'
      },
      features: {
        visualPageBuilder: true,
        themesSystem: true,
        adminPanel: true,
        apiIntegration: true,
        supabaseIntegration: true,
        responsiveDesign: true
      }
    });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
