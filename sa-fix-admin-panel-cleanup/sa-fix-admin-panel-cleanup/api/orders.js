import { createApiHandler, handleGet, handlePost, handlePut, handleDelete } from '../_lib/helpers';

export default createApiHandler({
  GET: (req, res) => handleGet(req, res, 'orders'),
  POST: (req, res) => handlePost(req, res, 'orders', { body: req.body }),
  PUT: (req, res) => handlePut(req, res, 'orders', { body: req.body }),
  DELETE: (req, res) => handleDelete(req, res, 'orders'),
});
