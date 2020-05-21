const Joi = require('@hapi/joi')

const productsSchema = Joi
    .object()
    .keys({
        id: Joi.string().length(36).required()
    }).unknown()

const productsIdSchema = Joi 
    .object()
    .keys({
        id: Joi.number().required()
    }).unknown()

const usersIdSchema = Joi
    .object()
    .keys({ 
        id: Joi.number().required()
    }).unknown()

const usersEmailSchema = Joi
    .object()
    .keys({
        email: Joi.string().email().required()
    })

const usersSchema = Joi
    .object()
    .keys({ 
        id: Joi.number().greater(0),  //tirar o id depois q gerar o token de auth     
        name: Joi.string().alphanum().required(),

        email: Joi.string().email().required(),  
        
        favorite_products: Joi.array().items(productsSchema).optional()
        })

module.exports = {
    usersIdSchema,
    usersEmailSchema,
    usersSchema,
    productsIdSchema, 
    productsSchema,   
}
