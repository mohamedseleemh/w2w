import { supabase } from './supabase';

export function withCORS(handler) {
  return async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    return handler(req, res);
  };
}

export function withErrorHandler(handler) {
  return async (req, res) => {
    try {
      return await handler(req, res);
    } catch (error) {
      console.error('API Error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: error.message,
      });
    }
  };
}

export function withMethodGuard(methods, handler) {
  return async (req, res) => {
    if (!methods.includes(req.method)) {
      res.setHeader('Allow', methods.join(', '));
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
    return handler(req, res);
  };
}

export function createApiHandler(handlers) {
  return withCORS(withErrorHandler(async (req, res) => {
    const handler = handlers[req.method];
    if (handler) {
      return handler(req, res);
    }
    res.setHeader('Allow', Object.keys(handlers).join(', '));
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }));
}

export async function handleGet(req, res, tableName, { queryer } = {}) {
  let query = supabase.from(tableName).select('*');
  if (queryer) {
    query = queryer(query, req);
  }
  const { data, error } = await query;

  if (error) {
    console.error(`Error fetching ${tableName}:`, error);
    return res.status(500).json({ error: `Failed to fetch ${tableName}` });
  }

  return res.status(200).json({ [tableName]: data || [] });
}

export async function handlePost(req, res, tableName, { body, defaultValues } = {}) {
    const insertData = { ...defaultValues, ...body };
    const { data, error } = await supabase
        .from(tableName)
        .insert(insertData)
        .select()
        .single();

    if (error) {
        console.error(`Error creating ${tableName}:`, error);
        return res.status(500).json({ error: `Failed to create ${tableName}` });
    }

    return res.status(201).json({
        message: `${tableName} created successfully`,
        [tableName.slice(0, -1)]: data,
    });
}

export async function handlePut(req, res, tableName, { body }) {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: `${tableName} ID is required` });
    }

    const { data, error } = await supabase
        .from(tableName)
        .update(body)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error(`Error updating ${tableName}:`, error);
        return res.status(500).json({ error: `Failed to update ${tableName}` });
    }

    if (!data) {
        return res.status(404).json({ error: `${tableName} not found` });
    }

    return res.status(200).json({
        message: `${tableName} updated successfully`,
        [tableName.slice(0, -1)]: data,
    });
}

export async function handleDelete(req, res, tableName) {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: `${tableName} ID is required` });
    }

    const { data, error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

    if (error) {
        console.error(`Error deleting ${tableName}:`, error);
        return res.status(500).json({ error: `Failed to delete ${tableName}` });
    }

    return res.status(200).json({
        message: `${tableName} deleted successfully`,
    });
}
