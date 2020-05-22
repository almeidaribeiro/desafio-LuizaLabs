const express = require('express')
const bodyParser = require('body-parser')
const {usersValidator, usersPathValidator, usersEmailValidator} = require('./usersValidator')
const {productsValidator, productsPathValidator} = require('./productsValidator')
const {Client} = require('pg');
const app = express()
const PORT = process.env.PORT || 5000

const client = new Client({
  user: 'boo',
  host: 'localhost',
  database: 'postgres',
  password: 'boodb',
  port: '5432'
});

client.connect();
console.log('connected client')

app.use(bodyParser.json())

app.get('/users', (req, res) => {
  const selectUsers = `SELECT * FROM users`
  
  client.query(selectUsers, (err, dbRes) => {
    if(err) {
      console.error(err);
      res.status(400).send({msg:'error on query'})
      return;
    }
    const users = dbRes.rows.map(x => x)
    const payload = JSON.stringify(users)
    res.status(200).send(payload)
  });  
})

app.get('/users_by_email', usersEmailValidator, (req, res) => { //alterar isso antes de entregar 
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

app.post('/users', usersValidator, (req,res) => {
  const userName = req.body.name
  const userEmail = req.body.email
  const insertNewUser = `INSERT INTO users (name, email) VALUES  ('${userName}', '${userEmail}')`
 
  client.query(insertNewUser, (err, dbRes) => {
    if(err) {
      console.log(err)
      const payload = {msg: 'error on query'}
      res.status(400).send(payload)
      return;
    }
    console.log('New user data insert successful');
    const payload = {
      name: req.body.name,
      email: req.body.email
    }

    res.status(200).send(payload)
  }); 
  
})

app.put('/users/:id', usersValidator, usersPathValidator, (req, res) => { //precisa?
  const userId = parseInt(req.params.id)
  const userPayload = req.body
  const indexUser = users.findIndex(user => user.id === userId)

  users.splice(indexUser, 1, userPayload)

  res.send(users[indexUser]) //retorna o user q foi alterado 
})

app.delete('/users/:id', usersPathValidator, (req, res)=> {
  const userId = parseInt(req.params.id)
  const indexUser = users.findIndex(user => user.id === userId)
  const deletedUser = users[indexUser]

  users.splice(indexUser, 1)

  res.send(deletedUser)//mostra qual foi deletado
})

app.post('/users/:id/:favorite_products', productsValidator, productsPathValidator, (req, res) => {
  const userId = parseInt(req.params.id)
  const p_id = req.body.id

  // codigo de insert

  //codigo p select:

  // const x =  [[1, 1], [1, 2]]  
  // const favs = x.map(each => each[1])

  // [1, 2]

  // {
  //   user_id: 
  // }
  
  // const indexUser = users.findIndex(user => user.id === userId)
  // const favoriteProducts = users[indexUser].favorite_products
  // favoriteProducts.push(newFavorite)

  // res.send(users[indexUser])
})

app.delete('/users/:id/:favorite_products', productsPathValidator, (req, res) => {
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
