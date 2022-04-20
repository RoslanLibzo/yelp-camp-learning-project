const BaseJoi = require('@hapi/joi')
const sanitizeHtml = require('sanitize-html')
const extension = (joi) => ({
  type:'string',
  base: joi.string(),
  messages: {
    'string.escapeHTML': '{{#label}} must not include HTML!'
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},

        });
        if (clean !== value) return helpers.error('string.escapeHTML', {value})
        return clean;
      }
    }
  }
});

const Joi = BaseJoi.extend(extension)

  module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
    title: Joi.string().required().min(6).max(90).escapeHTML(),
    price: Joi.number().required().min(0).max(999),
    description: Joi.string().required().escapeHTML().max(150).min(15),
    location: Joi.string().required().min(3).max(80).escapeHTML(),
    // image: Joi.string()
    }).required(),
    deleteImages: Joi.array()
  })

  module.exports.reviewSchema = Joi.object({
    review: Joi.object({
    body: Joi.string().required().escapeHTML().min(4).max(800),
    rating: Joi.number().required().min(1).max(5),
    }).required()
    
  })