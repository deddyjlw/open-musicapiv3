const Joi = require('joi');

const PictureHeadersSchema = Joi.object({
  'content-type': Joi.string().valid('image/jpeg', 'image/png').required(),
}).unknown();

module.exports = { PictureHeadersSchema };
