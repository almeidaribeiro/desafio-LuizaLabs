   const Joi = require('@hapi/joi')
   const {usersSchema, usersIdSchema, usersEmailSchema} = require('./schema')

  const usersValidator = async (req, res, next) => {
      const {error} = usersSchema.validate(req.body, {abortEarly: false});
      if (error) return res.status(400).json({error});
      next();
  }

  const usersPathValidator = async (req, res, next) => {
    const {error} = usersIdSchema.validate(req.params, {abortEarly: false});
    if (error) return res.status(400).json({error});
    next();
}

const usersEmailValidator = async (req, res, next) => {
    const {error} = usersEmailSchema.validate(req.body, {abortEarly: false});
    if (error) return res.status(400).json({error});
    next();
}
  module.exports = {
    usersValidator,
    usersPathValidator,
    usersEmailValidator,
  }