import { createApiHandler, handleGet, handlePost, handlePut, handleDelete } from '../_lib/helpers';

export default createApiHandler({
  GET: (req, res) => handleGet(req, res, 'page_templates'),
  POST: (req, res) => handlePost(req, res, 'page_templates', { body: req.body }),
  PUT: (req, res) => handlePut(req, res, 'page_templates', { body: req.body }),
  DELETE: (req, res) => handleDelete(req, res, 'page_templates'),
});
