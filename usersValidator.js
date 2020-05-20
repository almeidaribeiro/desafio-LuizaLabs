// const Joi = require('@hapi/joi')
const usersSchema = require('./schema')

const userValidator = (req, res, next) => {
    const {error} = usersSchema.validate(req.body, {abortEarly: false})
    if (error) return res.status(400).json({error})
    next();
}

module.exports = userValidator;
   