import { supabase } from '../_lib/supabase';
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { setupKey } = req.body;

    if (setupKey !== process.env.SETUP_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const schemaSql = await fs.readFile(path.join(process.cwd(), 'database', 'schema.sql'), 'utf-8');
    const seedSql = await fs.readFile(path.join(process.cwd(), 'database', 'seed.sql'), 'utf-8');

    const { error: schemaError } = await supabase.rpc('exec_sql', { sql: schemaSql });
    if (schemaError) {
      console.error('Error creating schema:', schemaError);
      return res.status(500).json({ error: 'Failed to create schema' });
    }

    const { error: seedError } = await supabase.rpc('exec_sql', { sql: seedSql });
    if (seedError) {
      console.error('Error seeding data:', seedError);
      return res.status(500).json({ error: 'Failed to seed data' });
    }

    res.status(200).json({
      success: true,
      message: 'Database setup completed successfully',
    });

  } catch (error) {
    console.error('Database setup error:', error);
    res.status(500).json({
      error: 'Database setup failed',
      details: error.message,
    });
  }
}
