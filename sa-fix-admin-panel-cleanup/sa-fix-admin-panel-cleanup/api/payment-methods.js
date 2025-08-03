import { createApiHandler, handleGet, handlePost, handlePut, handleDelete } from '../_lib/helpers';

export default createApiHandler({
  GET: (req, res) => handleGet(req, res, 'payment_methods'),
  POST: (req, res) => handlePost(req, res, 'payment_methods', { body: req.body }),
  PUT: (req, res) => handlePut(req, res, 'payment_methods', { body: req.body }),
  DELETE: (req, res) => handleDelete(req, res, 'payment_methods'),
});
