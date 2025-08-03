import { createApiHandler, handleGet, handlePost, handlePut } from '../_lib/helpers';

export default createApiHandler({
  GET: (req, res) => handleGet(req, res, 'site_settings'),
  POST: (req, res) => handlePost(req, res, 'site_settings', { body: req.body }),
  PUT: (req, res) => handlePut(req, res, 'site_settings', { body: req.body }),
});
