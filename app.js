const express = require('express')
const bodyParser = require('body-parser')
const {userValidator, usersPathValidator} = require('./usersValidator')
const productValidator = require('./productsValidator')
const app = express()
const PORT = process.env.PORT || 5000

const users = [
  {
    id: 1,
    name: "usuario1",
    email: "usuario1@gmail.com",
    favorite_products: [
      {
        id: "1bf0f365-fbdd-4e21-9786-da459d78dd1f"
      },
      {
        id: "958ec015-cfcf-258d-c6df-1721de0ab6ea"
      }
    ]
  },
  {
    id: 2,
    name: "usuario2",
    email: "usuario2@gmail.com",
    favorite_products: [
      {
        id: "6a512e6c-6627-d286-5d18-583558359ab6"
      },
      {  
        id: "4bd442b1-4a7d-2475-be97-a7b22a08a024"
      }
    ]
  }
] 

app.use(bodyParser.json())

app.get('/users', (req, res) => {
  res.status(200).send(JSON.stringify(users))
})

app.get('/users_by_email', (req, res) => { //alterar isso antes de entregar 
  const email = req.body.email
  const indexUser = users.findIndex(user => user.email === email)
  user = users[indexUser]

  res.send(user)
})// testar

app.get('/users/:id', usersPathValidator, (req, res) => {
  console.log(req)
  const userId = parseInt(req.params.id)
  const indexUser = users.findIndex(user => user.id === userId)


  user = users[indexUser]

  res.send(JSON.stringify(user))
})

app.post('/users', userValidator, (req,res) => {
  const newUser = req.body

  users.push(newUser)

  res.send(newUser)//devolve o usuario adicionado apenas, deveria mostrar todos?
})

app.put('/users/:id', userValidator, (req, res) => { //precisa?
  const userId = parseInt(req.params.id)
  const userPayload = req.body
  const indexUser = users.findIndex(user => user.id === userId)

  users.splice(indexUser, 1, userPayload)

  res.send(users[indexUser]) //retorna o user q foi alterado 
})

app.delete('/users/:id', (req, res)=> {
  const userId = parseInt(req.params.id)
  const indexUser = users.findIndex(user => user.id === userId)
  const deletedUser = users[indexUser]

  users.splice(indexUser, 1)

  res.send(deletedUser)//mostra qual foi deletado
})

app.post('/users/:id/:favorite_products', productValidator, (req, res) => {
  const userId = parseInt(req.params.id)
  const newFavorite = req.body
  const indexUser = users.findIndex(user => user.id === userId)
  const favoriteProducts = users[indexUser].favorite_products

  favoriteProducts.push(newFavorite)

  res.send(users[indexUser])
})

app.delete('/users/:id/:favorite_products', (req, res) => {
  const userId = parseInt(req.params.id)
  const indexUser = users.findIndex(user => user.id === userId)
  const productId = req.body.id
  const favoriteProducts = users[indexUser].favorite_products
  const productIndex = favoriteProducts.findIndex(product => product.id === productId)
  
  favoriteProducts.splice(productIndex, 1)

  res.send(users[indexUser])// retornar os produtos sem o excluido ou  o excluido?
})

app.listen(PORT, function() {
  console.log("servidor rodando...")
})
