const Joi = require('@hapi/joi')

const productsSchema = Joi
    .object()
    .keys({
        product_id: Joi.string().length(36).required()
    }).unknown()

const productsIdSchema = Joi 
    .object()
    .keys({
        user_id: Joi.number().required()
    }).unknown()

const usersIdSchema = Joi
    .object()
    .keys({ 
        user_id: Joi.number().required()
    }).unknown()

const usersEmailSchema = Joi
    .object()
    .keys({
        email: Joi.string().email().required()
    })

const usersSchema = Joi
    .object()
    .keys({ 
        name: Joi.string().alphanum().required(),
        email: Joi.string().email(),  
        favorite_products: Joi.array().items(productsSchema).optional()
        })

module.exports = {
    usersIdSchema,
    usersEmailSchema,
    usersSchema,
    productsIdSchema, 
    productsSchema,   
}
