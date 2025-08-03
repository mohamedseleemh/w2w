import { createApiHandler, handleGet, handlePost, handlePut, handleDelete } from '../_lib/helpers';

export default createApiHandler({
  GET: (req, res) => handleGet(req, res, 'themes'),
  POST: (req, res) => handlePost(req, res, 'themes', { body: req.body }),
  PUT: (req, res) => handlePut(req, res, 'themes', { body: req.body }),
  DELETE: (req, res) => handleDelete(req, res, 'themes'),
});
