import { createApiHandler, handleGet, handlePost, handlePut, handleDelete } from '../_lib/helpers';

export default createApiHandler({
  GET: (req, res) => handleGet(req, res, 'services'),
  POST: (req, res) => handlePost(req, res, 'services', { body: req.body }),
  PUT: (req, res) => handlePut(req, res, 'services', { body: req.body }),
  DELETE: (req, res) => handleDelete(req, res, 'services'),
});
