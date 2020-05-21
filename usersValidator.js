   const Joi = require('@hapi/joi')
   const {usersSchema, usersIdSchema} = require('./schema')

  const userValidator = async (req, res, next) => {
      const {error} = usersSchema.validate(req.body, {abortEarly: false});
      if (error) return res.status(400).json({error});
      next();
  }

  const usersPathValidator = async (req, res, next) => {
    const {error} = usersIdSchema.validate(req.params, {abortEarly: false});
    if (error) return res.status(400).json({error});
    next();
}
  module.exports = {
    userValidator,
    usersPathValidator,
  }