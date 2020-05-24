const express = require('express')
const bodyParser = require('body-parser')

const { isLegitToken } = require('./auth')

const { 
  usersValidator, 
  usersPathValidator, 
  usersEmailValidator
} = require('./usersValidator')
const {productsValidator, productsPathValidator} = require('./productsValidator')
const { 
  getUsers, 
  getUserByEmail, 
  getUserById, 
  postUsers,
  patchUsers,
  deleteUsers,
  postFavoriteProducts,
  deleteFavoriteProducts,
  postAuth
} = require('./services')


const app = express();

app.use(bodyParser.json())

app.all('*', isLegitToken)

app.post('/auth', (req, res) => {
  const adminName = req.body.admin_name
  const password = req.body.password
  postAuth(adminName, password, res)
})

app.get('/users', (req, res) => {
  getUsers(res) 
})

app.get('/user_by_email', usersEmailValidator, (req, res) => {
  const userEmail = req.body.email
  getUserByEmail(userEmail, res)
})

app.get('/users/:user_id', usersPathValidator, (req, res) => {
  const userId = parseInt(req.params.user_id)
  getUserById(userId, res)
})

app.post('/users', usersValidator, (req, res) => {
  const userName = req.body.name
  const userEmail = req.body.email
  postUsers(userName, userEmail, res)
})

app.patch('/users/:user_id', usersValidator, usersPathValidator, (req, res) => {
  const userId = parseInt(req.params.user_id)
  const userName = req.body.name
  patchUsers(userId, userName, res)
})

app.delete('/users/:user_id', usersPathValidator, (req, res)=> {
  const userId = parseInt(req.params.user_id)
  deleteUsers(userId, res)
})

app.post('/users/:user_id/favorite_products', productsValidator, usersPathValidator, (req, res) => {
  const userId = parseInt(req.params.user_id)
  const productId = req.body.product_id
  postFavoriteProducts(userId, productId, res)
})

app.delete('/users/:user_id/favorite_products', productsPathValidator, usersPathValidator, (req, res) => {
  const userId = parseInt(req.params.user_id)
  const productId = req.body.product_id
  deleteFavoriteProducts(userId, productId, res)
})


module.exports = app
