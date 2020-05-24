const Joi = require('@hapi/joi')
const {productsSchema, productsIdSchema} = require('./schema')

const productsValidator = async (req, res, next) => {
    const {error} = productsSchema.validate(req.body, {abortEarly: false});
    if (error) return res.status(400).json({error});
    next();
};

const productsPathValidator = async (req, res, next) => {
    const {error} = productsIdSchema.validate(req.params, {abortEarly: false});
    if (error) return res.status(400).json({error});
    next();
};

module.exports = {
    productsValidator,
    productsPathValidator,    
}
