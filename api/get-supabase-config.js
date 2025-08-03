export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check for environment variables
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return res.status(200).json({
        configured: false,
        message: 'Supabase not configured - using local storage fallback',
        instructions: {
          step1: 'Create a Supabase project at https://supabase.com',
          step2: 'Copy your project URL and anon key',
          step3: 'Set environment variables in Vercel dashboard',
          step4: 'Redeploy the application'
        }
      });
    }

    // Check if the credentials are placeholder values
    if (supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon-key')) {
      return res.status(200).json({
        configured: false,
        message: 'Supabase credentials are placeholder values',
        supabaseUrl: supabaseUrl.includes('your-project') ? null : supabaseUrl,
        needsConfiguration: true
      });
    }

    res.status(200).json({
      configured: true,
      supabaseUrl,
      message: 'Supabase is properly configured',
      setupEndpoint: '/api/setup-database'
    });

  } catch (error) {
    console.error('Config check error:', error);
    res.status(500).json({ 
      error: 'Failed to check configuration',
      details: error.message 
    });
  }
}
