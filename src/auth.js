const jwt = require('jsonwebtoken')
const {SECRET} = require('./config.js')

const isLegitToken = (req, res, next) => {
  if (req.path === '/auth') {
      next() 
      return
  }
  
  let token = req.headers['x-access-token'] || req.headers['authorization'] 
  if (!token) {
    res.json({msg: 'Not authorized, token not supplied'})
    return
  } 
  
  token = token.slice(7, token.length)
  try {
    jwt.verify(token, SECRET) 
  }
  catch (err) {
    console.log(err)
    res.json({msg: 'Not authorized, invalid token'})
    return
  }
  next()  
}

module.exports = {
  isLegitToken
}