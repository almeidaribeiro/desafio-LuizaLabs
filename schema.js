const Joi = require('@hapi/joi')

const usersSchema = Joi
    .object()
    .keys({ 
        id: Joi
            .number(),  //tirar o id depois q gerar o token de auth     
        name: Joi
            .string()
            .required(),

        email: Joi
            .string()
            .email()
            .required(),

        favorite_products: Joi
            .array()
            // .items(productsSchema)
    })



module.exports = usersSchema;
    