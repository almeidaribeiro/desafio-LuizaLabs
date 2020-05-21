const Joi = require('@hapi/joi')
const {productsSchema} = require('./schema')

const productValidator = async (req, res, next) => {
    const {error} = productsSchema.validate(req.body, {abortEarly: false});
    if (error) return res.status(400).json({error});
    next();
};

module.exports = productValidator;
