import { createApiHandler, handleGet, handlePost, handlePut, handleDelete } from '../_lib/helpers';
import { supabase } from '../_lib/supabase';

async function handlePostOrPut(req, res) {
    const { section_name, content } = req.body;

    if (!section_name || !content) {
        return res.status(400).json({ error: 'Section name and content are required' });
    }

    const { data: existing } = await supabase
        .from('landing_customization')
        .select('id')
        .eq('section_name', section_name)
        .eq('active', true)
        .single();

    if (existing) {
        return handlePut(req, res, 'landing_customization', { body: { content } });
    } else {
        return handlePost(req, res, 'landing_customization', { body: { section_name, content, active: true } });
    }
}


export default createApiHandler({
  GET: (req, res) => handleGet(req, res, 'landing_customization', {
      queryer: (query, req) => {
          if (req.query.section_name) {
              return query.eq('section_name', req.query.section_name);
          }
          return query;
      }
   }),
  POST: handlePostOrPut,
  PUT: handlePostOrPut,
  DELETE: (req, res) => handleDelete(req, res, 'landing_customization'),
});
